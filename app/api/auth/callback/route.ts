import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isProfileComplete } from "@/lib/auth/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      const user = data.user;

      // 1. Check if user profile already exists by id OR by email (linking safety)
      let { data: existingProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (!existingProfile && user.email) {
        const { data: profileByEmail } = await supabase
          .from("profiles")
          .select("*")
          .eq("email", user.email)
          .maybeSingle();

        if (profileByEmail) {
          // Link profile to user id safely
          await supabase
            .from("profiles")
            .update({ id: user.id })
            .eq("email", user.email);
          existingProfile = { ...profileByEmail, id: user.id };
        }
      }

      const fullName =
        existingProfile?.full_name ||
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "Scholar";

      if (!existingProfile) {
        // Initialize minimal profile for Google sign-in
        const { data: newProfile } = await supabase
          .from("profiles")
          .upsert(
            {
              id: user.id,
              role: "student",
              full_name: fullName,
              email: user.email!,
              institution: "",
              study_level: "",
              field_of_study: "",
              timezone: "UTC",
              marketing_opt_in: false,
              status: "active",
            },
            { onConflict: "id" }
          )
          .select()
          .single();

        existingProfile = newProfile;
      }

      const userRole = existingProfile?.role || "student";

      // If user is admin, set admin activity cookie
      if (userRole === "admin") {
        const cookieStore = await cookies();
        cookieStore.set("admin_last_active", String(Date.now()), {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
      }

      // Check if profile has all required fields: study level, field of study, institution, terms_accepted_at
      const profileCompleted = isProfileComplete(existingProfile);

      // If student and profile is incomplete, redirect to /complete-profile
      if (userRole === "student" && !profileCompleted) {
        const targetNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/student";
        return NextResponse.redirect(`${origin}/complete-profile?returnTo=${encodeURIComponent(targetNext)}`);
      }

      // If explicit 'next' parameter is provided (e.g. for /reset-password)
      if (next && next.startsWith("/") && !next.startsWith("//")) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      // Otherwise redirect based on role
      if (userRole === "admin") {
        return NextResponse.redirect(`${origin}/admin`);
      } else if (userRole === "mentor") {
        return NextResponse.redirect(`${origin}/mentor`);
      } else {
        return NextResponse.redirect(`${origin}/student`);
      }
    }
  }

  // Return the user to login with error notice if code exchange fails
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}

