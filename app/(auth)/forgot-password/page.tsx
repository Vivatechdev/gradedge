"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";

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
    <AuthShell title="Reset your password">
      {submitted ? (
        <div className="space-y-5 text-center font-sans py-4">
          <div className="w-12 h-12 rounded-[4px] bg-forest/10 text-forest flex items-center justify-center mx-auto text-xl font-serif">
            ✓
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-xl font-medium text-tone-heading">
              Check your inbox
            </h2>
            <p className="text-xs sm:text-sm text-tone-muted leading-relaxed max-w-sm mx-auto">
              If an account is registered with <strong className="text-tone-heading">{email}</strong>, we have sent a link to reset your password.
            </p>
          </div>

          <div className="pt-4 border-t border-tone-rule">
            <Link
              href="/login"
              className="inline-block w-full bg-cream hover:bg-cream/70 text-navy font-medium text-xs sm:text-sm py-2.5 px-4 rounded-[4px] border border-[#E4DFD5] transition-colors"
            >
              Return to Sign In
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs sm:text-sm">
          {errorMessage && (
            <div
              role="alert"
              className="p-3.5 bg-burgundy/10 border-l-2 border-burgundy text-xs text-tone-heading rounded-[4px] font-sans leading-relaxed"
            >
              {errorMessage}
            </div>
          )}

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
              className="block w-full border border-[#E4DFD5] bg-paper px-3.5 py-2.5 text-tone-heading rounded-[4px] focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-all"
            />
          </div>

          <div className="pt-2 space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold hover:bg-gold-deep text-navy font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-[4px] transition-colors disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-1.5 w-full text-xs text-tone-muted hover:text-tone-heading py-2 transition-colors"
            >
              &larr; Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </AuthShell>
  );
}
