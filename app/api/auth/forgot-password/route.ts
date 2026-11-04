import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ForgotPasswordSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const result = ForgotPasswordSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const { email } = result.data;
    const origin = new URL(request.url).origin;
    const supabase = await createClient();

    // Call Supabase password reset flow
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/api/auth/callback?next=/reset-password`,
    });

    if (error) {
      console.warn("[Forgot Password Warning]", error.message);
    }

    // Always return safe friendly message (anti-enumeration)
    return NextResponse.json({
      success: true,
      message:
        "If an account exists for that email, we have sent instructions to reset your password. Please check your inbox and spam folder.",
    });
  } catch (error: any) {
    console.error("[Forgot Password Error]", error);
    return NextResponse.json(
      { error: "Unable to process password reset request. Please try again." },
      { status: 500 }
    );
  }
}
