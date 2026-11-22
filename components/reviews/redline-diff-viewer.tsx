"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Columns,
  AlignLeft,
  Check,
  MessageSquare,
  Sparkles,
  Download,
  Eye,
} from "lucide-react";

export interface RedlineParagraph {
  id: string;
  sectionTitle: string;
  originalText: string;
  revisedSegments: {
    type: "unchanged" | "deletion" | "insertion";
    text: string;
  }[];
  mentorComment?: {
    author: string;
    note: string;
    severity: "advisory" | "critical" | "citation";
  };
}

const SAMPLE_PARAGRAPHS: RedlineParagraph[] = [
  {
    id: "p-1",
    sectionTitle: "3.2 Selection of Nearest-Neighbor Caliper Matching Algorithm",
    originalText:
      "To control for confounding variables in our non-randomized observational dataset, we used standard propensity score matching with a 0.2 caliper. This was done to pair treated and untreated women across districts.",
    revisedSegments: [
      {
        type: "unchanged",
        text: "To address confounding bias arising from observational assignment, we specified a ",
      },
      {
        type: "deletion",
        text: "standard propensity score matching with a 0.2 caliper",
      },
      {
        type: "insertion",
        text: "nearest-neighbor matching protocol without replacement, imposing a maximum caliper width of 0.2 standard deviations of the logit of the propensity score (Austin, 2011)",
      },
      {
        type: "unchanged",
        text: ". This restriction ensures common support and mitigates risk of poor matches across disparate rural districts.",
      },
    ],
    mentorComment: {
      author: "Dr. Eleanor Vance",
      note: "defense examiners will question a 0.2 raw score vs 0.2 SD of the logit. Austin (2011) provides empirical justification for the standard deviation specification.",
      severity: "citation",
    },
  },
  {
    id: "p-2",
    sectionTitle: "3.4 Sensitivity Analysis for Unobserved Confounders",
    originalText:
      "Because propensity matching assumes conditional independence, we assumed that there are no unobserved variables affecting both maternal clinic attendance and maternal survival.",
    revisedSegments: [
      {
        type: "unchanged",
        text: "Because propensity score matching relies on the ",
      },
      {
        type: "deletion",
        text: "assumed conditional independence that there are no unobserved variables",
      },
      {
        type: "insertion",
        text: "untestable strongly ignorable treatment assignment assumption (Rosenbaum & Rubin, 1983)",
      },
      {
        type: "unchanged",
        text: ", we subjected our treatment effect estimates to ",
      },
      {
        type: "insertion",
        text: "Rosenbaum bounds sensitivity analysis across gamma thresholds from 1.0 to 2.5",
      },
      {
        type: "unchanged",
        text: " to quantify the magnitude of hidden bias necessary to overturn statistical significance.",
      },
    ],
    mentorComment: {
      author: "Dr. Eleanor Vance",
      note: "Critical methodology addition: Never state you 'assumed no unobserved variables' without computing Rosenbaum sensitivity bounds. This guarantees examiner sign-off.",
      severity: "critical",
    },
  },
];

