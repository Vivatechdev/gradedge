"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  Scale,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserCheck,
  CreditCard,
  MessageSquare,
  Search,
  Eye,
  ShieldAlert,
} from "lucide-react";

interface QualityEscalation {
  id: string;
  caseRef: string;
  candidateName: string;
  mentorName: string;
  chapter: string;
  issueCategory: "methodology_divergence" | "turnaround_delay" | "supervisor_realignment" | "scope_creep";
  issueLabel: string;
  priority: "high" | "medium" | "low";
  status: "open_triage" | "second_reader_assigned" | "mediation_scheduled" | "resolved";
  reportedDate: string;
  description: string;
}

const DISPUTES: QualityEscalation[] = [
  {
    id: "dsp-601",
    caseRef: "ESC-2026-092",
    candidateName: "Freedom Sola",
    mentorName: "Dr. Eleanor Vance",
    chapter: "Chapter 3: Methodology (Propensity Score Matching)",
    issueCategory: "supervisor_realignment",
    issueLabel: "Supervisor Committee Realignment",
    priority: "medium",
    status: "second_reader_assigned",
    reportedDate: "Nov 20, 2026",
    description: "Candidate's university supervisor requested adding an Instrumental Variables comparison alongside PSM. Seeking additional faculty econometrics reader to validate identification assumptions.",
  },
  {
    id: "dsp-602",
    caseRef: "ESC-2026-088",
    candidateName: "Chidi Okafor",
    mentorName: "Dr. Miriam Al-Hassan",
    chapter: "Chapter 2: Conceptual Framework",
    issueCategory: "scope_creep",
    issueLabel: "Scope and Thematic Depth Clarification",
    priority: "low",
    status: "open_triage",
    reportedDate: "Nov 19, 2026",
    description: "Candidate submitted 28,000 words instead of the scoped 15,000 word milestone. Requires agreement on whether to split into two separate review phases.",
  },
  {
    id: "dsp-603",
    caseRef: "ESC-2026-081",
    candidateName: "Khadija Umar",
    mentorName: "Prof. Arthur Pendelton",
    chapter: "Chapter 4: Econometric Empirical Tables",
    issueCategory: "turnaround_delay",
    issueLabel: "SLA Turnaround Extension Request",
    priority: "high",
    status: "resolved",
    reportedDate: "Nov 12, 2026",
    description: "Complex dynamic GMM replication log required 12-hour review extension. Candidate notified; courtesy £100 milestone voucher applied.",
  },
];

export default function AdminDisputesPage() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDispute, setSelectedDispute] = useState<QualityEscalation>(DISPUTES[0]);

  const handleAssignSecondReader = () => {
    showToast(
      `Second Senior Faculty Reader (Prof. Arthur Pendelton) assigned to case ${selectedDispute.caseRef}.`,
      "success"
    );
  };

  const handleIssueVoucher = () => {
    showToast(
      `Courtesy milestone credit voucher issued to ${selectedDispute.candidateName}.`,
      "info"
    );
  };

  const handleResolve = () => {
    showToast(
      `Case ${selectedDispute.caseRef} marked as successfully resolved. Resolution statement archived.`,
      "success"
    );
  };

  return (
    <DashboardShell
      role="admin"
      title="Quality and Disputes"
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
              Quality Assurance and Revision Escalations
            </h2>
            <p className="text-xs text-tone-muted mt-1">
              Active triage desk for supervisory realignments, methodological second opinions, and SLA turnarounds.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-[2px] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              99.2% Dispute Resolution Rate
            </span>
          </div>
        </div>

        {/* 2-Column Incident Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Incidents Queue (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-tone-muted block">
              Active Escalation Queue
            </span>

            {DISPUTES.map((d) => {
              const isSelected = selectedDispute.id === d.id;
              return (
                <div
                  key={d.id}
                  onClick={() => setSelectedDispute(d)}
                  className={`p-4 rounded-[2px] border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-white border-gold shadow-xs ring-1 ring-gold/40"
                      : "bg-paper hover:bg-white border-tone-rule"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-mono text-[11px] text-stone-500 font-semibold">{d.caseRef}</span>
                    <Badge
                      variant={d.priority === "high" ? "gold" : "outline"}
                      className="text-[10px]"
                    >
                      {d.priority.toUpperCase()} PRIORITY
                    </Badge>
                  </div>
                  <p className="font-serif font-bold text-xs text-tone-heading leading-snug mb-1">
                    {d.issueLabel}
                  </p>
                  <p className="text-[11px] text-stone-500 font-sans line-clamp-2">
                    {d.candidateName} &bull; Mentor: {d.mentorName}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Incident Resolution Desk (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <Card className="bg-white border-tone-rule">
              <CardHeader className="border-b border-tone-rule pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px]">
                    Case Ref: {selectedDispute.caseRef}
                  </Badge>
                  <span className="text-xs text-stone-400 font-sans">
                    Reported: {selectedDispute.reportedDate}
                  </span>
                </div>
                <CardTitle className="font-serif text-lg text-tone-heading pt-2 leading-snug">
                  {selectedDispute.issueLabel}
                </CardTitle>
                <p className="text-xs text-stone-500 font-sans">
                  Candidate: <strong className="text-navy">{selectedDispute.candidateName}</strong> &bull; Mentor: <strong className="text-stone-800">{selectedDispute.mentorName}</strong>
                </p>
              </CardHeader>

              <CardContent className="p-5 space-y-5 text-xs font-sans">
                {/* Milestone Context */}
                <div className="p-3 bg-paper rounded-[2px] border border-tone-rule">
                  <span className="text-[11px] text-stone-400 block uppercase tracking-wide">
                    Affected Milestone
                  </span>
                  <span className="font-medium text-stone-800 block text-xs mt-0.5">
                    {selectedDispute.chapter}
                  </span>
                </div>

                {/* Case Narrative */}
                <div className="space-y-1.5">
                  <span className="font-semibold uppercase tracking-wider text-tone-heading text-[11px] block">
                    Escalation Notes and Committee Context:
                  </span>
                  <p className="p-3.5 bg-paper rounded-[2px] border border-tone-rule text-stone-700 leading-relaxed text-xs">
                    {selectedDispute.description}
                  </p>
                </div>

                {/* Triage Actions */}
                <div className="pt-4 border-t border-tone-rule space-y-3">
                  <span className="font-semibold uppercase tracking-wider text-tone-heading text-[11px] block">
                    Triage and Resolution Actions
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAssignSecondReader}
                    >
                      <UserCheck className="w-3.5 h-3.5 mr-1" />
                      Assign 2nd Faculty Reader
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleIssueVoucher}
                    >
                      <CreditCard className="w-3.5 h-3.5 mr-1" />
                      Issue Courtesy Voucher
                    </Button>
                    <Button
                      variant="accent"
                      size="sm"
                      onClick={handleResolve}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Mark Case Resolved
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

