"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";

interface AuthShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  activeTab?: "register" | "login" | null;
  className?: string;
}

export function AuthShell({
  title,
  description,
  children,
  activeTab,
  className,
}: AuthShellProps) {
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Monitor tab visibility to pause animations when hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Monitor prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  return (
    <div className="min-h-screen bg-paper flex flex-col min-[900px]:flex-row text-tone-body selection:bg-gold/20 selection:text-navy">
      {/* Google Font Caveat for handwritten notes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');

        /* ── 16-Second Feedback Cycle Keyframes ───────────────────────────── */

        /* Overall Card Loop Fade (92-100% fades out and restarts smoothly) */
        @keyframes manuscriptLoop {
          0%, 92% { opacity: 1; }
          96% { opacity: 0.08; }
          100% { opacity: 1; }
        }

        /* Status Tag 1: "You write" (0-30%) */
        @keyframes tagWriteFade {
          0%, 26% { opacity: 1; transform: translateY(0); }
          29%, 100% { opacity: 0; transform: translateY(-4px); }
        }

        /* Status Tag 2: "Mentor reviews" (30-62%) */
        @keyframes tagReviewFade {
          0%, 28% { opacity: 0; transform: translateY(4px); }
          32%, 58% { opacity: 1; transform: translateY(0); }
          61%, 100% { opacity: 0; transform: translateY(-4px); }
        }

        /* Status Tag 3: "You revise" (62-92%) */
        @keyframes tagReviseFade {
          0%, 60% { opacity: 0; transform: translateY(4px); }
          64%, 90% { opacity: 1; transform: translateY(0); }
          93%, 100% { opacity: 0; transform: translateY(-4px); }
        }

        /* Stepwise Typing of Student's Sentence (0-30%) */
        @keyframes typeSentenceStepwise {
          0%, 2% { clip-path: inset(0 100% 0 0); opacity: 1; }
          22% { clip-path: inset(0 0% 0 0); opacity: 1; }
          61% { clip-path: inset(0 0% 0 0); opacity: 1; }
          62%, 92% { clip-path: inset(0 0% 0 0); opacity: 0.45; }
          95%, 100% { clip-path: inset(0 100% 0 0); opacity: 0; }
        }

        /* Yellow Highlighter Sweep across "standard regression" (30-62%) */
        @keyframes sweepYellowHighlight {
          0%, 29% { transform: scaleX(0); opacity: 0; }
          30% { transform: scaleX(0); opacity: 1; }
          35%, 61% { transform: scaleX(1); opacity: 1; }
          62%, 92% { transform: scaleX(1); opacity: 0.35; }
          95%, 100% { transform: scaleX(0); opacity: 0; }
        }

        /* Handwritten Cream Sticky Note Tab at edge (30-62%) */
        @keyframes stickyNotePop {
          0%, 30% { opacity: 0; transform: translate(12px, -6px) rotate(6deg) scale(0.9); }
          33%, 59% { opacity: 1; transform: translate(0, 0) rotate(2deg) scale(1); }
          61%, 100% { opacity: 0; transform: translate(6px, -4px) rotate(4deg) scale(0.95); }
        }

        /* Mentor Comment Card Fades In (30-62%) */
        @keyframes mentorCommentIn {
          0%, 32% { opacity: 0; transform: translateY(6px); pointer-events: none; }
          36%, 59% { opacity: 1; transform: translateY(0); pointer-events: auto; }
          62%, 100% { opacity: 0; transform: translateY(-4px); pointer-events: none; }
        }

        /* Red Strikethrough Line (62-92%) */
        @keyframes redStrikethrough {
          0%, 61% { transform: scaleX(0); opacity: 0; }
          62% { transform: scaleX(0); opacity: 1; }
          66%, 92% { transform: scaleX(1); opacity: 1; }
          95%, 100% { transform: scaleX(0); opacity: 0; }
        }

        /* Revised Text Under Gold Left Border (62-92%) */
        @keyframes revisedTextTyping {
          0%, 62% { clip-path: inset(0 100% 0 0); opacity: 0; }
          64% { clip-path: inset(0 100% 0 0); opacity: 1; }
          78%, 92% { clip-path: inset(0 0% 0 0); opacity: 1; }
          95%, 100% { clip-path: inset(0 100% 0 0); opacity: 0; }
        }

        /* Chapter Progress Bar Fill from 15% to 60% (62-92%) */
        @keyframes progressFillCycle {
          0%, 62% { width: 15%; }
          65%, 77% { width: 60%; }
          92% { width: 60%; }
          96%, 100% { width: 15%; }
        }

        /* Progress Percentage Text Cross-fade */
        @keyframes percent15Fade {
          0%, 62% { opacity: 1; }
          64%, 93% { opacity: 0; }
          96%, 100% { opacity: 1; }
        }
        @keyframes percent60Fade {
          0%, 62% { opacity: 0; }
          65%, 92% { opacity: 1; }
          95%, 100% { opacity: 0; }
        }

        /* Animation Assignments */
        .anim-manuscript-card {
          animation: manuscriptLoop 16s ease-in-out infinite;
        }
        .anim-tag-write {
          animation: tagWriteFade 16s ease-in-out infinite;
        }
        .anim-tag-review {
          animation: tagReviewFade 16s ease-in-out infinite;
        }
        .anim-tag-revise {
          animation: tagReviseFade 16s ease-in-out infinite;
        }
        .anim-sentence-student {
          animation: typeSentenceStepwise 16s cubic-bezier(0.1, 0.7, 0.1, 1) infinite;
        }
        .anim-highlight-sweep {
          animation: sweepYellowHighlight 16s ease-out infinite;
        }
        .anim-sticky-tab {
          animation: stickyNotePop 16s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
        }
        .anim-mentor-card {
          animation: mentorCommentIn 16s ease-in-out infinite;
        }
        .anim-red-strike {
          animation: redStrikethrough 16s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
        }
        .anim-revised-sentence {
          animation: revisedTextTyping 16s cubic-bezier(0.1, 0.7, 0.1, 1) infinite;
        }
        .anim-progress-fill {
          animation: progressFillCycle 16s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .anim-percent-15 {
          animation: percent15Fade 16s ease-in-out infinite;
        }
        .anim-percent-60 {
          animation: percent60Fade 16s ease-in-out infinite;
        }

        /* Pause when tab is hidden */
        .auth-paused * {
          animation-play-state: paused !important;
        }

        /* Reduced Motion Fallback: Show Finished Revised State With No Movement */
        @media (prefers-reduced-motion: reduce) {
          .anim-manuscript-card,
          .anim-tag-write,
          .anim-tag-review,
          .anim-tag-revise,
          .anim-sentence-student,
          .anim-highlight-sweep,
          .anim-sticky-tab,
          .anim-mentor-card,
          .anim-red-strike,
          .anim-revised-sentence,
          .anim-progress-fill,
          .anim-percent-15,
          .anim-percent-60 {
            animation: none !important;
          }
          .anim-tag-write { opacity: 0 !important; }
          .anim-tag-review { opacity: 0 !important; }
          .anim-tag-revise { opacity: 1 !important; transform: none !important; }
          .anim-sentence-student {
            clip-path: none !important;
            opacity: 0.45 !important;
          }
          .anim-red-strike {
            transform: scaleX(1) !important;
            opacity: 1 !important;
          }
          .anim-highlight-sweep {
            transform: scaleX(1) !important;
            opacity: 0.3 !important;
          }
          .anim-sticky-tab {
            display: none !important;
          }
          .anim-mentor-card {
            display: none !important;
          }
          .anim-revised-sentence {
            clip-path: none !important;
            opacity: 1 !important;
          }
          .anim-progress-fill {
            width: 60% !important;
          }
          .anim-percent-15 { opacity: 0 !important; }
          .anim-percent-60 { opacity: 1 !important; }
        }
      `}</style>

      {/* ── LEFT PANEL (Desktop >= 900px, hidden below 900px) ───────────────── */}
      <aside className="hidden min-[900px]:flex min-[900px]:w-[48%] min-[900px]:max-w-[580px] lg:w-[48%] xl:w-[46%] p-4 min-h-screen shrink-0">
        <div className="bg-[#14263F] text-white rounded-[6px] p-8 lg:p-10 xl:p-12 flex flex-col justify-between w-full h-full relative overflow-hidden shadow-sm border border-[#14263F]">
          {/* Subtle background ambient warmth */}
          <div
            className="absolute -top-32 -left-32 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          {/* 1. White GradEdge Logo */}
          <div className="relative z-10">
            <Logo variant="full-white" href="/" />
          </div>

          {/* 2. Animated Manuscript Card Showing Feedback Cycle (16-second loop) */}
          <div
            className={cn(
              "relative z-10 my-6 w-full max-w-[440px] mx-auto",
              (!isPageVisible || prefersReducedMotion) && "auth-paused"
            )}
          >
            {/* The Manuscript Card Container */}
            <div className="anim-manuscript-card bg-[#FAF8F4] text-[#14263F] rounded-[4px] p-5 sm:p-6 border border-[#E4DFD5] shadow-[0_14px_32px_rgba(10,22,38,0.45),0_3px_8px_rgba(10,22,38,0.25)] relative transition-all">
              {/* Handwritten Sticky Tab Note at card's edge */}
              <div
                className="anim-sticky-tab absolute -right-3 sm:-right-4 top-10 z-30 bg-[#FFFDE7] border border-[#FDE047]/70 rounded-[2px] px-3 py-1 shadow-md origin-top-right pointer-events-none"
                style={{ fontFamily: "'Caveat', cursive, sans-serif" }}
              >
                <div className="w-4 h-1.5 bg-gold/30 rounded-full mx-auto -mt-2 mb-1" />
                <span className="text-base sm:text-lg font-bold text-[#854D0E] tracking-wide whitespace-nowrap">
                  Which model? Why?
                </span>
              </div>

              {/* Card Header: Manuscript Title & Status Tag Cross-fade */}
              <div className="flex items-center justify-between border-b border-[#E4DFD5] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" aria-hidden="true" />
                  <span className="font-serif text-xs sm:text-sm font-semibold tracking-tight text-[#14263F]">
                    Draft chapter 3, Methodology
                  </span>
                </div>

                {/* Status Tag Container */}
                <div className="relative h-6 w-28 flex items-center justify-end">
                  {/* Tag 1: You write */}
                  <span className="anim-tag-write absolute right-0 text-[10px] sm:text-[11px] font-sans font-semibold px-2 py-0.5 rounded-[3px] bg-[#14263F]/5 text-[#14263F] border border-[#14263F]/15">
                    You write
                  </span>
                  {/* Tag 2: Mentor reviews */}
                  <span className="anim-tag-review absolute right-0 text-[10px] sm:text-[11px] font-sans font-semibold px-2 py-0.5 rounded-[3px] bg-[#C8963E]/15 text-[#926014] border border-[#C8963E]/30">
                    Mentor reviews
                  </span>
                  {/* Tag 3: You revise */}
                  <span className="anim-tag-revise absolute right-0 text-[10px] sm:text-[11px] font-sans font-semibold px-2 py-0.5 rounded-[3px] bg-[#14263F] text-white border border-[#14263F]">
                    You revise
                  </span>
                </div>
              </div>

              {/* Manuscript Document Content Area */}
              <div className="relative bg-white border border-[#E4DFD5]/80 rounded-[3px] p-3.5 sm:p-4 mb-4 min-h-[148px] flex flex-col justify-between overflow-hidden">
                {/* Sentence 1: Student's draft with highlighter and strikethrough */}
                <div className="relative text-xs sm:text-[13px] font-sans text-[#14263F] leading-relaxed">
                  <div className="anim-sentence-student relative inline-block">
                    <span>Data was analysed with </span>
                    <span className="relative inline-block px-1">
                      {/* Yellow highlighter sweep */}
                      <span
                        className="anim-highlight-sweep absolute inset-0 bg-[#FEF08A] rounded-[1px] origin-left -z-0"
                        aria-hidden="true"
                      />
                      <span className="relative z-10 font-medium">standard regression</span>
                    </span>
                    <span>.</span>

                    {/* Red Strikethrough Line */}
                    <span
                      className="anim-red-strike absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1.5px] bg-[#DC2626] origin-left z-20 pointer-events-none"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* Feedback & Revision Stack (Min-height preserves zero layout shift) */}
                <div className="relative min-h-[64px] flex items-center mt-2.5">
                  {/* Mentor Comment Card (Fades in 30-62%) */}
                  <div className="anim-mentor-card absolute inset-x-0 top-0 bg-[#FAF8F4] border-l-2 border-gold border-t border-r border-b border-[#E4DFD5] rounded-r-[3px] p-2.5 shadow-xs">
                    <span className="text-[9px] uppercase font-sans font-bold tracking-wider text-[#C8963E] block mb-0.5">
                      Mentor comment
                    </span>
                    <p className="text-[11px] sm:text-xs text-[#14263F] leading-snug font-sans">
                      &ldquo;Does this method match your research question? Check normality before you run the model.&rdquo;
                    </p>
                  </div>

                  {/* Revised Sentence (Types in 62-92% under gold left border) */}
                  <div className="anim-revised-sentence absolute inset-x-0 top-0 border-l-2 border-[#C8963E] bg-gold/5 pl-2.5 pr-2 py-1.5 rounded-r-[2px]">
                    <span className="text-[9px] uppercase font-sans font-bold tracking-wider text-[#C8963E] block mb-0.5">
                      Revision
                    </span>
                    <p className="text-[11px] sm:text-xs text-[#14263F] leading-snug font-medium font-sans">
                      Instruments were validated by factor analysis, then tested with hierarchical regression.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Footer: Chapter Progress Bar */}
              <div className="pt-2 border-t border-[#E4DFD5]/80">
                <div className="flex items-center justify-between text-[11px] font-sans text-tone-muted mb-1.5">
                  <span className="font-medium text-[#14263F]">Chapter 3 progress</span>
                  <div className="relative h-4 w-10 text-right">
                    <span className="anim-percent-15 absolute right-0 font-mono font-semibold text-tone-muted">
                      15%
                    </span>
                    <span className="anim-percent-60 absolute right-0 font-mono font-semibold text-gold">
                      60%
                    </span>
                  </div>
                </div>
                {/* Progress Track & Animated Fill */}
                <div className="w-full h-1.5 bg-[#E4DFD5] rounded-full overflow-hidden">
                  <div className="anim-progress-fill h-full bg-gold rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Headline & Three Lines */}
          <div className="relative z-10 mt-2">
            <h2 className="font-serif text-2xl lg:text-[26px] xl:text-[28px] font-medium leading-tight text-white mb-4">
              A second pair of eyes on your thesis.
            </h2>

            <div className="space-y-2 text-xs lg:text-[13px] text-white/85 font-sans">
              <div className="pt-2.5 border-t border-white/15 leading-relaxed">
                Send a draft and get honest comments you can use
              </div>
              <div className="pt-2.5 border-t border-white/15 leading-relaxed">
                Your mentor knows your subject and your software
              </div>
              <div className="pt-2.5 border-t border-white/15 leading-relaxed">
                You write it. We help you get it right
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── RIGHT PANEL (Centered Form) ─────────────────────────────────────── */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-12 bg-paper">
        <div className={cn("w-full max-w-[440px] space-y-6", className)}>
          {/* Logo on top below 900px */}
          <div className="min-[900px]:hidden flex justify-center mb-6">
            <Logo variant="full" href="/" />
          </div>

          {/* Optional Tabs Switching Between "Create account" and "Log in" */}
          {activeTab && (
            <nav
              aria-label="Account navigation"
              className="flex border-b border-[#E4DFD5]"
            >
              <Link
                href="/register"
                className={cn(
                  "pb-2.5 px-3 text-xs sm:text-sm font-medium transition-colors border-b-2 -mb-px",
                  activeTab === "register"
                    ? "border-gold text-navy font-semibold"
                    : "border-transparent text-tone-muted hover:text-navy"
                )}
                aria-current={activeTab === "register" ? "page" : undefined}
              >
                Create account
              </Link>
              <Link
                href="/login"
                className={cn(
                  "pb-2.5 px-3 text-xs sm:text-sm font-medium transition-colors border-b-2 -mb-px",
                  activeTab === "login"
                    ? "border-gold text-navy font-semibold"
                    : "border-transparent text-tone-muted hover:text-navy"
                )}
                aria-current={activeTab === "login" ? "page" : undefined}
              >
                Log in
              </Link>
            </nav>
          )}

          {/* Form Header */}
          <div className="space-y-1.5 text-left">
            <h1 className="font-serif text-2xl sm:text-3xl font-medium text-tone-heading">
              {title}
            </h1>
            {description && (
              <p className="text-xs sm:text-sm text-tone-muted leading-relaxed font-sans">
                {description}
              </p>
            )}
          </div>

          {/* Form Card */}
          <div className="bg-white border border-[#E4DFD5] p-6 sm:p-8 rounded-[4px] shadow-xs">
            {children}
          </div>

          {/* Subtle return link */}
          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-[11px] text-tone-muted hover:text-navy transition-colors font-sans"
            >
              &larr; Return to homepage
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

// Re-export AuthSplitLayout for backward compatibility
export const AuthSplitLayout = AuthShell;
