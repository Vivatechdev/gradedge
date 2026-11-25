import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { createNotification } from "@/lib/notifications/service";

export async function POST(request: NextRequest) {
  try {
    const { user, profile } = await requireUser();
    const body = await request.json();
    const { messageId, reason, severity = "medium", notes } = body;

    if (!messageId || !reason) {
      return NextResponse.json({ error: "messageId and reason are required" }, { status: 400 });
    }

    const supabase = createServiceRoleClient();

    // Fetch message and thread details
    const { data: message, error: mErr } = await supabase
      .from("messages")
      .select("id, thread_id, body, sender_id, message_threads(id, project_id, subject, student_id, mentor_id)")
      .eq("id", messageId)
      .single();

    if (mErr || !message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    const thread = (message as any).message_threads;
    const isParticipant =
      thread?.student_id === user.id ||
      thread?.mentor_id === user.id ||
      message.sender_id === user.id ||
      profile?.role === "admin";

    if (!isParticipant) {
      return NextResponse.json({ error: "Forbidden: you do not have access to this thread" }, { status: 403 });
    }
    const projectId = thread?.project_id || null;
    const excerpt = message.body.length > 300 ? message.body.slice(0, 297) + "..." : message.body;

    // Insert integrity flag
    const { data: flag, error: fErr } = await supabase
      .from("integrity_flags")
      .insert({
        project_id: projectId,
        message_id: message.id,
        thread_id: thread?.id || null,
        message_excerpt: excerpt,
        raised_by: user.id,
        reason: `${reason}${notes ? ` — ${notes}` : ""}`,
        severity: ["low", "medium", "high", "critical"].includes(severity) ? severity : "medium",
      })
      .select()
      .single();

    if (fErr) {
      console.error("[Integrity Flag Insert Error]", fErr);
      return NextResponse.json({ error: fErr.message }, { status: 500 });
    }

    // Log to audit log
    await supabase.from("audit_log").insert({
      actor_id: user.id,
      action: "integrity_flag_raised",
      entity: "integrity_flag",
      entity_id: flag.id,
      metadata: {
        message_id: message.id,
        thread_id: thread?.id,
        reason,
        severity,
      },
    });

    // Notify administrators
    const { data: adminProfiles } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "admin");

    if (adminProfiles && adminProfiles.length > 0) {
      for (const admin of adminProfiles) {
        await createNotification({
          userId: admin.id,
          type: "general",
          title: "Academic Integrity Flag Raised",
          body: `A user has flagged a message for academic integrity review: "${reason}".`,
          link: `/admin/integrity`,
          sendEmailNotification: true,
          emailSubject: "[Urgent] Academic Integrity Flag Raised",
        });
      }
    }

    return NextResponse.json({ success: true, flagId: flag.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unauthorized" }, { status: 401 });
  }
}

