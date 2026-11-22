"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Search,
  Filter,
  FileText,
  Calendar,
  MessageSquare,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  GraduationCap,
  Sparkles,
} from "lucide-react";

interface MenteeRecord {
  id: string;
  name: string;
  email: string;
  institution: string;
  degree: string;
  field: string;
  topic: string;
  currentMilestone: string;
  progressPercent: number;
  status: "in_review" | "active" | "scheduled";
  lastReviewDate: string;
  nextSession: string;
  turnitinScore: string;
}

const MENTEES_DATA: MenteeRecord[] = [
  {
    id: "m-001",
    name: "Freedom Sola",
    email: "freedom.sola@university.edu",
    institution: "Cambridge Institute of Public Health",
    degree: "PhD in Public Health & Epidemiology",
    field: "Quantitative / Propensity Matching",
    topic: "Epidemiological Analysis of Maternal Health Access in Sub-Saharan Rural Districts",
    currentMilestone: "Chapter 3: Sampling & Propensity Score Matching",
    progressPercent: 68,
    status: "in_review",
    lastReviewDate: "Nov 19, 2026",
    nextSession: "Nov 25, 2026 at 14:00 UTC",
    turnitinScore: "4% (Compliant)",
  },
  {
    id: "m-002",
    name: "Amina Bello",
    email: "a.bello@lse.ac.uk",
    institution: "London School of Economics",
    degree: "PhD in Applied Econometrics",
    field: "Panel Data & Time-Series Stata",
    topic: "Panel Econometrics on Carbon Pricing Mechanisms & Inflationary Pressures Across Sub-Saharan Markets",
    currentMilestone: "Chapter 4: Stata Empirical Regression Tables",
    progressPercent: 82,
    status: "active",
    lastReviewDate: "Nov 12, 2026",
    nextSession: "Nov 28, 2026 at 10:00 UTC",
    turnitinScore: "6% (Compliant)",
  },
  {
    id: "m-003",
    name: "Chidi Okafor",
    email: "c.okafor@education.ox.ac.uk",
    institution: "Faculty of Education, University of Oxford",
    degree: "DPhil in Educational Technology",
    field: "Qualitative Phenomenology / NVivo",
    topic: "Qualitative Phenomenology of Hybrid Learning Experiences in Tertiary STEM",
    currentMilestone: "NVivo Thematic Coding Framework & Audit Trail",
    progressPercent: 54,
    status: "scheduled",
    lastReviewDate: "Nov 08, 2026",
    nextSession: "Dec 02, 2026 at 15:30 UTC",
    turnitinScore: "3% (Compliant)",
  },
  {
    id: "m-004",
    name: "Khadija Umar",
    email: "k.umar@business.manchester.ac.uk",
    institution: "Alliance Manchester Business School",
    degree: "PhD in Accounting & Corporate Governance",
    field: "Mixed-Methods / Governance Indices",
    topic: "Corporate Governance & Financial Restatement Frequencies in Emerging Capital Markets",
    currentMilestone: "Chapter 2: Literature Review Synthesis Matrix",
    progressPercent: 40,
    status: "in_review",
    lastReviewDate: "Nov 18, 2026",
    nextSession: "Dec 06, 2026 at 11:00 UTC",
    turnitinScore: "5% (Compliant)",
  },
];

export default function MentorMenteesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredMentees = MENTEES_DATA.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.institution.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardShell
      role="mentor"
      title="Doctoral Mentees"
      user={{
        id: "mentor-101",
        name: "Dr. Eleanor Vance",
        email: "e.vance@gradedge.org",
        institution: "Senior Faculty Mentor",
      }}
    >
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="border-b border-tone-rule pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-medium text-tone-heading">
              Assigned Doctoral Candidates
            </h2>
            <p className="text-xs text-tone-muted mt-1">
              Supervising 4 doctoral researchers across methodology design, empirical validation, and defense preparation.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" href="/mentor/reviews" size="sm">
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              Open Manuscript Queue
            </Button>
            <Button variant="accent" href="/mentor/schedule" size="sm">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              Manage Availability
            </Button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 border border-tone-rule rounded-[2px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search by scholar name, topic, or university..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-paper border border-stone-200 rounded-[2px] focus:outline-hidden focus:border-gold"
            />
          </div>
          <div className="flex items-center gap-2">
            {["all", "in_review", "active", "scheduled"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`text-xs px-3 py-1.5 rounded-[2px] capitalize font-medium transition-colors ${
                  statusFilter === status
                    ? "bg-navy-deep text-white font-semibold"
                    : "bg-paper text-stone-600 hover:bg-stone-100 border border-tone-rule"
                }`}
              >
                {status === "all" ? "All Scholars (4)" : status.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Scholar Cards Grid */}
        <div className="grid grid-cols-1 gap-5">
          {filteredMentees.map((mentee) => (
            <Card key={mentee.id} className="bg-white border-tone-rule hover:border-gold/60 transition-all">
              <CardContent className="p-5 sm:p-6 space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Scholar Bio & Project */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-serif text-lg font-semibold text-tone-heading">
                        {mentee.name}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {mentee.degree}
                      </Badge>
                      {mentee.status === "in_review" && (
                        <Badge variant="gold">Manuscript In Review</Badge>
                      )}
                      {mentee.status === "active" && (
                        <Badge variant="default">Empirical Drafting</Badge>
                      )}
                      {mentee.status === "scheduled" && (
                        <Badge variant="outline">Consultation Booked</Badge>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 font-sans">
                      {mentee.institution} &bull; <span className="font-medium text-navy">{mentee.field}</span>
                    </p>
                    <p className="text-sm font-serif text-stone-800 pt-1 leading-snug">
                      &ldquo;{mentee.topic}&rdquo;
                    </p>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex sm:flex-col lg:items-end gap-2 shrink-0">
                    <Button variant="accent" href="/mentor/reviews" size="sm" className="w-full sm:w-auto">
                      <FileText className="w-3.5 h-3.5 mr-1.5" />
                      Review Chapters
                    </Button>
                    <Button variant="outline" href="/mentor/schedule" size="sm" className="w-full sm:w-auto">
                      <Calendar className="w-3.5 h-3.5 mr-1.5" />
                      Session Notes
                    </Button>
                  </div>
                </div>

                {/* Milestone Progress & Metrics Bar */}
                <div className="pt-3 border-t border-tone-rule/70 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-stone-500 text-[11px] uppercase tracking-wide">
                        Current Milestone
                      </span>
                      <span className="font-semibold text-navy">{mentee.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mb-1">
                      <div
                        className="bg-gold h-1.5 rounded-full"
                        style={{ width: `${mentee.progressPercent}%` }}
                      />
                    </div>
                    <span className="font-medium text-stone-700 truncate block">
                      {mentee.currentMilestone}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-stone-500 text-[11px] uppercase tracking-wide block">
                      Next Consultation
                    </span>
                    <span className="font-medium text-stone-800 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gold" />
                      {mentee.nextSession}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-stone-500 text-[11px] uppercase tracking-wide block">
                      Integrity &amp; Similarity
                    </span>
                    <span className="font-medium text-emerald-700 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Turnitin: {mentee.turnitinScore}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

