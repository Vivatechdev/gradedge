import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { formatSlotForTimezone } from "@/lib/booking/availability";
import { sendBookingReminderEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
  return handleCronReminders(request);
}

export async function POST(request: NextRequest) {
  return handleCronReminders(request);
}

async function handleCronReminders(request: NextRequest) {
  // Verify cron secret if configured in production
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ success: true, mocked: true, message: "No Supabase credentials configured" });
  }

  const supabase = createServiceRoleClient();
  const now = new Date();
  const results = {
    releasedHolds: 0,
    reminders24hSent: 0,
    reminders1hSent: 0,
  };

  try {
    // 1. Release expired pending_payment bookings older than 15 minutes
    const { data: expiredBookings, error: releaseError } = await supabase
      .from("bookings")
      .update({
        status: "cancelled",
        cancellation_reason: "Payment hold expired (15 minutes elapsed without completion)",
        updated_at: now.toISOString(),
      })
      .eq("status", "pending_payment")
      .lt("expires_at", now.toISOString())
      .select("id");

    if (expiredBookings) {
      results.releasedHolds = expiredBookings.length;
    }

    // 2. Send 24-hour reminders: starts_at between 23h and 25h from now, reminder_24h_sent = false
    const window24hStart = new Date(now.getTime() + 23 * 60 * 60 * 1000).toISOString();
    const window24hEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000).toISOString();

    const { data: bookings24h } = await supabase
      .from("bookings")
      .select("*")
      .eq("status", "confirmed")
      .eq("reminder_24h_sent", false)
      .gte("starts_at", window24hStart)
      .lte("starts_at", window24hEnd);

    if (bookings24h && bookings24h.length > 0) {
      for (const b of bookings24h) {
        if (!b.guest_email) continue;
        const slotInfo = formatSlotForTimezone(new Date(b.starts_at), new Date(b.ends_at), b.timezone || "UTC");
        const dateStr = `${slotInfo.localDate} at ${slotInfo.localTime}`;

        await sendBookingReminderEmail({
          to: b.guest_email,
          name: b.guest_name || "Researcher",
          dateStr,
          timezone: slotInfo.timezoneShort,
          meetingUrl: b.meeting_url || "https://meet.google.com/lookup/gradedge-consultation",
          hoursBefore: 24,
        });

        await supabase
          .from("bookings")
          .update({ reminder_24h_sent: true, updated_at: new Date().toISOString() })
          .eq("id", b.id);

        results.reminders24hSent++;
      }
    }

    // 3. Send 1-hour reminders: starts_at between 45m and 75m from now, reminder_1h_sent = false
    const window1hStart = new Date(now.getTime() + 45 * 60 * 1000).toISOString();
    const window1hEnd = new Date(now.getTime() + 75 * 60 * 1000).toISOString();

    const { data: bookings1h } = await supabase
      .from("bookings")
      .select("*")
      .eq("status", "confirmed")
      .eq("reminder_1h_sent", false)
      .gte("starts_at", window1hStart)
      .lte("starts_at", window1hEnd);

    if (bookings1h && bookings1h.length > 0) {
      for (const b of bookings1h) {
        if (!b.guest_email) continue;
        const slotInfo = formatSlotForTimezone(new Date(b.starts_at), new Date(b.ends_at), b.timezone || "UTC");
        const dateStr = `${slotInfo.localDate} at ${slotInfo.localTime}`;

        await sendBookingReminderEmail({
          to: b.guest_email,
          name: b.guest_name || "Researcher",
          dateStr,
          timezone: slotInfo.timezoneShort,
          meetingUrl: b.meeting_url || "https://meet.google.com/lookup/gradedge-consultation",
          hoursBefore: 1,
        });

        await supabase
          .from("bookings")
          .update({ reminder_1h_sent: true, updated_at: new Date().toISOString() })
          .eq("id", b.id);

        results.reminders1hSent++;
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      results,
    });
  } catch (error) {
    console.error("[Cron Reminders Error]", error);
    return NextResponse.json({ error: "Failed to run cron reminders" }, { status: 500 });
  }
}

