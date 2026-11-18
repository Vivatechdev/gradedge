"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, X } from "lucide-react";

const COOKIE_CONSENT_KEY = "gradedge_cookie_consent";

export function CookieNotice() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show if user hasn't acknowledged the essential cookie notice
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consent) {
        setIsVisible(true);
      }
    } catch {
      // LocalStorage access restricted
    }
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, "acknowledged");
    } catch {
      // Ignore
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie and privacy information"
      className="fixed bottom-0 inset-x-0 z-40 bg-navy-deep text-white border-t border-tone-rule/20 p-3.5 shadow-xl transition-all duration-200"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs leading-relaxed">
        <div className="flex items-start sm:items-center gap-2.5">
          <ShieldCheck className="h-4 w-4 text-gold shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
          <p className="text-tone-muted-light text-[12px]">
            GradEdge deploys only essential session and currency preference cookies. We do not use third-party tracking or behavioral advertising cookies. Details are documented in our{" "}
            <Link
              href="/legal/cookies"
              className="text-gold underline hover:text-white transition-colors"
            >
              Cookie Policy
            </Link>
            .
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            type="button"
            onClick={handleDismiss}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium rounded-[2px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
          >
            Understood
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss cookie notice"
            className="p-1 text-tone-muted-light hover:text-white transition-colors rounded-[2px]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

