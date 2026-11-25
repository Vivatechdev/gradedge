import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { sendNewMessageDigestEmail } from "@/lib/email";
import { createNotification } from "@/lib/notifications/service";

export async function GET(req: Request) {
  try {
    const { user } = await requireUser();
    const supabase = createServiceRoleClient();

    // 1. Fetch business hours response window from settings
    const { data: windowSetting } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "mentor_response_window")
      .single();

    const responseWindow =
      (windowSetting?.value as string) || "24 business hours (Monday–Friday, 9:00 AM – 6:00 PM)";

    // 2. Fetch threads for this student
    const { data: threads, error } = await supabase
      .from("message_threads")
      .select("id, subject, last_message_at, mentor_id, mentors:profiles!message_threads_mentor_id_fkey(full_name, email), messages(id, sender_id, body, created_at, read_at, attachment_file_id, files(file_name, bucket_path))")
      .eq("student_id", user.id)
      .order("last_message_at", { ascending: false });

    if (error) {
      throw error;
    }

    const formattedThreads = (threads || []).map((t: any) => {
      const msgs = (t.messages || []).sort(
        (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      const unreadCount = msgs.filter((m: any) => m.sender_id !== user.id && !m.read_at).length;

      return {
        id: t.id,
        subject: t.subject,
        lastMessageAt: t.last_message_at,
        mentorName: t.mentors?.full_name || "GradEdge Academic Support Desk",
        mentorEmail: t.mentors?.email,
        unreadCount,
        messages: msgs.map((m: any) => ({
          id: m.id,
          senderId: m.sender_id,
          isMe: m.sender_id === user.id,
          body: m.body,
          createdAt: m.created_at,
          readAt: m.read_at,
          attachment: m.files ? { id: m.attachment_file_id, name: m.files.file_name } : null,
        })),
      };
    });

    return NextResponse.json({
      responseWindow,
      threads: formattedThreads,
    });
  } catch (err: any) {
    console.error("[Student Messages GET Error]", err);
    return NextResponse.json({ error: err.message || "Failed to load messages" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { user } = await requireUser();
    const supabase = createServiceRoleClient();

    const body = await req.json();
    const { threadId, subject, messageBody, attachmentFileId } = body;

    if (!messageBody || !messageBody.trim()) {
      return NextResponse.json({ error: "Message body cannot be empty." }, { status: 400 });
    }

    let activeThreadId = threadId;

    // Verify ownership if replying to an existing thread
    if (activeThreadId) {
      const { data: existingThread } = await supabase
        .from("message_threads")
        .select("id, student_id")
        .eq("id", activeThreadId)
        .eq("student_id", user.id)
        .single();

      if (!existingThread) {
        return NextResponse.json(
          { error: "Forbidden: you do not have access to this message thread." },
          { status: 403 }
        );
      }
    }

    // Verify file ownership if attaching a file
    if (attachmentFileId) {
      const { data: ownedFile } = await supabase
        .from("files")
        .select("id")
        .eq("id", attachmentFileId)
        .eq("owner_id", user.id)
        .single();

      if (!ownedFile) {
        return NextResponse.json(
          { error: "Forbidden: invalid or unauthorized file attachment." },
          { status: 403 }
        );
      }
    }

    // Create new thread if needed
    if (!activeThreadId) {
      // Find assigned mentor if any
      const { data: project } = await supabase
        .from("projects")
        .select("mentor_id")
        .eq("student_id", user.id)
        .not("mentor_id", "is", null)
        .limit(1)
        .single();

      const { data: newThread, error: tErr } = await supabase
        .from("message_threads")
        .insert({
          student_id: user.id,
          mentor_id: project?.mentor_id || null,
          subject: (subject || "Research Mentoring Inquiry").trim(),
          last_message_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (tErr) throw tErr;
      activeThreadId = newThread.id;
    }

    // Insert message
    const { data: newMsg, error: mErr } = await supabase
      .from("messages")
      .insert({
        thread_id: activeThreadId,
        sender_id: user.id,
        body: messageBody.trim(),
        attachment_file_id: attachmentFileId || null,
      })
      .select()
      .single();

    if (mErr) throw mErr;

    // Update thread last_message_at
    await supabase
      .from("message_threads")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", activeThreadId);

    // Mark previous incoming messages in this thread as read
    await supabase
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("thread_id", activeThreadId)
      .neq("sender_id", user.id)
      .is("read_at", null);

    // Fetch thread and sender profile for notification and email digest
    const { data: threadData } = await supabase
      .from("message_threads")
      .select("id, subject, student_id, mentor_id")
      .eq("id", activeThreadId)
      .single();

    if (threadData) {
      const recipientId = user.id === threadData.student_id ? threadData.mentor_id : threadData.student_id;
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gradedge.com";
      const senderName = user.user_metadata?.full_name || "Research Colleague";

      if (recipientId) {
        // Fetch recipient email
        const { data: recipientProfile } = await supabase
          .from("profiles")
          .select("email, full_name")
          .eq("id", recipientId)
          .single();

        if (recipientProfile?.email) {
          await sendNewMessageDigestEmail({
            to: recipientProfile.email,
            name: recipientProfile.full_name || "Researcher",
            senderName,
            threadSubject: threadData.subject,
            messagePreview: messageBody.trim(),
            threadUrl: `${siteUrl}/student/messages?thread=${activeThreadId}`,
          });
        }

        // Create in-app notification for recipient
        await createNotification({
          userId: recipientId,
          type: "mentor_message",
          title: `New Message: ${threadData.subject}`,
          body: `${senderName}: ${messageBody.trim().slice(0, 100)}`,
          link: `/student/messages?thread=${activeThreadId}`,
        });
      }
    }

    return NextResponse.json({ success: true, message: newMsg, threadId: activeThreadId });
  } catch (err: any) {
    console.error("[Student Messages POST Error]", err);
    return NextResponse.json({ error: err.message || "Failed to post message" }, { status: 500 });
  }
}

