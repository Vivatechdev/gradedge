import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function GET() {
  try {
    const { user } = await requireUser();
    const supabase = createServiceRoleClient();

    // 1. Fetch matching and response window settings
    const { data: settingsData } = await supabase
      .from("settings")
      .select("key, value")
      .in("key", ["mentor_matching_window", "mentor_response_window"]);

    let matchingWindow = "48 business hours";
    let responseWindow = "24 business hours (Monday–Friday, 9:00 AM – 6:00 PM)";

    (settingsData || []).forEach((s: any) => {
      if (s.key === "mentor_matching_window") {
        matchingWindow = typeof s.value === "string" ? s.value : JSON.stringify(s.value).replace(/"/g, "");
      }
      if (s.key === "mentor_response_window") {
        responseWindow = typeof s.value === "string" ? s.value : JSON.stringify(s.value).replace(/"/g, "");
      }
    });

    // 2. Find student's assigned mentor through active projects or confirmed bookings
    const { data: projectWithMentor } = await supabase
      .from("projects")
      .select("id, title, mentor_id")
      .eq("student_id", user.id)
      .not("mentor_id", "is", null)
      .in("status", ["active", "scoping", "requested"])
      .order("created_at", { ascending: false })
      .limit(1);

    let mentorId = projectWithMentor?.[0]?.mentor_id || null;
    let associatedProjectId = projectWithMentor?.[0]?.id || null;

    if (!mentorId) {
      // Check bookings
      const { data: bookingWithMentor } = await supabase
        .from("bookings")
        .select("id, mentor_id")
        .eq("student_id", user.id)
        .not("mentor_id", "is", null)
        .in("status", ["confirmed", "completed"])
        .order("starts_at", { ascending: false })
        .limit(1);

      mentorId = bookingWithMentor?.[0]?.mentor_id || null;
    }

    let mentor = null;
    let nextSession = null;

    if (mentorId) {
      // Fetch mentor profile and mentor details
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, full_name, email, avatar_url")
        .eq("id", mentorId)
        .single();

      const { data: mentorDetails } = await supabase
        .from("mentors")
        .select("headline, bio, credentials, disciplines, software, photo_url")
        .eq("profile_id", mentorId)
        .single();

      if (profileData) {
        mentor = {
          id: profileData.id,
          name: profileData.full_name,
          email: profileData.email,
          avatarUrl: mentorDetails?.photo_url || profileData.avatar_url || null,
          headline: mentorDetails?.headline || "Faculty Research Mentor",
          bio:
            mentorDetails?.bio ||
            "Specialized academic advisor guiding study design, literature synthesis, and empirical methodology.",
          credentials: mentorDetails?.credentials || "Ph.D., Senior Research Fellow",
          disciplines: mentorDetails?.disciplines || ["Methodology", "Quantitative Design", "Academic Writing"],
          software: mentorDetails?.software || ["R", "SPSS", "LaTeX"],
          projectId: associatedProjectId,
        };
      }

      // Fetch next session with this mentor
      const nowIso = new Date().toISOString();
      const { data: upcomingSessions } = await supabase
        .from("bookings")
        .select("id, starts_at, ends_at, meeting_url, notes, timezone, services(title)")
        .eq("student_id", user.id)
        .eq("mentor_id", mentorId)
        .eq("status", "confirmed")
        .gte("starts_at", nowIso)
        .order("starts_at", { ascending: true })
        .limit(1);

      if (upcomingSessions && upcomingSessions.length > 0) {
        const s = upcomingSessions[0];
        nextSession = {
          id: s.id,
          startsAt: s.starts_at,
          endsAt: s.ends_at,
          meetingUrl: s.meeting_url,
          notes: s.notes,
          timezone: s.timezone,
          serviceTitle: (s as any).services?.title || "Coaching Consultation",
        };
      }
    }

    // 3. Fetch any existing mentor change request
    const { data: changeRequests } = await supabase
      .from("mentor_change_requests")
      .select("id, reason, preferred_disciplines, additional_notes, status, created_at")
      .eq("student_id", user.id)
      .in("status", ["submitted", "under_review"])
      .order("created_at", { ascending: false })
      .limit(1);

    const activeChangeRequest = changeRequests?.[0] || null;

    return NextResponse.json({
      mentor,
      nextSession,
      matchingWindow,
      responseWindow,
      activeChangeRequest,
      associatedProjectId,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const { user } = await requireUser();
    const supabase = createServiceRoleClient();
    const body = await request.json();

    const { reason, preferredDisciplines, additionalNotes, currentMentorId, projectId } = body;

    if (!reason || typeof reason !== "string" || reason.trim().length === 0) {
      return NextResponse.json({ error: "Please provide a valid reason for the mentor change." }, { status: 400 });
    }

    const { data: newRequest, error } = await supabase
      .from("mentor_change_requests")
      .insert({
        student_id: user.id,
        current_mentor_id: currentMentorId || null,
        project_id: projectId || null,
        reason: reason.trim(),
        preferred_disciplines: Array.isArray(preferredDisciplines) ? preferredDisciplines : [],
        additional_notes: additionalNotes ? additionalNotes.trim() : null,
        status: "submitted",
      })
      .select()
      .single();

    if (error) {
      console.error("Mentor change request error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Also trigger in-app notification confirming submission
    await supabase.from("notifications").insert({
      user_id: user.id,
      type: "mentor",
      title: "Mentor Reassignment Request Logged",
      body: "Your request for faculty mentor reassignment has been received. Academic operations will review within 48 business hours.",
      link: "/student/mentor",
    });

    return NextResponse.json({ success: true, request: newRequest });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unauthorized" }, { status: 401 });
  }
}

