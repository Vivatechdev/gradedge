import { NextRequest } from "next/server";
import { executeCronJob } from "@/lib/cron/logger";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function GET(request: NextRequest) {
  return handleJob(request);
}

export async function POST(request: NextRequest) {
  return handleJob(request);
}

async function handleJob(request: NextRequest) {
  return executeCronJob("expiring_bookings", request, async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return { mocked: true, message: "Database credentials not configured." };
    }

    const supabase = createServiceRoleClient();
    const now = new Date();

    // 1. Release expired pending_payment bookings older than 15 minutes
    const { data: expiredBookings, error } = await supabase
      .from("bookings")
      .update({
        status: "cancelled",
        cancellation_reason: "Payment hold expired (15 minutes elapsed without completion)",
        updated_at: now.toISOString(),
      })
      .eq("status", "pending_payment")
      .lt("expires_at", now.toISOString())
      .select("id, guest_name, guest_email, starts_at");

    if (error) {
      throw error;
    }

    return {
      releasedHolds: expiredBookings?.length || 0,
      expiredBookingIds: (expiredBookings || []).map((b: any) => b.id),
      executedAt: now.toISOString(),
    };
  });
}

