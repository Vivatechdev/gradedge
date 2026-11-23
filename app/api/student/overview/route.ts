import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function GET() {
  try {
    const { user, profile } = await requireUser();

    // Database-Free Preview Fallback:
    // When Supabase is not configured in environment, serve realistic research mock data
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const studentName = profile?.full_name?.split(" ")[0] || "Researcher";
      return NextResponse.json({
        studentName,
        timezone: profile?.timezone || "UTC",
        nextSession: {
          id: "mock-sess-1",
          starts_at: new Date(Date.now() + 86400000 * 2).toISOString(),
          ends_at: new Date(Date.now() + 86400000 * 2 + 3600000).toISOString(),
          meeting_url: "https://meet.google.com/abc-defg-hij",
          notes: "Chapter 3 Methodology review and SEM structural model specification",
          timezone: profile?.timezone || "UTC",
          mentor_id: "mock-mentor-id",
          profiles: { full_name: "Dr. Eleanor Vance" },
        },
        activeProject: {
          id: "mock-proj-1",
          title: "Empirical Investigation of Institutional Economics in Emerging African Markets",
          brief: "Comprehensive mixed-methods dissertation investigating macroeconomic governance reforms.",
          status: "active",
          due_date: new Date(Date.now() + 86400000 * 45).toISOString(),
          services: { title: "Dissertation Mentoring and Advisory" },
          mentors: { full_name: "Dr. Eleanor Vance" },
          milestones: [
            { id: "m-1", title: "Chapter 1: Problem Statement and Research Hypotheses", status: "done", sort_order: 1 },
            { id: "m-2", title: "Chapter 2: Critical Literature Synthesis Matrix", status: "done", sort_order: 2 },
            { id: "m-3", title: "Chapter 3: Methodology and Sampling Strategy", status: "in_progress", sort_order: 3 },
            { id: "m-4", title: "Chapter 4: Statistical Econometric Estimation", status: "pending", sort_order: 4 },
            { id: "m-5", title: "Chapter 5: Discussion and Oral Defense Preparation", status: "pending", sort_order: 5 },
          ],
        },
        milestoneProgress: {
          total: 5,
          completed: 2,
          nextDue: new Date(Date.now() + 86400000 * 7).toISOString(),
          nextTitle: "Chapter 3: Methodology and Sampling Strategy",
        },
        unreadMessages: 1,
        unreadNotifications: 2,
        pendingInvoices: 0,
        recentActivity: [
          {
            action: "booking_created",
            label: "Methodology Consultation confirmed with Dr. Eleanor Vance",
            timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
          },
          {
            action: "file_uploaded",
            label: "Draft uploaded: Chapter_2_Literature_Review_Final.docx",
            timestamp: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            action: "application_submitted",
            label: "Doctoral Accelerator milestones initialized",
            timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
          },
        ],
      });
    }

    const supabase = createServiceRoleClient();

    // 1. Fetch upcoming session
    const nowIso = new Date().toISOString();
    const { data: upcomingSessions } = await supabase
      .from("bookings")
      .select("id, starts_at, ends_at, meeting_url, notes, timezone, mentor_id, profiles!bookings_mentor_id_fkey(full_name)")
      .eq("student_id", user.id)
      .eq("status", "confirmed")
      .gte("starts_at", nowIso)
      .order("starts_at", { ascending: true })
      .limit(1);

    const nextSession = upcomingSessions?.[0] || null;

    // 2. Fetch active project with milestones
    const { data: activeProjects } = await supabase
      .from("projects")
      .select("id, title, brief, status, due_date, services(title), mentors:profiles!projects_mentor_id_fkey(full_name), milestones(id, title, status, due_date, sort_order)")
      .eq("student_id", user.id)
      .in("status", ["active", "scoping", "requested"])
      .order("created_at", { ascending: false })
      .limit(1);

    const activeProject = activeProjects?.[0] || null;

    // 3. Calculate milestone progress
    let milestoneProgress = { total: 0, completed: 0, nextDue: null as string | null, nextTitle: null as string | null };
    if (activeProject && (activeProject as any).milestones) {
      const ms = (activeProject as any).milestones;
      milestoneProgress.total = ms.length;
      milestoneProgress.completed = ms.filter((m: any) => m.status === "done").length;
      const pending = ms.filter((m: any) => m.status !== "done").sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));
      if (pending.length > 0) {
        milestoneProgress.nextDue = pending[0].due_date;
        milestoneProgress.nextTitle = pending[0].title;
      }
    }

    // 4. Fetch unread counts (messages, notifications and pending invoices)
    const { data: threads } = await supabase
      .from("message_threads")
      .select("id, messages(id, sender_id, read_at)")
      .eq("student_id", user.id);

    let unreadMessages = 0;
    if (threads) {
      for (const t of threads) {
        const msgs = (t as any).messages || [];
        unreadMessages += msgs.filter((m: any) => m.sender_id !== user.id && !m.read_at).length;
      }
    }

    const { count: unreadNotifications } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .is("read_at", null);

    const { count: pendingInvoices } = await supabase
      .from("payments")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "initiated");

    // 5. Fetch recent activity (quiet list)
    const { data: recentAudit } = await supabase
      .from("audit_log")
      .select("action, entity, metadata, created_at")
      .eq("actor_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    const recentActivity = (recentAudit || []).map((a: any) => {
      let label = "Account activity";
      if (a.action === "payment_succeeded") label = `Payment of ${a.metadata?.currency || ""} confirmed`;
      else if (a.action === "booking_created") label = "Consultation session scheduled";
      else if (a.action === "file_uploaded") label = `Draft file uploaded: ${a.metadata?.file_name || ""}`;
      else if (a.action === "application_submitted") label = "Doctoral Accelerator application received";
      return {
        action: a.action,
        label,
        timestamp: a.created_at,
      };
    });

    return NextResponse.json({
      studentName: profile?.full_name?.split(" ")[0] || "Researcher",
      timezone: profile?.timezone || "UTC",
      nextSession,
      activeProject,
      milestoneProgress,
      unreadMessages,
      unreadNotifications: unreadNotifications || 0,
      pendingInvoices: pendingInvoices || 0,
      recentActivity,
    });
  } catch (error: any) {
    console.error("[Student Overview Error]", error);
    return NextResponse.json({ error: error.message || "Failed to load overview data" }, { status: 500 });
  }
}

