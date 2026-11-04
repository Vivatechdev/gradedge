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

    const supabase = await createClient();

    // 2. Sign in with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      recordFailedLoginAttempt(email);

      // Friendly brand error message
      return NextResponse.json(
        { error: "That password doesn't match this email. Try again or reset it." },
        { status: 401 }
      );
    }

    // Reset rate limit on successful sign-in
    resetLoginRateLimit(email);

    // 3. Query role from profiles
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", authData.user.id)
      .single();

    const role = profile?.role || "student";

    if (profile?.status === "suspended") {
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: "Your account is currently suspended. Please contact support@gradedge.com." },
        { status: 403 }
      );
    }

    // 4. Set admin inactivity tracker cookie if role is admin
    if (role === "admin") {
      const cookieStore = await cookies();
      cookieStore.set("admin_last_active", String(Date.now()), {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    // 5. Determine redirection target
    let target = "/student";
    if (role === "admin") {
      target = "/admin";
    } else if (role === "mentor") {
      target = "/mentor";
    }

    // If a valid safe internal returnTo was requested, prioritize it for students and admins
    if (returnTo && returnTo.startsWith("/") && !returnTo.startsWith("//")) {
      // Don't allow students to redirect into /admin
      if (!(role === "student" && returnTo.startsWith("/admin"))) {
        target = returnTo;
      }
    }

    return NextResponse.json({
      success: true,
      redirectTo: target,
      role,
      user: {
        id: authData.user.id,
        email: authData.user.email,
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
