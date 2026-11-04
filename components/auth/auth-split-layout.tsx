"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AuthSplitLayoutProps {
  honestLine: string;
  subtext?: string;
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function AuthSplitLayout({
  honestLine,
  subtext,
  title,
  subtitle,
  children,
  className,
}: AuthSplitLayoutProps) {
  return (
    <div className="min-h-screen bg-paper flex flex-col lg:flex-row text-tone-body">
      {/* ── CALM LEFT PANEL ────────────────────────────────────────────── */}
      <aside className="lg:w-[45%] xl:w-[42%] bg-navy-deep text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden shrink-0 border-b lg:border-b-0 lg:border-r border-tone-rule">
        {/* Subtle background ambient warmth */}
        <div
          className="absolute -top-24 -left-24 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Wordmark */}
        <div className="relative z-10">
          <Link href="/" className="inline-block group focus:outline-none focus-visible:ring-1 focus-visible:ring-gold">
            <span className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-white group-hover:text-gold transition-colors">
              GradEdge
            </span>
            <span className="text-[10px] uppercase font-sans font-semibold tracking-[0.18em] text-gold block mt-0.5">
              Academic Solutions
            </span>
          </Link>
        </div>

        {/* Center: The Single Honest Line */}
        <div className="relative z-10 my-12 lg:my-0 max-w-md">
          <div className="w-10 h-[2px] bg-gold mb-6" aria-hidden="true" />
          <blockquote className="font-serif text-2xl sm:text-3xl lg:text-[30px] text-white leading-snug font-normal">
            &ldquo;{honestLine}&rdquo;
          </blockquote>
          {subtext && (
            <p className="text-xs sm:text-sm text-white/70 mt-5 leading-relaxed font-sans">
              {subtext}
            </p>
          )}
        </div>

        {/* Bottom: Institutional Integrity Badge */}
        <div className="relative z-10 pt-8 border-t border-white/15 text-[11px] text-white/60 font-sans flex flex-wrap items-center justify-between gap-3">
          <span>Non-ghostwriting guarantee</span>
          <span className="text-gold">&bull;</span>
          <span>Faculty mentoring worldwide</span>
        </div>
      </aside>

      {/* ── CLEAN FORM RIGHT PANEL ─────────────────────────────────────── */}
      <main className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-14 bg-paper">
        <div className={cn("w-full max-w-lg space-y-6", className)}>
          {/* Header */}
          <div className="space-y-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-medium text-tone-heading">
              {title}
            </h1>
            {subtitle && (
              <div className="text-xs sm:text-sm text-tone-muted leading-relaxed font-sans">
                {subtitle}
              </div>
            )}
          </div>

          {/* Form Card */}
          <div className="bg-white border border-tone-rule p-6 sm:p-8 rounded-[2px] shadow-xs">
            {children}
          </div>

          {/* Footnote */}
          <p className="text-center text-[11px] text-tone-muted font-sans">
            Protected by TLS 1.3 encryption &middot; Strict confidential manuscript handling
          </p>
        </div>
      </main>
    </div>
  );
}
