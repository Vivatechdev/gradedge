"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  FileCheck,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Send,
  Calendar,
  Award,
  Filter,
} from "lucide-react";

interface AcceleratorApplication {
  id: string;
  applicantName: string;
  email: string;
  targetUniversity: string;
  fieldOfStudy: string;
  thesisTopic: string;
  proposedCohort: string;
  evaluationScore: number;
  status: "under_review" | "interview_scheduled" | "offer_extended" | "waitlisted";
  submittedDate: string;
}

const APPLICATIONS: AcceleratorApplication[] = [
  {
    id: "app-501",
    applicantName: "Oluwaseun Adeleke",
    email: "o.adeleke@postgrad.ox.ac.uk",
    targetUniversity: "University of Oxford",
    fieldOfStudy: "Computational Genomics and Epigenetics",
    thesisTopic: "Machine Learning Predictors of Polygenic Risk Scores in Under-Sampled African Cohorts",
    proposedCohort: "Winter 2026 Doctoral Cohort",
    evaluationScore: 92,
    status: "interview_scheduled",
    submittedDate: "Nov 18, 2026",
  },
  {
    id: "app-502",
    applicantName: "Marcus Sterling",
    email: "m.sterling@warwick.ac.uk",
    targetUniversity: "Warwick Business School",
    fieldOfStudy: "Behavioral Finance and Market Microstructure",
    thesisTopic: "High-Frequency Algorithmic Order Flow Toxicity During Central Bank Rate Announcements",
    proposedCohort: "Winter 2026 Doctoral Cohort",
    evaluationScore: 88,
    status: "under_review",
    submittedDate: "Nov 19, 2026",
  },
  {
    id: "app-503",
    applicantName: "Fatima Zahra",
    email: "f.zahra@kcl.ac.uk",
    targetUniversity: "King's College London",
    fieldOfStudy: "Global Health Policy and Health Economics",
    thesisTopic: "Cost-Effectiveness Evaluations of Universal Health Coverage Rollouts in Low-Income Federations",
    proposedCohort: "Winter 2026 Doctoral Cohort",
    evaluationScore: 95,
    status: "offer_extended",
    submittedDate: "Nov 14, 2026",
  },
  {
    id: "app-504",
    applicantName: "David Thornton",
    email: "d.thornton@ed.ac.uk",
    targetUniversity: "University of Edinburgh",
    fieldOfStudy: "Environmental Law and Policy",
    thesisTopic: "Extraterritorial Jurisdiction and Corporate Climate Due Diligence Under European Directives",
    proposedCohort: "Winter 2026 Doctoral Cohort",
    evaluationScore: 79,
    status: "waitlisted",
    submittedDate: "Nov 10, 2026",
  },
];

export default function AdminApplicationsPage() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredApps = APPLICATIONS.filter((a) => {
    const matchesSearch =
      a.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.thesisTopic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.targetUniversity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleIssueOffer = (name: string) => {
    showToast(`Formal 9-Month Accelerator Offer extended to ${name}. Welcome kit and enrollment contract dispatched.`, "success");
  };

  const handleScheduleInterview = (name: string) => {
    showToast(`Admissions Interview with Senior Faculty panel booked for ${name}.`, "info");
  };

  return (
    <DashboardShell
      role="admin"
      title="Admissions Desk"
      user={{
        id: "admin-1",
        name: "System Administrator",
        email: "admin@gradedge.org",
        institution: "GradEdge Operations",
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-tone-rule pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-medium text-tone-heading">
              9-Month Doctoral Accelerator Admissions Desk
            </h2>
            <p className="text-xs text-tone-muted mt-1">
              Candidate proposal review, admissions panel scoring, and cohort capacity allocation.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-[2px] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Winter 2026 Cohort: 8 Seats Remaining
            </span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 border border-tone-rule rounded-[2px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search applicants, proposed topics, universities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-paper border border-stone-200 rounded-[2px] focus:outline-hidden focus:border-gold"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {["all", "under_review", "interview_scheduled", "offer_extended", "waitlisted"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`text-xs px-3 py-1.5 rounded-[2px] capitalize whitespace-nowrap font-medium transition-colors ${
                  statusFilter === st
                    ? "bg-navy-deep text-white font-semibold"
                    : "bg-paper text-stone-600 hover:bg-stone-100 border border-tone-rule"
                }`}
              >
                {st === "all" ? "All Applicants (4)" : st.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApps.map((app) => (
            <Card key={app.id} className="bg-white border-tone-rule">
              <CardContent className="p-5 space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-serif text-lg font-bold text-tone-heading">
                        {app.applicantName}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {app.targetUniversity}
                      </Badge>
                      {app.status === "offer_extended" && (
                        <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-300 bg-emerald-50">
                          Offer Extended
                        </Badge>
                      )}
                      {app.status === "interview_scheduled" && (
                        <Badge variant="gold" className="text-[10px]">
                          Interview Scheduled
                        </Badge>
                      )}
                      {app.status === "under_review" && (
                        <Badge variant="default" className="text-[10px]">
                          Under Committee Review
                        </Badge>
                      )}
                      {app.status === "waitlisted" && (
                        <span className="text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded-[2px]">
                          Waitlisted
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 font-sans">
                      Discipline: <strong className="text-navy">{app.fieldOfStudy}</strong> &bull; Applied: {app.submittedDate}
                    </p>
                    <p className="text-sm font-serif text-stone-800 pt-1 leading-snug">
                      &ldquo;{app.thesisTopic}&rdquo;
                    </p>
                  </div>

                  <div className="flex sm:flex-col lg:items-end gap-2 shrink-0">
                    <div className="text-right sm:mb-1">
                      <span className="text-[10px] uppercase text-stone-400 block font-sans">
                        Proposal Score
                      </span>
                      <span className="font-serif font-bold text-xl text-navy">
                        {app.evaluationScore} / 100
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleScheduleInterview(app.applicantName)}
                      >
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        Interview
                      </Button>
                      <Button
                        variant="accent"
                        size="sm"
                        onClick={() => handleIssueOffer(app.applicantName)}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Issue Offer
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-tone-rule/60 flex items-center justify-between text-xs font-sans text-stone-500">
                  <span>Target Enrollment: <strong>{app.proposedCohort}</strong></span>
                  <a
                    href={`mailto:${app.email}`}
                    className="text-gold font-medium hover:underline text-[11px]"
                  >
                    Contact Applicant ({app.email}) &rarr;
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

