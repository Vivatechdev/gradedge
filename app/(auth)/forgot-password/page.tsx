"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Unable to send reset email. Please try again.");
        setLoading(false);
        return;
      }

      setSubmitted(true);
      setLoading(false);
    } catch {
      setErrorMessage("Unable to connect to service. Please check your internet connection.");
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      honestLine="No locked doors. We'll get you back into your drafts."
      subtext="Enter the institutional or scholar email associated with your account, and we'll send a secure password reset link."
      title="Reset Your Password"
      subtitle={
        <p>
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-navy hover:text-gold transition-colors underline font-medium"
          >
            Sign in
          </Link>
        </p>
      }
    >
      {submitted ? (
        <div className="space-y-5 text-center font-sans py-4">
          <div className="w-12 h-12 rounded-full bg-forest/10 text-forest flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-xl font-medium text-tone-heading">
              Check Your Inbox
            </h2>
            <p className="text-xs sm:text-sm text-tone-muted leading-relaxed max-w-sm mx-auto">
              If an account is registered with <strong className="text-tone-heading">{email}</strong>, we have sent a secure link to reset your password.
            </p>
          </div>

          <div className="pt-4 border-t border-tone-rule">
            <Button variant="secondary" href="/login" size="md" className="w-full">
              Return to Sign In
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          {errorMessage && (
            <div
              role="alert"
              className="p-3.5 bg-burgundy/10 border-l-2 border-burgundy text-xs text-tone-heading rounded-[1px] flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-burgundy shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-tone-heading"
            >
              Account Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="scholar@university.edu"
              className="block w-full border border-tone-rule bg-paper px-3.5 py-2.5 text-xs sm:text-sm text-tone-heading placeholder:text-tone-muted/60 focus:outline-2 focus:outline-navy rounded-[2px]"
            />
          </div>

          <div className="pt-2 space-y-3">
            <Button
              type="submit"
              variant="accent"
              size="lg"
              disabled={loading}
              className="w-full text-xs font-semibold py-2.5"
            >
              {loading ? "Sending reset instructions..." : "Send Password Reset Link \u2192"}
            </Button>

            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-1.5 w-full text-xs text-tone-muted hover:text-tone-heading py-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </form>
      )}
    </AuthSplitLayout>
  );
}
