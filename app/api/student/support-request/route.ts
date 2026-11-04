import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { SupportRequestSchema } from "@/lib/validators";
import { requireUser } from "@/lib/auth/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { sendSupportRequestAdminNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const authSession = await requireUser();
    if (!authSession || !authSession.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to submit a support request." },
        { status: 401 }
      );
    }
    const { user, profile } = authSession;

    const body = await request.json();
    const parsed = SupportRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { service_id, title, brief, deadline, files } = parsed.data;
    const projectId = crypto.randomUUID();

    let studentName = profile?.full_name || user.email?.split("@")[0] || "Enrolled Student";
    let serviceTitle = "Methodology & Review Support";

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createServiceRoleClient();

      // Resolve service title
      const { data: service } = await supabase
        .from("services")
        .select("id, name")
        .eq("id", service_id)
        .single();
      if (service?.name) {
        serviceTitle = service.name;
      }

      // Resolve student profile name if not cached
      if (!studentName || studentName === "Enrolled Student") {
        const { data: dbProfile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
        if (dbProfile?.full_name) {
          studentName = dbProfile.full_name;
        }
      }

      // Create project with status 'requested'
      const { error: projectError } = await supabase.from("projects").insert({
        id: projectId,
        student_id: user.id,
        service_id,
        title,
        brief,
        due_date: deadline ? new Date(deadline).toISOString().slice(0, 10) : null,
        status: "requested",
      });

      if (projectError) {
        console.error("[Support Request Project Error]", projectError);
        return NextResponse.json({ error: "Failed to submit support request" }, { status: 500 });
      }

      // Attach any files to files table
      if (files && files.length > 0) {
        const fileRows = files.map((f) => ({
          id: crypto.randomUUID(),
          owner_id: user.id,
          project_id: projectId,
          file_name: f.file_name,
          bucket_path: f.bucket_path,
          mime_type: f.mime_type,
          size_bytes: f.size_bytes,
          visibility: "shared_with_mentor",
        }));

        await supabase.from("files").insert(fileRows);
      }
    }

    // Notify admin
    await sendSupportRequestAdminNotification({
      studentName,
      studentEmail: user.email || "student@gradedge.com",
      serviceTitle,
      title,
      brief,
      deadline,
      projectId,
    });

    return NextResponse.json({
      success: true,
      projectId,
      status: "requested",
      message: "Your support request has been submitted. Our team will review your scope and assign your specialist mentor.",
    });
  } catch (error) {
    console.error("[Support Request Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
