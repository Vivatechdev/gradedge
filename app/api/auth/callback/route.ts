import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      const user = data.user;

      // 1. Check if user already has a profile record
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("role, status")
        .eq("id", user.id)
        .single();

      let userRole = existingProfile?.role || "student";

      if (!existingProfile) {
        // First-time sign-in via OAuth / Google
        const fullName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "Scholar";

        await supabase.from("profiles").upsert(
          {
            id: user.id,
            role: "student",
            full_name: fullName,
            email: user.email!,
            institution: "",
            study_level: "masters",
            field_of_study: "",
            timezone: "UTC",
            marketing_opt_in: false,
            status: "active",
          },
          { onConflict: "id" }
        );

        sendWelcomeEmail({
          to: user.email!,
          name: fullName,
        }).catch((err) => console.error("[OAuth Welcome Email Error]", err));
      }

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

      // 2. If explicit 'next' parameter is provided (e.g. for /reset-password)
      if (next && next.startsWith("/") && !next.startsWith("//")) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      // 3. Otherwise redirect based on role
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
