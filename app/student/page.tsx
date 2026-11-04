"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarCheck,
  FileText,
  Clock,
  Download,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileCode,
  BookOpen,
} from "lucide-react";

interface Milestone {
  id: string;
  chapter: string;
  title: string;
  status: "completed" | "in_review" | "pending";
  progress: number;
  wordCount: string;
  lastUpdated: string;
  deliverablesCount: number;
}

const MILESTONES: Milestone[] = [
  {
    id: "ch1",
    chapter: "Chapter 1",
    title: "Introduction & Research Framing",
    status: "completed",
    progress: 100,
    wordCount: "6,200 words",
    lastUpdated: "Sep 12, 2026",
    deliverablesCount: 3,
  },
  {
    id: "ch2",
    chapter: "Chapter 2",
    title: "Systematic Literature Review",
    status: "completed",
    progress: 100,
    wordCount: "11,800 words",
    lastUpdated: "Oct 04, 2026",
    deliverablesCount: 4,
  },
  {
    id: "ch3",
    chapter: "Chapter 3",
    title: "Methodological Design & Syntax Audit",
    status: "in_review",
    progress: 68,
    wordCount: "8,400 words",
    lastUpdated: "Yesterday at 16:30",
    deliverablesCount: 2,
  },
  {
    id: "ch4",
    chapter: "Chapter 4",
    title: "Empirical Results & Model Diagnostics",
    status: "pending",
    progress: 0,
    wordCount: "Target: 9,000 words",
    lastUpdated: "Awaiting Ch 3 Clearance",
    deliverablesCount: 0,
  },
  {
    id: "ch5",
    chapter: "Chapter 5",
    title: "Discussion, Policy Implications & Viva",
    status: "pending",
    progress: 0,
    wordCount: "Target: 7,500 words",
    lastUpdated: "Scheduled Dec 2026",
    deliverablesCount: 0,
  },
];

const RECENT_DELIVERABLES = [
  {
    id: "del-1",
    title: "Chapter 3 Methodology Audit & Line-Level Annotations",
    type: "Annotated Manuscript",
    filename: "Ch3_Methodology_Annotated_Review_v2.pdf",
    size: "1.4 MB",
    date: "Oct 29, 2026",
    icon: FileText,
  },
  {
    id: "del-2",
    title: "Reproducible SEM & Fit Index Syntax (R lavaan)",
    type: "Syntax Codebase",
    filename: "SEM_Fit_Indices_lavaan_ModelAudit.R",
    size: "48 KB",
    date: "Oct 28, 2026",
    icon: FileCode,
  },
  {
    id: "del-3",
    title: "Supervisory Risk Memo & Response Matrix",
    type: "Strategic Brief",
    filename: "Supervisory_Response_Matrix_Memo.pdf",
    size: "620 KB",
    date: "Oct 24, 2026",
    icon: BookOpen,
  },
];

