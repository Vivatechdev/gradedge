import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireUser();
    const { id } = await params;
    const supabase = createServiceRoleClient();

    // 1. Fetch project and verify ownership
    const { data: project, error: pErr } = await supabase
      .from("projects")
      .select("id, title, brief, status, due_date, created_at, student_id, services(title, description), mentors:profiles!projects_mentor_id_fkey(id, full_name, email)")
      .eq("id", id)
      .eq("student_id", user.id)
      .single();

    if (pErr || !project) {
      return NextResponse.json({ error: "Project not found or unauthorized" }, { status: 404 });
    }

    // 2. Fetch milestones
    const { data: milestones } = await supabase
      .from("milestones")
      .select("id, title, description, due_date, status, sort_order")
      .eq("project_id", id)
      .order("sort_order", { ascending: true });

    // 3. Fetch linked files
    const { data: files } = await supabase
      .from("files")
      .select("id, file_name, mime_type, size_bytes, visibility, version_label, uploaded_at, bucket_path")
      .eq("project_id", id)
      .order("uploaded_at", { ascending: false });

    // 4. Fetch linked messages/threads
    const { data: threads } = await supabase
      .from("message_threads")
      .select("id, subject, last_message_at, messages(id, sender_id, body, created_at, read_at)")
      .eq("project_id", id)
      .order("last_message_at", { ascending: false });

    // 5. Fetch linked sessions / bookings
    const { data: sessions } = await supabase
      .from("bookings")
      .select("id, starts_at, ends_at, status, meeting_url, notes, timezone")
      .eq("project_id", id)
      .order("starts_at", { ascending: false });

    // 6. Fetch linked billing / invoices
    const { data: payments } = await supabase
      .from("payments")
      .select("id, amount_minor, currency, status, purpose, created_at, invoices(id, number, pdf_url)")
      .eq("related_id", id)
      .order("created_at", { ascending: false });

    return NextResponse.json({
      project: {
        id: project.id,
        title: project.title,
        brief: project.brief,
        status: project.status,
        dueDate: project.due_date,
        createdAt: project.created_at,
        serviceTitle: (project as any).services?.title || "Academic Mentoring",
        mentor: (project as any).mentors || null,
      },
      milestones: milestones || [],
      files: files || [],
      threads: threads || [],
      sessions: sessions || [],
      billing: payments || [],
    });
  } catch (err: any) {
    console.error("[Project Detail Error]", err);
    return NextResponse.json({ error: err.message || "Failed to load project" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireUser();
    const { id } = await params;
    const supabase = createServiceRoleClient();

    // Verify ownership
    const { data: project } = await supabase
      .from("projects")
      .select("id, student_id")
      .eq("id", id)
      .eq("student_id", user.id)
      .single();

    if (!project) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { milestoneId, candidateNotes, requestedStatus } = body;

    // RULE: Students cannot mark items as done that require mentor approval
    if (requestedStatus === "done") {
      return NextResponse.json(
        { error: "Milestone completion requires faculty mentor verification and approval." },
        { status: 403 }
      );
    }

    if (milestoneId) {
      const { error: mErr } = await supabase
        .from("milestones")
        .update({
          description: candidateNotes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", milestoneId)
        .eq("project_id", id);

      if (mErr) {
        throw mErr;
      }

      await supabase.from("audit_log").insert({
        actor_id: user.id,
        action: "milestone_notes_updated",
        entity: "milestone",
        entity_id: milestoneId,
        metadata: { project_id: id },
      });

      return NextResponse.json({ success: true, message: "Notes updated successfully" });
    }

    return NextResponse.json({ error: "No update parameters provided" }, { status: 400 });
  } catch (err: any) {
    console.error("[Project Update Error]", err);
    return NextResponse.json({ error: err.message || "Failed to update project" }, { status: 500 });
  }
}

