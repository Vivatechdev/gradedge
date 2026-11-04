import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { RegisterSchema } from "@/lib/validators";
import { checkRateLimit, recordFailedAttempt } from "@/lib/auth/server";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const result = RegisterSchema.safeParse(json);

    if (!result.success) {
      const firstError = result.error.issues[0]?.message || "Invalid registration information.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const {
      full_name,
      email,
      password,
      study_level,
      institution,
      field_of_study,
      timezone,
      terms_accepted,
      terms_version,
      marketing_opt_in,
    } = result.data;

    // 1. Rate limiting on registration (5 attempts per 15 mins)
    const rateLimit = checkRateLimit("register", email);
    if (!rateLimit.allowed) {
      const minutes = Math.ceil((rateLimit.retryAfterSeconds || 900) / 60);
      return NextResponse.json(
        {
          error: `Too many registration attempts. Please wait ${minutes} minute${
            minutes === 1 ? "" : "s"
          } before trying again.`,
        },
        { status: 429 }
      );
    }

    const supabase = await createClient();

    // 2. Sign up user via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          study_level,
          institution,
          field_of_study,
          timezone: timezone || "UTC",
          marketing_opt_in,
        },
      },
    });

    if (authError) {
      recordFailedAttempt("register", email);

      if (
        authError.message.toLowerCase().includes("already registered") ||
        authError.message.toLowerCase().includes("unique constraint")
      ) {
        // Do not reveal email existence (neutral anti-enumeration response)
        return NextResponse.json({
          success: true,
          requiresVerification: true,
          redirectTo: "/verify-email",
          message: "Please check your email to complete registration.",
        });
      }

      return NextResponse.json(
        { error: authError.message || "Failed to create account. Please try again." },
        { status: 400 }
      );
    }

    const user = authData?.user;
    const nowIso = new Date().toISOString();

    if (user) {
      // 3. Upsert public.profiles with role = 'student' and completed profile details
      await supabase.from("profiles").upsert(
        {
          id: user.id,
          role: "student",
          full_name,
          email,
          institution,
          study_level,
          field_of_study,
          timezone: timezone || "UTC",
          marketing_opt_in: !!marketing_opt_in,
          terms_accepted_at: nowIso,
          terms_version: terms_version || "1.0",
          profile_completed_at: nowIso,
          status: "active",
        },
        { onConflict: "id" }
      );

      // If user has instant session (email verification disabled in env), send welcome email now
      if (authData.session) {
        sendWelcomeEmail({
          to: email,
          name: full_name,
        }).catch((err) => console.error("[Welcome Email Error]", err));
      }
    }

    // Determine if email confirmation is required
    const session = authData?.session;
    const requiresVerification = !session;

    return NextResponse.json({
      success: true,
      requiresVerification,
      redirectTo: requiresVerification ? "/verify-email" : "/student",
      user: {
        id: user?.id,
        email: user?.email,
      },
    });
  } catch (error: any) {
    console.error("[Register Error]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during registration. Please try again." },
      { status: 500 }
    );
  }
}
