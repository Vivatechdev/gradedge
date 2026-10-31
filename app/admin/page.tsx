"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FolderKanban,
  FileText,
} from "lucide-react";

interface BriefItem {
  id: string;
  candidateName: string;
  projectTitle: string;
  institution: string;
  level: string;
  assignedMentor: string;
  status: "in_scoping" | "active" | "completed";
  receivedDate: string;
  turnaroundTarget: string;
}

const RECENT_BRIEFS: BriefItem[] = [
  {
    id: "br-101",
    candidateName: "Freedom Sola",
    projectTitle: "Epidemiological Analysis of Maternal Health Access in Rural Districts",
    institution: "University Research Scholar",
    level: "PhD Candidate",
    assignedMentor: "Dr. E. R.",
    status: "active",
    receivedDate: "Oct 27, 2026",
    turnaroundTarget: "3 business days",
  },
  {
    id: "br-102",
    candidateName: "Amina Bello",
    projectTitle: "Panel Econometrics on Carbon Pricing Mechanisms & Inflationary Pressures",
    institution: "Institute of Development Economics",
    level: "PhD Candidate",
    assignedMentor: "Dr. A. T.",
    status: "in_scoping",
    receivedDate: "Oct 30, 2026",
    turnaroundTarget: "48 hours",
  },
  {
    id: "br-103",
    candidateName: "Chidi Okafor",
    projectTitle: "Qualitative Phenomenology of Hybrid Learning Experiences in Tertiary STEM",
    institution: "Faculty of Education",
    level: "Masters Researcher",
    assignedMentor: "Dr. M. K.",
    status: "in_scoping",
    receivedDate: "Oct 30, 2026",
    turnaroundTarget: "48 hours",
  },
  {
    id: "br-104",
    candidateName: "Khadija Umar",
    projectTitle: "Corporate Governance & Financial Restatement Frequencies in Emerging Markets",
    institution: "School of Business & Finance",
    level: "PhD Candidate",
    assignedMentor: "Dr. H. W.",
    status: "active",
    receivedDate: "Oct 25, 2026",
    turnaroundTarget: "5 business days",
  },
];

const MENTOR_FACULTY_POOL = [
  {
    name: "Dr. E. R.",
    specialty: "Biostatistics & Quantitative Modeling",
    activeMentees: 4,
    capacity: 5,
    status: "Available",
  },
  {
    name: "Dr. A. T.",
    specialty: "Applied Econometrics & Stata/Python",
    activeMentees: 3,
    capacity: 4,
    status: "Available",
  },
  {
    name: "Dr. M. K.",
    specialty: "Qualitative Inquiry & NVivo Hierarchy",
    activeMentees: 4,
    capacity: 4,
    status: "At Capacity",
  },
  {
    name: "Dr. H. W.",
    specialty: "Literature Synthesis & Academic Prose",
    activeMentees: 2,
    capacity: 4,
    status: "Available",
  },
];

