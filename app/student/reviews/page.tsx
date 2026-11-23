"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useStudent } from "@/components/layout/student-context";
import { RedlineDiffViewer } from "@/components/reviews/redline-diff-viewer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  FileText,
  CheckCircle2,
  Clock,
  Download,
  AlertCircle,
  Eye,
  MessageSquare,
  ShieldCheck,
  Star,
} from "lucide-react";

interface ChapterSubmissionReview {
  id: string;
  chapterTitle: string;
  mentorName: string;
  submittedAt: string;
  status: "approved" | "in_review" | "revision_required";
  similarityIndex: string;
  rubricScore: string;
  feedbackSummary: string;
  actionRequired?: string;
}

const REVIEWS: ChapterSubmissionReview[] = [
  {
    id: "sub-1",
    chapterTitle: "Chapter 3: Methodology and Propensity Score Matching Protocol",
    mentorName: "Dr. Eleanor Vance",
    submittedAt: "Nov 20, 2026",
    status: "in_review",
    similarityIndex: "4% (Turnitin verified)",
    rubricScore: "In Evaluation",
    feedbackSummary: "Currently under review by Dr. Eleanor Vance. Expected completion within 48-hour faculty turnaround window.",
    actionRequired: "Review Stata log sensitivity bounds in preparation for upcoming consultation.",
  },
  {
    id: "sub-2",
    chapterTitle: "Chapter 2: Literature Review and Conceptual Synthesis Matrix",
    mentorName: "Dr. Eleanor Vance",
    submittedAt: "Nov 02, 2026",
    status: "approved",
    similarityIndex: "5% (Turnitin verified)",
    rubricScore: "19 / 20 (Grade: A+)",
    feedbackSummary: "Exemplary thematic structuring. Agency theory synthesis successfully bridges macro and micro econometric paradigms. All minor citations integrated.",
  },
  {
    id: "sub-3",
    chapterTitle: "Chapter 1: Problem Statement and Epidemiological Hypotheses",
    mentorName: "Dr. Eleanor Vance",
    submittedAt: "Oct 15, 2026",
    status: "approved",
    similarityIndex: "3% (Turnitin verified)",
    rubricScore: "18 / 20 (Grade: A)",
    feedbackSummary: "Problem statement is sharp and policy-relevant. Hypotheses 1 through 4 are testable and properly operationalized against national survey data.",
  },
];

export default function StudentReviewsPage() {
  const student = useStudent();
  const { showToast } = useToast();
  const [selectedReview, setSelectedReview] = useState<ChapterSubmissionReview>(REVIEWS[0]);

  const handleDownloadDraft = (title: string) => {
    showToast(`Downloading redlined manuscript for "${title}"`, "info");
  };

  const handleDownloadSimilarity = () => {
    showToast("Downloading Official Turnitin Similarity Report (PDF)...", "success");
  };

  return (
    <DashboardShell role="student" title="Chapter Reviews" user={student}>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-tone-rule pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-medium text-tone-heading">
              Chapter Feedback and Redline Archive
            </h2>
            <p className="text-xs text-tone-muted mt-1">
              Complete audit trail of faculty mentor evaluations, track-changes commentary, and Turnitin similarity certificates.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="accent" href="/student/files" size="sm">
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              Submit Next Chapter Draft
            </Button>
          </div>
        </div>

        {/* 2-Column Review Archive */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Submissions History (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-tone-muted block">
              Manuscript Submission History
            </span>

            {REVIEWS.map((rev) => {
              const isSelected = selectedReview.id === rev.id;
              return (
                <div
                  key={rev.id}
                  onClick={() => setSelectedReview(rev)}
                  className={`p-4 rounded-[2px] border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-white border-gold shadow-xs ring-1 ring-gold/40"
                      : "bg-paper hover:bg-white border-tone-rule"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-stone-400 font-sans text-[11px]">{rev.submittedAt}</span>
                    {rev.status === "in_review" ? (
                      <Badge variant="gold" className="text-[10px]">
                        In Review
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-300 bg-emerald-50">
                        Approved
                      </Badge>
                    )}
                  </div>
                  <p className="font-serif font-bold text-xs text-tone-heading leading-snug mb-1">
                    {rev.chapterTitle}
                  </p>
                  <p className="text-[11px] text-stone-500 font-sans">
                    Mentor: <strong className="text-navy">{rev.mentorName}</strong>
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Review and Rubric (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <Card className="bg-white border-tone-rule">
              <CardHeader className="border-b border-tone-rule pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant={selectedReview.status === "approved" ? "outline" : "gold"}>
                    {selectedReview.status === "approved" ? "Milestone Approved" : "Evaluation In Progress"}
                  </Badge>
                  <span className="text-xs text-stone-500 font-sans">
                    Submitted: {selectedReview.submittedAt}
                  </span>
                </div>
                <CardTitle className="font-serif text-lg text-tone-heading pt-2 leading-snug">
                  {selectedReview.chapterTitle}
                </CardTitle>
                <p className="text-xs text-stone-500 font-sans">
                  Assigned Faculty Reader: <strong className="text-navy">{selectedReview.mentorName}</strong>
                </p>
              </CardHeader>

              <CardContent className="p-5 space-y-5 text-xs font-sans">
                {/* Score and Similarity Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-paper rounded-[2px] border border-tone-rule">
                    <span className="text-stone-500 text-[11px] block">Rubric Assessment</span>
                    <span className="font-serif font-bold text-navy text-base">
                      {selectedReview.rubricScore}
                    </span>
                  </div>
                  <div className="p-3 bg-paper rounded-[2px] border border-tone-rule">
                    <span className="text-stone-500 text-[11px] block">Academic Integrity</span>
                    <span className="font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      {selectedReview.similarityIndex}
                    </span>
                  </div>
                </div>

                {/* Faculty Commentary */}
                <div className="space-y-1.5">
                  <span className="font-semibold uppercase tracking-wider text-tone-heading text-[11px] block">
                    Faculty Commentary and Structural Notes:
                  </span>
                  <div className="p-4 bg-paper rounded-[2px] border border-tone-rule text-stone-700 leading-relaxed text-xs">
                    {selectedReview.feedbackSummary}
                  </div>
                </div>

                {/* Interactive Track Changes / Redline Viewer */}
                <div className="space-y-2">
                  <span className="font-semibold uppercase tracking-wider text-tone-heading text-[11px] block">
                    Interactive Manuscript Redlines and Margin Notes
                  </span>
                  <RedlineDiffViewer
                    candidateName={student.name}
                    chapterTitle={selectedReview.chapterTitle}
                    similarityScore={selectedReview.similarityIndex}
                  />
                </div>

                {/* Action Required if any */}
                {selectedReview.actionRequired && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-[2px] text-amber-900 text-xs">
                    <strong className="block font-semibold mb-0.5">Next Step for Candidate:</strong>
                    {selectedReview.actionRequired}
                  </div>
                )}

                {/* Download Actions */}
                <div className="pt-4 border-t border-tone-rule flex flex-col sm:flex-row items-center justify-end gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadSimilarity}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    Turnitin Certificate (.PDF)
                  </Button>
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={() => handleDownloadDraft(selectedReview.chapterTitle)}
                  >
                    <Download className="w-3.5 h-3.5 mr-1" />
                    Download Annotated Manuscript
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

