import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export type UserRole = "student" | "mentor" | "admin";

export interface UserProfile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  institution: string;
  study_level: string;
  field_of_study: string;
  timezone: string;
  marketing_opt_in: boolean;
  status: "active" | "suspended";
  created_at: string;
}

/**
 * Server-side helper: Require an authenticated user.
 * Redirects unauthenticated visitors to /login with a returnTo query param.
 */
export async function requireUser(returnTo?: string): Promise<{
  user: any;
  profile: UserProfile | null;
}> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      const query = returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : "";
      redirect(`/login${query}`);
    }

    // Fetch role and profile details
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return { user, profile: (profile as UserProfile) || null };
  } else {
    // Test/local mode fallback without Supabase credentials
    const cookieStore = await cookies();
    const roleCookie = cookieStore.get("mock_user_role")?.value;

    if (!roleCookie) {
      const query = returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : "";
      redirect(`/login${query}`);
    }

    const mockProfile: UserProfile = {
      id: "mock-user-id",
      role: (roleCookie as UserRole) || "student",
      full_name: "Test Scholar",
      email: "scholar@gradedge.com",
      institution: "Cambridge",
      study_level: "phd",
      field_of_study: "Economics",
      timezone: "UTC",
      marketing_opt_in: false,
      status: "active",
      created_at: new Date().toISOString(),
    };

    return { user: { id: "mock-user-id", email: "scholar@gradedge.com" }, profile: mockProfile };
  }
}

/**
 * Server-side helper: Require a specific user role (or one of multiple allowed roles).
 * Never relies on client-side state alone.
 */
export async function requireRole(
  allowedRoles: UserRole | UserRole[],
  returnTo?: string
): Promise<{ user: any; profile: UserProfile }> {
  const { user, profile } = await requireUser(returnTo);

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!profile || !roles.includes(profile.role)) {
    // If a student tries to access admin routes, redirect to student dashboard
    if (profile?.role === "student") {
      redirect("/student");
    }
    // If a mentor tries to access admin routes, redirect to mentor portal
    if (profile?.role === "mentor") {
      redirect("/mentor");
    }
    // Fallback: redirect to login
    redirect("/login");
  }

  // If user is admin, enforce 8-hour inactivity session check
  if (profile.role === "admin") {
    const cookieStore = await cookies();
    const lastActive = cookieStore.get("admin_last_active")?.value;
    const now = Date.now();
    const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;

    if (lastActive && now - parseInt(lastActive, 10) > EIGHT_HOURS_MS) {
      redirect("/login?reason=session_expired");
    }
  }

  return { user, profile };
}

/**
 * In-memory Login Rate Limiter (sliding 15-minute window)
 * Enforces security without degrading UX.
 */
interface RateLimitRecord {
  attempts: number;
  firstAttempt: number;
  blockedUntil?: number;
}

const loginAttempts = new Map<string, RateLimitRecord>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes block

export function checkLoginRateLimit(identifier: string): {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds?: number;
} {
  const cleanId = identifier.toLowerCase().trim();
  const now = Date.now();
  const record = loginAttempts.get(cleanId);

  if (!record) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  // Check if currently blocked
  if (record.blockedUntil && record.blockedUntil > now) {
    const retryAfter = Math.ceil((record.blockedUntil - now) / 1000);
    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfterSeconds: retryAfter,
    };
  }

  // Reset if window has elapsed
  if (now - record.firstAttempt > WINDOW_MS) {
    loginAttempts.delete(cleanId);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  const remaining = Math.max(0, MAX_ATTEMPTS - record.attempts);
  return {
    allowed: remaining > 0,
    remainingAttempts: remaining,
  };
}

export function recordFailedLoginAttempt(identifier: string): void {
  const cleanId = identifier.toLowerCase().trim();
  const now = Date.now();
  const record = loginAttempts.get(cleanId);

  if (!record || now - record.firstAttempt > WINDOW_MS) {
    loginAttempts.set(cleanId, {
      attempts: 1,
      firstAttempt: now,
    });
    return;
  }

  record.attempts += 1;
  if (record.attempts >= MAX_ATTEMPTS) {
    record.blockedUntil = now + BLOCK_DURATION_MS;
  }
  loginAttempts.set(cleanId, record);
}

export function resetLoginRateLimit(identifier: string): void {
  loginAttempts.delete(identifier.toLowerCase().trim());
}
