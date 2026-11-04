import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CompleteProfileSchema } from "@/lib/validators";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "You must be signed in to complete your profile." },
        { status: 401 }
      );
    }

    const json = await request.json();
    const result = CompleteProfileSchema.safeParse(json);

    if (!result.success) {
      const firstError = result.error.issues[0]?.message || "Invalid profile data.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const {
      study_level,
      institution,
      field_of_study,
      timezone,
      terms_accepted,
      terms_version,
      marketing_opt_in,
    } = result.data;

    const nowIso = new Date().toISOString();

    const { data: updatedProfile, error: updateError } = await supabase
      .from("profiles")
      .update({
        study_level,
        institution,
        field_of_study,
        timezone: timezone || "UTC",
        terms_accepted_at: nowIso,
        terms_version: terms_version || "1.0",
        marketing_opt_in: !!marketing_opt_in,
        profile_completed_at: nowIso,
      })
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message || "Failed to update profile." },
        { status: 400 }
      );
    }

    // Send plain short welcome email via Resend once profile is complete
    const fullName = updatedProfile?.full_name || user.user_metadata?.full_name || "Scholar";
    if (user.email) {
      sendWelcomeEmail({
        to: user.email,
        name: fullName,
      }).catch((err) => console.error("[Complete Profile Welcome Email Error]", err));
    }

    const returnTo = json.returnTo || "/student";
    const safeReturn = returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/student";

    return NextResponse.json({
      success: true,
      redirectTo: safeReturn,
    });
  } catch (error: any) {
    console.error("[Complete Profile Error]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while saving your profile." },
      { status: 500 }
    );
  }
}

