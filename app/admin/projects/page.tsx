"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FolderKanban,
  Search,
  Filter,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  ArrowRight,
  FileText,
  Calendar,
} from "lucide-react";

interface ProjectBrief {
  id: string;
  candidateName: string;
  candidateEmail: string;
  projectTitle: string;
  institution: string;
  level: string;
  fieldOfStudy: string;
  assignedMentor: string | null;
  status: "in_scoping" | "active" | "completed" | "needs_assignment";
  serviceCategory: string;
  receivedDate: string;
  turnaroundTarget: string;
  budgetMinor: number;
  currency: string;
}

const INITIAL_PROJECTS: ProjectBrief[] = [
  {
    id: "br-101",
    candidateName: "Freedom Sola",
    candidateEmail: "freedom.sola@cam.ac.uk",
    projectTitle: "Epidemiological Analysis of Maternal Health Access in Rural Districts",
    institution: "University of Cambridge",
    level: "PhD Candidate",
    fieldOfStudy: "Public Health Epidemiology",
    assignedMentor: "Dr. Eleanor Vance",
    status: "active",
    serviceCategory: "Data Analysis and Statistics",
    receivedDate: "Oct 27, 2026",
    turnaroundTarget: "3 business days",
    budgetMinor: 45000,
    currency: "USD",
  },
  {
    id: "br-102",
    candidateName: "Amina Bello",
    candidateEmail: "a.bello@lse.ac.uk",
    projectTitle: "Panel Econometrics on Carbon Pricing Mechanisms and Inflationary Pressures",
    institution: "London School of Economics",
    level: "PhD Candidate",
    fieldOfStudy: "Applied Econometrics",
    assignedMentor: "Dr. Alex Taylor",
    status: "in_scoping",
    serviceCategory: "Dissertation Mentoring",
    receivedDate: "Oct 30, 2026",
    turnaroundTarget: "48 hours",
    budgetMinor: 55000,
    currency: "USD",
  },
  {
    id: "br-103",
    candidateName: "Chidi Okafor",
    candidateEmail: "chidi.okafor@ed.ac.uk",
    projectTitle: "Qualitative Phenomenology of Hybrid Learning Experiences in Tertiary STEM",
    institution: "University of Edinburgh",
    level: "Masters Researcher",
    fieldOfStudy: "Higher Education and Pedagogy",
    assignedMentor: null,
    status: "needs_assignment",
    serviceCategory: "Methodology Review",
    receivedDate: "Nov 01, 2026",
    turnaroundTarget: "24 hours",
    budgetMinor: 35000,
    currency: "USD",
  },
  {
    id: "br-104",
    candidateName: "Khadija Umar",
    candidateEmail: "k.umar@imperial.ac.uk",
    projectTitle: "Corporate Governance and Financial Restatement Frequencies in Emerging Markets",
    institution: "Imperial College London",
    level: "PhD Candidate",
    fieldOfStudy: "Finance and Accounting",
    assignedMentor: "Dr. Heather Wright",
    status: "active",
    serviceCategory: "Editing and Writing Quality",
    receivedDate: "Oct 25, 2026",
    turnaroundTarget: "5 business days",
    budgetMinor: 40000,
    currency: "USD",
  },
  {
    id: "br-105",
    candidateName: "Marcus Thorne",
    candidateEmail: "m.thorne@ox.ac.uk",
    projectTitle: "Structural Equation Modeling of Technology Acceptance in Healthcare",
    institution: "University of Oxford",
    level: "PhD Candidate",
    fieldOfStudy: "Information Systems",
    assignedMentor: null,
    status: "needs_assignment",
    serviceCategory: "Statistical Syntax Audit",
    receivedDate: "Nov 02, 2026",
    turnaroundTarget: "48 hours",
    budgetMinor: 50000,
    currency: "USD",
  },
];

