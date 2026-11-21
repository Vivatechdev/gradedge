"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  Clock,
  FileText,
  ExternalLink,
  CheckCircle2,
  Video,
  ArrowRight,
  LogOut,
  Shield,
  GraduationCap,
} from "lucide-react";

interface MenteeBrief {
  id: string;
  candidateName: string;
  projectTitle: string;
  institution: string;
  level: string;
  status: "active" | "in_review" | "scheduled";
  dueDate: string;
  currentMilestone: string;
}

const MENTEES: MenteeBrief[] = [
  {
    id: "br-101",
    candidateName: "Freedom Sola",
    projectTitle: "Epidemiological Analysis of Maternal Health Access in Rural Districts",
    institution: "Cambridge Institute of Public Health",
    level: "PhD Candidate",
    status: "in_review",
    dueDate: "Nov 24, 2026",
    currentMilestone: "Chapter 3: Sampling & Propensity Score Matching",
  },
  {
    id: "br-102",
    candidateName: "Amina Bello",
    projectTitle: "Panel Econometrics on Carbon Pricing Mechanisms & Inflationary Pressures",
    institution: "London School of Economics",
    level: "PhD Candidate",
    status: "active",
    dueDate: "Nov 28, 2026",
    currentMilestone: "Chapter 4: Stata Empirical Regression Tables",
  },
  {
    id: "br-103",
    candidateName: "Chidi Okafor",
    projectTitle: "Qualitative Phenomenology of Hybrid Learning Experiences in Tertiary STEM",
    institution: "Faculty of Education",
    level: "Masters Researcher",
    status: "scheduled",
    dueDate: "Dec 02, 2026",
    currentMilestone: "NVivo Thematic Coding Framework",
  },
  {
    id: "br-104",
    candidateName: "Khadija Umar",
    projectTitle: "Corporate Governance & Financial Restatement Frequencies in Emerging Markets",
    institution: "School of Business & Finance",
    level: "PhD Candidate",
    status: "active",
    dueDate: "Dec 06, 2026",
    currentMilestone: "Chapter 2: Literature Review Synthesis Matrix",
  },
];

