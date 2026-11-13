import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function GET() {
  try {
    const { user } = await requireUser();
    const supabase = createServiceRoleClient();

    // 1. Fetch student's accelerator application
    const { data: applications, error: appErr } = await supabase
      .from("program_applications")
      .select("id, program, stage_of_research, topic_summary, goals, status, admin_notes, created_at, updated_at")
      .eq("applicant_id", user.id)
      .eq("program", "accelerator")
      .order("created_at", { ascending: false })
      .limit(1);

    if (appErr) throw appErr;

    const application = applications?.[0] || null;

    if (!application) {
      return NextResponse.json({ application: null, isPaid: false });
    }

    // 2. Check if tuition has been paid (payment purpose = 'program' and status = 'succeeded')
    const { data: payments } = await supabase
      .from("payments")
      .select("id, amount_minor, currency, status, created_at")
      .eq("user_id", user.id)
      .eq("purpose", "program")
      .eq("status", "succeeded")
      .limit(1);

    const isPaid = (payments && payments.length > 0) || false;

    // Cohort timetable details (if accepted and paid)
    const cohortDetails = {
      cohortName: "Doctoral Completion Cohort 2026-B",
      startDate: "November 23, 2026",
      advisorDesk: "Discipline Advisory Board (Oxford & Lagos Hub)",
      schedule: [
        {
          week: "Week 1",
          date: "Nov 23, 2026",
          topic: "Orientation & Research Question Tightening (Live Workshop)",
          time: "3:00 PM UTC",
        },
        {
          week: "Week 3",
          date: "Dec 7, 2026",
          topic: "Methodological Alignment & Sampling Architecture",
          time: "3:00 PM UTC",
        },
        {
          week: "Week 5",
          date: "Dec 21, 2026",
          topic: "Empirical Model Execution, Normality & Syntax Audits",
          time: "3:00 PM UTC",
        },
        {
          week: "Week 8",
          date: "Jan 11, 2027",
          topic: "Discussion & Theoretical Contribution Formulation",
          time: "3:00 PM UTC",
        },
        {
          week: "Week 10",
          date: "Jan 25, 2027",
          topic: "Pre-Defense Readiness Review & Examiner Simulation",
          time: "3:00 PM UTC",
        },
        {
          week: "Week 12",
          date: "Feb 8, 2027",
          topic: "Final Viva Mock Clearance & Thesis Defense Sign-off",
          time: "3:00 PM UTC",
        },
      ],
    };

    return NextResponse.json({
      application,
      isPaid,
      cohortDetails,
    });
  } catch (err: any) {
    console.error("[Student Accelerator Error]", err);
    return NextResponse.json({ error: err.message || "Failed to load accelerator data" }, { status: 500 });
  }
}

