"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { BookOpen, AlertCircle, CheckCircle2, ChevronRight, FileText } from "lucide-react";

interface ChapterBlueprint {
  number: string;
  title: string;
  focus: string;
  bottleneck: string;
  mentorIntervention: string;
  deliverable: string;
  targetWords: string;
}

const CHAPTERS: ChapterBlueprint[] = [
  {
    number: "01",
    title: "Introduction & Research Formulation",
    focus: "Problem statement, significance, research questions, conceptual boundaries",
    bottleneck: "Vague problem statement leading supervisors to question the study's scientific justification.",
    mentorIntervention: "We stress-test research questions against doctoral criteria to ensure narrow, falsifiable scope.",
    deliverable: "Defensible Chapter 1 manuscript with aligned aim, objectives, and theoretical delimitations.",
    targetWords: "4,000 – 6,000 words",
  },
  {
    number: "02",
    title: "Critical Literature Review",
    focus: "Theoretical framework, thematic synthesis, methodological critique of past studies",
    bottleneck: "Dumping summaries author-by-author without synthesizing the critical gap in knowledge.",
    mentorIntervention: "We structure thematic synthesis matrices so literature directly justifies your empirical study.",
    deliverable: "Synthesis matrix & coherent thematic chapter structured around your conceptual framework.",
    targetWords: "8,000 – 12,000 words",
  },
  {
    number: "03",
    title: "Research Design & Methodology",
    focus: "Epistemological stance, sampling frame, instrument validity, ethical compliance",
    bottleneck: "Methodological misalignment between research questions, sampling strategy, and statistical tests.",
    mentorIntervention: "Complete audit of validity threats, power calculations, and protocol audit trails.",
    deliverable: "Replicable methodology chapter with validated instruments and ethics board ready protocols.",
    targetWords: "5,000 – 7,500 words",
  },
  {
    number: "04",
    title: "Empirical Analysis & Findings",
    focus: "Descriptive statistics, inferential models, qualitative coding, hypothesis testing",
    bottleneck: "Presenting raw software output without scholarly narrative and diagnostic verification.",
    mentorIntervention: "Publication-grade table formatting (APA 7th/Chicago) with rigorous interpretive prose.",
    deliverable: "Fully formatted empirical findings chapter with annotated syntax and diagnostic tests.",
    targetWords: "7,000 – 10,000 words",
  },
  {
    number: "05",
    title: "Discussion & Conclusions",
    focus: "Contextualization with literature, theoretical contribution, policy implications, limitations",
    bottleneck: "Merely repeating Chapter 4 results without demonstrating theoretical contribution.",
    mentorIntervention: "We coach you on defending broader significance and delineating realistic future research.",
    deliverable: "Comprehensive discussion manuscript bridging findings back to literature and theory.",
    targetWords: "5,000 – 8,000 words",
  },
];

export function ThesisArchitectureVisualizer({ className }: { className?: string }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeChapter = CHAPTERS[selectedIdx];

  return (
    <div className={cn("border border-tone-rule bg-white rounded-[2px] overflow-hidden shadow-xs", className)}>
      {/* Top Banner */}
      <div className="bg-cream/80 border-b border-tone-rule px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-gold shrink-0" />
          <span className="type-micro font-semibold text-tone-heading tracking-wider">
            Thesis Architecture & Supervisory Milestone Navigator
          </span>
        </div>
        <span className="text-[11px] text-tone-muted font-mono">
          Select chapter to inspect supervisory risk & intervention
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-tone-rule">
        {/* Left: Chapter Selector List (5 Cols) */}
        <div className="lg:col-span-5 bg-paper/50 divide-y divide-tone-rule">
          {CHAPTERS.map((ch, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <button
                key={ch.number}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={cn(
                  "w-full text-left p-4 transition-all duration-150 flex items-center justify-between group cursor-pointer",
                  isSelected
                    ? "bg-white border-l-3 border-l-navy text-tone-heading shadow-2xs"
                    : "hover:bg-cream/60 text-tone-muted hover:text-tone-heading"
                )}
              >
                <div className="space-y-0.5 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-gold font-semibold">Ch {ch.number}</span>
                    <span className="text-[10px] uppercase tracking-wider text-tone-muted font-mono">
                      {ch.targetWords}
                    </span>
                  </div>
                  <h4 className="font-serif text-sm font-medium text-tone-heading leading-snug">
                    {ch.title}
                  </h4>
                </div>
                <ChevronRight
                  className={cn(
                    "w-4 h-4 transition-transform shrink-0",
                    isSelected ? "text-navy translate-x-0.5" : "text-tone-muted group-hover:text-tone-heading"
                  )}
                />
              </button>
            );
          })}
        </div>

        {/* Right: Detailed Chapter Inspection (7 Cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 bg-white">
          <div className="border-b border-tone-rule pb-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="type-micro text-gold font-semibold">
                Milestone Blueprint &bull; Chapter {activeChapter.number}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 bg-paper border border-tone-rule rounded-[2px] text-tone-body">
                {activeChapter.targetWords}
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-medium text-tone-heading">
              {activeChapter.title}
            </h3>
            <p className="text-xs text-tone-muted leading-relaxed">
              <strong>Core Focus:</strong> {activeChapter.focus}
            </p>
          </div>

          <div className="space-y-4">
            {/* Common Supervisory Bottleneck */}
            <div className="p-4 bg-amber-500/5 border border-amber-600/20 rounded-[2px] space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Common Supervisory Failure Point</span>
              </div>
              <p className="text-xs text-tone-body leading-relaxed pl-5">
                {activeChapter.bottleneck}
              </p>
            </div>

            {/* Mentor Intervention */}
            <div className="p-4 bg-paper border border-tone-rule rounded-[2px] space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-navy">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>GradEdge Mentor Intervention</span>
              </div>
              <p className="text-xs text-tone-body leading-relaxed pl-5">
                {activeChapter.mentorIntervention}
              </p>
            </div>

            {/* Documented Deliverable */}
            <div className="p-4 bg-cream border border-gold/30 rounded-[2px] space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-tone-heading">
                <FileText className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>Tangible Deliverable You Retain</span>
              </div>
              <p className="text-xs text-tone-body font-medium leading-relaxed pl-5">
                {activeChapter.deliverable}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

