import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function GET() {
  try {
    const { user } = await requireUser();
    const supabase = createServiceRoleClient();

    // 1. Fetch Profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    // 2. Fetch Projects and Milestones
    const { data: projects } = await supabase
      .from("projects")
      .select("*, milestones(*), services(title, slug)")
      .eq("student_id", user.id);

    // 3. Fetch Bookings / Sessions
    const { data: bookings } = await supabase
      .from("bookings")
      .select("*, services(title)")
      .eq("student_id", user.id);

    // 4. Fetch Files Metadata
    const { data: files } = await supabase
      .from("files")
      .select("id, original_name, mime_type, size_bytes, version_label, notes, shared_with_mentor, created_at, updated_at")
      .eq("owner_id", user.id);

    // 5. Fetch Invoices and Payments
    const { data: payments } = await supabase
      .from("payments")
      .select("*, invoices(*)")
      .eq("user_id", user.id);

    // 6. Fetch Membership
    const { data: memberships } = await supabase
      .from("memberships")
      .select("*, membership_plans(*)")
      .eq("user_id", user.id);

    // 7. Fetch Notifications
    const { data: notifications } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id);

    const exportBundle = {
      version: "1.0",
      export_date: new Date().toISOString(),
      platform: "GradEdge Academic Solutions",
      user_id: user.id,
      email: user.email,
      profile: profile || null,
      projects: projects || [],
      bookings: bookings || [],
      files_metadata: files || [],
      payments: payments || [],
      memberships: memberships || [],
      notifications: notifications || [],
    };

    const fileName = `gradedge-researcher-data-${new Date().toISOString().split("T")[0]}.json`;

    return new NextResponse(JSON.stringify(exportBundle, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unauthorized" }, { status: 401 });
  }
}

