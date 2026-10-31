"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Users, Shield, Mic, CheckCircle, HelpCircle } from "lucide-react";

interface VivaScenario {
  examinerRole: string;
  trapQuestion: string;
  examinerHiddenIntent: string;
  scholarResponseFramework: string[];
  slidePresentationTip: string;
}

const VIVA_SCENARIOS: VivaScenario[] = [
  {
    examinerRole: "External Examiner (Methodological Rigor)",
    trapQuestion: "You used purposive sampling for your qualitative cohort. Why should the academic committee trust your findings given this lack of statistical generalizability?",
    examinerHiddenIntent: "Testing whether you confuse quantitative statistical generalizability with qualitative theoretical transferability.",
    scholarResponseFramework: [
      "1. Clarify Epistemology: Reaffirm that qualitative inquiry aims for analytical and theoretical transferability (Lincoln & Guba, 1985), not population generalizability.",
      "2. Defend Purposive Criteria: State the exact inclusion criteria that ensured information-rich cases (Patton, 2015).",
      "3. Demonstrate Data Saturation: Reference the audit trail confirming code saturation was achieved by Interview 18.",
    ],
    slidePresentationTip: "Keep a dedicated 'Methodological Rigor & Trustworthiness' backup slide with Lincoln & Guba's four-dimension credibility matrix ready.",
  },
  {
    examinerRole: "Internal Examiner (Theoretical Contribution)",
    trapQuestion: "Your statistical findings partially contradict Smith & Jones (2021). Does this invalidate your theoretical model?",
    examinerHiddenIntent: "Probing whether you panic and concede, or whether you can articulate contextual boundary conditions with scholarly poise.",
    scholarResponseFramework: [
      "1. Welcome Discrepancy: Frame the divergence not as a failure, but as an empirical discovery of boundary conditions.",
      "2. Contrast Contexts: Highlight that Smith & Jones sampled public-sector employees in Western Europe, while your investigation evaluated emerging-market private institutions.",
      "3. Articulate Contribution: Explain how your study refines the original theory to account for institutional variance.",
    ],
    slidePresentationTip: "Show a side-by-side contextual comparison table contrasting your study's sample parameters against Smith & Jones.",
  },
  {
    examinerRole: "Committee Chair (Practical & Policy Impact)",
    trapQuestion: "If you had to advise the Ministry or an executive board tomorrow based solely on your Chapter 5 conclusions, what is the single policy change you would recommend?",
    examinerHiddenIntent: "Testing your ability to synthesize 80,000 words into an executive, high-impact translation without academic rambling.",
    scholarResponseFramework: [
      "1. Direct Synthesis: Deliver one precise, evidence-backed institutional intervention in 30 seconds.",
      "2. Cost & Feasibility: Acknowledge resource constraints and phased implementation.",
      "3. Scholarly Humility: Delineate what the study can authoritatively prescribe versus what warrants further longitudinal inquiry.",
    ],
    slidePresentationTip: "Conclude your presentation deck with a crisp 'Translational Policy Roadmap' diagram connecting findings to implementation.",
  },
];

export function VivaDefenseVisualizer({ className }: { className?: string }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const scenario = VIVA_SCENARIOS[selectedIdx];

  return (
    <div className={cn("border border-tone-rule bg-white rounded-[2px] overflow-hidden shadow-xs", className)}>
      {/* Header Bar */}
      <div className="bg-cream/80 border-b border-tone-rule px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gold shrink-0" />
          <span className="type-micro font-semibold text-tone-heading tracking-wider">
            Oral Viva Voce &amp; Defense Simulation Chamber
          </span>
        </div>
        <span className="text-[11px] text-tone-muted font-mono">
          Doctoral &amp; Masters Committee Interrogation Scenarios
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-tone-rule">
        {/* Left: Committee Questions (5 Cols) */}
        <div className="lg:col-span-5 bg-paper/50 divide-y divide-tone-rule">
          <div className="p-4 bg-cream/50 border-b border-tone-rule">
            <span className="text-xs font-semibold text-tone-heading block">
              Examiner Defense Scenarios
            </span>
            <p className="text-[11px] text-tone-muted mt-0.5">
              Select an examination cross-examination scenario to review the defense strategy:
            </p>
          </div>

          {VIVA_SCENARIOS.map((sc, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={cn(
                  "w-full text-left p-4 transition-all duration-150 space-y-1.5 group cursor-pointer",
                  isSelected
                    ? "bg-white border-l-3 border-l-navy text-tone-heading shadow-2xs"
                    : "hover:bg-cream/60 text-tone-muted hover:text-tone-heading"
                )}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-navy">
                  <Mic className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span>{sc.examinerRole}</span>
                </div>
                <p className="font-serif text-xs leading-snug line-clamp-2 text-tone-body font-medium">
                  &ldquo;{sc.trapQuestion}&rdquo;
                </p>
              </button>
            );
          })}
        </div>

        {/* Right: Defense Strategy & Response Architecture (7 Cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 bg-white">
          <div className="space-y-2 border-b border-tone-rule pb-4">
            <span className="type-micro text-gold font-semibold">
              Live Committee Query &bull; {scenario.examinerRole}
            </span>
            <div className="p-3.5 bg-paper border border-tone-rule rounded-[2px] text-xs font-serif text-tone-heading font-medium leading-relaxed">
              &ldquo;{scenario.trapQuestion}&rdquo;
            </div>
          </div>

          <div className="space-y-4">
            {/* Hidden Examiner Intent */}
            <div className="p-3.5 bg-amber-500/10 border-l-3 border-amber-600 rounded-[2px] text-xs">
              <strong className="text-amber-950 block font-semibold mb-0.5">
                Examiner Psychological Intent / Underlying Probe:
              </strong>
              <p className="text-tone-body leading-relaxed">{scenario.examinerHiddenIntent}</p>
            </div>

            {/* Structured Response Framework */}
            <div className="space-y-2">
              <span className="type-micro text-navy block font-semibold">
                Recommended 3-Part Defense Framework:
              </span>
              <div className="space-y-2">
                {scenario.scholarResponseFramework.map((point, i) => (
                  <div key={i} className="p-3 bg-cream/70 border border-tone-rule rounded-[2px] text-xs text-tone-body leading-relaxed">
                    {point}
                  </div>
                ))}
              </div>
            </div>

            {/* Slide Tip */}
            <div className="p-3 bg-paper border border-tone-rule rounded-[2px] flex items-start gap-2.5 text-xs text-tone-muted">
              <Shield className="w-4 h-4 text-navy shrink-0 mt-0.5" />
              <div>
                <strong className="text-tone-heading block">Defense Deck Slide Strategy:</strong>
                <span>{scenario.slidePresentationTip}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

