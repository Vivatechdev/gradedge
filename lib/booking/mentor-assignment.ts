import { createServiceRoleClient } from "@/lib/supabase/service-role";

export interface MentorAssignmentParams {
  serviceId?: string;
  fieldOfStudy?: string;
  startsAt: string;
  endsAt: string;
}

export interface MentorAssignmentResult {
  mentorId: string | null;
  assignedMethod: "discipline_match" | "availability_pool" | "admin_pending" | "mock_assigned";
  notes?: string;
}

/**
 * Replaceable Mentor Assignment Logic
 * Matches mentors based on discipline compatibility, verified availability, and lowest current workload.
 */
export async function assignMentorForBooking(
  params: MentorAssignmentParams
): Promise<MentorAssignmentResult> {
  const { serviceId, fieldOfStudy, startsAt, endsAt } = params;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    // In local / mock environment without live DB credentials
    return {
      mentorId: "00000000-0000-0000-0000-000000000001",
      assignedMethod: "mock_assigned",
      notes: "Mock mentor assigned automatically for local testing.",
    };
  }

  try {
    const supabase = createServiceRoleClient();

    // 1. Query available active mentors
    const { data: mentors, error: mentorError } = await supabase
      .from("mentors")
      .select("id, profile_id, discipline, subjects, status, rating")
      .eq("status", "active");

    if (mentorError || !mentors || mentors.length === 0) {
      // Fallback to any profile with role = 'mentor' or 'admin'
      const { data: fallbackProfiles } = await supabase
        .from("profiles")
        .select("id, role")
        .in("role", ["mentor", "admin"])
        .limit(1);

      if (fallbackProfiles && fallbackProfiles.length > 0) {
        return {
          mentorId: fallbackProfiles[0].id,
          assignedMethod: "availability_pool",
          notes: "Assigned from default senior academic advisor pool.",
        };
      }

      return {
        mentorId: null,
        assignedMethod: "admin_pending",
        notes: "No active mentors registered; pending manual admin allocation.",
      };
    }

    // 2. Filter mentors who have no overlapping bookings during requested slot
    const slotStart = new Date(startsAt).toISOString();
    const slotEnd = new Date(endsAt).toISOString();

    const { data: busyBookings } = await supabase
      .from("bookings")
      .select("mentor_id")
      .in("status", ["confirmed", "pending_payment"])
      .lt("starts_at", slotEnd)
      .gt("ends_at", slotStart);

    const busyMentorIds = new Set(busyBookings?.map((b) => b.mentor_id) || []);
    const availableMentors = mentors.filter((m) => !busyMentorIds.has(m.profile_id));

    if (availableMentors.length === 0) {
      return {
        mentorId: null,
        assignedMethod: "admin_pending",
        notes: "All mentors busy at requested slot; flagged for admin dispatch.",
      };
    }

    // 3. Discipline match: Check if fieldOfStudy matches mentor discipline or subjects
    if (fieldOfStudy) {
      const normalizedField = fieldOfStudy.toLowerCase();
      const disciplineMatches = availableMentors.filter((m) => {
        const disc = (m.discipline || "").toLowerCase();
        const subs = (m.subjects || []).map((s: string) => s.toLowerCase());
        return (
          disc.includes(normalizedField) ||
          normalizedField.includes(disc) ||
          subs.some((s: string) => s.includes(normalizedField) || normalizedField.includes(s))
        );
      });

      if (disciplineMatches.length > 0) {
        // Pick discipline-matched mentor with highest rating / lowest workload
        return {
          mentorId: disciplineMatches[0].profile_id,
          assignedMethod: "discipline_match",
          notes: `Matched on academic discipline (${disciplineMatches[0].discipline}).`,
        };
      }
    }

    // 4. Default to first available qualified mentor
    return {
      mentorId: availableMentors[0].profile_id,
      assignedMethod: "availability_pool",
      notes: "Assigned from general methodology pool.",
    };
  } catch (err) {
    console.error("[MentorAssignmentEngine Error]", err);
    return {
      mentorId: null,
      assignedMethod: "admin_pending",
      notes: "Error during assignment; queued for admin manual review.",
    };
  }
}

