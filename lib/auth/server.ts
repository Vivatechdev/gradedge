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
  avatar_url?: string | null;
  notification_preferences?: Record<string, any> | null;
  terms_accepted_at?: string | null;
  terms_version?: string | null;
  profile_completed_at?: string | null;
  status: "active" | "suspended";
  created_at: string;
}

/**
 * Checks whether a student profile has all required fields:
 * study_level, field_of_study, institution, and terms_accepted_at.
 */
export function isProfileComplete(profile: Partial<UserProfile> | null | undefined): boolean {
  if (!profile) return false;
  const hasStudyLevel = Boolean(profile.study_level && profile.study_level.trim().length > 0);
  const hasFieldOfStudy = Boolean(profile.field_of_study && profile.field_of_study.trim().length > 0);
  const hasInstitution = Boolean(profile.institution && profile.institution.trim().length > 0);
  const hasTerms = Boolean(profile.terms_accepted_at || profile.profile_completed_at);
  return hasStudyLevel && hasFieldOfStudy && hasInstitution && hasTerms;
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
    try {
      const supabase = await createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!error && user) {
        // Fetch role and profile details
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        return { user, profile: (profile as UserProfile) || null };
      }
    } catch {
      // Fall through to mock session
    }
  }

  // Real Supabase Auth required — no mock session fallback.
  const query = returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : "";
  redirect(`/login${query}`);
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

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // In test/mock mode without active Supabase credentials, allow seamless switching between portals
  if ((!supabaseUrl || !supabaseAnonKey) && profile && !roles.includes(profile.role)) {
    profile.role = roles[0];
  }

  if (!profile || !roles.includes(profile.role)) {
    // If user's role is not in allowedRoles, redirect to /login with returnTo
    const query = returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : "";
    redirect(`/login${query}`);
  }

  // If role is student, ensure profile is complete
  if (profile.role === "student" && !isProfileComplete(profile)) {
    const dest = returnTo || "/student";
    redirect(`/complete-profile?returnTo=${encodeURIComponent(dest)}`);
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
 * General In-memory Rate Limiter (sliding 15-minute window)
 * Applied to login, register, forgot-password, and resend-verification.
 */
interface RateLimitRecord {
  attempts: number;
  firstAttempt: number;
  blockedUntil?: number;
}

const rateLimitBuckets = new Map<string, RateLimitRecord>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes block

export function checkRateLimit(
  action: string,
  identifier: string,
  maxAttempts: number = MAX_ATTEMPTS,
  windowMs: number = WINDOW_MS
): {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds?: number;
} {
  const cleanKey = `${action}:${identifier.toLowerCase().trim()}`;
  const now = Date.now();
  const record = rateLimitBuckets.get(cleanKey);

  if (!record) {
    return { allowed: true, remainingAttempts: maxAttempts };
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
  if (now - record.firstAttempt > windowMs) {
    rateLimitBuckets.delete(cleanKey);
    return { allowed: true, remainingAttempts: maxAttempts };
  }

  const remaining = Math.max(0, maxAttempts - record.attempts);
  return {
    allowed: remaining > 0,
    remainingAttempts: remaining,
  };
}

export function recordFailedAttempt(
  action: string,
  identifier: string,
  maxAttempts: number = MAX_ATTEMPTS,
  windowMs: number = WINDOW_MS,
  blockDurationMs: number = BLOCK_DURATION_MS
): void {
  const cleanKey = `${action}:${identifier.toLowerCase().trim()}`;
  const now = Date.now();
  const record = rateLimitBuckets.get(cleanKey);

  if (!record || now - record.firstAttempt > windowMs) {
    rateLimitBuckets.set(cleanKey, {
      attempts: 1,
      firstAttempt: now,
    });
    return;
  }

  record.attempts += 1;
  if (record.attempts >= maxAttempts) {
    record.blockedUntil = now + blockDurationMs;
  }
  rateLimitBuckets.set(cleanKey, record);
}

export function resetRateLimit(action: string, identifier: string): void {
  const cleanKey = `${action}:${identifier.toLowerCase().trim()}`;
  rateLimitBuckets.delete(cleanKey);
}

// Backward-compatible wrappers for login
export function checkLoginRateLimit(identifier: string) {
  return checkRateLimit("login", identifier);
}

export function recordFailedLoginAttempt(identifier: string) {
  recordFailedAttempt("login", identifier);
}

export function resetLoginRateLimit(identifier: string) {
  resetRateLimit("login", identifier);
}
