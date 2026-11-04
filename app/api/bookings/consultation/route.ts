import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { ConsultationBookingSchema } from "@/lib/validators";
import {
  getBookingSettings,
  getNextAvailableSlots,
  formatSlotForTimezone,
} from "@/lib/booking/availability";
import { generateICSString } from "@/lib/booking/calendar-ics";
import {
  sendBookingConfirmationEmail,
  sendBookingAdminNotificationEmail,
} from "@/lib/email";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = ConsultationBookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { starts_at, timezone, full_name, email, study_level, topic_help, message } =
      parsed.data;
    const settings = await getBookingSettings();

    const startTime = new Date(starts_at);
    const endTime = new Date(startTime.getTime() + settings.sessionDurationMinutes * 60 * 1000);
    const now = new Date();

    // Check minimum notice & max advance
    const minNoticeTime = new Date(now.getTime() + settings.minNoticeHours * 60 * 60 * 1000);
    const maxAdvanceTime = new Date(now.getTime() + settings.maxAdvanceDays * 24 * 60 * 60 * 1000);

    if (startTime < minNoticeTime) {
      return NextResponse.json(
        {
          error: `Consultations require at least ${settings.minNoticeHours} hours advance notice. Please select a later time.`,
        },
        { status: 400 }
      );
    }

    if (startTime > maxAdvanceTime) {
      return NextResponse.json(
        {
          error: `Bookings can only be scheduled up to ${settings.maxAdvanceDays} days in advance.`,
        },
        { status: 400 }
      );
    }

    const cancellationToken = crypto.randomBytes(20).toString("hex");
    const meetingUrl = settings.defaultMeetingUrl;
    let bookingId = crypto.randomUUID();

    // Database interaction with exclusion check
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createServiceRoleClient();

      // Check for conflicting confirmed/pending bookings
      const { data: conflictCheck } = await supabase
        .from("bookings")
        .select("id")
        .in("status", ["confirmed", "pending_payment"])
        .lt("starts_at", endTime.toISOString())
        .gt("ends_at", startTime.toISOString());

      if (conflictCheck && conflictCheck.length > 0) {
        const nextSlots = await getNextAvailableSlots(starts_at, 3, timezone);
        return NextResponse.json(
          {
            error: "Someone just took that time. Here are the next ones.",
            nextSlots,
          },
          { status: 409 }
        );
      }

      // Insert booking record
      const { data: inserted, error: insertError } = await supabase
        .from("bookings")
        .insert({
          id: bookingId,
          guest_name: full_name,
          guest_email: email,
          guest_study_level: study_level,
          guest_topic: topic_help,
          notes: message || null,
          starts_at: startTime.toISOString(),
          ends_at: endTime.toISOString(),
          status: "confirmed",
          session_type: "consultation",
          cancellation_token: cancellationToken,
          meeting_url: meetingUrl,
          timezone,
        })
        .select()
        .single();

      if (insertError) {
        // Handle PostgreSQL GiST exclusion constraint violation (code 23P01)
        if (insertError.code === "23P01" || insertError.message.includes("overlapping")) {
          const nextSlots = await getNextAvailableSlots(starts_at, 3, timezone);
          return NextResponse.json(
            {
              error: "Someone just took that time. Here are the next ones.",
              nextSlots,
            },
            { status: 409 }
          );
        }

        console.error("[Booking Insert Error]", insertError);
        return NextResponse.json(
          { error: "Failed to confirm booking. Please try again." },
          { status: 500 }
        );
      }

      if (inserted) {
        bookingId = inserted.id;
      }
    }

    // Format local time display for email and confirmation
    const slotInfo = formatSlotForTimezone(startTime, endTime, timezone);
    const dateStr = `${slotInfo.localDate} at ${slotInfo.localTime}`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const manageUrl = `${siteUrl}/booking/manage/${cancellationToken}`;

    // Generate .ics calendar attachment
    const icsContent = generateICSString({
      uid: bookingId,
      summary: "GradEdge 20-Minute Advisory Consultation",
      description: `Confidential advisory consultation regarding ${topic_help}.\n\nMeeting link: ${meetingUrl}\nManage or reschedule: ${manageUrl}`,
      location: meetingUrl,
      startsAt: startTime,
      endsAt: endTime,
      attendeeName: full_name,
      attendeeEmail: email,
    });

    // Send emails asynchronously
    await Promise.allSettled([
      sendBookingConfirmationEmail({
        to: email,
        name: full_name,
        dateStr,
        timezone: slotInfo.timezoneShort,
        meetingUrl,
        manageUrl,
        icsContent,
      }),
      sendBookingAdminNotificationEmail({
        guestName: full_name,
        guestEmail: email,
        studyLevel: study_level,
        topicHelp: topic_help,
        message,
        dateStr,
        timezone: slotInfo.timezoneShort,
        meetingUrl,
      }),
    ]);

    return NextResponse.json({
      success: true,
      bookingId,
      cancellationToken,
      startsAt: startTime.toISOString(),
      endsAt: endTime.toISOString(),
      localDate: slotInfo.localDate,
      localTimeDisplay: slotInfo.localTimeDisplay,
      meetingUrl,
      manageUrl,
    });
  } catch (error) {
    console.error("[Consultation Booking API Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

