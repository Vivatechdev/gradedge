import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function GET() {
  try {
    const { user } = await requireUser();
    const supabase = createServiceRoleClient();

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, role, full_name, email, avatar_url, institution, study_level, field_of_study, timezone, phone, notification_preferences, created_at")
      .eq("id", user.id)
      .single();

    if (error || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ profile });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { user } = await requireUser();
    const supabase = createServiceRoleClient();
    const body = await request.json();

    const allowedUpdates: Record<string, any> = {};

    if (typeof body.full_name === "string" && body.full_name.trim().length > 0) {
      allowedUpdates.full_name = body.full_name.trim();
    }
    if (typeof body.institution === "string") {
      allowedUpdates.institution = body.institution.trim();
    }
    if (typeof body.study_level === "string") {
      allowedUpdates.study_level = body.study_level;
    }
    if (typeof body.field_of_study === "string") {
      allowedUpdates.field_of_study = body.field_of_study.trim();
    }
    if (typeof body.timezone === "string" && body.timezone.length > 0) {
      allowedUpdates.timezone = body.timezone;
    }
    if (typeof body.phone === "string" || body.phone === null) {
      allowedUpdates.phone = body.phone;
    }
    if (typeof body.avatar_url === "string" || body.avatar_url === null) {
      allowedUpdates.avatar_url = body.avatar_url;
    }
    if (body.notification_preferences && typeof body.notification_preferences === "object") {
      allowedUpdates.notification_preferences = body.notification_preferences;
    }

    allowedUpdates.updated_at = new Date().toISOString();

    const { data: updatedProfile, error } = await supabase
      .from("profiles")
      .update(allowedUpdates)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Profile update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: updatedProfile });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unauthorized" }, { status: 401 });
  }
}

