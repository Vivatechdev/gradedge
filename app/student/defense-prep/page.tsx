"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useStudent } from "@/components/layout/student-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  Award,
  CheckCircle2,
  HelpCircle,
  Play,
  Volume2,
  Calendar,
  FileText,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  BookOpen,
} from "lucide-react";

interface VivaQuestion {
  id: string;
  category: "methodology" | "theory" | "contribution" | "limitations";
  categoryLabel: string;
  question: string;
  examinerFocus: string;
  recommendedStructure: string;
}

const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    id: "vq-1",
    category: "methodology",
    categoryLabel: "Methodological Justification",
    question: "Why did you select Propensity Score Matching over Instrumental Variables or Regression Discontinuity for addressing confounding in your empirical model?",
    examinerFocus: "Testing whether you understand the fundamental identification assumptions of conditional independence vs exclusion restrictions.",
    recommendedStructure: "1. State the observable covariate richness in your dataset. 2. Acknowledge unobserved confounding risk. 3. Justify why a valid instrument was unavailable or weak.",
  },
  {
    id: "vq-2",
    category: "contribution",
    categoryLabel: "Contribution to Knowledge",
    question: "In two minutes, can you state the singular original contribution this dissertation makes to the existing literature?",
    examinerFocus: "Evaluating conciseness, academic confidence, and ability to separate secondary findings from the primary conceptual breakthrough.",
    recommendedStructure: "1. The established consensus in existing literature. 2. The critical empirical blindspot identified. 3. Your specific novel finding and its theoretical implication.",
  },
  {
    id: "vq-3",
    category: "theory",
    categoryLabel: "Theoretical Framework",
    question: "How do your empirical findings challenge or extend the foundational theoretical model you adopted in Chapter 2?",
    examinerFocus: "Assessing whether your empirical analysis actually talks back to theory, rather than treating theory as decorative background reading.",
    recommendedStructure: "1. Remind the committee of the core theoretical mechanism. 2. Highlight where empirical coefficients diverge. 3. Propose the nuanced theoretical refinement.",
  },
  {
    id: "vq-4",
    category: "limitations",
    categoryLabel: "Limitations & Delimitations",
    question: "If you had an additional year and unlimited funding, what critical limitation in this study would you address first?",
    examinerFocus: "Evaluating academic honesty and mature critical self-appraisal without invalidating the integrity of your findings.",
    recommendedStructure: "1. Identify one structural constraint (e.g., longitudinal attrition). 2. Explain how a prospective design would fortify the findings. 3. Re-affirm why the current results remain internally valid.",
  },
];

