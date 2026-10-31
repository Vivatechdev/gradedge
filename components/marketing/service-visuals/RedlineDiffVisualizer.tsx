"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Edit3, CheckCircle, SplitSquareVertical, FileCheck, Layers } from "lucide-react";

type DiffMode = "tracked" | "split" | "compliance";

export function RedlineDiffVisualizer({ className }: { className?: string }) {
  const [activeMode, setActiveMode] = useState<DiffMode>("tracked");

  return (
    <div className={cn("border border-tone-rule bg-white rounded-[2px] overflow-hidden shadow-xs", className)}>
      {/* Header Bar */}
      <div className="bg-cream/80 border-b border-tone-rule px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-gold shrink-0" />
          <span className="type-micro font-semibold text-tone-heading tracking-wider">
            Redline Editorial Proofroom & Line-Level Audit
          </span>
        </div>

        {/* Mode Tabs */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-[2px] border border-tone-rule text-xs">
          <button
            type="button"
            onClick={() => setActiveMode("tracked")}
            className={cn(
              "px-3 py-1 font-medium rounded-[2px] transition-colors cursor-pointer",
              activeMode === "tracked"
                ? "bg-navy text-white"
                : "text-tone-muted hover:text-tone-heading hover:bg-cream/60"
            )}
          >
            Tracked Changes
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("split")}
            className={cn(
              "px-3 py-1 font-medium rounded-[2px] transition-colors cursor-pointer",
              activeMode === "split"
                ? "bg-navy text-white"
                : "text-tone-muted hover:text-tone-heading hover:bg-cream/60"
            )}
          >
            Before / After Diff
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("compliance")}
            className={cn(
              "px-3 py-1 font-medium rounded-[2px] transition-colors cursor-pointer",
              activeMode === "compliance"
                ? "bg-navy text-white"
                : "text-tone-muted hover:text-tone-heading hover:bg-cream/60"
            )}
          >
            Style Guide Rules
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 sm:p-8">
        {activeMode === "tracked" && (
          <div className="space-y-6">
            <div className="border border-tone-rule bg-paper/60 p-6 rounded-[2px] relative font-serif text-sm sm:text-base leading-relaxed text-tone-body space-y-4">
              <span className="type-micro text-gold font-sans font-semibold block mb-2">
                Manuscript Excerpt &bull; Chapter 3: Methodology (Doctoral Thesis in Social Epidemiology)
              </span>

              <p>
                In order to examine the research questions,{" "}
                <span className="line-through text-red-700/80 bg-red-100/60 px-1 decoration-red-800">
                  a quantitative survey questionnaire was sent out by the researcher to a total of 450 nurses
                </span>{" "}
                <span className="text-emerald-800 bg-emerald-100/70 px-1 font-medium">
                  we administered a pre-validated psychometric instrument to a stratified random sample of 450 registered nursing professionals
                </span>{" "}
                across twelve tertiary medical centers{" "}
                <span className="line-through text-red-700/80 bg-red-100/60 px-1">
                  (Smith and Jones 2020)
                </span>
                <span className="text-emerald-800 bg-emerald-100/70 px-1 font-medium">
                  (Smith &amp; Jones, 2020, p. 114)
                </span>
                .{" "}
                <span className="line-through text-red-700/80 bg-red-100/60 px-1">
                  The data was then put into SPSS to see if there was any significant difference.
                </span>{" "}
                <span className="text-emerald-800 bg-emerald-100/70 px-1 font-medium">
                  Survey responses were subsequently imported into R (v4.3.2) for multivariate analysis of variance (MANOVA) to evaluate inter-cohort discrepancies across burnout dimensions.
                </span>
              </p>

              {/* Marginal Comments Box */}
              <div className="mt-6 pt-4 border-t border-tone-rule/80 space-y-2 font-sans text-xs">
                <div className="p-3 bg-amber-500/10 border-l-3 border-amber-600 rounded-[2px] text-tone-body">
                  <strong className="text-amber-900 block font-semibold mb-0.5">
                    Mentor Editorial Query (Dr. H. W.):
                  </strong>
                  &ldquo;Replaced passive colloquialisms (&lsquo;was sent out by the researcher&rsquo;) with authoritative scholarly active voice. Standardized parenthetical in-text citation to strict APA 7th format including specific page attribution. Replaced vague &lsquo;see if there was any difference&rsquo; with the explicit statistical technique (MANOVA).&rdquo;
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 text-xs font-sans text-tone-muted">
              <div className="p-3 bg-cream/60 border border-tone-rule rounded-[2px]">
                <strong className="text-tone-heading block font-semibold">Line-Level Precision:</strong>
                Syntax, sentence cadence, subject-verb agreement, and scholarly terminology.
              </div>
              <div className="p-3 bg-cream/60 border border-tone-rule rounded-[2px]">
                <strong className="text-tone-heading block font-semibold">Integrity Verified:</strong>
                All original scholarship remains 100% yours; we refine clarity and rigor.
              </div>
              <div className="p-3 bg-cream/60 border border-tone-rule rounded-[2px]">
                <strong className="text-tone-heading block font-semibold">Dual Delivery:</strong>
                You receive both a clean submission-ready docx and a fully tracked redline version.
              </div>
            </div>
          </div>
        )}

        {activeMode === "split" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-red-50/30 border border-red-200/60 rounded-[2px] space-y-3 font-serif text-xs sm:text-sm">
              <div className="flex items-center justify-between font-sans pb-2 border-b border-red-200 text-xs">
                <span className="font-semibold text-red-950 uppercase tracking-wider">Scholar Original Draft</span>
                <span className="text-red-700/80 font-mono text-[10px]">Pre-Editorial Audit</span>
              </div>
              <p className="text-tone-body leading-relaxed">
                &ldquo;A lot of previous literature has looked at teacher retention, but very few people have looked at how school leadership actually influences teachers emotionally. This study aims to fill that huge gap by using both qualitative interviews and numbers to get a comprehensive view.&rdquo;
              </p>
              <div className="pt-2 font-sans text-[11px] text-red-900/80 space-y-1">
                <span className="font-semibold block">&times; Colloquial phrasing (&lsquo;a lot of&rsquo;, &lsquo;very few people&rsquo;)</span>
                <span className="font-semibold block">&times; Hyperbolic claim (&lsquo;huge gap&rsquo;)</span>
                <span className="font-semibold block">&times; Imprecise methodology (&lsquo;interviews and numbers&rsquo;)</span>
              </div>
            </div>

            <div className="p-5 bg-emerald-50/40 border border-emerald-200/80 rounded-[2px] space-y-3 font-serif text-xs sm:text-sm">
              <div className="flex items-center justify-between font-sans pb-2 border-b border-emerald-200 text-xs">
                <span className="font-semibold text-emerald-950 uppercase tracking-wider">GradEdge Editorial Redline</span>
                <span className="text-emerald-700 font-mono text-[10px]">Publication-Ready</span>
              </div>
              <p className="text-tone-body leading-relaxed">
                &ldquo;While scholarly inquiry has extensively investigated instructional retention factors (e.g., Anderson &amp; Thorne, 2021; Williams, 2023), the affective mechanisms mediated by administrative leadership remain under-theorized. Addressing this empirical void, the present investigation employs a convergent mixed-methods design integrating semi-structured phenomenology with structural equation modeling.&rdquo;
              </p>
              <div className="pt-2 font-sans text-[11px] text-emerald-900 space-y-1">
                <span className="font-semibold block">&check; Formal academic register and domain-specific lexicon</span>
                <span className="font-semibold block">&check; Accurate epistemological phrasing (&lsquo;convergent mixed-methods&rsquo;)</span>
                <span className="font-semibold block">&check; Seamless citation integration</span>
              </div>
            </div>
          </div>
        )}

        {activeMode === "compliance" && (
          <div className="space-y-4 text-xs font-sans">
            <p className="text-tone-muted leading-relaxed">
              Every editor at GradEdge is certified across international academic style manuals. We audit every citation, heading level, table caption, and bibliography entry against strict guidelines:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-paper border border-tone-rule rounded-[2px] space-y-2">
                <span className="font-semibold text-navy block text-sm">APA 7th Edition</span>
                <p className="text-tone-muted text-[11px] leading-relaxed">
                  Strict bias-free language, heading levels 1-5, DOIs formatted as live URLs, and parenthetical vs. narrative citations.
                </p>
              </div>
              <div className="p-4 bg-paper border border-tone-rule rounded-[2px] space-y-2">
                <span className="font-semibold text-navy block text-sm">Chicago 17th (Notes &amp; Bib)</span>
                <p className="text-tone-muted text-[11px] leading-relaxed">
                  Footnotes and endnotes formatting, subsequent shortened citations (ibid replacement), and bibliographic indentation.
                </p>
              </div>
              <div className="p-4 bg-paper border border-tone-rule rounded-[2px] space-y-2">
                <span className="font-semibold text-navy block text-sm">IEEE &amp; Vancouver</span>
                <p className="text-tone-muted text-[11px] leading-relaxed">
                  Numerical bracketed citation ordering, mathematical equations formatting, and biomedical journal conformity.
                </p>
              </div>
              <div className="p-4 bg-paper border border-tone-rule rounded-[2px] space-y-2">
                <span className="font-semibold text-navy block text-sm">Harvard &amp; Oxford</span>
                <p className="text-tone-muted text-[11px] leading-relaxed">
                  Institutional author-date conventions, UK vs. US orthography and spelling, and Oxford comma consistency.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

