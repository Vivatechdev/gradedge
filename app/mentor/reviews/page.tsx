"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { RedlineDiffViewer } from "@/components/reviews/redline-diff-viewer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  Eye,
  MessageSquare,
  ShieldCheck,
  Send,
  Star,
  ExternalLink,
} from "lucide-react";

interface ManuscriptReviewItem {
  id: string;
  candidateName: string;
  institution: string;
  title: string;
  chapter: string;
  wordCount: number;
  similarityScore: string;
  submittedAt: string;
  deadlineHoursRemaining: number;
  status: "pending_review" | "in_progress" | "approved" | "revision_requested";
  summary: string;
}

const REVIEW_QUEUE: ManuscriptReviewItem[] = [
  {
    id: "rev-201",
    candidateName: "Freedom Sola",
    institution: "Cambridge Institute of Public Health",
    title: "Epidemiological Analysis of Maternal Health Access in Rural Districts",
    chapter: "Chapter 3: Methodology and Propensity Score Matching Protocol",
    wordCount: 14320,
    similarityScore: "4% (Turnitin verified)",
    submittedAt: "Nov 20, 2026 &bull; 11:30 UTC",
    deadlineHoursRemaining: 28,
    status: "in_progress",
    summary:
      "Draft includes covariate balance tables and nearest-neighbor caliper matching algorithms. Requires faculty review on sensitivity analysis for unobserved confounders (Rosenbaum bounds).",
  },
  {
    id: "rev-202",
    candidateName: "Khadija Umar",
    institution: "Alliance Manchester Business School",
    title: "Corporate Governance and Financial Restatement Frequencies in Emerging Markets",
    chapter: "Chapter 2: Literature Review Synthesis Matrix",
    wordCount: 18450,
    similarityScore: "5% (Turnitin verified)",
    submittedAt: "Nov 21, 2026 &bull; 08:15 UTC",
    deadlineHoursRemaining: 44,
    status: "pending_review",
    summary:
      "Comprehensive synthesis of agency theory vs stewardship models. Seeks confirmation on synthesis matrix taxonomy and thematic structuring before supervisor committee presentation.",
  },
];

