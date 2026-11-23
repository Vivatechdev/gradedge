"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useStudent } from "@/components/layout/student-context";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Clock,
} from "lucide-react";

const SERVICES = [
  { id: "dissertation-thesis-mentoring", title: "Full Dissertation / Thesis Mentoring" },
  { id: "topic-proposal-development", title: "Topic Framing and Proposal Architecture" },
  { id: "literature-review-support", title: "Literature Review Synthesis and Matrix" },
  { id: "data-analysis", title: "Quantitative and Qualitative Data Analysis (R, SPSS, Python)" },
  { id: "defense-preparation", title: "Oral Defense and mock defense Coaching" },
  { id: "editing-and-writing-quality", title: "Academic Proofreading and Structural Edit" },
];

export default function NewSupportRequestPage() {
  const student = useStudent();
  const { toast } = useToast();

  const [serviceId, setServiceId] = useState(SERVICES[0].id);
  const [title, setTitle] = useState("");
  const [brief, setBrief] = useState("");
  const [deadline, setDeadline] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || brief.trim().length < 20) {
      toast({
        title: "Validation Incomplete",
        message: "Please provide a clear title and a brief description (at least 20 characters).",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/student/support-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: serviceId,
          title: title.trim(),
          brief: brief.trim(),
          deadline: deadline || undefined,
          file_name: file ? file.name : undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to submit support request.");
      }

      setProjectId(json.projectId);
      setSubmitted(true);
      toast({
        title: "Request Submitted",
        message: "Your academic support request has been registered.",
        type: "success",
      });
    } catch (err: any) {
      toast({ title: "Submission Error", message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardShell
      role="student"
      title="Request Academic Support"
      user={{
        name: student.name,
        email: student.email,
        institution: student.institution,
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {submitted ? (
          /* Confirmation Screen in 3 Plain Steps */
          <div className="bg-white border border-tone-rule rounded-[2px] p-6 sm:p-8 space-y-6 text-center shadow-xs">
            <div className="w-12 h-12 bg-success/10 border border-success/30 rounded-[2px] flex items-center justify-center mx-auto text-success">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <span className="type-micro text-gold">Request Received</span>
              <h1 className="font-serif text-2xl font-medium text-tone-heading">
                Your Support Request Has Been Logged
              </h1>
              <p className="text-xs text-tone-muted leading-relaxed max-w-md mx-auto">
                Reference ID: <strong className="font-mono text-tone-heading">{projectId}</strong>
              </p>
            </div>

            {/* 3 Plain Steps */}
            <div className="bg-paper p-5 border border-tone-rule rounded-[2px] text-left space-y-4">
              <span className="text-[10px] uppercase font-mono tracking-wider text-tone-muted block border-b border-tone-rule pb-2">
                What Happens Next (Three Steps)
              </span>

              <div className="space-y-3.5 text-xs text-tone-body">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-navy text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-tone-heading">
                      Desk Review within 24 Hours
                    </h4>
                    <p className="text-tone-muted text-[11px] leading-relaxed">
                      Our academic coordination desk evaluates your thesis topic, research design questions, and methodology scope.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-navy text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-tone-heading">
                      Mentor Allocation and Scope Plan
                    </h4>
                    <p className="text-tone-muted text-[11px] leading-relaxed">
                      We match you with a faculty advisor specialized in your specific discipline and quantitative/qualitative tools (SPSS, R, Stata, NVivo).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-navy text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-tone-heading">
                      Milestone Commencement in Workspace
                    </h4>
                    <p className="text-tone-muted text-[11px] leading-relaxed">
                      Your chapter deliverables and milestone timeline unlock directly in your student portal with scheduled feedback cycles.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Button variant="accent" href={`/student/projects/${projectId || ""}`} size="md">
                <span>View Project in Workspace</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
              <Button variant="secondary" href="/student" size="md">
                Return to Overview
              </Button>
            </div>
          </div>
        ) : (
          /* Intake Form */
          <div className="bg-white border border-tone-rule rounded-[2px] p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-tone-rule pb-4 space-y-1">
              <span className="type-micro text-gold">Advisory Desk</span>
              <h1 className="font-serif text-2xl font-medium text-tone-heading">
                Request Research Mentoring Support
              </h1>
              <p className="text-xs text-tone-muted leading-relaxed">
                Describe the chapter, methodological model, or defense milestone where you require developmental critique.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              {/* Service Selection */}
              <div className="space-y-1">
                <label className="font-semibold text-tone-heading block">
                  Select Focus Area
                </label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-white border border-tone-rule rounded-[2px] text-tone-heading focus:outline-none focus:border-navy"
                >
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label htmlFor="reqTitle" className="font-semibold text-tone-heading block">
                  Request Headline / Manuscript Chapter
                </label>
                <input
                  id="reqTitle"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Chapter 3: Hierarchical Regression and Factor Analysis Validation"
                  className="w-full h-10 px-3 text-xs bg-white border border-tone-rule rounded-[2px] focus:outline-none focus:border-navy"
                />
              </div>

              {/* Brief */}
              <div className="space-y-1">
                <label htmlFor="reqBrief" className="font-semibold text-tone-heading block">
                  Detailed Description of Support Needed
                </label>
                <textarea
                  id="reqBrief"
                  required
                  rows={4}
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  placeholder="Explain your research questions, sample size, hypothesis testing, or specific conceptual blockers you want your advisor to examine..."
                  className="w-full p-3 text-xs bg-white border border-tone-rule rounded-[2px] focus:outline-none focus:border-navy leading-relaxed"
                />
                <span className="text-[10px] text-tone-muted">
                  Minimum 20 characters. Include current software tools or statistical packages.
                </span>
              </div>

              {/* Deadline */}
              <div className="space-y-1">
                <label htmlFor="reqDeadline" className="font-semibold text-tone-heading block">
                  Target Deadline / Submission Date (Optional)
                </label>
                <input
                  id="reqDeadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-white border border-tone-rule rounded-[2px] focus:outline-none focus:border-navy"
                />
              </div>

              {/* File Attachment */}
              <div className="space-y-1 pt-1">
                <label className="font-semibold text-tone-heading block">
                  Attach Draft Excerpt or Syntax File (Optional)
                </label>
                <div className="border border-dashed border-tone-rule rounded-[2px] p-4 text-center bg-paper/50 hover:bg-paper transition-colors">
                  <input
                    type="file"
                    id="supportFile"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.csv,.sav,.r,.py,.zip"
                  />
                  <label htmlFor="supportFile" className="cursor-pointer block space-y-1">
                    <UploadCloud className="w-5 h-5 text-tone-muted mx-auto" />
                    <span className="text-xs text-navy font-medium underline block">
                      {file ? file.name : "Select draft manuscript, data, or syntax file"}
                    </span>
                    <span className="text-[10px] text-tone-muted block">
                      Accepted: PDF, Word, CSV, SPSS (.sav), R, Python scripts, ZIP (max 25MB)
                    </span>
                  </label>
                </div>
              </div>

              {/* Academic Code of Integrity */}
              <div className="p-3 bg-paper border border-tone-rule rounded-[2px] flex items-start gap-2 text-[11px] text-tone-muted">
                <ShieldCheck className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>
                  All mentoring strictly respects university honor policies. We do not write dissertations for students; we teach you how to analyze, write, and defend them with rigor.
                </span>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  disabled={loading}
                  className="w-full font-semibold text-xs py-3"
                >
                  {loading ? "Transmitting Request..." : "Submit Support Request"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