export default function StudentDefensePrepPage() {
  const student = useStudent();
  const { showToast } = useToast();
  const [selectedQuestion, setSelectedQuestion] = useState<VivaQuestion>(VIVA_QUESTIONS[0]);
  const [candidateNotes, setCandidateNotes] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredQuestions = VIVA_QUESTIONS.filter(
    (q) => activeTab === "all" || q.category === activeTab
  );

  const handleSaveNotes = () => {
    showToast("Defense talking points and rehearsal notes saved.", "success");
  };

  return (
    <DashboardShell role="student" title="Viva Defense Prep" user={student}>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-tone-rule pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-medium text-tone-heading">
              Viva Voce &amp; Oral Defense Simulator
            </h2>
            <p className="text-xs text-tone-muted mt-1">
              Prepare for rigorous doctoral examination with real examiner questions, structure rubrics, and mock committee interrogations.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="accent" href="/student/sessions" size="sm">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              Book Mock Viva with Mentor
            </Button>
          </div>
        </div>

        {/* Readiness Metric Banner */}
        <div className="p-5 bg-navy-deep text-white rounded-[2px] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="gold" className="text-[10px]">
                Oral Readiness Score
              </Badge>
              <span className="text-xs text-white/70">Based on methodology defense &amp; slide audits</span>
            </div>
            <h3 className="font-serif text-2xl text-white font-medium">
              84% &mdash; High Committee Readiness
            </h3>
            <p className="text-xs text-white/70 max-w-xl">
              Strong methodological defense formulated for Chapter 3. Recommended focus: Rehearse addressing limitations in observational sampling.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase text-white/50 block">Target Defense Date</span>
              <span className="font-serif font-bold text-lg text-gold">May 2027</span>
            </div>
          </div>
        </div>

        {/* 2-Column Interrogation Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Question List (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-tone-muted">
                Examiner Question Bank
              </span>
              <span className="text-[11px] text-stone-500 font-sans">4 Core Modules</span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {["all", "methodology", "theory", "contribution", "limitations"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveTab(cat)}
                  className={`text-[11px] px-2.5 py-1 rounded-[2px] capitalize transition-colors font-medium ${
                    activeTab === cat
                      ? "bg-navy-deep text-white font-semibold"
                      : "bg-paper text-stone-600 border border-tone-rule hover:bg-stone-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Questions List */}
            <div className="space-y-2.5">
              {filteredQuestions.map((q) => {
                const isSelected = selectedQuestion.id === q.id;
                return (
                  <div
                    key={q.id}
                    onClick={() => setSelectedQuestion(q)}
                    className={`p-3.5 rounded-[2px] border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-white border-gold shadow-xs ring-1 ring-gold/40"
                        : "bg-paper hover:bg-white border-tone-rule"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-stone-400 mb-1">
                      <span className="font-semibold uppercase tracking-wide text-navy">
                        {q.categoryLabel}
                      </span>
                      <span>Q-{q.id.toUpperCase()}</span>
                    </div>
                    <p className="font-serif text-xs font-semibold text-tone-heading leading-snug line-clamp-2">
                      {q.question}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Slide Deck Audit Card */}
            <Card className="bg-paper border-tone-rule">
              <CardContent className="p-4 space-y-2 text-xs font-sans">
                <span className="font-serif font-semibold text-tone-heading block">
                  15-Slide Viva Presentation Standard
                </span>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  Doctoral viva presentations should not exceed 20 minutes (1 slide per 75 seconds). Avoid text-dense bullet lists; prioritize causal diagrams and regression coefficient charts.
                </p>
                <div className="pt-1">
                  <a
                    href="/student/resources"
                    className="inline-flex items-center gap-1 text-[11px] text-gold font-medium hover:underline"
                  >
                    Download Slide Template (.pptx / Keynote) &rarr;
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Practice & Rubric Workspace (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <Card className="bg-white border-tone-rule">
              <CardHeader className="border-b border-tone-rule pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="gold" className="text-[10px]">
                    {selectedQuestion.categoryLabel}
                  </Badge>
                  <span className="text-xs text-stone-400 font-sans">Interactive Rehearsal</span>
                </div>
                <CardTitle className="font-serif text-lg text-tone-heading pt-2 leading-snug">
                  &ldquo;{selectedQuestion.question}&rdquo;
                </CardTitle>
              </CardHeader>

              <CardContent className="p-5 space-y-5 text-xs font-sans">
                {/* Examiner Psychology & Focus */}
                <div className="p-3.5 bg-paper rounded-[2px] border border-tone-rule space-y-1">
                  <span className="font-semibold text-navy block text-xs">
                    Examiner Intent &amp; Trap to Avoid:
                  </span>
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    {selectedQuestion.examinerFocus}
                  </p>
                </div>

                {/* Recommended Response Structure */}
                <div className="space-y-1.5">
                  <span className="font-semibold uppercase tracking-wider text-tone-heading text-[11px] block">
                    Ideal Response Framework:
                  </span>
                  <div className="p-3 bg-stone-50 rounded-[2px] border border-stone-200 text-stone-700 text-[11px] leading-relaxed">
                    {selectedQuestion.recommendedStructure}
                  </div>
                </div>

                {/* Candidate Notes & Rehearsal Draft */}
                <div className="space-y-2">
                  <label className="font-semibold uppercase tracking-wider text-tone-heading text-[11px] block">
                    Your Defense Formulation &amp; Key References:
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Type your structured 2-minute answer bullets, empirical statistics, and key authors to cite..."
                    value={candidateNotes}
                    onChange={(e) => setCandidateNotes(e.target.value)}
                    className="w-full p-3 text-xs font-sans bg-paper border border-stone-200 rounded-[2px] focus:outline-hidden focus:border-gold leading-relaxed"
                  />
                  <div className="flex items-center justify-between text-[11px] text-stone-400">
                    <span>Target spoken duration: 90 - 120 seconds</span>
                    <Button variant="accent" size="sm" onClick={handleSaveNotes}>
                      Save Rehearsal Notes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