export default function MentorReviewsPage() {
  const { showToast } = useToast();
  const [selectedReview, setSelectedReview] = useState<ManuscriptReviewItem>(REVIEW_QUEUE[0]);
  const [rubricScores, setRubricScores] = useState({
    rigor: 4,
    theory: 5,
    citations: 5,
    reproducibility: 4,
  });
  const [feedbackNote, setFeedbackNote] = useState(
    "Overall methodological framing is robust. However, in Section 3.4 please ensure Rosenbaum sensitivity bounds are explicitly tabulated to address potential hidden bias in observational matching."
  );

  const handleApprove = () => {
    showToast(
      `Chapter milestone approved for ${selectedReview.candidateName}. Milestone sign-off dispatched to candidate and supervisor portal.`,
      "success"
    );
  };

  const handleRequestRevision = () => {
    showToast(
      `Annotated feedback and revision notes delivered to ${selectedReview.candidateName}. SLA timer paused.`,
      "info"
    );
  };

  return (
    <DashboardShell
      role="mentor"
      title="Manuscript Reviews"
      user={{
        id: "mentor-101",
        name: "Dr. Eleanor Vance",
        email: "e.vance@gradedge.org",
        institution: "Senior Faculty Mentor",
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-tone-rule pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-medium text-tone-heading">
              Manuscript Review and Redlining Desk
            </h2>
            <p className="text-xs text-tone-muted mt-1">
              Guaranteed 48-hour faculty turnaround on doctoral chapter submissions and methodology redlines.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-[2px] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              2 Pending Submissions
            </span>
          </div>
        </div>

        {/* 2-Column Review Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Submissions Queue (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-tone-muted block">
              Current Submission Queue
            </span>

            {REVIEW_QUEUE.map((item) => {
              const isSelected = selectedReview.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedReview(item)}
                  className={`p-4 rounded-[2px] border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-white border-gold shadow-xs ring-1 ring-gold/40"
                      : "bg-paper hover:bg-white border-tone-rule"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-serif font-bold text-tone-heading">{item.candidateName}</span>
                    <Badge variant={item.deadlineHoursRemaining < 30 ? "gold" : "outline"} className="text-[10px]">
                      {item.deadlineHoursRemaining}h remaining (SLA)
                    </Badge>
                  </div>
                  <p className="text-xs font-medium text-navy truncate block mb-1">
                    {item.chapter}
                  </p>
                  <p className="text-[11px] text-stone-500 font-sans line-clamp-2">
                    {item.summary}
                  </p>
                  <div className="mt-3 pt-2 border-t border-tone-rule/60 flex items-center justify-between text-[11px] text-stone-500">
                    <span>{item.wordCount.toLocaleString()} words</span>
                    <span className="text-emerald-700 font-medium">{item.similarityScore}</span>
                  </div>
                </div>
              );
            })}

            {/* Turnaround Standards Card */}
            <Card className="bg-paper border-tone-rule mt-4">
              <CardContent className="p-4 space-y-2 text-xs font-sans">
                <span className="font-serif font-semibold text-tone-heading block">
                  Faculty Review Standards
                </span>
                <p className="text-stone-600 leading-relaxed text-[11px]">
                  All feedback must adhere to the GradEdge Non-Ghostwriting Policy: offer substantive structural critique, methodological correction, and citation guidance without drafting direct candidate prose.
                </p>
                <div className="pt-2">
                  <a
                    href="/mentor/integrity"
                    className="inline-flex items-center gap-1 text-[11px] text-gold font-medium hover:underline"
                  >
                    View Academic Integrity Protocol &rarr;
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Active Review Workbench (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <Card className="bg-white border-tone-rule">
              <CardHeader className="border-b border-tone-rule/80 pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px]">
                    Active Workspace
                  </Badge>
                  <span className="text-xs text-stone-500 font-sans">
                    Submitted: <span className="text-stone-700">{selectedReview.submittedAt}</span>
                  </span>
                </div>
                <CardTitle className="font-serif text-lg text-tone-heading pt-2">
                  {selectedReview.chapter}
                </CardTitle>
                <p className="text-xs text-stone-500 font-sans">
                  Candidate: <strong className="text-navy">{selectedReview.candidateName}</strong> ({selectedReview.institution})
                </p>
              </CardHeader>

              <CardContent className="p-5 space-y-6">
                {/* Manuscript Download and Inspect Actions */}
                <div className="p-3.5 bg-paper rounded-[2px] border border-tone-rule flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-tone-heading block flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-gold" />
                      Original Submission Draft (.docx &bull; 14.3 MB)
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Clean format &bull; Embedded Stata .do log appended
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => showToast("Simulating manuscript draft download...", "info")}
                  >
                    <Download className="w-3.5 h-3.5 mr-1" />
                    Download Draft
                  </Button>
                </div>

                {/* Interactive Redline and Track Changes Workbench */}
                <div className="space-y-2">
                  <RedlineDiffViewer
                    candidateName={selectedReview.candidateName}
                    chapterTitle={selectedReview.chapter}
                    similarityScore={selectedReview.similarityScore}
                  />
                </div>

                {/* Rubric Assessment Scoring */}
                <div className="space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-tone-heading block">
                    Doctoral Rubric Assessment
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                    {[
                      { key: "rigor", label: "Methodological Rigor" },
                      { key: "theory", label: "Theoretical Grounding" },
                      { key: "citations", label: "Citation and Reference Hygiene" },
                      { key: "reproducibility", label: "Empirical Reproducibility" },
                    ].map((item) => (
                      <div key={item.key} className="p-2.5 bg-paper rounded-[2px] border border-tone-rule">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-stone-700 font-medium">{item.label}</span>
                          <span className="text-gold font-bold">
                            {rubricScores[item.key as keyof typeof rubricScores]}/5
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={rubricScores[item.key as keyof typeof rubricScores]}
                          onChange={(e) =>
                            setRubricScores({
                              ...rubricScores,
                              [item.key]: parseInt(e.target.value, 10),
                            })
                          }
                          className="w-full accent-gold h-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Editorial Feedback and Redline Notes */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-tone-heading block">
                    Faculty Redlining Notes and Required Revisions
                  </label>
                  <textarea
                    rows={4}
                    value={feedbackNote}
                    onChange={(e) => setFeedbackNote(e.target.value)}
                    className="w-full p-3 text-xs font-sans bg-paper border border-stone-200 rounded-[2px] focus:outline-hidden focus:border-gold leading-relaxed"
                  />
                  <span className="text-[11px] text-stone-400 block">
                    Notes will be published directly to candidate&apos;s Review Archive and emailed as formal faculty commentary.
                  </span>
                </div>

                {/* Submit Actions */}
                <div className="pt-4 border-t border-tone-rule flex flex-col sm:flex-row items-center justify-end gap-3">
                  <Button variant="outline" size="sm" onClick={handleRequestRevision}>
                    <AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-600" />
                    Request Revisions
                  </Button>
                  <Button variant="accent" size="sm" onClick={handleApprove}>
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Approve Milestone Sign-off
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

