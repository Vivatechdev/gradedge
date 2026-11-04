import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ResendVerificationSchema } from "@/lib/validators";
import { checkRateLimit, recordFailedAttempt } from "@/lib/auth/server";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const result = ResendVerificationSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // Rate limit resend verification (e.g. max 3 requests per 15 mins)
    const rateLimit = checkRateLimit("resend-verification", email, 3, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      const minutes = Math.ceil((rateLimit.retryAfterSeconds || 900) / 60);
      return NextResponse.json(
        {
          error: `Please wait ${minutes} minute${
            minutes === 1 ? "" : "s"
          } before requesting another verification email.`,
        },
        { status: 429 }
      );
    }

    recordFailedAttempt("resend-verification", email, 3, 15 * 60 * 1000);

    const supabase = await createClient();
    const origin = new URL(request.url).origin;

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${origin}/api/auth/callback?next=/student`,
      },
    });

    if (error) {
      console.warn("[Resend Verification Warning]", error.message);
    }

    // Always return safe neutral success
    return NextResponse.json({
      success: true,
      message: "If your account is pending verification, a new confirmation link has been sent.",
    });
  } catch (error: any) {
    console.error("[Resend Verification Error]", error);
    return NextResponse.json(
      { error: "Unable to send verification email. Please try again." },
      { status: 500 }
    );
  }
}

