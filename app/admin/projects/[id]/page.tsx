"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  Users,
  ShieldAlert,
  Send,
  ExternalLink,
} from "lucide-react";

export default function AdminProjectDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || "br-101";

  const [mentor, setMentor] = useState("Dr. Eleanor Vance");
  const [status, setStatus] = useState("active");
  const [internalNotes, setInternalNotes] = useState(
    "Candidate submitted complete quantitative survey responses. Focus is primarily on multivariate regression validation and SEM moderation testing in SPSS and SmartPLS."
  );
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <DashboardShell
      role="admin"
      title={`Brief Review: ${id}`}
      user={{
        name: "Freedom Sola",
        email: "admin@gradedge.com",
        institution: "Academic Operations Hub",
      }}
    >
      <div className="space-y-6 max-w-5xl">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-1.5 text-xs font-sans text-tone-muted hover:text-navy transition-colors mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Briefs</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-tone-rule pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-semibold text-gold">{id}</span>
                <span className="text-stone-300">&bull;</span>
                <Badge variant={status === "active" ? "success" : "warning"}>
                  {status === "active" ? "Active Advisory" : "Under Scoping"}
                </Badge>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl text-tone-heading font-medium">
                Epidemiological Analysis of Maternal Health Access in Rural Districts
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 font-sans mt-1">
                Candidate: <strong>Freedom Sola</strong> &bull; University of Cambridge (PhD Candidate)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="secondary" href="/admin/integrity" size="sm">
                Integrity Log
              </Button>
              <Button
                variant="accent"
                size="sm"
                onClick={() => alert(`Status for ${id} synchronized.`)}
              >
                Sync with Portal
              </Button>
            </div>
          </div>
        </div>

        {savedNotice && (
          <div className="p-3 bg-success/10 border border-success/30 rounded-[2px] text-xs font-sans text-tone-heading">
            Changes saved successfully. Mentor allocations and milestone updates pushed to candidate workspace.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column (2 cols): Brief Content and Milestones */}
          <div className="lg:col-span-2 space-y-6">
            <Card background="white" className="border-tone-rule shadow-2xs">
              <CardHeader className="pb-3 border-b border-tone-rule">
                <CardTitle className="font-serif text-base text-tone-heading">
                  Research Specification and Scope
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-xs font-sans">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-tone-muted font-semibold block mb-1">
                    Problem Statement and Methodology
                  </span>
                  <p className="text-tone-body leading-relaxed bg-paper p-3 rounded-[2px] border border-tone-rule">
                    The research models maternal health clinic accessibility across 44 rural primary health centers using a cross-sectional quasi-experimental framework. Needs validation of propensity score matching equations and logistical regression modeling.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-tone-muted font-semibold block mb-1">
                      Academic Discipline
                    </span>
                    <span className="font-medium text-tone-heading">Health Sciences and Biostatistics</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-tone-muted font-semibold block mb-1">
                      Target Software
                    </span>
                    <span className="font-medium text-tone-heading">SPSS, R, SmartPLS</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Milestones Plan */}
            <Card background="white" className="border-tone-rule shadow-2xs">
              <CardHeader className="pb-3 border-b border-tone-rule">
                <CardTitle className="font-serif text-base text-tone-heading">
                  Advisory Milestones and Deliverables
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {[
                  { title: "Milestone 1: Sampling Strategy Review", status: "completed", date: "Oct 29, 2026" },
                  { title: "Milestone 2: Data Cleaning and Normality Testing", status: "completed", date: "Nov 05, 2026" },
                  { title: "Milestone 3: Multivariate Regression and Propensity Matching", status: "in_progress", date: "Nov 24, 2026" },
                  { title: "Milestone 4: Findings Interpretation and Defense Briefing", status: "pending", date: "Dec 10, 2026" },
                ].map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-paper border border-tone-rule rounded-[2px] flex items-center justify-between text-xs font-sans"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2
                        className={`w-4 h-4 ${
                          m.status === "completed"
                            ? "text-emerald-600"
                            : m.status === "in_progress"
                            ? "text-gold"
                            : "text-stone-300"
                        }`}
                      />
                      <span className="font-medium text-tone-heading">{m.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-stone-400 text-[11px]">{m.date}</span>
                      <Badge variant={m.status === "completed" ? "success" : m.status === "in_progress" ? "warning" : "default"}>
                        {m.status === "completed" ? "Completed" : m.status === "in_progress" ? "Active" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Column (1 col): Mentor Assignment and Internal Notes */}
          <div className="space-y-6">
            <Card background="white" className="border-tone-rule shadow-2xs">
              <CardHeader className="pb-3 border-b border-tone-rule">
                <CardTitle className="font-serif text-base text-tone-heading">
                  Mentor Allocation
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <form onSubmit={handleSave} className="space-y-3 text-xs font-sans">
                  <div>
                    <label className="block text-[11px] font-semibold text-tone-muted uppercase tracking-wider mb-1">
                      Assigned Faculty Mentor
                    </label>
                    <select
                      value={mentor}
                      onChange={(e) => setMentor(e.target.value)}
                      className="w-full h-9 px-2.5 bg-paper border border-tone-rule rounded-[2px] text-tone-heading focus:outline-none focus:border-gold"
                    >
                      <option value="Dr. Eleanor Vance">Dr. Eleanor Vance (Biostatistics)</option>
                      <option value="Dr. Alex Taylor">Dr. Alex Taylor (Applied Econometrics)</option>
                      <option value="Dr. Heather Wright">Dr. Heather Wright (Literature)</option>
                      <option value="Dr. Marcus King">Dr. Marcus King (Qualitative)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-tone-muted uppercase tracking-wider mb-1">
                      Brief Operational Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full h-9 px-2.5 bg-paper border border-tone-rule rounded-[2px] text-tone-heading focus:outline-none focus:border-gold"
                    >
                      <option value="active">Active Advisory</option>
                      <option value="in_scoping">Under Scoping</option>
                      <option value="completed">Completed and Archival</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-tone-muted uppercase tracking-wider mb-1">
                      Internal Operations Notes
                    </label>
                    <textarea
                      rows={4}
                      value={internalNotes}
                      onChange={(e) => setInternalNotes(e.target.value)}
                      className="w-full p-2.5 bg-paper border border-tone-rule rounded-[2px] text-tone-heading focus:outline-none focus:border-gold text-xs leading-relaxed"
                    />
                  </div>

                  <Button variant="accent" size="sm" type="submit" className="w-full">
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="p-4 bg-paper rounded-[4px] border border-tone-rule text-xs font-sans space-y-2">
              <span className="font-semibold text-navy block flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-gold" />
                Academic Integrity Certification
              </span>
              <p className="text-stone-500 text-[11px] leading-relaxed">
                Advisory strictly adheres to zero-ghostwriting policy. Mentors must review student-authored manuscripts and provide annotations only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

