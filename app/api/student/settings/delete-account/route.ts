import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function POST(request: Request) {
  try {
    const { user, profile } = await requireUser();
    const supabase = createServiceRoleClient();
    const body = await request.json().catch(() => ({}));

    const confirmation = (body.confirmation || "").trim();
    const expectedConfirmation = "DELETE";

    if (confirmation !== expectedConfirmation && confirmation !== user.email) {
      return NextResponse.json(
        {
          error:
            "Confirmation mismatch. Please type DELETE or your account email address to confirm account deletion.",
        },
        { status: 400 }
      );
    }

    // 1. Log to audit_log before deleting
    await supabase.from("audit_log").insert({
      actor_id: user.id,
      action: "account_deleted_by_user",
      entity: "profiles",
      entity_id: user.id,
      metadata: {
        email: user.email,
        full_name: profile?.full_name || "Doctoral Candidate",
        reason: body.reason || "Self-requested deletion",
        timestamp: new Date().toISOString(),
      },
    });

    // 2. Cancel any pending bookings or memberships
    await supabase
      .from("bookings")
      .update({
        status: "cancelled",
        cancellation_reason: "Account deleted by researcher",
        updated_at: new Date().toISOString(),
      })
      .eq("student_id", user.id)
      .in("status", ["pending_payment", "confirmed"]);

    await supabase
      .from("memberships")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("status", "active");

    // 3. Delete user from Supabase Auth admin (cascades to profile)
    const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(user.id);
    if (deleteAuthError) {
      console.error("Error deleting auth user:", deleteAuthError);
      return NextResponse.json(
        { error: "Failed to delete account. Please contact administrative support." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Account and personal data successfully purged.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unauthorized" }, { status: 401 });
  }
}
