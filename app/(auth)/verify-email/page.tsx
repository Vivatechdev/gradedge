"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;

    if (!email) {
      setError("Please enter your email to receive a new verification link.");
      return;
    }

    setResending(true);
    setError(null);
    setNotice(null);

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to resend verification email.");
        setResending(false);
        return;
      }

      setNotice("A new verification link has been sent to your email.");
      setCooldown(60); // 60 seconds cooldown
      setResending(false);
    } catch {
      setError("Unable to connect to service. Please try again.");
      setResending(false);
    }
  };

  return (
    <AuthShell title="Verify your email">
      <div className="space-y-6 text-center font-sans py-2">
        <div className="w-12 h-12 rounded-[4px] bg-cream border border-[#E4DFD5] text-gold flex items-center justify-center mx-auto text-lg font-serif">
          ✉
        </div>

        <div className="space-y-2 max-w-sm mx-auto">
          <p className="text-xs sm:text-sm text-tone-muted leading-relaxed">
            A verification link has been sent to your email address. Please click the link to activate your account.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="p-3 bg-burgundy/10 border-l-2 border-burgundy text-xs text-tone-heading rounded-[4px] text-left leading-relaxed"
          >
            {error}
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="p-3 bg-forest/10 border-l-2 border-forest text-xs text-tone-heading rounded-[4px] text-left leading-relaxed"
          >
            {notice}
          </div>
        )}

        <div className="space-y-3 pt-2 text-left">
          <label
            htmlFor="verify_email"
            className="block text-xs font-semibold uppercase tracking-wider text-tone-heading"
          >
            Account Email
          </label>
          <input
            id="verify_email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="scholar@university.edu"
            className="block w-full border border-[#E4DFD5] bg-paper px-3.5 py-2.5 text-tone-heading rounded-[4px] focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-all"
          />
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="w-full bg-cream hover:bg-cream/70 text-navy font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-[4px] border border-[#E4DFD5] transition-colors disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          >
            {resending
              ? "Sending..."
              : cooldown > 0
              ? `Resend in ${cooldown}s`
              : "Resend Verification Email"}
          </button>
        </div>

        <div className="pt-4 border-t border-tone-rule">
          <Link
            href="/login"
            className="text-xs text-navy hover:text-gold transition-colors font-medium underline"
          >
            Proceed to Sign In &rarr;
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
