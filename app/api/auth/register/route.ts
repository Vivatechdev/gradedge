import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { RegisterSchema } from "@/lib/validators";
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
      marketing_opt_in,
    } = result.data;

    const supabase = await createClient();

    // 1. Sign up user via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          study_level,
          institution,
          field_of_study,
          timezone,
          marketing_opt_in,
        },
      },
    });

    if (authError) {
      if (
        authError.message.toLowerCase().includes("already registered") ||
        authError.message.toLowerCase().includes("unique constraint")
      ) {
        return NextResponse.json(
          { error: "An account with this email already exists. Try signing in instead." },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: authError.message || "Failed to create account. Please try again." },
        { status: 400 }
      );
    }

    const user = authData?.user;
    if (user) {
      // 2. Insert or update public.profiles with role = 'student'
      // Note: public registration NEVER allows setting admin or mentor role
      const { error: profileError } = await supabase.from("profiles").upsert(
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
          status: "active",
        },
        { onConflict: "id" }
      );

      if (profileError) {
        console.warn("[Register Profile Warning]", profileError.message);
      }

      // 3. Dispatch welcome email via Resend in the background
      sendWelcomeEmail({
        to: email,
        name: full_name,
      }).catch((err) => console.error("[Welcome Email Error]", err));
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
