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

    let project: any = null;
    let milestones: any[] = [];
    let files: any[] = [];
    let threads: any[] = [];
    let sessions: any[] = [];
    let payments: any[] = [];

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { data: pData } = await supabase
          .from("projects")
          .select("id, title, brief, status, due_date, created_at, student_id, services(title, description), mentors:profiles!projects_mentor_id_fkey(id, full_name, email)")
          .eq("id", id)
          .eq("student_id", user.id)
          .single();

        if (pData) {
          project = pData;

          const { data: mData } = await supabase
            .from("milestones")
            .select("id, title, description, due_date, status, sort_order")
            .eq("project_id", id)
            .order("sort_order", { ascending: true });
          milestones = mData || [];

          const { data: fData } = await supabase
            .from("files")
            .select("id, file_name, mime_type, size_bytes, visibility, version_label, uploaded_at, bucket_path")
            .eq("project_id", id)
            .order("uploaded_at", { ascending: false });
          files = fData || [];

          const { data: tData } = await supabase
            .from("message_threads")
            .select("id, subject, last_message_at, messages(id, sender_id, body, created_at, read_at)")
            .eq("project_id", id)
            .order("last_message_at", { ascending: false });
          threads = tData || [];

          const { data: sData } = await supabase
            .from("bookings")
            .select("id, starts_at, ends_at, status, meeting_url, notes, timezone")
            .eq("project_id", id)
            .order("starts_at", { ascending: false });
          sessions = sData || [];

          const { data: payData } = await supabase
            .from("payments")
            .select("id, amount_minor, currency, status, purpose, created_at, invoices(id, number, pdf_url)")
            .eq("related_id", id)
            .order("created_at", { ascending: false });
          payments = payData || [];
        }
      } catch (dbErr) {
        console.warn("[Project Detail DB Query Error, falling back to mock]", dbErr);
      }
    }

    // Deterministic fallback for dev / preview mode
    if (!project) {
      return NextResponse.json({
        project: {
          id: id,
          title: "Empirical Investigation of Institutional Economics in Emerging African Markets",
          brief: "Comprehensive mixed-methods dissertation investigating macroeconomic governance reforms, structural equation models, and policy interventions.",
          status: "active",
          dueDate: new Date(Date.now() + 86400000 * 45).toISOString().split("T")[0],
          createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
          serviceTitle: "Dissertation Mentoring and Advisory",
          mentor: {
            id: "mentor-vance",
            full_name: "Dr. Eleanor Vance",
            email: "e.vance@gradedge.com",
          },
        },
        milestones: [
          {
            id: "m-1",
            title: "Chapter 1: Problem Statement and Epidemiological Hypotheses",
            description: "Clarified research scope, demographic delimitation, and theoretical underpinnings.",
            due_date: "Oct 15, 2026",
            status: "done",
            sort_order: 1,
            hasReview: true,
            rubricScore: "18 / 20",
          },
          {
            id: "m-2",
            title: "Chapter 2: Critical Literature Synthesis Matrix",
            description: "Completed matrix analyzing agency theory vs stewardship models across 140 empirical papers.",
            due_date: "Nov 02, 2026",
            status: "done",
            sort_order: 2,
            hasReview: true,
            rubricScore: "19 / 20",
          },
          {
            id: "m-3",
            title: "Chapter 3: Methodology and Sampling Strategy",
            description: "Nearest-neighbor caliper matching protocol specified. Awaiting faculty sensitivity audit on unobserved confounders.",
            due_date: "Nov 28, 2026",
            status: "in_progress",
            sort_order: 3,
            hasReview: true,
            rubricScore: "In Review",
          },
          {
            id: "m-4",
            title: "Chapter 4: Statistical Econometric Estimation and Model Diagnostics",
            description: "Stata and R scripts drafted. Heteroscedasticity robust standard errors specified.",
            due_date: "Dec 20, 2026",
            status: "pending",
            sort_order: 4,
            hasReview: false,
          },
          {
            id: "m-5",
            title: "Chapter 5: Discussion, Policy Implications, and Defense Preparation",
            description: "Translational policy roadmap and defense presentation slide deck.",
            due_date: "Jan 15, 2027",
            status: "pending",
            sort_order: 5,
            hasReview: false,
          },
        ],
        files: [
          {
            id: "f-1",
            file_name: "Chapter_3_Methodology_Propensity_Score_Matching.docx",
            mime_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            size_bytes: 485200,
            visibility: "shared_with_mentor",
            version_label: "v2.1",
            uploaded_at: new Date(Date.now() - 86400000 * 2).toISOString(),
          },
          {
            id: "f-2",
            file_name: "Econometric_Estimation_Scripts_Stata.zip",
            mime_type: "application/zip",
            size_bytes: 1240500,
            visibility: "shared_with_mentor",
            version_label: "v1.0",
            uploaded_at: new Date(Date.now() - 86400000 * 8).toISOString(),
          },
          {
            id: "f-3",
            file_name: "Chapter_2_Literature_Review_Final_Signed_Off.pdf",
            mime_type: "application/pdf",
            size_bytes: 890400,
            visibility: "shared_with_mentor",
            version_label: "v3.0",
            uploaded_at: new Date(Date.now() - 86400000 * 21).toISOString(),
          },
        ],
        threads: [
          {
            id: "th-1",
            subject: "Feedback on Rosenbaum Bounds Sensitivity Calculation",
            last_message_at: new Date(Date.now() - 3600000 * 4).toISOString(),
            messages: [
              {
                id: "msg-1",
                sender_id: "mentor-vance",
                body: "I have added detailed line-level comments on Section 3.4. Tabulating the gamma thresholds directly addresses the external examiner's standard questions.",
                created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
              },
            ],
          },
        ],
        sessions: [
          {
            id: "sess-1",
            starts_at: new Date(Date.now() + 86400000 * 2).toISOString(),
            ends_at: new Date(Date.now() + 86400000 * 2 + 3600000).toISOString(),
            status: "confirmed",
            meeting_url: "https://meet.google.com/abc-defg-hij",
            notes: "Chapter 3 Methodology review and SEM structural model specification",
            timezone: "UTC",
          },
        ],
        billing: [
          {
            id: "pay-1",
            amount_minor: 14000,
            currency: "USD",
            status: "succeeded",
            purpose: "Milestone Review Package",
            created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
            invoices: {
              id: "inv-1",
              number: "INV-2026-088",
              pdf_url: "#",
            },
          },
        ],
      });
    }

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

    // Verify ownership in DB if connected
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && !id.startsWith("mock-")) {
      const { data: project } = await supabase
        .from("projects")
        .select("id, student_id")
        .eq("id", id)
        .eq("student_id", user.id)
        .single();

      if (!project) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
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
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && !id.startsWith("mock-")) {
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
      }

      return NextResponse.json({ success: true, message: "Notes updated successfully" });
    }

    return NextResponse.json({ error: "No update parameters provided" }, { status: 400 });
  } catch (err: any) {
    console.error("[Project Update Error]", err);
    return NextResponse.json({ error: err.message || "Failed to update project" }, { status: 500 });
  }
}

