import { NextRequest, NextResponse } from "next/server";
import { executeCronJob } from "@/lib/cron/logger";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { formatSlotForTimezone } from "@/lib/booking/availability";
import { sendBookingReminderEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
  return handleJob(request);
}

export async function POST(request: NextRequest) {
  return handleJob(request);
}

async function handleJob(request: NextRequest) {
  return executeCronJob("session_reminders", request, async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return { mocked: true, message: "Database credentials not configured." };
    }

    const supabase = createServiceRoleClient();
    const now = new Date();
    const results = {
      reminders24hSent: 0,
      reminders1hSent: 0,
    };

    // 1. 24-hour reminders: starts_at between 23h and 25h from now, reminder_24h_sent = false
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

    // 2. 1-hour reminders: starts_at between 45m and 75m from now, reminder_1h_sent = false
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

    return results;
  });
}

