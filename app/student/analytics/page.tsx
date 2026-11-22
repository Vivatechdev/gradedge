"use client";

import React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useStudent } from "@/components/layout/student-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Target,
} from "lucide-react";

interface ChapterBurndown {
  id: string;
  name: string;
  targetWords: number;
  currentWords: number;
  status: "completed" | "in_review" | "drafting" | "planned";
  similarityScore?: string;
  completionDate?: string;
}

const CHAPTERS: ChapterBurndown[] = [
  {
    id: "ch-1",
    name: "Chapter 1: Problem Statement & Epidemiological Hypotheses",
    targetWords: 10000,
    currentWords: 10250,
    status: "completed",
    similarityScore: "3%",
    completionDate: "Oct 28, 2026",
  },
  {
    id: "ch-2",
    name: "Chapter 2: Literature Review & Conceptual Synthesis",
    targetWords: 18000,
    currentWords: 18450,
    status: "completed",
    similarityScore: "5%",
    completionDate: "Nov 02, 2026",
  },
  {
    id: "ch-3",
    name: "Chapter 3: Methodology & Propensity Score Protocol",
    targetWords: 15000,
    currentWords: 14320,
    status: "in_review",
    similarityScore: "4%",
  },
  {
    id: "ch-4",
    name: "Chapter 4: Empirical Results & Covariate Balance Analysis",
    targetWords: 22000,
    currentWords: 11180,
    status: "drafting",
  },
  {
    id: "ch-5",
    name: "Chapter 5: Discussion, Limitations & Policy Implications",
    targetWords: 15000,
    currentWords: 0,
    status: "planned",
  },
];

export default function StudentAnalyticsPage() {
  const student = useStudent();

  const totalTargetWords = CHAPTERS.reduce((sum, c) => sum + c.targetWords, 0);
  const totalWrittenWords = CHAPTERS.reduce((sum, c) => sum + c.currentWords, 0);
  const overallPercentage = Math.round((totalWrittenWords / totalTargetWords) * 100);

  return (
    <DashboardShell role="student" title="Writing Velocity & Burndown" user={student}>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-tone-rule pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-medium text-tone-heading">
              Dissertation Burndown &amp; Writing Velocity
            </h2>
            <p className="text-xs text-tone-muted mt-1">
              Live word count metrics, milestone trajectory, and estimated oral defense timeline.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" href="/student/reviews" size="sm">
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              Chapter Reviews
            </Button>
            <Button variant="accent" href="/student/files" size="sm">
              Upload New Chapter Draft
            </Button>
          </div>
        </div>

        {/* 3 Top Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-white border-tone-rule">
            <CardHeader className="pb-1">
              <span className="type-micro uppercase text-tone-muted tracking-wider">
                Total Manuscript Words
              </span>
              <div className="flex items-center justify-between pt-1">
                <span className="font-serif text-3xl font-bold text-tone-heading">
                  {totalWrittenWords.toLocaleString()}
                </span>
                <Target className="w-5 h-5 text-gold" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden my-2">
                <div
                  className="bg-gold h-1.5 rounded-full"
                  style={{ width: `${overallPercentage}%` }}
                />
              </div>
              <span className="text-[11px] text-stone-500 font-sans">
                {overallPercentage}% of {totalTargetWords.toLocaleString()} target words completed
              </span>
            </CardContent>
          </Card>

          <Card className="bg-white border-tone-rule">
            <CardHeader className="pb-1">
              <span className="type-micro uppercase text-tone-muted tracking-wider">
                Writing Velocity (4-Wk Avg)
              </span>
              <div className="flex items-center justify-between pt-1">
                <span className="font-serif text-3xl font-bold text-emerald-700">
                  1,420
                </span>
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <span className="text-[11px] text-stone-500 font-sans block mt-2">
                Words per week (+18% above target velocity of 1,200 w/wk)
              </span>
            </CardContent>
          </Card>

          <Card className="bg-white border-tone-rule">
            <CardHeader className="pb-1">
              <span className="type-micro uppercase text-tone-muted tracking-wider">
                Projected Defense Submission
              </span>
              <div className="flex items-center justify-between pt-1">
                <span className="font-serif text-2xl font-bold text-navy">
                  May 15, 2027
                </span>
                <Calendar className="w-5 h-5 text-navy" />
              </div>
            </CardHeader>
            <CardContent>
              <span className="text-[11px] text-emerald-700 font-sans block mt-2 font-medium">
                Pacing 18 days ahead of university registry deadline
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Chapter-by-Chapter Burndown Breakdown */}
        <Card className="bg-white border-tone-rule">
          <CardHeader className="border-b border-tone-rule pb-4">
            <CardTitle className="font-serif text-lg text-tone-heading">
              Chapter Milestone Progression
            </CardTitle>
            <p className="text-xs text-stone-500 font-sans">
              Track word count targets, mentor sign-offs, and Turnitin similarity indices per chapter.
            </p>
          </CardHeader>

          <CardContent className="p-5 space-y-6">
            {CHAPTERS.map((ch) => {
              const chPercentage = Math.min(
                100,
                Math.round((ch.currentWords / ch.targetWords) * 100)
              );
              return (
                <div key={ch.id} className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-tone-heading text-sm">
                        {ch.name}
                      </span>
                      {ch.status === "completed" && (
                        <Badge variant="outline" className="text-[9px] text-emerald-700 border-emerald-300 bg-emerald-50">
                          Faculty Approved
                        </Badge>
                      )}
                      {ch.status === "in_review" && (
                        <Badge variant="gold" className="text-[9px]">
                          In Review (Dr. Vance)
                        </Badge>
                      )}
                      {ch.status === "drafting" && (
                        <Badge variant="default" className="text-[9px]">
                          Active Drafting
                        </Badge>
                      )}
                      {ch.status === "planned" && (
                        <span className="text-[10px] text-stone-400">Planned</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-stone-500 font-sans">
                      {ch.similarityScore && (
                        <span className="text-emerald-700 font-medium">
                          Similarity: {ch.similarityScore}
                        </span>
                      )}
                      <span className="font-medium text-stone-800">
                        {ch.currentWords.toLocaleString()} / {ch.targetWords.toLocaleString()} words ({chPercentage}%)
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        ch.status === "completed"
                          ? "bg-emerald-600"
                          : ch.status === "in_review"
                          ? "bg-gold"
                          : ch.status === "drafting"
                          ? "bg-navy"
                          : "bg-stone-300"
                      }`}
                      style={{ width: `${chPercentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

