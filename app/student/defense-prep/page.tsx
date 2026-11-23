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
  Printer,
  Download,
  X,
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
    categoryLabel: "Limitations and Delimitations",
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
  const [printModalOpen, setPrintModalOpen] = useState(false);

  const filteredQuestions = VIVA_QUESTIONS.filter(
    (q) => activeTab === "all" || q.category === activeTab
  );

  const handleSaveNotes = () => {
    showToast("Defense talking points and rehearsal notes saved.", "success");
  };

  const handleTriggerPrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <DashboardShell role="student" title="Oral Defense Prep" user={student}>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-tone-rule pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-medium text-tone-heading">
              Oral Defense and Examination Simulator
            </h2>
            <p className="text-xs text-tone-muted mt-1">
              Prepare for rigorous doctoral examination with real examiner questions, structure rubrics, and mock committee interrogations.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPrintModalOpen(true)}
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Defense Study Guide (Print/PDF)
            </Button>
            <Button variant="accent" href="/student/sessions" size="sm">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              Book mock defense with Mentor
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
              <span className="text-xs text-white/70">Based on methodology defense and slide audits</span>
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
                  15-Slide defense Presentation Standard
                </span>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  Doctoral defense presentations should not exceed 20 minutes (1 slide per 75 seconds). Avoid text-dense bullet lists; prioritize causal diagrams and regression coefficient charts.
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

          {/* Practice and Rubric Workspace (7 cols) */}
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
                {/* Examiner Psychology and Focus */}
                <div className="p-3.5 bg-paper rounded-[2px] border border-tone-rule space-y-1">
                  <span className="font-semibold text-navy block text-xs">
                    Examiner Intent and Trap to Avoid:
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

                {/* Candidate Notes and Rehearsal Draft */}
                <div className="space-y-2">
                  <label className="font-semibold uppercase tracking-wider text-tone-heading text-[11px] block">
                    Your Defense Formulation and Key References:
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

        {/* Printable Defense Study Guide Modal */}
        {printModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white max-w-3xl w-full rounded-[2px] border border-tone-rule shadow-2xl overflow-hidden my-8">
              {/* Modal Action Bar (Hidden when printed) */}
              <div className="print:hidden p-4 bg-navy-deep text-white flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-gold" />
                  <span className="font-serif font-bold text-sm">
                    Doctoral Oral Defense Dossier
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={handleTriggerPrint}
                  >
                    <Printer className="w-3.5 h-3.5 mr-1.5" />
                    Print / Save as PDF
                  </Button>
                  <button
                    type="button"
                    onClick={() => setPrintModalOpen(false)}
                    className="p-1.5 text-white/70 hover:text-white rounded-[2px]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Printable Body */}
              <div className="p-8 space-y-6 text-stone-900 font-sans print:p-0">
                {/* Academic Header */}
                <div className="border-b-2 border-tone-heading pb-4 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gold block">
                      GradEdge Doctoral Advisory Services &bull; Oral Defense Preparation
                    </span>
                    <h1 className="font-serif text-2xl font-bold text-tone-heading mt-1">
                      Oral Examination Question Bank and Defense Notes
                    </h1>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Candidate: <strong>{student.name}</strong> &bull; {student.institution}
                    </p>
                  </div>
                  <div className="text-right text-xs">
                    <span className="text-stone-400 block text-[10px] uppercase">Generated Date</span>
                    <strong className="text-stone-800">November 2026</strong>
                  </div>
                </div>

                {/* Question Items in Document */}
                <div className="space-y-6">
                  {VIVA_QUESTIONS.map((q, idx) => (
                    <div key={q.id} className="space-y-2 border-b border-stone-200 pb-5 last:border-none">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-navy">
                          Section {idx + 1}: {q.categoryLabel}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">Q-REF: {q.id.toUpperCase()}</span>
                      </div>
                      <p className="font-serif font-bold text-base text-stone-900 leading-snug">
                        &ldquo;{q.question}&rdquo;
                      </p>

                      <div className="bg-stone-50 p-3 rounded-[2px] border border-stone-200 space-y-1.5 text-xs">
                        <div>
                          <strong className="text-navy text-[11px] block">Examiner Intent:</strong>
                          <p className="text-stone-600 text-[11px]">{q.examinerFocus}</p>
                        </div>
                        <div>
                          <strong className="text-stone-800 text-[11px] block">Recommended 2-Minute Defense Structure:</strong>
                          <p className="text-stone-600 text-[11px]">{q.recommendedStructure}</p>
                        </div>
                      </div>

                      {selectedQuestion.id === q.id && candidateNotes && (
                        <div className="p-3 bg-paper rounded-[2px] border border-gold/40 text-xs">
                          <strong className="text-gold font-semibold text-[11px] block">Your Rehearsal Notes:</strong>
                          <p className="text-stone-800 mt-1 whitespace-pre-wrap">{candidateNotes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer Disclaimers */}
                <div className="pt-4 border-t border-stone-200 text-[10px] text-stone-400 flex justify-between items-center">
                  <span>Confidential Doctoral Study Asset &bull; GradEdge Academic Coaching</span>
                  <span>Page 1 of 1</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

