"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

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

      // Redirect to target workspace
      router.push(data.redirectTo || "/student");
      router.refresh();
    } catch {
      setErrorMessage("Unable to connect to authentication service. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      honestLine="Your research, your words, our guidance."
      subtext="Access your dissertation chapters, annotated mentor feedback, and scheduled strategy consultations."
      title="Scholar Portal Sign In"
      subtitle={
        <p>
          New to GradEdge?{" "}
          <Link
            href="/register"
            className="text-navy hover:text-gold transition-colors underline font-medium"
          >
            Create your researcher account
          </Link>
        </p>
      }
    >
      {/* Notifications */}
      {errorMessage && (
        <div
          role="alert"
          className="p-3.5 bg-burgundy/10 border-l-2 border-burgundy text-xs text-tone-heading rounded-[1px] flex items-start gap-2.5 font-sans mb-5"
        >
          <AlertCircle className="w-4 h-4 text-burgundy shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">{errorMessage}</div>
        </div>
      )}

      {successNotice && (
        <div
          role="status"
          className="p-3.5 bg-forest/10 border-l-2 border-forest text-xs text-tone-heading rounded-[1px] flex items-start gap-2.5 font-sans mb-5"
        >
          <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">{successNotice}</div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4 font-sans">
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-wider text-tone-heading"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="researcher@university.edu"
            className="block w-full border border-tone-rule bg-paper px-3.5 py-2.5 text-xs sm:text-sm text-tone-heading placeholder:text-tone-muted/60 focus:outline-2 focus:outline-navy rounded-[2px] transition-all"
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
            <Link
              href="/forgot-password"
              className="text-xs text-tone-muted hover:text-navy underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full border border-tone-rule bg-paper px-3.5 py-2.5 pr-10 text-xs sm:text-sm text-tone-heading placeholder:text-tone-muted/60 focus:outline-2 focus:outline-navy rounded-[2px] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-tone-muted hover:text-tone-heading p-1 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="accent"
            size="lg"
            disabled={loading}
            className="w-full text-xs font-semibold py-2.5"
          >
            {loading ? "Authenticating..." : "Sign In to Workspace \u2192"}
          </Button>
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
    </AuthSplitLayout>
  );
}
