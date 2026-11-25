import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { LoginSchema } from "@/lib/validators";
import {
  checkLoginRateLimit,
  recordFailedLoginAttempt,
  resetLoginRateLimit,
} from "@/lib/auth/server";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const result = LoginSchema.safeParse(json);

    if (!result.success) {
      const firstError = result.error.issues[0]?.message || "Please enter your email and password.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { email, password } = result.data;
    const searchParams = new URL(request.url).searchParams;
    const returnTo = searchParams.get("returnTo") || json.returnTo;

    // 1. Enforce login rate limiting (max 5 attempts per 15 minutes)
    const rateLimit = checkLoginRateLimit(email);
    if (!rateLimit.allowed) {
      const minutes = Math.ceil((rateLimit.retryAfterSeconds || 900) / 60);
      return NextResponse.json(
        {
          error: `Too many sign-in attempts. For your account security, please wait ${minutes} minute${
            minutes === 1 ? "" : "s"
          } or reset your password.`,
        },
        { status: 429 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Authentication service is not configured." },
        { status: 503 }
      );
    }

    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData?.user) {
      recordFailedLoginAttempt(email);

      if (authError?.message?.toLowerCase().includes("email not confirmed")) {
        return NextResponse.json(
          {
            error: "Please verify your email address before signing in.",
            needsVerification: true,
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { error: "Invalid email or password. Please try again or reset your password." },
        { status: 401 }
      );
    }

    const authUser = authData.user;
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, status, full_name")
      .eq("id", authUser.id)
      .single();

    if (profile?.status === "suspended") {
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: "Your account is currently suspended. Please contact support@gradedge.com." },
        { status: 403 }
      );
    }

    const role = profile?.role || "student";

    // Reset rate limit on successful sign-in
    resetLoginRateLimit(email);

    const cookieStore = await cookies();
    const displayName =
      profile?.full_name ||
      authUser.user_metadata?.full_name ||
      email.split("@")[0];

    // Set admin inactivity tracker cookie if role is admin
    if (role === "admin") {
      cookieStore.set("admin_last_active", String(Date.now()), {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    // Smart role-based redirection
    let target = "/student";
    if (role === "admin") {
      target = "/admin";
    } else if (role === "mentor") {
      target = "/mentor";
    }

    // If a valid safe internal returnTo was requested, honor it only if role permits
    if (returnTo && returnTo.startsWith("/") && !returnTo.startsWith("//")) {
      const isAllowedReturn =
        (role === "admin") ||
        (role === "mentor" && !returnTo.startsWith("/admin")) ||
        (role === "student" && !returnTo.startsWith("/admin") && !returnTo.startsWith("/mentor"));

      if (isAllowedReturn) {
        target = returnTo;
      }
    }

    return NextResponse.json({
      success: true,
      redirectTo: target,
      redirectUrl: target,
      role,
      user: {
        id: authUser.id,
        email: authUser.email,
        name: displayName,
      },
    });
  } catch (error: any) {
    console.error("[Login Error]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while signing in. Please try again." },
      { status: 500 }
    );
  }
}
