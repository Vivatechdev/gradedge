import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export default async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let user: any = null;
  let role: string = "student";
  let isProfileCompleted: boolean = true;

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    user = authUser;

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, status, study_level, field_of_study, institution, terms_accepted_at, profile_completed_at")
        .eq("id", user.id)
        .single();

      role = profile?.role || "student";

      const hasStudyLevel = Boolean(profile?.study_level && profile.study_level.trim().length > 0);
      const hasFieldOfStudy = Boolean(profile?.field_of_study && profile.field_of_study.trim().length > 0);
      const hasInstitution = Boolean(profile?.institution && profile.institution.trim().length > 0);
      const hasTerms = Boolean(profile?.terms_accepted_at || profile?.profile_completed_at);

      isProfileCompleted = hasStudyLevel && hasFieldOfStudy && hasInstitution && hasTerms;
    }
  } else {
    // When Supabase credentials are not set in environment (e.g. testing), check test session cookie
    const authCookie =
      request.cookies.get("mock_user_role")?.value ||
      request.cookies.get("sb-access-token")?.value;

    if (authCookie) {
      user = { id: "test-user-id", email: "scholar@gradedge.com" };
      role = authCookie;
      const mockIncomplete = request.cookies.get("mock_incomplete_profile")?.value === "true";
      isProfileCompleted = !mockIncomplete;
    }
  }

  // Handle /complete-profile route
  if (pathname.startsWith("/complete-profile")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("returnTo", pathname + search);
      return NextResponse.redirect(loginUrl);
    }
    // If student already has a complete profile, send to /student
    if (role === "student" && isProfileCompleted) {
      const dest = request.nextUrl.searchParams.get("returnTo");
      return NextResponse.redirect(new URL(dest || "/student", request.url));
    }
    return response;
  }

  const isProtectedPath =
    pathname.startsWith("/student") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/mentor");

  if (!isProtectedPath) {
    return response;
  }

  // 1. Unauthenticated visitors accessing protected routes are redirected to /login with returnTo
  if (!user) {
    const returnPath = pathname + search;
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnTo", returnPath);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Admin routes protection
  if (pathname.startsWith("/admin")) {
    if (role !== "admin") {
      // Students or mentors cannot access /admin
      const redirectTarget = role === "mentor" ? "/mentor" : "/student";
      return NextResponse.redirect(new URL(redirectTarget, request.url));
    }

    // Check admin session inactivity timeout (8 hours)
    const lastActive = request.cookies.get("admin_last_active")?.value;
    const now = Date.now();
    const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;

    if (lastActive && now - parseInt(lastActive, 10) > EIGHT_HOURS_MS) {
      // Inactivity timeout: expire session and redirect
      const timeoutUrl = new URL("/login", request.url);
      timeoutUrl.searchParams.set("reason", "session_expired");
      const redirectResponse = NextResponse.redirect(timeoutUrl);
      redirectResponse.cookies.delete("admin_last_active");
      return redirectResponse;
    }

    // Refresh last active timestamp
    response.cookies.set("admin_last_active", String(now), {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  // 3. Student routes protection
  if (pathname.startsWith("/student")) {
    if (role === "mentor") {
      return NextResponse.redirect(new URL("/mentor", request.url));
    }

    // Check profile completeness: if missing required fields, redirect to /complete-profile
    if (role === "student" && !isProfileCompleted) {
      const returnPath = pathname + search;
      const completeUrl = new URL("/complete-profile", request.url);
      completeUrl.searchParams.set("returnTo", returnPath);
      return NextResponse.redirect(completeUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, svg, icons
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
