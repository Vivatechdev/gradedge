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
  GraduationCap,
  Building,
  BookOpen,
  Calendar,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

interface StudentScholar {
  id: string;
  name: string;
  email: string;
  institution: string;
  level: string;
  fieldOfStudy: string;
  enrolledAt: string;
  activeProjectsCount: number;
  completedSessions: number;
  status: "active" | "completed" | "inactive";
}

const SCHOLARS: StudentScholar[] = [
  {
    id: "stu-001",
    name: "Freedom Sola",
    email: "freedom.sola@cam.ac.uk",
    institution: "University of Cambridge",
    level: "PhD Candidate",
    fieldOfStudy: "Public Health & Biostatistics",
    enrolledAt: "Sep 2026",
    activeProjectsCount: 1,
    completedSessions: 3,
    status: "active",
  },
  {
    id: "stu-002",
    name: "Amina Bello",
    email: "a.bello@lse.ac.uk",
    institution: "London School of Economics",
    level: "PhD Candidate",
    fieldOfStudy: "Applied Econometrics",
    enrolledAt: "Oct 2026",
    activeProjectsCount: 1,
    completedSessions: 2,
    status: "active",
  },
  {
    id: "stu-003",
    name: "Chidi Okafor",
    email: "chidi.okafor@ed.ac.uk",
    institution: "University of Edinburgh",
    level: "Masters Researcher",
    fieldOfStudy: "Higher Education Pedagogy",
    enrolledAt: "Oct 2026",
    activeProjectsCount: 1,
    completedSessions: 1,
    status: "active",
  },
  {
    id: "stu-004",
    name: "Khadija Umar",
    email: "k.umar@imperial.ac.uk",
    institution: "Imperial College London",
    level: "PhD Candidate",
    fieldOfStudy: "Finance & Corporate Governance",
    enrolledAt: "Sep 2026",
    activeProjectsCount: 1,
    completedSessions: 4,
    status: "active",
  },
  {
    id: "stu-005",
    name: "Marcus Thorne",
    email: "m.thorne@ox.ac.uk",
    institution: "University of Oxford",
    level: "PhD Candidate",
    fieldOfStudy: "Information Systems",
    enrolledAt: "Nov 2026",
    activeProjectsCount: 1,
    completedSessions: 0,
    status: "active",
  },
  {
    id: "stu-006",
    name: "Elena Rostova",
    email: "e.rostova@manchester.ac.uk",
    institution: "University of Manchester",
    level: "PhD Candidate",
    fieldOfStudy: "Computational Linguistics",
    enrolledAt: "Aug 2026",
    activeProjectsCount: 0,
    completedSessions: 6,
    status: "completed",
  },
];

export default function AdminStudentsPage() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

  const filtered = SCHOLARS.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.institution.toLowerCase().includes(search.toLowerCase()) ||
      s.fieldOfStudy.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());

    const matchesLevel =
      levelFilter === "all" ||
      (levelFilter === "phd" && s.level.toLowerCase().includes("phd")) ||
      (levelFilter === "masters" && s.level.toLowerCase().includes("master"));

    return matchesSearch && matchesLevel;
  });

  return (
    <DashboardShell
      role="admin"
      title="Researchers & Candidates Directory"
      user={{
        name: "Freedom Sola",
        email: "admin@gradedge.com",
        institution: "Academic Operations Hub",
      }}
    >
      <div className="space-y-6 max-w-6xl">
        {/* Top Header */}
        <div className="border-b border-tone-rule pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="type-micro text-gold">Postgraduate Cohort</span>
              <span className="text-tone-rule">&bull;</span>
              <span className="text-xs text-tone-muted font-mono">{SCHOLARS.length} Enrolled Scholars</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif text-tone-heading font-medium">
              Candidate Researchers Directory
            </h1>
            <p className="text-xs sm:text-sm text-tone-muted mt-1 max-w-xl leading-relaxed">
              Overview of all active and past doctoral scholars, university affiliations, and mentorship engagement.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              href="/admin/projects"
            >
              View Active Briefs
            </Button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card background="white" className="border-tone-rule shadow-2xs">
            <CardHeader className="pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-tone-muted">
                Total Enrolled
              </span>
              <CardTitle className="text-2xl font-serif text-navy">{SCHOLARS.length} Scholars</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-stone-500">Postgraduate candidates</p>
            </CardContent>
          </Card>

          <Card background="white" className="border-tone-rule shadow-2xs">
            <CardHeader className="pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-tone-muted">
                Doctoral Candidates (PhD)
              </span>
              <CardTitle className="text-2xl font-serif text-emerald-700">
                {SCHOLARS.filter((s) => s.level.includes("PhD")).length} Researchers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-stone-500">83% doctoral research ratio</p>
            </CardContent>
          </Card>

          <Card background="white" className="border-tone-rule shadow-2xs">
            <CardHeader className="pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-tone-muted">
                Universities Represented
              </span>
              <CardTitle className="text-2xl font-serif text-navy">
                {new Set(SCHOLARS.map((s) => s.institution)).size} Institutions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-stone-500">Russell Group &amp; Global Labs</p>
            </CardContent>
          </Card>

          <Card background="white" className="border-tone-rule shadow-2xs">
            <CardHeader className="pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-tone-muted">
                Integrity Compliance
              </span>
              <CardTitle className="text-2xl font-serif text-gold">100%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-stone-500">Zero ghostwriting violations</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-tone-rule rounded-[4px] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search by candidate, university, discipline..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs font-sans bg-paper border border-tone-rule rounded-[2px] text-tone-heading placeholder:text-stone-400 focus:outline-none focus:border-gold"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            {["all", "phd", "masters"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-3 py-1.5 text-xs font-sans font-medium rounded-[2px] transition-colors cursor-pointer ${
                  levelFilter === lvl
                    ? "bg-navy text-white font-semibold"
                    : "bg-paper text-tone-muted hover:text-tone-heading hover:bg-stone-100 border border-tone-rule"
                }`}
              >
                {lvl === "all" ? "All Levels" : lvl === "phd" ? "PhD Candidates" : "Masters"}
              </button>
            ))}
          </div>
        </div>

        {/* Scholars Directory Table */}
        <div className="bg-white border border-tone-rule rounded-[4px] overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-paper border-b border-tone-rule text-[11px] uppercase tracking-wider text-tone-muted font-semibold">
                <tr>
                  <th className="py-3 px-4">Candidate Scholar</th>
                  <th className="py-3 px-4">Affiliated Institution</th>
                  <th className="py-3 px-4">Degree &amp; Field</th>
                  <th className="py-3 px-4">Enrolled Date</th>
                  <th className="py-3 px-4">Active Projects</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tone-rule">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-paper/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-tone-heading">{s.name}</div>
                      <div className="text-[11px] text-stone-400">{s.email}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-tone-body font-medium">
                        <Building className="w-3.5 h-3.5 text-navy" />
                        <span>{s.institution}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-navy">{s.level}</div>
                      <div className="text-[11px] text-stone-500">{s.fieldOfStudy}</div>
                    </td>

                    <td className="py-3.5 px-4 text-stone-500">
                      {s.enrolledAt}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-tone-heading">
                        {s.activeProjectsCount} active
                      </span>
                      <div className="text-[10px] text-stone-400">
                        {s.completedSessions} sessions done
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant={s.status === "active" ? "success" : "default"}>
                        {s.status === "active" ? "Active" : "Alumnus"}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => alert(`Researcher Profile for ${s.name}: ${s.institution} (${s.level})`)}
                      >
                        Profile
                      </Button>
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
