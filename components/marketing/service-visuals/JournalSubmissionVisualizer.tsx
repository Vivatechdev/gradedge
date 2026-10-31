"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Award, BookOpen, Send, CheckCircle2, MessageSquare, ArrowRight } from "lucide-react";

interface RebuttalScenario {
  reviewer: string;
  critique: string;
  mentorStrategy: string;
  formalRebuttalResponse: string;
  manuscriptPageChange: string;
}

const REBUTTAL_SCENARIOS: RebuttalScenario[] = [
  {
    reviewer: "Reviewer 2 (Methodology Specialist)",
    critique: "The sample size (N=184) is insufficient to support the structural path model in Figure 3. Post-hoc power is questionable.",
    mentorStrategy: "Never argue defensively. Provide an exact Monte Carlo power simulation (Mplus / semPower) demonstrating >0.85 power for medium effect sizes, and insert a dedicated limitation paragraph.",
    formalRebuttalResponse: "We thank the reviewer for this vital methodological observation. To definitively address statistical power concerns, we executed a Monte Carlo power simulation (10,000 replications) parameterised with our empirical factor loadings (RMSEA = 0.04). The analysis confirmed power exceeded 0.88 for detecting our primary structural paths at alpha = 0.05. We have incorporated this full diagnostic breakdown in Section 3.4 and expanded on sample constraints in Section 5.3.",
    manuscriptPageChange: "Page 14, Section 3.4, Paragraphs 2-3 (Lines 312-340); Supplementary Table S2 added.",
  },
  {
    reviewer: "Reviewer 1 (Theoretical Framework)",
    critique: "The manuscript relies heavily on outdated models from the early 2000s and ignores recent discourse regarding institutional logics.",
    mentorStrategy: "Map out the genealogical evolution of the theory, cite the prominent 2022-2025 papers, and explain how your empirical findings bridge classical theory with modern institutional logics.",
    formalRebuttalResponse: "We deeply appreciate the reviewer highlighting this theoretical opportunity. We have thoroughly revised Section 2.2 to incorporate foundational recent scholarship (e.g., Alvesson et al., 2023; Greenwood & Hinings, 2024), contextualizing how our findings extend classical institutional theory into modern distributed organizational contexts.",
    manuscriptPageChange: "Page 6, Section 2.2, Lines 124-180; 11 new peer-reviewed references added to Bibliography.",
  },
  {
    reviewer: "Editor-in-Chief (Journal Scope & Formatting)",
    critique: "The manuscript exceeds the journal's 8,500-word limit by 2,200 words. Please truncate without losing analytical depth.",
    mentorStrategy: "Execute surgical structural truncation: relocate lengthy descriptive tables into online Supplementary Appendices and streamline repetitive transitions in the discussion chapter.",
    formalRebuttalResponse: "In strict accordance with the Editor's guidance, we streamlined the manuscript from 10,740 words to 8,310 words (-2,430 words). We achieved this by transferring extended item-level psychometric tables to Supplementary File S1 and tightening the discussion synthesis, preserving all core empirical analyses.",
    manuscriptPageChange: "Total word count: 8,310 words; Tables 3 and 4 designated as Online Supplementary Materials.",
  },
];

export function JournalSubmissionVisualizer({ className }: { className?: string }) {
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const scenario = REBUTTAL_SCENARIOS[activeScenarioIdx];

  return (
    <div className={cn("border border-tone-rule bg-white rounded-[2px] overflow-hidden shadow-xs", className)}>
      {/* Header Bar */}
      <div className="bg-cream/80 border-b border-tone-rule px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-gold shrink-0" />
          <span className="type-micro font-semibold text-tone-heading tracking-wider">
            Peer Review Response & Journal Conversion Dispatch
          </span>
        </div>
        <span className="text-[11px] text-tone-muted font-mono">
          Scopus Q1 / Web of Science Submission Protocols
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-tone-rule">
        {/* Left: Reviewer Queries List (5 Cols) */}
        <div className="lg:col-span-5 bg-paper/50 divide-y divide-tone-rule">
          <div className="p-4 bg-cream/50 border-b border-tone-rule">
            <span className="text-xs font-semibold text-tone-heading block">
              Simulated Peer Review Rebuttals
            </span>
            <p className="text-[11px] text-tone-muted mt-0.5">
              Click a peer review challenge to see the GradEdge response strategy:
            </p>
          </div>

          {REBUTTAL_SCENARIOS.map((sc, idx) => {
            const isSelected = activeScenarioIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveScenarioIdx(idx)}
                className={cn(
                  "w-full text-left p-4 transition-all duration-150 space-y-1 group cursor-pointer",
                  isSelected
                    ? "bg-white border-l-3 border-l-gold text-tone-heading shadow-2xs"
                    : "hover:bg-cream/60 text-tone-muted hover:text-tone-heading"
                )}
              >
                <span className="font-mono text-xs font-semibold text-gold block">
                  {sc.reviewer}
                </span>
                <p className="font-serif text-xs leading-snug line-clamp-2 text-tone-body font-medium">
                  &ldquo;{sc.critique}&rdquo;
                </p>
              </button>
            );
          })}
        </div>

        {/* Right: Rebuttal Strategy & Actionable Response (7 Cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 bg-white">
          <div className="space-y-2 border-b border-tone-rule pb-4">
            <span className="type-micro text-gold font-semibold">
              Point-by-Point Author Rebuttal Protocol
            </span>
            <h3 className="font-serif text-lg font-medium text-tone-heading">
              {scenario.reviewer}
            </h3>
            <div className="p-3 bg-red-50/50 border border-red-200/80 rounded-[2px] text-xs font-serif italic text-tone-body leading-relaxed">
              &ldquo;{scenario.critique}&rdquo;
            </div>
          </div>

          <div className="space-y-4">
            {/* Strategy */}
            <div className="space-y-1">
              <span className="type-micro text-tone-muted block font-semibold">
                GradEdge Advisory Strategy:
              </span>
              <p className="text-xs text-tone-body leading-relaxed bg-paper p-3 border border-tone-rule rounded-[2px]">
                {scenario.mentorStrategy}
              </p>
            </div>

            {/* Formal Response */}
            <div className="space-y-1">
              <span className="type-micro text-navy block font-semibold">
                Formal Letter to Editor &amp; Reviewers:
              </span>
              <p className="text-xs text-tone-body leading-relaxed bg-cream p-4 border border-gold/30 rounded-[2px] font-serif">
                {scenario.formalRebuttalResponse}
              </p>
            </div>

            {/* Manuscript Change */}
            <div className="p-3 bg-paper border border-tone-rule rounded-[2px] flex items-start gap-2.5 text-xs text-tone-muted">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-tone-heading block">Manuscript Audit Trail:</strong>
                <span>{scenario.manuscriptPageChange}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

