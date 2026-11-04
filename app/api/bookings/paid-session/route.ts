import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { PaidSessionBookingSchema } from "@/lib/validators";
import { requireUser } from "@/lib/auth/server";
import { getBookingSettings, getNextAvailableSlots } from "@/lib/booking/availability";
import { assignMentorForBooking } from "@/lib/booking/mentor-assignment";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function POST(request: NextRequest) {
  try {
    // 1. Require student authentication
    const authSession = await requireUser();
    if (!authSession || !authSession.user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in to book a paid session." }, { status: 401 });
    }
    const { user, profile } = authSession;

    const body = await request.json();
    const parsed = PaidSessionBookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { service_id, starts_at, timezone, notes } = parsed.data;
    const settings = await getBookingSettings();

    const startTime = new Date(starts_at);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 60 min standard session
    const now = new Date();

    // 15-minute pending payment hold
    const expiresAt = new Date(now.getTime() + 15 * 60 * 1000);

    // 2. Resolve field of study from profile
    let fieldOfStudy = profile?.field_of_study || "";
    if (!fieldOfStudy && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createServiceRoleClient();
      const { data: profileData } = await supabase
        .from("profiles")
        .select("field_of_study")
        .eq("id", user.id)
        .single();
      if (profileData?.field_of_study) {
        fieldOfStudy = profileData.field_of_study;
      }
    }

    // 3. System Mentor Assignment Engine
    const assignment = await assignMentorForBooking({
      serviceId: service_id,
      fieldOfStudy,
      startsAt: startTime.toISOString(),
      endsAt: endTime.toISOString(),
    });

    const bookingId = crypto.randomUUID();
    const cancellationToken = crypto.randomBytes(20).toString("hex");

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createServiceRoleClient();

      // Check collision
      let conflictQuery = supabase
        .from("bookings")
        .select("id")
        .in("status", ["confirmed", "pending_payment"])
        .lt("starts_at", endTime.toISOString())
        .gt("ends_at", startTime.toISOString());

      if (assignment.mentorId) {
        conflictQuery = conflictQuery.eq("mentor_id", assignment.mentorId);
      }

      const { data: conflict } = await conflictQuery;
      if (conflict && conflict.length > 0) {
        const nextSlots = await getNextAvailableSlots(starts_at, 3, timezone);
        return NextResponse.json(
          {
            error: "Someone just took that time. Here are the next ones.",
            nextSlots,
          },
          { status: 409 }
        );
      }

      // Insert pending_payment booking with 15-minute hold
      const { data: inserted, error: insertError } = await supabase
        .from("bookings")
        .insert({
          id: bookingId,
          student_id: user.id,
          mentor_id: assignment.mentorId,
          service_id: service_id.length === 36 ? service_id : null,
          starts_at: startTime.toISOString(),
          ends_at: endTime.toISOString(),
          status: "pending_payment",
          session_type: "paid_session",
          expires_at: expiresAt.toISOString(),
          notes: notes || null,
          timezone,
          cancellation_token: cancellationToken,
        })
        .select()
        .single();

      if (insertError) {
        console.error("[Paid Session Insert Error]", insertError);
        return NextResponse.json({ error: "Failed to reserve slot" }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      bookingId,
      status: "pending_payment",
      expiresAt: expiresAt.toISOString(),
      startsAt: startTime.toISOString(),
      endsAt: endTime.toISOString(),
      mentorAssigned: !!assignment.mentorId,
      notes: "Slot reserved for 15 minutes. Proceeding to Stage 7 checkout.",
    });
  } catch (error) {
    console.error("[Paid Session Booking Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
