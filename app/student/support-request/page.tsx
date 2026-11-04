"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";

const SERVICE_OPTIONS = [
  { id: "serv-1", name: "Methodology Design & Research Ethics", turnaround: "3-5 business days" },
  { id: "serv-2", name: "Quantitative Data Analysis & Model Diagnostics", turnaround: "3-5 business days" },
  { id: "serv-3", name: "Qualitative Data Analysis & Thematic Coding", turnaround: "5-7 business days" },
  { id: "serv-4", name: "Academic Editing & Line-Level Developmental Review", turnaround: "3-5 business days" },
  { id: "serv-5", name: "Defense Presentation Coaching & Viva Mock", turnaround: "1-2 weeks" },
  { id: "serv-6", name: "Journal Article Conversion & Peer Review Response", turnaround: "5-7 business days" },
];

export default function StudentSupportRequestPage() {
  const router = useRouter();

  const [serviceId, setServiceId] = useState(SERVICE_OPTIONS[0].id);
  const [title, setTitle] = useState("");
  const [brief, setBrief] = useState("");
  const [deadline, setDeadline] = useState("");
  const [files, setFiles] = useState<
    Array<{ file_name: string; bucket_path: string; size_bytes: number; mime_type: string }>
  >([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedProject, setSubmittedProject] = useState<{
    projectId: string;
    status: string;
    message: string;
  } | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedList = Array.from(e.target.files);
    const newFiles = selectedList.map((f) => ({
      file_name: f.name,
      bucket_path: `projects/uploads/${Date.now()}-${f.name}`,
      size_bytes: f.size,
      mime_type: f.type || "application/octet-stream",
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/student/support-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: serviceId,
          title,
          brief,
          deadline: deadline || undefined,
          files: files.length > 0 ? files : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit support request. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setSubmittedProject({
        projectId: data.projectId,
        status: data.status,
        message: data.message,
      });
    } catch {
      setError("Network error submitting support request. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardShell role="student">
      <div className="max-w-3xl mx-auto space-y-6 font-sans">
        {/* Header Breadcrumb & Heading */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-tone-muted">
            <Link href="/student" className="hover:text-navy">
              Dashboard
            </Link>
            <span>&rarr;</span>
            <span className="text-tone-heading font-medium">New Support Request</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-tone-heading">
            Submit a Support Request
          </h1>
          <p className="text-xs sm:text-sm text-tone-muted leading-relaxed">
            Upload your draft excerpt, chapter, or analysis file. An academic methodologist in your discipline will review the brief and provide written margin feedback.
          </p>
        </div>

        {/* Success Confirmation Card */}
        {submittedProject ? (
          <div className="bg-white border border-[#E4DFD5] rounded-[4px] p-8 text-center space-y-5 shadow-xs">
            <div className="w-12 h-12 bg-forest/10 text-forest border border-forest/30 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              &check;
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gold block">
                Status: Support Request Initiated
              </span>
              <h2 className="font-serif text-2xl font-semibold text-tone-heading">
                Support request submitted successfully
              </h2>
              <p className="text-xs sm:text-sm text-tone-muted max-w-lg mx-auto leading-relaxed">
                {submittedProject.message}
              </p>
            </div>

            <div className="p-4 bg-[#FAF8F4] border border-[#E4DFD5] rounded-[4px] max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-tone-muted">Support Request Reference:</span>
                <span className="font-mono text-navy font-semibold">{submittedProject.projectId.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-tone-muted">Initial Review Stage:</span>
                <span className="px-2 py-0.5 bg-gold/15 text-navy font-semibold rounded-[2px] text-[10px]">
                  Requested &bull; Scoping
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-4">
              <Link
                href="/student"
                className="px-6 py-2 bg-navy text-white text-xs font-semibold rounded-[4px] hover:bg-navy/90"
              >
                Return to Workspace
              </Link>
            </div>
          </div>
        ) : (
          /* Intake Form */
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#E4DFD5] rounded-[4px] p-6 sm:p-8 space-y-6 shadow-xs"
          >
            {error && (
              <div
                role="alert"
                className="p-3.5 bg-burgundy/10 border-l-2 border-burgundy rounded-[4px] text-xs text-burgundy font-medium"
              >
                {error}
              </div>
            )}

            {/* Service Choice */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="service" className="text-xs font-semibold text-tone-heading block">
                Select Service Area *
              </label>
              <select
                id="service"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full border border-[#E4DFD5] bg-paper px-3 py-2 text-xs sm:text-sm rounded-[4px] focus:outline-none focus:ring-1 focus:ring-gold"
              >
                {SERVICE_OPTIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.turnaround})
                  </option>
                ))}
              </select>
            </div>

            {/* Request Title */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="title" className="text-xs font-semibold text-tone-heading block">
                Support Request Title *
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Chapter 3 Quantitative Regression & Normality Audit"
                className="w-full border border-[#E4DFD5] bg-paper px-3 py-2 text-xs sm:text-sm rounded-[4px] focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>

            {/* Detailed Brief */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="brief" className="text-xs font-semibold text-tone-heading block">
                Describe What You Need Help With *
              </label>
              <textarea
                id="brief"
                rows={5}
                required
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="Describe the research questions, software syntax, committee concerns, or line-level questions you need your assigned mentor to address..."
                className="w-full border border-[#E4DFD5] bg-paper px-3 py-2 text-xs sm:text-sm rounded-[4px] focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>

            {/* Optional Deadline */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="deadline" className="text-xs font-semibold text-tone-heading block">
                Target Deadline (Optional)
              </label>
              <input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full sm:w-60 border border-[#E4DFD5] bg-paper px-3 py-2 text-xs sm:text-sm rounded-[4px] focus:outline-none focus:ring-1 focus:ring-gold"
              />
              <span className="text-[11px] text-tone-muted block">
                Helps your mentor prioritize line reviews ahead of committee submissions.
              </span>
            </div>

            {/* File Attachments */}
            <div className="space-y-2 text-left pt-2 border-t border-[#E4DFD5]">
              <label className="text-xs font-semibold text-tone-heading block">
                Attach Draft Files, Datasets, or Code Syntax (Optional)
              </label>
              <p className="text-[11px] text-tone-muted">
                Supported formats: PDF, DOCX, R, Python, SPSS (.sav), CSV, Stata (.dta). Confidential and covered by NDA.
              </p>

              <div className="border-2 border-dashed border-[#E4DFD5] rounded-[4px] p-5 text-center bg-[#FAF8F4] hover:border-gold transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-xs font-semibold text-navy hover:text-gold"
                >
                  Click to select files from your computer
                </label>
              </div>

              {files.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-semibold text-tone-muted block">
                    Attached Files ({files.length}):
                  </span>
                  <div className="space-y-1">
                    {files.map((f, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-paper border border-[#E4DFD5] rounded-[3px] text-xs"
                      >
                        <span className="font-mono text-tone-heading truncate max-w-xs sm:max-w-md">
                          {f.file_name} ({Math.round(f.size_bytes / 1024)} KB)
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="text-burgundy text-xs hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Academic Integrity Notice */}
            <div className="p-3.5 bg-[#FAF8F4] border border-[#E4DFD5] rounded-[4px] text-[11px] text-tone-muted leading-relaxed text-left">
              <strong>Support Request Protocol:</strong> Your mentor provides line-level critique, structural suggestions, and methodology coaching. Under our Academic Integrity Policy, we never write or replace your original research text.
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-between border-t border-[#E4DFD5]">
              <Link
                href="/student"
                className="text-xs text-tone-muted hover:text-navy font-medium"
              >
                &larr; Cancel and return to workspace
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2.5 bg-gold text-navy font-semibold text-xs sm:text-sm rounded-[4px] hover:bg-gold/90 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {isSubmitting ? "Submitting Support Request..." : "Submit Support Request &rarr;"}
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardShell>
  );
}

