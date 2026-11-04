"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

export default function LoginPage() {
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
        setErrorMessage(data.error || "That password doesn't match this email. Try again or reset it.");
        setLoading(false);
        return;
      }

      router.push(data.redirectTo || "/student");
      router.refresh();
    } catch {
      setErrorMessage("Unable to connect to authentication service. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back" activeTab="login">
      {/* Notifications */}
      {errorMessage && (
        <div
          role="alert"
          className="p-3.5 bg-burgundy/10 border-l-2 border-burgundy text-xs text-tone-heading rounded-[4px] font-sans mb-5 leading-relaxed"
        >
          {errorMessage}
        </div>
      )}

      {successNotice && (
        <div
          role="status"
          className="p-3.5 bg-forest/10 border-l-2 border-forest text-xs text-tone-heading rounded-[4px] font-sans mb-5 leading-relaxed"
        >
          {successNotice}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs sm:text-sm">
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-wider text-tone-heading"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full border border-[#E4DFD5] bg-paper px-3.5 py-2.5 text-tone-heading rounded-[4px] focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-tone-heading"
            >
              Password
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-tone-muted hover:text-tone-heading font-medium transition-colors"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              <Link
                href="/forgot-password"
                className="text-xs text-tone-muted hover:text-navy underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full border border-[#E4DFD5] bg-paper px-3.5 py-2.5 text-tone-heading rounded-[4px] focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-all"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-gold-deep text-navy font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-[4px] transition-colors disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
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
