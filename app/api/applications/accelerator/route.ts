import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { ProgramApplicationSchema } from "@/lib/validators";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import {
  sendAcceleratorApplicationAcknowledgement,
  sendAcceleratorAdminNotification,
} from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Map backwards-compatible or alternative field names if needed
    const normalizedBody = {
      name: body.name || body.full_name,
      email: body.email,
      institution: body.institution,
      doctoral_stage: body.doctoral_stage || body.study_level,
      topic_summary: body.topic_summary || body.summary || body.dissertation_title,
      completed_summary: body.completed_summary || body.summary || "Draft in progress",
      desired_outcomes: body.desired_outcomes || body.timeline || "Completion & defense readiness",
      preferred_start: body.preferred_start || body.timeline || "Next upcoming cohort",
    };

    const parsed = ProgramApplicationSchema.safeParse(normalizedBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const applicationId = crypto.randomUUID();
    const securePaymentToken = crypto.randomBytes(24).toString("hex");
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const paymentUrl = `${siteUrl}/checkout/accelerator?token=${securePaymentToken}`;

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createServiceRoleClient();

      const { error: insertError } = await supabase.from("program_applications").insert({
        id: applicationId,
        program: "accelerator",
        full_name: data.name,
        email: data.email,
        institution: data.institution,
        doctoral_stage: data.doctoral_stage,
        stage_of_research: data.doctoral_stage,
        topic_summary: data.topic_summary,
        completed_summary: data.completed_summary,
        desired_outcomes: data.desired_outcomes,
        goals: data.desired_outcomes,
        preferred_start: data.preferred_start,
        status: "submitted",
        secure_payment_token: securePaymentToken,
        secure_payment_url: paymentUrl,
      });

      if (insertError) {
        console.error("[Accelerator Application Error]", insertError);
        return NextResponse.json(
          { error: "Failed to submit application. Please try again." },
          { status: 500 }
        );
      }
    }

    // Send emails asynchronously
    await Promise.allSettled([
      sendAcceleratorApplicationAcknowledgement({
        to: data.email,
        name: data.name,
        doctoralStage: data.doctoral_stage,
        topicSummary: data.topic_summary,
      }),
      sendAcceleratorAdminNotification({
        name: data.name,
        email: data.email,
        institution: data.institution,
        doctoralStage: data.doctoral_stage,
        topicSummary: data.topic_summary,
        completedSummary: data.completed_summary,
        desiredOutcomes: data.desired_outcomes,
        preferredStart: data.preferred_start,
      }),
    ]);

    return NextResponse.json({
      success: true,
      applicationId,
      message: "Application submitted successfully.",
    });
  } catch (error) {
    console.error("[Accelerator API Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
