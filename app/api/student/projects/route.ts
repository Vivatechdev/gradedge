import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function GET() {
  try {
    const { user } = await requireUser();
    const supabase = createServiceRoleClient();

    const { data: projects, error } = await supabase
      .from("projects")
      .select("id, title, brief, status, due_date, created_at, services(title), mentors:profiles!projects_mentor_id_fkey(full_name), milestones(id, status)")
      .eq("student_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const formatted = (projects || []).map((p: any) => {
      const ms = p.milestones || [];
      const totalMilestones = ms.length;
      const completedMilestones = ms.filter((m: any) => m.status === "done").length;

      return {
        id: p.id,
        title: p.title,
        brief: p.brief,
        status: p.status,
        dueDate: p.due_date,
        serviceTitle: p.services?.title || "Academic Mentoring",
        mentorName: p.mentors?.full_name || "Assigned on Scope Finalization",
        createdAt: p.created_at,
        milestonesTotal: totalMilestones,
        milestonesCompleted: completedMilestones,
      };
    });

    return NextResponse.json({ projects: formatted });
  } catch (err: any) {
    console.error("[Student Projects Error]", err);
    return NextResponse.json({ error: err.message || "Failed to load projects" }, { status: 500 });
  }
}

