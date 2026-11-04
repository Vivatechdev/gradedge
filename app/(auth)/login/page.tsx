"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "";
  const reason = searchParams.get("reason");
  const messageParam = searchParams.get("message");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  useEffect(() => {
    if (reason === "session_expired") {
      setErrorMessage("Your session has timed out after 8 hours of inactivity. Please sign in again.");
    } else if (messageParam === "password_updated") {
      setSuccessNotice("Your password has been successfully updated. You can now sign in.");
    } else if (messageParam === "signed_out_all") {
      setSuccessNotice("You have been signed out of all devices.");
    } else if (messageParam === "signed_out") {
      setSuccessNotice("You have successfully signed out.");
    }
  }, [reason, messageParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnTo }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.needsVerification) {
          router.push(`/verify-email?email=${encodeURIComponent(email)}`);
          return;
        }
        setErrorMessage(data.error || "That password doesn't match this email. Try again or reset it.");
        setLoading(false);
        return;
      }

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        window.location.href = returnTo || "/student";
      }
    } catch {
      setErrorMessage("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome Back to GradEdge"
      description="Sign in to your researcher workspace."
      activeTab="login"
    >
      {/* Alert Banners */}
      {successNotice && (
        <div
          role="status"
          className="mb-6 p-3.5 bg-success/10 border border-success/30 rounded-[2px] text-xs font-sans text-tone-heading leading-relaxed"
        >
          {successNotice}
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="mb-6 p-3.5 bg-error/10 border border-error/30 rounded-[2px] text-xs font-sans text-error leading-relaxed"
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-sans font-medium text-tone-heading mb-1.5"
          >
            Academic or Institutional Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-10 px-3 text-sm font-sans bg-white border border-tone-rule rounded-[2px] text-tone-heading placeholder:text-stone-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all"
            placeholder="you@university.edu"
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-sans font-medium text-tone-heading"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-sans text-navy hover:text-gold transition-colors underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 px-3 pr-16 text-sm font-sans bg-white border border-tone-rule rounded-[2px] text-tone-heading placeholder:text-stone-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all"
              placeholder="Your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-sans font-medium text-stone-500 hover:text-navy transition-colors select-none"
              aria-label={showPassword ? "Hide password text" : "Show password text"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-navy text-paper font-sans text-sm font-medium rounded-[2px] hover:bg-navy/95 active:bg-navy focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Signing in..." : "Sign In to Workspace"}
          </button>
        </div>
      </form>

      {/* OAuth Divider */}
      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-tone-rule" />
        <span className="text-[11px] font-sans uppercase tracking-widest text-tone-muted">
          or
        </span>
        <div className="flex-1 h-px bg-tone-rule" />
      </div>

      {/* Google OAuth Button */}
      <GoogleSignInButton returnTo={returnTo} />

      {/* Register link */}
      <div className="mt-6 pt-4 border-t border-tone-rule text-center text-xs font-sans text-tone-muted">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-navy hover:text-gold transition-colors underline font-medium"
        >
          Register
        </Link>
      </div>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <AuthShell title="Welcome Back to GradEdge" description="Sign in to your researcher workspace." activeTab="login">
          <div className="py-12 text-center text-xs font-sans text-tone-muted">Loading workspace sign in...</div>
        </AuthShell>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