export default function AdminDashboardPage() {
  const [filterStatus, setFilterStatus] = useState<"all" | "in_scoping" | "active">("all");

  const filteredBriefs =
    filterStatus === "all"
      ? RECENT_BRIEFS
      : RECENT_BRIEFS.filter((b) => b.status === filterStatus);

  return (
    <DashboardShell
      role="admin"
      title="Platform Operations"
      user={{
        name: "Freedom Sola",
        email: "freedom.sola@gradedge.internal",
        institution: "Academic Administration",
      }}
    >
      <div className="space-y-8 ui-interface max-w-6xl">
        {/* ── 1. TOP OPERATIONS BANNER ──────────────────────────────────────── */}
        <div className="border-b border-tone-rule pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="type-micro text-gold">Academic Operations Hub</span>
              <span className="text-tone-rule">&bull;</span>
              <span className="text-xs text-tone-muted font-mono">Status: Triage Active</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-tone-heading font-medium">
              Academic Support Triage & Quality Assurance
            </h2>
            <p className="text-xs sm:text-sm text-tone-muted mt-1 max-w-xl leading-relaxed">
              Review incoming researcher project briefs, allocate PhD faculty mentors, and verify zero-ghostwriting compliance.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button href="/admin/integrity" variant="secondary" size="sm">
              Audit Session Logs
            </Button>
            <Button href="/admin/projects?mode=new" variant="accent" size="sm">
              Assign Incoming Brief
            </Button>
          </div>
        </div>

        {/* ── 2. OPERATIONAL COUNTERS & CAPACITY ────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card background="white" className="border-tone-rule shadow-xs hover:border-gold/60 transition-colors">
            <CardHeader className="pb-2">
              <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-tone-muted">
                Pending Scoping
              </span>
              <CardTitle className="text-2xl font-serif text-navy">2 Briefs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-tone-muted">Awaiting mentor assignment within SLA</p>
              <span className="text-[10px] text-gold font-medium block mt-1">Average wait: 4.2 hours</span>
            </CardContent>
          </Card>

          <Card background="white" className="border-tone-rule shadow-xs hover:border-gold/60 transition-colors">
            <CardHeader className="pb-2">
              <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-tone-muted">
                Active Engagements
              </span>
              <CardTitle className="text-2xl font-serif text-tone-heading">13 Scholars</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-tone-muted">Mentoring cycles in progress across disciplines</p>
              <span className="text-[10px] text-tone-muted block mt-1">9 PhD / 4 Masters</span>
            </CardContent>
          </Card>

          <Card background="white" className="border-tone-rule shadow-xs hover:border-gold/60 transition-colors">
            <CardHeader className="pb-2">
              <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-tone-muted">
                Mentor Pool Allocation
              </span>
              <CardTitle className="text-2xl font-serif text-navy">76% Utilized</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-tone-muted">13 of 17 available mentoring slots filled</p>
              <span className="text-[10px] text-success font-medium block mt-1">4 senior slots open</span>
            </CardContent>
          </Card>

          <Card background="white" className="border-tone-rule shadow-xs hover:border-gold/60 transition-colors">
            <CardHeader className="pb-2">
              <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-tone-muted">
                Academic Integrity
              </span>
              <CardTitle className="text-xl font-serif text-success flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-success" />
                <span>0 Violations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-tone-muted">100% adherence to coaching standards</p>
              <span className="text-[10px] text-tone-muted block mt-1">Audited weekly by review board</span>
            </CardContent>
          </Card>
        </div>

        {/* ── 3. LIVE RESEARCHER BRIEFS TRIAGE QUEUE ────────────────────────── */}
        <div className="border border-tone-rule bg-white rounded-[2px] overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-tone-rule bg-cream flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="space-y-0.5">
              <h3 className="font-serif text-lg text-tone-heading font-medium">
                Live Researcher Support Briefs
              </h3>
              <p className="text-xs text-tone-muted">
                Incoming candidate requests awaiting triage, scoping validation, and faculty allocation.
              </p>
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center gap-1 bg-white border border-tone-rule p-1 rounded-[2px] text-xs">
              <button
                type="button"
                onClick={() => setFilterStatus("all")}
                className={`px-2.5 py-1 rounded-[1px] font-medium transition-colors cursor-pointer ${filterStatus === "all" ? "bg-navy text-white" : "text-tone-muted hover:text-tone-heading"
                  }`}
              >
                All ({RECENT_BRIEFS.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus("in_scoping")}
                className={`px-2.5 py-1 rounded-[1px] font-medium transition-colors cursor-pointer ${filterStatus === "in_scoping" ? "bg-navy text-white" : "text-tone-muted hover:text-tone-heading"
                  }`}
              >
                In Scoping (2)
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus("active")}
                className={`px-2.5 py-1 rounded-[1px] font-medium transition-colors cursor-pointer ${filterStatus === "active" ? "bg-navy text-white" : "text-tone-muted hover:text-tone-heading"
                  }`}
              >
                Active (2)
              </button>
            </div>
          </div>

          <div className="divide-y divide-tone-rule text-xs">
            {filteredBriefs.map((b) => (
              <div
                key={b.id}
                className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-paper/50 transition-colors"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-tone-heading text-sm">
                      {b.candidateName}
                    </span>
                    <span className="text-tone-rule">&bull;</span>
                    <span className="text-tone-muted">{b.institution}</span>
                    <span className="text-tone-rule">&bull;</span>
                    <span className="font-mono text-[11px] text-gold">{b.level}</span>
                  </div>

                  <p className="font-serif text-sm text-tone-heading leading-normal">
                    {b.projectTitle}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-tone-muted">
                    <span>Mentor: <strong className="text-navy">{b.assignedMentor}</strong></span>
                    <span className="text-tone-rule">&bull;</span>
                    <span>Received: {b.receivedDate}</span>
                    <span className="text-tone-rule">&bull;</span>
                    <span>Target: {b.turnaroundTarget}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end shrink-0">
                  {b.status === "in_scoping" ? (
                    <Badge variant="navy">In Scoping</Badge>
                  ) : (
                    <Badge variant="success">Active Mentoring</Badge>
                  )}

                  <Button variant="secondary" size="sm" href={`/admin/projects/${b.id}`}>
                    Manage Brief &rarr;
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. MENTOR FACULTY POOL STATUS TABLE ──────────────────────────── */}
        <div className="border border-tone-rule bg-white rounded-[2px] overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-tone-rule bg-cream flex justify-between items-center">
            <div>
              <h3 className="font-serif text-lg text-tone-heading font-medium">
                Faculty Mentor Capacity & Workload
              </h3>
              <p className="text-xs text-tone-muted mt-0.5">
                Anonymous faculty pool oversight complying with Scholar and Mentor Privacy Protocols.
              </p>
            </div>
            <Badge variant="outline">4 Mentors Online</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-paper border-b border-tone-rule text-tone-muted uppercase tracking-wider text-[10px]">
                  <th className="p-4 font-mono font-medium">Mentor ID</th>
                  <th className="p-4 font-mono font-medium">Specialty Field</th>
                  <th className="p-4 font-mono font-medium">Active Load</th>
                  <th className="p-4 font-mono font-medium">Capacity</th>
                  <th className="p-4 font-mono font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tone-rule">
                {MENTOR_FACULTY_POOL.map((m, i) => (
                  <tr key={i} className="hover:bg-paper/40 transition-colors">
                    <td className="p-4 font-serif font-medium text-tone-heading text-sm">
                      {m.name}
                    </td>
                    <td className="p-4 text-tone-body">
                      {m.specialty}
                    </td>
                    <td className="p-4 text-tone-heading font-mono">
                      {m.activeMentees} scholars
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-cream h-1.5 rounded-full overflow-hidden border border-tone-rule/60">
                          <div
                            className={`h-full rounded-full ${m.activeMentees >= m.capacity ? "bg-gold" : "bg-navy"
                              }`}
                            style={{ width: `${(m.activeMentees / m.capacity) * 100}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-tone-muted">
                          {m.activeMentees}/{m.capacity}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      {m.status === "Available" ? (
                        <span className="text-success font-medium inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Available</span>
                        </span>
                      ) : (
                        <span className="text-tone-muted font-medium inline-flex items-center gap-1">
                          <span>Full</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
