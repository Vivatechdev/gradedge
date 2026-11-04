import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { sendAcceleratorAcceptanceEmail } from "@/lib/email";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Admin RBAC verification
    const admin = await requireRole("admin");
    if (!admin) {
      return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, note } = body;

    if (!["accepted", "waitlisted", "declined", "under_review"].includes(status)) {
      return NextResponse.json({ error: "Invalid application status" }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ success: true, status, note, mocked: true });
    }

    const supabase = createServiceRoleClient();
    const { data: application, error: fetchError } = await supabase
      .from("program_applications")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const { error: updateError } = await supabase
      .from("program_applications")
      .update({
        status,
        admin_notes: note || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
    }

    // On acceptance, email applicant with secure payment link
    if (status === "accepted") {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const paymentUrl =
        application.secure_payment_url ||
        `${siteUrl}/checkout/accelerator?token=${application.secure_payment_token || application.id}`;

      await sendAcceleratorAcceptanceEmail({
        to: application.email,
        name: application.full_name || "Doctoral Scholar",
        paymentUrl,
        note,
      });
    }

    return NextResponse.json({
      success: true,
      id,
      status,
      note,
      message: `Application marked as ${status}. Notification dispatched.`,
    });
  } catch (error) {
    console.error("[Admin Application Status Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