export default function AdminProjectsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [projects, setProjects] = useState<ProjectBrief[]>(INITIAL_PROJECTS);
  const [assigningId, setAssigningId] = useState<string | null>(null);

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      p.projectTitle.toLowerCase().includes(search.toLowerCase()) ||
      p.institution.toLowerCase().includes(search.toLowerCase()) ||
      p.fieldOfStudy.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAssignMentor = (projectId: string, mentorName: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, assignedMentor: mentorName, status: "active" as const }
          : p
      )
    );
    setAssigningId(null);
  };

  return (
    <DashboardShell
      role="admin"
      title="Support Requests and Project Briefs"
      user={{
        name: "Freedom Sola",
        email: "admin@gradedge.com",
        institution: "Academic Operations Hub",
      }}
    >
      <div className="space-y-6 max-w-6xl">
        {/* Top Header and Actions */}
        <div className="border-b border-tone-rule pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="type-micro text-gold">Project Scoping and Dispatch</span>
              <span className="text-tone-rule">&bull;</span>
              <span className="text-xs text-tone-muted font-mono">{filtered.length} active briefs</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif text-tone-heading font-medium">
              Candidate Research Briefs
            </h1>
            <p className="text-xs sm:text-sm text-tone-muted mt-1 max-w-xl leading-relaxed">
              Triage incoming support requests, allocate discipline-matched faculty mentors, and monitor SLA turnarounds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="accent"
              size="sm"
              onClick={() => alert("Quick brief creation modal: You can triage incoming briefs directly from the list below.")}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              New Brief Intake
            </Button>
          </div>
        </div>

        {/* Operational Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card background="white" className="border-tone-rule shadow-2xs">
            <CardHeader className="pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-tone-muted">
                Total Briefs
              </span>
              <CardTitle className="text-2xl font-serif text-navy">{projects.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-tone-muted">Across all academic stages</p>
            </CardContent>
          </Card>

          <Card background="white" className="border-tone-rule shadow-2xs">
            <CardHeader className="pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-tone-muted">
                Needs Mentor Assignment
              </span>
              <CardTitle className="text-2xl font-serif text-amber-600">
                {projects.filter((p) => p.status === "needs_assignment").length} Briefs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-stone-500">Require triage within 24h</p>
            </CardContent>
          </Card>

          <Card background="white" className="border-tone-rule shadow-2xs">
            <CardHeader className="pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-tone-muted">
                Active in Mentoring
              </span>
              <CardTitle className="text-2xl font-serif text-emerald-700">
                {projects.filter((p) => p.status === "active").length} Briefs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-stone-500">Milestones actively tracked</p>
            </CardContent>
          </Card>

          <Card background="white" className="border-tone-rule shadow-2xs">
            <CardHeader className="pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-tone-muted">
                Average Turnaround
              </span>
              <CardTitle className="text-2xl font-serif text-navy">2.1 Days</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-gold font-medium">100% within SLA targets</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar and Search */}
        <div className="bg-white border border-tone-rule rounded-[4px] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search candidate, thesis title, university..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs font-sans bg-paper border border-tone-rule rounded-[2px] text-tone-heading placeholder:text-stone-400 focus:outline-none focus:border-gold"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {["all", "needs_assignment", "in_scoping", "active", "completed"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-sans font-medium rounded-[2px] transition-colors cursor-pointer ${
                  statusFilter === st
                    ? "bg-navy text-white font-semibold"
                    : "bg-paper text-tone-muted hover:text-tone-heading hover:bg-stone-100 border border-tone-rule"
                }`}
              >
                {st === "all"
                  ? "All Briefs"
                  : st === "needs_assignment"
                  ? "Needs Mentor"
                  : st === "in_scoping"
                  ? "In Scoping"
                  : st === "active"
                  ? "Active"
                  : "Completed"}
              </button>
            ))}
          </div>
        </div>

        {/* Project Briefs Table */}
        <div className="bg-white border border-tone-rule rounded-[4px] overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-paper border-b border-tone-rule text-[11px] uppercase tracking-wider text-tone-muted font-semibold">
                <tr>
                  <th className="py-3 px-4">Ref and Candidate</th>
                  <th className="py-3 px-4">Research Topic and Field</th>
                  <th className="py-3 px-4">Service Tier</th>
                  <th className="py-3 px-4">Assigned Mentor</th>
                  <th className="py-3 px-4">Turnaround</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tone-rule">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-paper/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-[10px] text-gold font-semibold mb-0.5">
                        {b.id}
                      </div>
                      <div className="font-semibold text-tone-heading">{b.candidateName}</div>
                      <div className="text-[11px] text-stone-500">{b.institution}</div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <Link
                        href={`/admin/projects/${b.id}`}
                        className="font-serif text-sm font-medium text-navy hover:text-gold transition-colors line-clamp-1"
                      >
                        {b.projectTitle}
                      </Link>
                      <div className="text-[11px] text-stone-500 mt-0.5">{b.fieldOfStudy}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-tone-heading font-medium">{b.serviceCategory}</span>
                      <div className="text-[11px] text-stone-400">
                        ${(b.budgetMinor / 100).toFixed(0)} {b.currency}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {b.assignedMentor ? (
                        <div className="flex items-center gap-1.5 font-medium text-tone-heading">
                          <Users className="w-3.5 h-3.5 text-navy" />
                          <span>{b.assignedMentor}</span>
                        </div>
                      ) : (
                        <span className="text-amber-700 font-semibold inline-flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Unallocated
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-tone-body">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span>{b.turnaroundTarget}</span>
                      </div>
                      <div className="text-[10px] text-stone-400 mt-0.5">Recv: {b.receivedDate}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          b.status === "active"
                            ? "success"
                            : b.status === "needs_assignment"
                            ? "error"
                            : b.status === "in_scoping"
                            ? "warning"
                            : "default"
                        }
                      >
                        {b.status === "active"
                          ? "Active"
                          : b.status === "needs_assignment"
                          ? "Needs Mentor"
                          : b.status === "in_scoping"
                          ? "In Scoping"
                          : "Completed"}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {b.status === "needs_assignment" ? (
                          <div className="relative">
                            {assigningId === b.id ? (
                              <div className="absolute right-0 top-0 z-30 bg-white border border-tone-rule shadow-lg rounded-[2px] p-2 w-48 text-left space-y-1">
                                <div className="text-[10px] font-semibold text-tone-muted uppercase tracking-wider px-2 py-1">
                                  Assign Mentor:
                                </div>
                                <button
                                  onClick={() => handleAssignMentor(b.id, "Dr. Eleanor Vance")}
                                  className="w-full text-left px-2 py-1 hover:bg-paper rounded-[2px] text-xs text-tone-heading hover:text-navy cursor-pointer"
                                >
                                  Dr. Eleanor Vance (Methodology)
                                </button>
                                <button
                                  onClick={() => handleAssignMentor(b.id, "Dr. Alex Taylor")}
                                  className="w-full text-left px-2 py-1 hover:bg-paper rounded-[2px] text-xs text-tone-heading hover:text-navy cursor-pointer"
                                >
                                  Dr. Alex Taylor (Econometrics)
                                </button>
                                <button
                                  onClick={() => handleAssignMentor(b.id, "Dr. Heather Wright")}
                                  className="w-full text-left px-2 py-1 hover:bg-paper rounded-[2px] text-xs text-tone-heading hover:text-navy cursor-pointer"
                                >
                                  Dr. Heather Wright (Literature)
                                </button>
                                <button
                                  onClick={() => setAssigningId(null)}
                                  className="w-full text-left px-2 py-1 text-[11px] text-stone-400 hover:text-stone-600 border-t border-tone-rule pt-1 mt-1 cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <Button
                                variant="accent"
                                size="sm"
                                onClick={() => setAssigningId(b.id)}
                              >
                                Assign Mentor
                              </Button>
                            )}
                          </div>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            href={`/admin/projects/${b.id}`}
                          >
                            Manage
                          </Button>
                        )}
                      </div>
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