export default function StudentDashboardPage() {
  const [activeTab, setActiveTab] = useState<"milestones" | "deliverables" | "consultations">("milestones");

  return (
    <DashboardShell
      role="student"
      title="Student Research Portal"
      user={{
        name: "Freedom Sola",
        email: "freedom.sola@university.edu",
        institution: "PhD Candidate in Public Health",
      }}
    >
      <div className="space-y-8 ui-interface max-w-6xl">
        {/* ── 1. WELCOME BANNER & STAGE CONTEXT ─────────────────────────────── */}
        <div className="border-b border-tone-rule pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="type-micro text-gold">Doctoral Candidate Portal</span>
              <span className="text-tone-rule">&bull;</span>
              <span className="text-xs text-tone-muted font-mono">ID: GRD-2026-8842</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-tone-heading font-medium">
              Welcome back, Freedom
            </h2>
            <p className="text-xs sm:text-sm text-tone-muted mt-1 max-w-xl leading-relaxed">
              Active project: <strong className="text-tone-heading">Epidemiological Analysis of Maternal Health Access in Rural Districts</strong>. Your methodology audit is currently under line-level review.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button href="/student/book-session" variant="secondary" size="sm">
              Book Paid Session
            </Button>
            <Button href="/student/support-request" variant="accent" size="sm">
              Submit Support Request
            </Button>
          </div>
        </div>

        {/* ── 2. EXECUTIVE METRICS & STATUS CARDS ───────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active Milestone */}
          <Card background="white" className="border-tone-rule shadow-xs hover:border-gold/60 transition-colors">
            <CardHeader className="pb-2">
              <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-tone-muted">
                Active Milestone
              </span>
              <CardTitle className="text-xl font-serif text-tone-heading flex items-baseline justify-between">
                <span>Chapter 3</span>
                <span className="text-xs font-mono font-normal text-gold">68%</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-cream h-1.5 rounded-full overflow-hidden mb-2 border border-tone-rule/60">
                <div className="bg-gold h-full rounded-full" style={{ width: "68%" }} />
              </div>
              <p className="text-[11px] text-tone-muted">Methodology & sample size audit</p>
            </CardContent>
          </Card>

          {/* Next Consultation */}
          <Card background="white" className="border-tone-rule shadow-xs hover:border-gold/60 transition-colors">
            <CardHeader className="pb-2">
              <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-tone-muted">
                Next Consultation
              </span>
              <CardTitle className="text-lg font-serif text-tone-heading flex items-baseline justify-between">
                <span>Thu, 14:00</span>
                <Badge variant="navy">Confirmed</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-tone-muted">
                1-on-1 Review with <strong>Dr. E. R.</strong>
              </p>
              <span className="text-[10px] text-tone-muted block mt-1">Focus: SEM Model Fit & CFI/TLI</span>
            </CardContent>
          </Card>

          {/* Documented Deliverables */}
          <Card background="white" className="border-tone-rule shadow-xs hover:border-gold/60 transition-colors">
            <CardHeader className="pb-2">
              <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-tone-muted">
                Deliverables Retained
              </span>
              <CardTitle className="text-xl font-serif text-tone-heading flex items-baseline justify-between">
                <span>9 Files</span>
                <Download className="w-3.5 h-3.5 text-tone-muted" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-tone-muted">Annotated drafts, code & data memos</p>
              <span className="text-[10px] text-tone-muted block mt-1">All permanent in student dashboard</span>
            </CardContent>
          </Card>

          {/* Academic Integrity Compliance */}
          <Card background="white" className="border-tone-rule shadow-xs hover:border-gold/60 transition-colors">
            <CardHeader className="pb-2">
              <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-tone-muted">
                Authorship Standard
              </span>
              <CardTitle className="text-lg font-serif text-success flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-success" />
                <span>Verified Clean</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-tone-muted">Zero ghostwriting compliance</p>
              <span className="text-[10px] text-tone-muted block mt-1">100% researcher-authored scholarship</span>
            </CardContent>
          </Card>
        </div>

        {/* ── 3. UPCOMING CONSULTATION APPOINTMENT STRIP ───────────────────── */}
        <div className="bg-cream/80 border border-gold/40 rounded-[2px] p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-gold" />
              <span className="type-micro text-gold">Upcoming Advisory Session</span>
              <span className="text-tone-rule">&bull;</span>
              <span className="text-xs text-tone-heading font-medium">Tomorrow at 14:00 WAT</span>
            </div>
            <h3 className="font-serif text-xl text-tone-heading font-medium">
              Doctoral Consultation: Chapter 3 Methodology Clearance
            </h3>
            <p className="text-xs text-tone-body leading-relaxed">
              Pre-meeting checklist: Dr. E. R. has reviewed your updated R syntax script and covariance matrices. Ensure you have your supervisory committee feedback notes open.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 w-full lg:w-auto">
            <Button
              href="/student/bookings"
              variant="accent"
              size="md"
              className="inline-flex items-center gap-1.5"
            >
              <span>Join Consultation Room</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
            <Button href="/student/messages" variant="secondary" size="md">
              Message Mentor
            </Button>
          </div>
        </div>

        {/* ── 4. RESEARCH PROGRESSION WORKBENCH (TABS) ─────────────────────── */}
        <div className="space-y-6">
          <div className="border-b border-tone-rule flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("milestones")}
                className={`py-3 px-1 font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === "milestones"
                    ? "border-navy text-navy font-semibold"
                    : "border-transparent text-tone-muted hover:text-tone-heading"
                }`}
              >
                Manuscript Milestones (Ch 1–5)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("deliverables")}
                className={`py-3 px-1 font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === "deliverables"
                    ? "border-navy text-navy font-semibold"
                    : "border-transparent text-tone-muted hover:text-tone-heading"
                }`}
              >
                Recent Deliverables & Code
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("consultations")}
                className={`py-3 px-1 font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === "consultations"
                    ? "border-navy text-navy font-semibold"
                    : "border-transparent text-tone-muted hover:text-tone-heading"
                }`}
              >
                Supervisory History
              </button>
            </div>

            <span className="text-[11px] text-tone-muted hidden sm:inline font-mono">
              Stage: Doctoral Candidate
            </span>
          </div>

          {/* TAB 1: MILESTONES PIPELINE */}
          {activeTab === "milestones" && (
            <div className="border border-tone-rule bg-white rounded-[2px] divide-y divide-tone-rule shadow-xs">
              {MILESTONES.map((m, i) => (
                <div
                  key={m.id}
                  className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:bg-paper/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <span className="w-8 h-8 rounded-full bg-cream border border-tone-rule flex items-center justify-center font-serif text-xs font-semibold text-tone-heading shrink-0 mt-0.5">
                      0{i + 1}
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-tone-muted">{m.chapter}</span>
                        <span className="text-tone-rule">&bull;</span>
                        <h4 className="font-serif text-base font-medium text-tone-heading">
                          {m.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-tone-muted">
                        <span>{m.wordCount}</span>
                        <span className="text-tone-rule">&bull;</span>
                        <span>Updated: {m.lastUpdated}</span>
                        {m.deliverablesCount > 0 && (
                          <>
                            <span className="text-tone-rule">&bull;</span>
                            <span className="text-navy font-medium">{m.deliverablesCount} files attached</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
                    {m.status === "completed" && (
                      <Badge variant="success" className="inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Completed</span>
                      </Badge>
                    )}
                    {m.status === "in_review" && (
                      <Badge variant="gold" className="inline-flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Active Review</span>
                      </Badge>
                    )}
                    {m.status === "pending" && (
                      <Badge variant="outline" className="text-tone-muted">
                        Scheduled
                      </Badge>
                    )}

                    <Button variant="secondary" size="sm" href={`/student/projects?chapter=${m.id}`}>
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: DELIVERABLES */}
          {activeTab === "deliverables" && (
            <div className="border border-tone-rule bg-white rounded-[2px] divide-y divide-tone-rule shadow-xs">
              {RECENT_DELIVERABLES.map((del) => {
                const IconComponent = del.icon;
                return (
                  <div
                    key={del.id}
                    className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-paper/50 transition-colors"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-[2px] bg-cream border border-tone-rule flex items-center justify-center shrink-0 text-navy">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-serif text-sm font-medium text-tone-heading">
                          {del.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-tone-muted font-mono">
                          <span>{del.filename}</span>
                          <span className="text-tone-rule">&bull;</span>
                          <span>{del.size}</span>
                          <span className="text-tone-rule">&bull;</span>
                          <span>{del.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        href="#"
                        className="inline-flex items-center gap-1 text-xs"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: CONSULTATIONS */}
          {activeTab === "consultations" && (
            <div className="border border-tone-rule bg-white rounded-[2px] p-6 space-y-4 text-xs text-tone-body shadow-xs">
              <h4 className="font-serif text-base font-medium text-tone-heading">
                Supervisory Consultation Log
              </h4>
              <p className="text-tone-muted">
                All verbal advice, feedback summaries, and action points are recorded here following each scheduled session.
              </p>
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-paper border border-tone-rule rounded-[2px] space-y-1">
                  <div className="flex justify-between font-medium text-tone-heading">
                    <span>Oct 14, 2026 — Chapter 2 Literature Synthesis Clearance</span>
                    <span className="text-tone-muted font-mono text-[11px]">45 mins (Dr. E. R.)</span>
                  </div>
                  <p className="text-tone-muted text-[11px]">
                    Action items completed: Reorganized thematic matrices, addressed 14 missing citations from 2024-2025, approved by primary supervisor.
                  </p>
                </div>
                <div className="p-3 bg-paper border border-tone-rule rounded-[2px] space-y-1">
                  <div className="flex justify-between font-medium text-tone-heading">
                    <span>Sep 02, 2026 — Research Problem & Conceptual Framework Alignment</span>
                    <span className="text-tone-muted font-mono text-[11px]">60 mins (Dr. E. R.)</span>
                  </div>
                  <p className="text-tone-muted text-[11px]">
                    Action items completed: Narrowed geographic district scope to 3 rural local government areas to ensure statistical viability.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── 5. ASSIGNED MENTOR SCHOLAR PROFILE ───────────────────────────── */}
        <div className="border border-tone-rule bg-cream p-6 sm:p-8 rounded-[2px] shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-tone-rule pb-4 mb-4">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-gold font-mono font-semibold">
                Assigned Primary Doctoral Advisor
              </span>
              <h3 className="text-xl font-serif text-tone-heading font-medium mt-0.5">
                Dr. E. R.
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="navy">Quantitative Methodology Specialist</Badge>
              <Badge variant="outline">PhD, Biostatistics</Badge>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-tone-body leading-relaxed">
            Dr. E. R. holds an earned PhD in Biostatistics with over 12 years of experience coaching doctoral candidates on complex statistical modeling, survey design, and empirical defense readiness.
          </p>

          <div className="mt-4 pt-4 border-t border-tone-rule/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-2 text-tone-muted">
              <span className="font-semibold text-navy">Disciplines:</span>
              <span>Health Sciences, Epidemiology, Public Health</span>
              <span className="text-tone-rule mx-1">|</span>
              <span className="font-semibold text-navy">Environments:</span>
              <span>R, SPSS, Stata, Python</span>
            </div>

            <Button href="/student/messages" variant="secondary" size="sm" className="inline-flex items-center gap-1.5 self-start sm:self-auto">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Send Secure Query</span>
            </Button>
          </div>
        </div>

        {/* ── 6. ACADEMIC INTEGRITY PLEDGE BANNER ─────────────────────────── */}
        <div className="p-4 bg-white border border-tone-rule rounded-[2px] flex items-center justify-between text-xs text-tone-muted shadow-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
            <span>
              All consultations and deliverables comply with institutional research conduct and higher education integrity guidelines.
            </span>
          </div>
          <Link href="/about/academic-integrity" className="text-navy hover:text-gold font-medium shrink-0">
            Read Policy &rarr;
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
