"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Lock,
  AlertTriangle,
  Scale,
  Award,
  ExternalLink,
} from "lucide-react";

export default function MentorIntegrityPage() {
  const { showToast } = useToast();
  const [pledgeSigned, setPledgeSigned] = useState(true);

  const handleReaffirmPledge = () => {
    setPledgeSigned(true);
    showToast(
      "Faculty Academic Honor Pledge re-affirmed. Digital timestamp recorded for 2026-2027 academic year.",
      "success"
    );
  };

  return (
    <DashboardShell
      role="mentor"
      title="Academic Integrity"
      user={{
        id: "mentor-101",
        name: "Dr. Eleanor Vance",
        email: "e.vance@gradedge.org",
        institution: "Senior Faculty Mentor",
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-tone-rule pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-medium text-tone-heading">
              Faculty Code of Ethics &amp; Academic Integrity
            </h2>
            <p className="text-xs text-tone-muted mt-1">
              GradEdge strictly enforces ethical academic coaching. Mentors never write, fabricate, or complete candidate dissertations.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs text-emerald-800 border-emerald-300 bg-emerald-50 py-1 px-2.5">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600 inline" />
              Verified Faculty Pledge (Active)
            </Badge>
          </div>
        </div>

        {/* Status Callout Banner */}
        <div className="p-4 bg-paper rounded-[2px] border border-gold/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-gold shrink-0 mt-0.5" />
            <div>
              <span className="font-serif font-bold text-sm text-tone-heading block">
                2026 Faculty Honor Certification &bull; Validated
              </span>
              <p className="text-xs text-stone-600 font-sans">
                Digitally confirmed by Dr. Eleanor Vance on October 12, 2026. Audit token: <code className="text-navy bg-white px-1.5 py-0.5 rounded-[2px] border border-tone-rule text-[11px]">ETH-9921-VCE</code>
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleReaffirmPledge}>
            Re-Affirm Pledge
          </Button>
        </div>

        {/* 5 Core Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-white border-tone-rule">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-navy-deep text-gold text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <CardTitle className="font-serif text-base text-tone-heading">
                  Strict Non-Ghostwriting Principle
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-xs text-stone-600 font-sans space-y-2 leading-relaxed">
              <p>
                Mentors provide developmental commentary, structural auditing, methodological advice, and editorial redlining. Mentors are expressly forbidden from penning candidate paragraphs, drafting discussion sections, or calculating primary findings on behalf of the scholar.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-tone-rule">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-navy-deep text-gold text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <CardTitle className="font-serif text-base text-tone-heading">
                  Empirical Reproducibility &amp; Transparency
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-xs text-stone-600 font-sans space-y-2 leading-relaxed">
              <p>
                All quantitative coaching requires verifiable code (R, Stata, Python, SPSS syntax) and raw data logs. Mentors never invent, fabricate, or p-hack statistical outcomes to satisfy committee expectations.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-tone-rule">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-navy-deep text-gold text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <CardTitle className="font-serif text-base text-tone-heading">
                  Absolute Doctoral Confidentiality
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-xs text-stone-600 font-sans space-y-2 leading-relaxed">
              <p>
                All research proposals, unpublished datasets, and unexamined chapter drafts remain the exclusive intellectual property of the doctoral researcher. Mentors never share or duplicate candidate material outside the secure GradEdge workspace.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-tone-rule">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-navy-deep text-gold text-xs font-bold flex items-center justify-center">
                  4
                </span>
                <CardTitle className="font-serif text-base text-tone-heading">
                  Conflict-of-Interest Disclosures
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-xs text-stone-600 font-sans space-y-2 leading-relaxed">
              <p>
                Mentors must promptly declare any institutional or supervisory connection to assigned candidates. A mentor cannot evaluate a student from their own degree-awarding department or external examiner panel.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Ombudsman Contact & Escalation */}
        <Card className="bg-paper border-tone-rule">
          <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-serif font-semibold text-sm text-tone-heading block">
                Academic Ombudsman &amp; Ethics Escalation Channel
              </span>
              <p className="text-xs text-stone-600 font-sans max-w-xl">
                If a candidate requests ghostwriting, data fabrication, or violations of university guidelines, faculty mentors have a protected right to pause the project and notify the Academic Ombudsman immediately.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => showToast("Ethics confidential inquiry portal opened.", "info")}
            >
              Report Integrity Issue
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

