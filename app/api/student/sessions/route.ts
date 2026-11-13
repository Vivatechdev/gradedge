import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function GET() {
  try {
    const { user, profile } = await requireUser();
    const supabase = createServiceRoleClient();

    const nowIso = new Date().toISOString();

    // Upcoming sessions (status confirmed, starts_at >= now)
    const { data: upcoming } = await supabase
      .from("bookings")
      .select("id, starts_at, ends_at, status, meeting_url, notes, timezone, cancellation_token, services(title), mentors:profiles!bookings_mentor_id_fkey(full_name)")
      .eq("student_id", user.id)
      .eq("status", "confirmed")
      .gte("starts_at", nowIso)
      .order("starts_at", { ascending: true });

    // Past sessions (starts_at < now or completed/cancelled)
    const { data: past } = await supabase
      .from("bookings")
      .select("id, starts_at, ends_at, status, meeting_url, notes, timezone, cancellation_token, services(title), mentors:profiles!bookings_mentor_id_fkey(full_name)")
      .eq("student_id", user.id)
      .or(`status.in.(completed,cancelled),starts_at.lt.${nowIso}`)
      .order("starts_at", { ascending: false });

    return NextResponse.json({
      timezone: profile?.timezone || "UTC",
      upcoming: upcoming || [],
      past: past || [],
    });
  } catch (err: any) {
    console.error("[Student Sessions Error]", err);
    return NextResponse.json({ error: err.message || "Failed to load sessions" }, { status: 500 });
  }
}

