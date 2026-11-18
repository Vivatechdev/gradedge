import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { sendMentorAssignedEmail } from "@/lib/email";
import { createNotification } from "@/lib/notifications/service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireRole("admin");
    const { id: threadId } = await params;
    const { mentorId } = await request.json();

    if (!mentorId) {
      return NextResponse.json({ error: "mentorId is required" }, { status: 400 });
    }

    const supabase = createServiceRoleClient();

    // Fetch mentor details
    const { data: mentorProfile, error: mErr } = await supabase
      .from("profiles")
      .select("id, full_name, email, institution, bio, title")
      .eq("id", mentorId)
      .single();

    if (mErr || !mentorProfile) {
      return NextResponse.json({ error: "Selected mentor profile not found" }, { status: 404 });
    }

    // Update thread
    const { data: thread, error: tErr } = await supabase
      .from("message_threads")
      .update({
        mentor_id: mentorId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", threadId)
      .select("id, student_id, subject, project_id")
      .single();

    if (tErr || !thread) {
      return NextResponse.json({ error: "Failed to update thread" }, { status: 500 });
    }

    // Fetch student info
    const { data: studentProfile } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("id", thread.student_id)
      .single();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gradedge.com";
    const threadUrl = `${siteUrl}/student/messages?thread=${thread.id}`;

    // Send email notification to student
    if (studentProfile?.email) {
      const mentorFirstName = mentorProfile.full_name?.split(" ")[0] || "Mentor";
      await sendMentorAssignedEmail({
        to: studentProfile.email,
        studentName: studentProfile.full_name || "Researcher",
        mentorFirstName,
        mentorTitle: mentorProfile.title || "Dr.",
        mentorBio:
          mentorProfile.bio ||
          "Senior academic reviewer and methodological consultant specializing in post-graduate research design.",
        specialization: mentorProfile.institution || "Methodological Research Guidance",
        threadUrl,
      });
    }

    // Create in-app notification
    await createNotification({
      userId: thread.student_id,
      type: "mentor_assigned",
      title: `Academic Mentor Appointed: ${mentorProfile.full_name}`,
      body: `Your discussion thread "${thread.subject}" has been assigned to ${mentorProfile.full_name}. You may now communicate directly.`,
      link: `/student/messages?thread=${thread.id}`,
    });

    // Audit log
    await supabase.from("audit_log").insert({
      actor_id: user.id,
      action: "thread_mentor_assigned",
      entity: "message_thread",
      entity_id: thread.id,
      metadata: {
        mentor_id: mentorId,
        student_id: thread.student_id,
      },
    });

    return NextResponse.json({ success: true, thread });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unauthorized" }, { status: 401 });
  }
}