export default function MentorPortalPage() {
  return (
    <div className="min-h-screen bg-paper flex flex-col text-tone-body">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-paper border-b border-tone-rule px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo variant="full" href="/" />
          <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-tone-rule text-xs font-sans">
            <Badge variant="gold">Faculty Mentor Portal</Badge>
            <span className="text-tone-muted">Preview Workspace</span>
          </div>
        </div>

        {/* Quick Portal Switcher & User Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs font-sans">
            <span className="text-stone-400">Switch workspace:</span>
            <Link
              href="/student"
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-tone-rule rounded-[2px] text-tone-heading hover:text-gold hover:border-gold transition-colors"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Student
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-tone-rule rounded-[2px] text-tone-heading hover:text-gold hover:border-gold transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </Link>
          </div>

          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 text-xs font-sans text-tone-muted hover:text-navy px-3 py-1.5 rounded-[2px] border border-tone-rule bg-white hover:bg-cream transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Greeting */}
        <div className="border-b border-tone-rule pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="type-micro uppercase tracking-wider text-gold font-semibold">
              Senior Academic Advisory
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-tone-heading font-medium mt-1">
              Welcome back, Dr. Eleanor Vance
            </h1>
            <p className="text-sm font-sans text-tone-body mt-1">
              Department of Research Methodology &amp; Quantitative Inquiry &bull; 4 active candidates assigned.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" href="/student" size="sm">
              View Student Experience &rarr;
            </Button>
            <Button variant="accent" href="/" size="sm">
              Public Homepage
            </Button>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white border-tone-rule">
            <CardHeader className="pb-2">
              <span className="type-micro text-tone-muted uppercase">Active Doctoral Scholars</span>
              <div className="flex items-center justify-between pt-1">
                <span className="font-serif text-2xl font-bold text-tone-heading">4</span>
                <Users className="w-5 h-5 text-gold" />
              </div>
            </CardHeader>
            <CardContent>
              <span className="text-[11px] text-stone-500 font-sans">Full dissertation advisory</span>
            </CardContent>
          </Card>

          <Card className="bg-white border-tone-rule">
            <CardHeader className="pb-2">
              <span className="type-micro text-tone-muted uppercase">Drafts Awaiting Review</span>
              <div className="flex items-center justify-between pt-1">
                <span className="font-serif text-2xl font-bold text-tone-heading">2</span>
                <FileText className="w-5 h-5 text-navy" />
              </div>
            </CardHeader>
            <CardContent>
              <span className="text-[11px] text-amber-600 font-sans font-medium">1 due within 48 hours</span>
            </CardContent>
          </Card>

          <Card className="bg-white border-tone-rule">
            <CardHeader className="pb-2">
              <span className="type-micro text-tone-muted uppercase">Upcoming Consultations</span>
              <div className="flex items-center justify-between pt-1">
                <span className="font-serif text-2xl font-bold text-tone-heading">3</span>
                <Calendar className="w-5 h-5 text-gold" />
              </div>
            </CardHeader>
            <CardContent>
              <span className="text-[11px] text-stone-500 font-sans">Next session tomorrow, 14:00 UTC</span>
            </CardContent>
          </Card>

          <Card className="bg-white border-tone-rule">
            <CardHeader className="pb-2">
              <span className="type-micro text-tone-muted uppercase">Turnaround Performance</span>
              <div className="flex items-center justify-between pt-1">
                <span className="font-serif text-2xl font-bold text-tone-heading">100%</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <span className="text-[11px] text-stone-500 font-sans">Average 2.1 days turnaround</span>
            </CardContent>
          </Card>
        </div>

        {/* Two-Column Section: Assigned Candidates & Scheduled Sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Candidates List (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-medium text-tone-heading">
                Assigned Candidate Briefs
              </h2>
              <span className="text-xs text-tone-muted">Ordered by priority</span>
            </div>

            <div className="space-y-3">
              {MENTEES.map((mentee) => (
                <div
                  key={mentee.id}
                  className="bg-white border border-tone-rule rounded-[4px] p-5 space-y-3 hover:border-gold/60 transition-colors shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-sans font-semibold text-sm text-tone-heading">
                          {mentee.candidateName}
                        </span>
                        <span className="text-xs text-stone-400">&bull;</span>
                        <span className="text-xs text-tone-muted font-sans">{mentee.institution}</span>
                      </div>
                      <h3 className="font-serif text-base text-navy font-medium mt-1">
                        {mentee.projectTitle}
                      </h3>
                    </div>
                    <Badge
                      variant={
                        mentee.status === "in_review"
                          ? "warning"
                          : mentee.status === "active"
                          ? "gold"
                          : "default"
                      }
                    >
                      {mentee.status === "in_review"
                        ? "Review in progress"
                        : mentee.status === "active"
                        ? "Active writing"
                        : "Session booked"}
                    </Badge>
                  </div>

                  <div className="pt-2 border-t border-tone-rule flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans text-tone-muted">
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-gold" />
                      <span>{mentee.currentMilestone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-stone-500">Target: {mentee.dueDate}</span>
                      <button
                        type="button"
                        onClick={() => alert(`Opening workspace draft for ${mentee.candidateName}`)}
                        className="text-navy hover:text-gold font-medium inline-flex items-center gap-1 cursor-pointer"
                      >
                        Review Draft &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scheduled Sessions (1 Col) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-medium text-tone-heading">
                Upcoming Sessions
              </h2>
              <span className="text-xs text-tone-muted">Google Meet</span>
            </div>

            <div className="bg-white border border-tone-rule rounded-[4px] p-5 space-y-4 shadow-2xs">
              <div className="p-3.5 bg-paper rounded-[2px] border border-tone-rule space-y-2">
                <div className="flex items-center justify-between text-xs font-sans font-semibold text-navy">
                  <span>Tomorrow &bull; 14:00 UTC</span>
                  <Badge variant="success">Confirmed</Badge>
                </div>
                <p className="font-serif text-sm text-tone-heading font-medium">
                  Freedom Sola &mdash; Chapter 3 Methodology Audit
                </p>
                <div className="pt-1 flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-sans">60-minute consultation</span>
                  <a
                    href="https://meet.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-gold hover:text-navy font-medium"
                  >
                    <Video className="w-3.5 h-3.5" />
                    Launch Meet
                  </a>
                </div>
              </div>

              <div className="p-3.5 bg-paper rounded-[2px] border border-tone-rule space-y-2">
                <div className="flex items-center justify-between text-xs font-sans font-semibold text-navy">
                  <span>Friday &bull; 10:00 UTC</span>
                  <Badge variant="default">Scheduled</Badge>
                </div>
                <p className="font-serif text-sm text-tone-heading font-medium">
                  Amina Bello &mdash; Panel Econometrics Review
                </p>
                <div className="pt-1 flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-sans">45-minute advisory</span>
                  <a
                    href="https://meet.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-gold hover:text-navy font-medium"
                  >
                    <Video className="w-3.5 h-3.5" />
                    Launch Meet
                  </a>
                </div>
              </div>

              <div className="pt-2 text-center">
                <p className="text-xs text-stone-400 font-sans">
                  Times automatically synced with your calendar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
