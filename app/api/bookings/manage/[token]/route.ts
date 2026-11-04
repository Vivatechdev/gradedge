import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { formatSlotForTimezone, getBookingSettings, getNextAvailableSlots } from "@/lib/booking/availability";
import { generateICSString } from "@/lib/booking/calendar-ics";
import { sendBookingCancellationEmail, sendBookingConfirmationEmail } from "@/lib/email";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token || token.length < 8) {
      return NextResponse.json({ error: "Invalid booking token" }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      // Mock booking for development
      const mockStarts = new Date(Date.now() + 24 * 3600 * 1000);
      const mockEnds = new Date(mockStarts.getTime() + 20 * 60 * 1000);
      const slotInfo = formatSlotForTimezone(mockStarts, mockEnds, "UTC");
      return NextResponse.json({
        booking: {
          id: "mock-booking",
          starts_at: mockStarts.toISOString(),
          ends_at: mockEnds.toISOString(),
          status: "confirmed",
          guest_name: "Alex Researcher",
          guest_email: "alex@university.edu",
          meeting_url: "https://meet.google.com/lookup/gradedge-consultation",
          timezone: "UTC",
          localDate: slotInfo.localDate,
          localTimeDisplay: slotInfo.localTimeDisplay,
        },
        canModify: true,
        hoursUntilStart: 24,
      });
    }

    const supabase = createServiceRoleClient();
    const { data: booking, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("cancellation_token", token)
      .single();

    if (error || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const now = new Date();
    const startTime = new Date(booking.starts_at);
    const endTime = new Date(booking.ends_at);
    const hoursUntilStart = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    const canModify = hoursUntilStart >= 6 && booking.status !== "cancelled";

    const slotInfo = formatSlotForTimezone(startTime, endTime, booking.timezone || "UTC");

    return NextResponse.json({
      booking: {
        id: booking.id,
        starts_at: booking.starts_at,
        ends_at: booking.ends_at,
        status: booking.status,
        guest_name: booking.guest_name,
        guest_email: booking.guest_email,
        guest_topic: booking.guest_topic,
        meeting_url: booking.meeting_url,
        timezone: booking.timezone || "UTC",
        localDate: slotInfo.localDate,
        localTimeDisplay: slotInfo.localTimeDisplay,
      },
      canModify,
      hoursUntilStart: Math.round(hoursUntilStart * 10) / 10,
    });
  } catch (error) {
    console.error("[Manage Booking GET Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await request.json();
    const { action, reason, starts_at, timezone } = body;

    if (!token || token.length < 8) {
      return NextResponse.json({ error: "Invalid booking token" }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      // Mock response for dev
      return NextResponse.json({ success: true, action, mocked: true });
    }

    const supabase = createServiceRoleClient();
    const { data: booking, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("cancellation_token", token)
      .single();

    if (error || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const now = new Date();
    const startTime = new Date(booking.starts_at);
    const hoursUntilStart = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilStart < 6) {
      return NextResponse.json(
        {
          error:
            "Modifications or cancellations within 6 hours of the call must be coordinated directly with our advisory team to respect mentor schedules.",
        },
        { status: 400 }
      );
    }

    // 1. CANCEL ACTION
    if (action === "cancel") {
      const { error: cancelError } = await supabase
        .from("bookings")
        .update({
          status: "cancelled",
          cancellation_reason: reason || "Cancelled by researcher via self-service link",
          updated_at: new Date().toISOString(),
        })
        .eq("id", booking.id);

      if (cancelError) {
        return NextResponse.json({ error: "Failed to cancel booking" }, { status: 500 });
      }

      const slotInfo = formatSlotForTimezone(startTime, new Date(booking.ends_at), booking.timezone || "UTC");
      const dateStr = `${slotInfo.localDate} at ${slotInfo.localTime}`;

      await sendBookingCancellationEmail({
        to: booking.guest_email,
        name: booking.guest_name || "Researcher",
        dateStr,
        timezone: slotInfo.timezoneShort,
        reason,
      });

      return NextResponse.json({
        success: true,
        message: "Your booking has been cancelled and the slot released.",
      });
    }

    // 2. RESCHEDULE ACTION
    if (action === "reschedule") {
      if (!starts_at) {
        return NextResponse.json({ error: "Please select a replacement time slot." }, { status: 400 });
      }

      const settings = await getBookingSettings();
      const newStart = new Date(starts_at);
      const newEnd = new Date(newStart.getTime() + settings.sessionDurationMinutes * 60 * 1000);
      const targetTz = timezone || booking.timezone || "UTC";

      // Collision check
      const { data: conflict } = await supabase
        .from("bookings")
        .select("id")
        .neq("id", booking.id)
        .in("status", ["confirmed", "pending_payment"])
        .lt("starts_at", newEnd.toISOString())
        .gt("ends_at", newStart.toISOString());

      if (conflict && conflict.length > 0) {
        const nextSlots = await getNextAvailableSlots(starts_at, 3, targetTz);
        return NextResponse.json(
          {
            error: "Someone just took that time. Here are the next ones.",
            nextSlots,
          },
          { status: 409 }
        );
      }

      const { error: updateError } = await supabase
        .from("bookings")
        .update({
          starts_at: newStart.toISOString(),
          ends_at: newEnd.toISOString(),
          timezone: targetTz,
          status: "confirmed",
          reminder_24h_sent: false,
          reminder_1h_sent: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", booking.id);

      if (updateError) {
        return NextResponse.json({ error: "Failed to reschedule booking" }, { status: 500 });
      }

      const newSlotInfo = formatSlotForTimezone(newStart, newEnd, targetTz);
      const dateStr = `${newSlotInfo.localDate} at ${newSlotInfo.localTime}`;
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const manageUrl = `${siteUrl}/booking/manage/${token}`;

      const icsContent = generateICSString({
        uid: booking.id,
        summary: "GradEdge 20-Minute Advisory Consultation (Rescheduled)",
        description: `Confidential advisory consultation regarding ${booking.guest_topic || "research"}.\n\nMeeting link: ${booking.meeting_url}\nManage: ${manageUrl}`,
        location: booking.meeting_url || undefined,
        startsAt: newStart,
        endsAt: newEnd,
        attendeeName: booking.guest_name,
        attendeeEmail: booking.guest_email,
      });

      await sendBookingConfirmationEmail({
        to: booking.guest_email,
        name: booking.guest_name || "Researcher",
        dateStr,
        timezone: newSlotInfo.timezoneShort,
        meetingUrl: booking.meeting_url || settings.defaultMeetingUrl,
        manageUrl,
        icsContent,
      });

      return NextResponse.json({
        success: true,
        message: "Your booking has been rescheduled.",
        newSlot: newSlotInfo,
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("[Manage Booking POST Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

