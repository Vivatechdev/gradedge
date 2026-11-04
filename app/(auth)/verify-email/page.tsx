"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle2, ArrowRight } from "lucide-react";

export default function VerifyEmailPage() {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    setResending(true);
    // Simulate / trigger resend confirmation
    setTimeout(() => {
      setResending(false);
      setResent(true);
    }, 800);
  };

  return (
    <AuthSplitLayout
      honestLine="Academic work demands precision and trust."
      subtext="We have dispatched a confirmation link to verify your institutional or scholar email address."
      title="Verify Your Email Address"
      subtitle={<p>One quick step before entering your researcher workspace.</p>}
    >
      <div className="space-y-6 text-center font-sans py-2">
        <div className="w-14 h-14 rounded-full bg-cream border border-tone-rule text-gold flex items-center justify-center mx-auto">
          <Mail className="w-6 h-6" />
        </div>

        <div className="space-y-2 max-w-sm mx-auto">
          <h2 className="font-serif text-lg font-medium text-tone-heading">
            Confirmation Link Dispatched
          </h2>
          <p className="text-xs sm:text-sm text-tone-muted leading-relaxed">
            Please check your inbox and click the verification link to activate your scholar profile and thesis project portal.
          </p>
        </div>

        <div className="p-3.5 bg-paper border border-tone-rule text-xs text-tone-body rounded-[2px] text-left leading-relaxed">
          <span className="font-semibold text-tone-heading block mb-1">
            Didn&apos;t receive the email?
          </span>
          Check your institutional spam folder or filters. Academic mail systems (e.g. .edu, .ac.uk) may occasionally hold new automated dispatches for review.
        </div>

        {resent ? (
          <div className="p-3 bg-forest/10 border border-forest/20 text-xs text-forest rounded-[2px] flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>A fresh verification link has been dispatched.</span>
          </div>
        ) : (
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={handleResend}
            disabled={resending}
            className="w-full text-xs"
          >
            {resending ? "Dispatching..." : "Resend Verification Email"}
          </Button>
        )}

        <div className="pt-4 border-t border-tone-rule">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-navy hover:text-gold transition-colors font-medium"
          >
            <span>Proceed to Sign In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </AuthSplitLayout>
  );
}
