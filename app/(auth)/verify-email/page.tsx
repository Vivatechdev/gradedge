"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";

function VerifyEmailContent() {
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

      setNotice("A new confirmation email has been dispatched. Please check your inbox and institutional spam filters.");
      setCooldown(60);
      setResending(false);
    } catch {
      setError("A network error occurred. Please try again.");
      setResending(false);
    }
  };

  return (
    <AuthShell
      title="Check Your Academic Inbox"
      description="We have dispatched a verification link to confirm your research workspace."
    >
      <div className="space-y-4">
        {notice && (
          <div
            role="status"
            className="p-3 bg-success/10 border border-success/30 rounded-[4px] text-xs font-sans text-tone-heading leading-relaxed"
          >
            {notice}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="p-3 bg-error/10 border border-error/30 rounded-[4px] text-xs font-sans text-error leading-relaxed"
          >
            {error}
          </div>
        )}

        <div className="bg-[#FAF8F4] border border-[#E4DFD5] rounded-[4px] p-4 text-xs space-y-2 text-tone-muted">
          <p className="font-semibold text-tone-heading">
            Institutional Email Filter Guidance:
          </p>
          <p>
            University spam filters occasionally flag automated confirmations. If you do not see the email within 2 minutes:
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Inspect your institution&apos;s Junk, Spam, or Quarantine folder.</li>
            <li>Whitelist <code>admissions@gradedge.com</code> with your IT department.</li>
            <li>Or request another link below.</li>
          </ul>
        </div>

        {/* Resend Form */}
        <div className="pt-2 space-y-2">
          <label htmlFor="verify_email" className="block text-xs font-semibold text-tone-heading">
            Confirmation Email Address:
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

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <AuthShell
          title="Check Your Academic Inbox"
          description="We have dispatched a verification link to confirm your research workspace."
        >
          <div className="py-12 text-center text-xs font-sans text-tone-muted">Loading verification status...</div>
        </AuthShell>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