export function RedlineDiffViewer({
  candidateName = "Freedom Sola",
  chapterTitle = "Chapter 3: Methodology (Propensity Score Matching)",
  similarityScore = "4%",
}: {
  candidateName?: string;
  chapterTitle?: string;
  similarityScore?: string;
}) {
  const [viewMode, setViewMode] = useState<"inline" | "split" | "clean">("inline");
  const [showComments, setShowComments] = useState(true);

  return (
    <div className="bg-white border border-tone-rule rounded-[2px] overflow-hidden">
      {/* Header Controls */}
      <div className="p-4 bg-paper border-b border-tone-rule flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-serif font-bold text-sm text-tone-heading">
              Track Changes &amp; Editorial Redline
            </span>
            <Badge variant="gold" className="text-[9px]">
              Turnitin: {similarityScore}
            </Badge>
          </div>
          <p className="text-[11px] text-stone-500 font-sans">
            Candidate: <strong className="text-navy">{candidateName}</strong> &bull; {chapterTitle}
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <div className="bg-white border border-tone-rule rounded-[2px] p-0.5 flex items-center text-xs">
            <button
              type="button"
              onClick={() => setViewMode("inline")}
              className={`px-2.5 py-1 rounded-[2px] font-medium transition-colors flex items-center gap-1 ${
                viewMode === "inline"
                  ? "bg-navy-deep text-white font-semibold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <AlignLeft className="w-3 h-3" />
              Inline Markup
            </button>
            <button
              type="button"
              onClick={() => setViewMode("split")}
              className={`px-2.5 py-1 rounded-[2px] font-medium transition-colors flex items-center gap-1 ${
                viewMode === "split"
                  ? "bg-navy-deep text-white font-semibold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Columns className="w-3 h-3" />
              Side-by-Side
            </button>
            <button
              type="button"
              onClick={() => setViewMode("clean")}
              className={`px-2.5 py-1 rounded-[2px] font-medium transition-colors flex items-center gap-1 ${
                viewMode === "clean"
                  ? "bg-navy-deep text-white font-semibold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Check className="w-3 h-3 text-emerald-500" />
              Clean Accepted
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className={`px-2 py-1 text-xs border rounded-[2px] transition-colors flex items-center gap-1 ${
              showComments
                ? "bg-amber-50 text-amber-900 border-amber-300 font-medium"
                : "bg-white text-stone-500 border-tone-rule"
            }`}
          >
            <MessageSquare className="w-3 h-3" />
            Notes
          </button>
        </div>
      </div>

      {/* Diff Metrics Bar */}
      <div className="px-4 py-2 bg-stone-50/70 border-b border-tone-rule flex items-center justify-between text-[11px] font-sans text-stone-500">
        <div className="flex items-center gap-3">
          <span className="text-emerald-700 font-semibold">+68 words inserted</span>
          <span className="text-rose-700 font-semibold">-34 words deleted</span>
          <span className="text-stone-400">&bull;</span>
          <span>Net increase: +34 words</span>
        </div>
        <span className="text-stone-400 hidden sm:inline">Austin (2011) &amp; Rosenbaum (1983) applied</span>
      </div>

      {/* Content Rendering Body */}
      <div className="p-5 space-y-6">
        {SAMPLE_PARAGRAPHS.map((para) => (
          <div key={para.id} className="space-y-3 pb-5 border-b border-tone-rule/60 last:border-none last:pb-0">
            <span className="font-serif font-bold text-xs uppercase tracking-wider text-tone-heading block">
              {para.sectionTitle}
            </span>

            {/* Inline Markup View */}
            {viewMode === "inline" && (
              <div className="p-4 bg-paper rounded-[2px] border border-tone-rule text-xs font-serif leading-relaxed text-stone-800">
                {para.revisedSegments.map((seg, idx) => {
                  if (seg.type === "deletion") {
                    return (
                      <span
                        key={idx}
                        className="bg-rose-100/80 text-rose-800 line-through decoration-rose-600 px-1 mx-0.5 rounded-xs"
                      >
                        {seg.text}
                      </span>
                    );
                  }
                  if (seg.type === "insertion") {
                    return (
                      <span
                        key={idx}
                        className="bg-emerald-100/80 text-emerald-900 underline decoration-emerald-600 decoration-1 px-1 mx-0.5 rounded-xs font-medium"
                      >
                        {seg.text}
                      </span>
                    );
                  }
                  return <span key={idx}>{seg.text}</span>;
                })}
              </div>
            )}

            {/* Side-by-Side Split View */}
            {viewMode === "split" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-serif leading-relaxed">
                <div className="p-3.5 bg-paper rounded-[2px] border border-tone-rule">
                  <span className="font-sans font-semibold text-[10px] uppercase text-stone-400 block mb-1">
                    Candidate Draft
                  </span>
                  <p className="text-stone-700">{para.originalText}</p>
                </div>
                <div className="p-3.5 bg-emerald-50/40 rounded-[2px] border border-emerald-200">
                  <span className="font-sans font-semibold text-[10px] uppercase text-emerald-700 block mb-1">
                    Faculty Revised Redline
                  </span>
                  <p className="text-emerald-950 font-medium">
                    {para.revisedSegments
                      .filter((s) => s.type !== "deletion")
                      .map((s) => s.text)
                      .join("")}
                  </p>
                </div>
              </div>
            )}

            {/* Clean Accepted View */}
            {viewMode === "clean" && (
              <div className="p-4 bg-white rounded-[2px] border border-emerald-300 text-xs font-serif leading-relaxed text-stone-900">
                <p>
                  {para.revisedSegments
                    .filter((s) => s.type !== "deletion")
                    .map((s) => s.text)
                    .join("")}
                </p>
              </div>
            )}

            {/* Margin Faculty Note */}
            {showComments && para.mentorComment && (
              <div className="ml-2 sm:ml-4 p-3 bg-amber-50/80 border-l-2 border-l-amber-500 rounded-r-[2px] border-t border-b border-r border-amber-200 text-xs font-sans">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-semibold text-amber-950 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                    {para.mentorComment.author} (Faculty Commentary)
                  </span>
                  <Badge variant="outline" className="text-[9px] bg-white border-amber-300 text-amber-800">
                    {para.mentorComment.severity.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-amber-900 text-[11px] leading-relaxed">
                  {para.mentorComment.note}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

