"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Building,
  UserCheck,
  ExternalLink,
  MessageSquare,
  ArrowRight,
  Send,
} from "lucide-react";

interface MilestoneReview {
  chapter: string;
  wordCount: number;
  similarity: string;
  mentorSignOff: string;
  status: "approved" | "in_review";
  supervisorConcurrence: boolean;
}

export default function SupervisorPortalPage() {
  const { showToast } = useToast();
  const [concurrenceGiven, setConcurrenceGiven] = useState(false);
  const [departmentNote, setDepartmentNote] = useState("");

  const [milestones, setMilestones] = useState<MilestoneReview[]>([
    {
      chapter: "Chapter 1: Problem Statement & Epidemiological Hypotheses",
      wordCount: 10250,
      similarity: "3% (Compliant)",
      mentorSignOff: "Approved by Dr. Eleanor Vance (Oct 28, 2026)",
      status: "approved",
      supervisorConcurrence: true,
    },
    {
      chapter: "Chapter 2: Literature Review & Conceptual Synthesis Matrix",
      wordCount: 18450,
      similarity: "5% (Compliant)",
      mentorSignOff: "Approved by Dr. Eleanor Vance (Nov 02, 2026)",
      status: "approved",
      supervisorConcurrence: true,
    },
    {
      chapter: "Chapter 3: Research Methodology & Propensity Score Matching Protocol",
      wordCount: 14320,
      similarity: "4% (Compliant)",
      mentorSignOff: "Active Review by Dr. Eleanor Vance (Nov 20, 2026)",
      status: "in_review",
      supervisorConcurrence: false,
    },
  ]);

  const handleConcur = () => {
    setConcurrenceGiven(true);
    showToast(
      "Official University Supervisor Concurrence recorded. Departmental registry transmittal generated.",
      "success"
    );
  };

  const handleSaveNote = () => {
    if (!departmentNote.trim()) return;
    showToast("Departmental supervisory note transmitted to candidate and GradEdge faculty mentor.", "info");
    setDepartmentNote("");
  };

  const handleDownloadDossier = () => {
    showToast("Generating Complete Doctoral Advisory Dossier (.ZIP with Turnitin certificates)...", "success");
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col text-tone-body">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-tone-rule px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo variant="full" href="/" />
          <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-tone-rule text-xs font-sans">
            <Badge variant="outline" className="text-navy border-navy/30 bg-navy/5">
              University Supervisor Portal
            </Badge>
            <span className="text-stone-400">Department of Graduate Studies</span>
          </div>
        </div>

        {/* Quick Portal Switcher */}
        <div className="flex items-center gap-2 text-xs font-sans">
          <span className="text-stone-400 hidden md:inline">Switch Workspace:</span>
          <Link
            href="/student"
            className="px-2.5 py-1 bg-paper border border-tone-rule rounded-[2px] text-stone-700 hover:text-navy hover:border-navy transition-colors"
          >
            Student
          </Link>
          <Link
            href="/mentor"
            className="px-2.5 py-1 bg-paper border border-tone-rule rounded-[2px] text-stone-700 hover:text-navy hover:border-navy transition-colors"
          >
            Faculty Mentor
          </Link>
          <Link
            href="/admin"
            className="px-2.5 py-1 bg-paper border border-tone-rule rounded-[2px] text-stone-700 hover:text-navy hover:border-navy transition-colors"
          >
            Admin
          </Link>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Scholar Overview Banner */}
        <div className="p-6 bg-white rounded-[2px] border border-tone-rule shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-gold block">
                Doctoral Candidate Dossier &bull; Supervisory Concurrence
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-medium text-tone-heading">
                Freedom Sola
              </h1>
              <p className="text-xs text-stone-500 font-sans">
                PhD in Public Health &amp; Epidemiology &bull; Cambridge Institute of Public Health
              </p>
              <p className="font-serif text-sm text-stone-800 pt-1 leading-snug">
                Thesis: &ldquo;Epidemiological Analysis of Maternal Health Access in Sub-Saharan Rural Districts&rdquo;
              </p>
            </div>

            <div className="flex sm:flex-col items-start sm:items-end gap-2 shrink-0">
              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase text-stone-400 block font-sans">
                  Assigned GradEdge Mentor
                </span>
                <span className="font-serif font-bold text-sm text-navy">
                  Dr. Eleanor Vance
                </span>
                <span className="text-[10px] text-stone-500 block">
                  Methodology &amp; Biostatistics
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadDossier}
                className="mt-1"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                Download Complete Dossier (.ZIP)
              </Button>
            </div>
          </div>

          {/* Academic Integrity Bar */}
          <div className="pt-4 border-t border-tone-rule flex flex-wrap items-center justify-between text-xs font-sans text-stone-600 gap-2">
            <span className="flex items-center gap-1.5 text-emerald-800 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified Non-Ghostwriting Compliance &bull; All Work Authored Solely by Candidate
            </span>
            <span className="text-[11px] text-stone-500">
              Target Defense Date: <strong>May 2027</strong>
            </span>
          </div>
        </div>

        {/* Milestone Review Matrix */}
        <Card className="bg-white border-tone-rule">
          <CardHeader className="border-b border-tone-rule pb-4">
            <CardTitle className="font-serif text-base text-tone-heading">
              Chapter Milestones &amp; Advisory Redline Audit
            </CardTitle>
            <p className="text-xs text-stone-500 font-sans">
              Review certified faculty feedback, Turnitin similarity records, and register departmental concurrence.
            </p>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full min-w-[650px] text-xs font-sans text-left">
              <thead className="bg-paper border-b border-tone-rule text-stone-500 uppercase tracking-wide text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Dissertation Chapter</th>
                  <th className="py-3 px-4 font-semibold">Word Count</th>
                  <th className="py-3 px-4 font-semibold">Integrity Index</th>
                  <th className="py-3 px-4 font-semibold">GradEdge Mentor Sign-Off</th>
                  <th className="py-3 px-4 font-semibold text-right">University Concurrence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tone-rule">
                {milestones.map((m, idx) => (
                  <tr key={idx} className="hover:bg-paper/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-stone-800 max-w-sm">
                      {m.chapter}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">
                      {m.wordCount.toLocaleString()} words
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        {m.similarity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-700">
                      {m.mentorSignOff}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {m.supervisorConcurrence || (idx === 2 && concurrenceGiven) ? (
                        <Badge variant="outline" className="text-[10px] text-emerald-800 border-emerald-300 bg-emerald-50">
                          Concurrence Recorded
                        </Badge>
                      ) : (
                        <Button
                          variant="accent"
                          size="sm"
                          onClick={handleConcur}
                        >
                          Concur
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Departmental Advisory Notes Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white border-tone-rule">
            <CardHeader className="pb-3 border-b border-tone-rule">
              <CardTitle className="font-serif text-sm text-tone-heading">
                Departmental Supervisory Notes &amp; Committee Direction
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs font-sans">
              <textarea
                rows={4}
                placeholder="Leave official supervisory comments or university registry requirements for candidate and GradEdge advisory faculty..."
                value={departmentNote}
                onChange={(e) => setDepartmentNote(e.target.value)}
                className="w-full p-2.5 bg-paper border border-stone-200 rounded-[2px] focus:outline-hidden focus:border-gold leading-relaxed"
              />
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={handleSaveNote}>
                  <Send className="w-3.5 h-3.5 mr-1" />
                  Transmit Advisory Note
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-paper border-tone-rule">
            <CardHeader className="pb-2">
              <CardTitle className="font-serif text-sm text-tone-heading">
                University Supervisor Information &amp; Ethics Guarantee
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2 text-xs font-sans text-stone-600 leading-relaxed">
              <p>
                GradEdge acts in direct alignment with university advisory standards. Mentors provide editorial critique, methodological verification, and defense preparation. All original intellectual inquiry and prose generation remains 100% the candidate&apos;s own.
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500">
                <span>Accreditation Code: <strong>UKRI-DTP-2026</strong></span>
                <a href="/integrity" className="text-gold font-medium hover:underline">
                  View Ethics Charter &rarr;
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

