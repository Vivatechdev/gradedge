import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { DEFAULT_EMAIL_TEMPLATES, saveTemplateConfigs } from "@/lib/email/settings";

export async function GET() {
  try {
    await requireRole("admin");
    const supabase = createServiceRoleClient();

    // 1. Fetch settings from database
    const { data: settingsRows } = await supabase.from("settings").select("key, value");

    const settingsMap: Record<string, any> = {};
    (settingsRows || []).forEach((row) => {
      settingsMap[row.key] = row.value;
    });

    const emailTemplates = {
      ...DEFAULT_EMAIL_TEMPLATES,
      ...(settingsMap["email_templates"] || {}),
    };

    const mentorResponseWindow =
      settingsMap["mentor_response_window"] ||
      "24 business hours (Monday–Friday, 9:00 AM – 6:00 PM)";

    // 2. Fetch recent cron runs
    const { data: recentCronRuns } = await supabase
      .from("cron_runs")
      .select("*")
      .order("started_at", { ascending: false })
      .limit(50);

    return NextResponse.json({
      emailTemplates,
      mentorResponseWindow,
      cronRuns: recentCronRuns || [],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireRole("admin");
    const body = await request.json();
    const supabase = createServiceRoleClient();

    const { emailTemplates, mentorResponseWindow } = body;

    if (emailTemplates) {
      await saveTemplateConfigs(emailTemplates);
    }

    if (mentorResponseWindow !== undefined) {
      await supabase.from("settings").upsert({
        key: "mentor_response_window",
        value: mentorResponseWindow,
        updated_at: new Date().toISOString(),
      });
    }

    // Log update
    await supabase.from("audit_log").insert({
      actor_id: user.id,
      action: "admin_updated_platform_settings",
      entity: "settings",
      metadata: {
        updated_templates_count: emailTemplates ? Object.keys(emailTemplates).length : 0,
        response_window: mentorResponseWindow,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unauthorized" }, { status: 401 });
  }
}

