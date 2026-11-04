import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ForgotPasswordSchema } from "@/lib/validators";
import { checkRateLimit, recordFailedAttempt } from "@/lib/auth/server";

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

    // Rate limit forgot-password attempts
    const rateLimit = checkRateLimit("forgot-password", email);
    if (!rateLimit.allowed) {
      const minutes = Math.ceil((rateLimit.retryAfterSeconds || 900) / 60);
      return NextResponse.json(
        {
          error: `Too many password reset requests. Please wait ${minutes} minute${
            minutes === 1 ? "" : "s"
          } before trying again.`,
        },
        { status: 429 }
      );
    }

    recordFailedAttempt("forgot-password", email);

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
        "If an account is registered with this email, we have sent a link to reset your password.",
    });
  } catch (error: any) {
    console.error("[Forgot Password Error]", error);
    return NextResponse.json(
      { error: "Unable to process password reset request. Please try again." },
      { status: 500 }
    );
  }
}

