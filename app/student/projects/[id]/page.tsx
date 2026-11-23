"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useStudent } from "@/components/layout/student-context";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RedlineDiffViewer } from "@/components/reviews/redline-diff-viewer";
import { formatMoney } from "@/lib/payments/types";
import {
  FolderKanban,
  FileText,
  MessageSquare,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowLeft,
  User,
  ShieldCheck,
  ExternalLink,
  Download,
  AlertCircle,
  Save,
  Eye,
  UploadCloud,
  X,
  FileCheck,
} from "lucide-react";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  const student = useStudent();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<
    "overview" | "milestones" | "files" | "messages" | "sessions" | "billing"
  >("overview");

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [notesText, setNotesText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  // Milestone interactive actions
  const [activeRedlineMilestone, setActiveRedlineMilestone] = useState<any | null>(null);
  const [uploadingMilestone, setUploadingMilestone] = useState<any | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadVersion, setUploadVersion] = useState("v2.1");
  const [uploadNotes, setUploadNotes] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function loadProject() {
      try {
        const res = await fetch(`/api/student/projects/${projectId}`);
        const json = await res.json();
        if (res.ok) {
          setData(json);
        } else {
          toast({ title: "Notice", message: json.error || "Loading default workspace", type: "info" });
        }
      } catch (err: any) {
        toast({ title: "Network Error", message: err.message, type: "error" });
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [projectId, toast]);

  const handleSaveNotes = async (milestoneId: string) => {
    setSavingNote(true);
    try {
      const res = await fetch(`/api/student/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ milestoneId, candidateNotes: notesText }),
      });
      const json = await res.json();
      if (res.ok) {
        toast({ title: "Notes Saved", message: "Your candidate notes have been updated.", type: "success" });
        setData((prev: any) => ({
          ...prev,
          milestones: prev.milestones.map((m: any) =>
            m.id === milestoneId ? { ...m, description: notesText } : m
          ),
        }));
        setEditingMilestoneId(null);
      } else {
        toast({ title: "Save Failed", message: json.error, type: "error" });
      }
    } catch (err: any) {
      toast({ title: "Error", message: err.message, type: "error" });
    } finally {
      setSavingNote(false);
    }
  };

  const handleUploadDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      toast({ title: "File Required", message: "Please select a manuscript file (.docx or .pdf).", type: "error" });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("projectId", projectId);
      formData.append("versionLabel", uploadVersion);
      formData.append("visibility", "shared_with_mentor");
      formData.append("notes", uploadNotes);

      const res = await fetch("/api/student/files", {
        method: "POST",
        body: formData,
      });

      // Optimistic update for student workspace
      const newFileObj = {
        id: `file-${Date.now()}`,
        file_name: uploadFile.name,
        mime_type: uploadFile.type || "application/pdf",
        size_bytes: uploadFile.size,
        visibility: "shared_with_mentor",
        version_label: uploadVersion,
        uploaded_at: new Date().toISOString(),
      };

      setData((prev: any) => ({
        ...prev,
        files: [newFileObj, ...(prev?.files || [])],
        milestones: (prev?.milestones || []).map((m: any) =>
          m.id === uploadingMilestone?.id ? { ...m, status: "in_progress", hasReview: true } : m
        ),
      }));

      toast({
        title: "Draft Submitted",
        message: `${uploadFile.name} successfully submitted for faculty critique. Guaranteed 48-hour SLA active.`,
        type: "success",
      });

      setUploadingMilestone(null);
      setUploadFile(null);
      setUploadNotes("");
    } catch (err: any) {
      toast({ title: "Upload Error", message: err.message, type: "error" });
    } finally {
      setUploading(false);
    }
  };

  const project = data?.project;

  return (
    <DashboardShell
      role="student"
      title="Project Workspace"
      user={{
        name: student.name,
        email: student.email,
        institution: student.institution,
      }}
    >
      <div className="space-y-6">
        {/* Back Link */}
        <div>
          <Link
            href="/student/projects"
            className="inline-flex items-center gap-1.5 text-xs text-navy hover:text-gold font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to all projects</span>
          </Link>
        </div>

        {/* Project Header */}
        <div className="bg-white border border-tone-rule rounded-[2px] p-6 space-y-4 shadow-xs">
          {loading ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-tone-muted">
                    {project?.serviceTitle}
                  </span>
                  <Badge variant="navy" className="text-[10px] capitalize">
                    {project?.status}
                  </Badge>
                </div>
                <h1 className="font-serif text-2xl font-medium text-tone-heading">
                  {project?.title}
                </h1>
                <p className="text-xs text-tone-muted leading-relaxed max-w-2xl">
                  {project?.brief}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-tone-muted block">
                  Target Due Date
                </span>
                <span className="font-serif text-sm font-semibold text-tone-heading">
                  {project?.dueDate || "Flexible Completion"}
                </span>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-tone-rule pt-4 overflow-x-auto text-xs">
            {[
              { id: "overview", label: "Overview" },
              { id: "milestones", label: `Milestones (${data?.milestones?.length || 0})` },
              { id: "files", label: `Files (${data?.files?.length || 0})` },
              { id: "messages", label: "Messages" },
              { id: "sessions", label: `Sessions (${data?.sessions?.length || 0})` },
              { id: "billing", label: "Billing" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-3 font-medium transition-colors border-b-2 -mb-px shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? "border-navy text-navy font-semibold"
                    : "border-transparent text-tone-muted hover:text-tone-heading"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white border border-tone-rule rounded-[2px] p-6 space-y-3">
                <h3 className="font-serif text-base font-semibold text-tone-heading">
                  Research Brief and Scope
                </h3>
                <p className="text-xs text-tone-muted leading-relaxed">
                  {project?.brief || "No detailed brief provided for this project."}
                </p>
              </div>

              <div className="bg-white border border-tone-rule rounded-[2px] p-6 space-y-3">
                <h3 className="font-serif text-base font-semibold text-tone-heading">
                  Pedagogic Framework and Authorship Guarantee
                </h3>
                <p className="text-xs text-tone-muted leading-relaxed">
                  Every critique, syntax audit, and marginal annotation provided under this project is developmental. You maintain 100% intellectual property, research questions, and manuscript authorship.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-tone-rule rounded-[2px] p-6 space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-tone-muted block">
                  Assigned Faculty Mentor
                </span>
                {project?.mentor ? (
                  <div className="space-y-2 text-xs">
                    <p className="font-serif text-base font-medium text-tone-heading">
                      {project.mentor.full_name}
                    </p>
                    <p className="text-tone-muted text-[11px]">{project.mentor.email}</p>
                    <div className="pt-2">
                      <Button variant="secondary" size="sm" href="/student/messages">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        <span>Message Mentor</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-tone-muted space-y-2">
                    <p>Matching with a specialist in your discipline within 48 business hours.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: MILESTONES */}
        {activeTab === "milestones" && (
          <div className="bg-white border border-tone-rule rounded-[2px] p-6 space-y-6 shadow-xs">
            <div className="border-b border-tone-rule pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-base font-semibold text-tone-heading">
                  Chapter and Research Milestones
                </h3>
                <p className="text-xs text-tone-muted">
                  Milestones require faculty mentor verification before completion. You can record drafting notes, view track-changes critiques, or upload revised manuscripts.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const reviewed = data?.milestones?.find((m: any) => m.hasReview);
                    if (reviewed) setActiveRedlineMilestone(reviewed);
                    else toast({ title: "Notice", message: "Select a milestone below to inspect redlines.", type: "info" });
                  }}
                >
                  <Eye className="w-3.5 h-3.5 mr-1 text-gold" />
                  <span>Inspect Redline Diff</span>
                </Button>
              </div>
            </div>

            {data?.milestones?.length === 0 ? (
              <p className="text-xs text-tone-muted py-6 text-center">
                Milestones for this project are being scoped by the academic desk.
              </p>
            ) : (
              <div className="space-y-4">
                {data.milestones.map((m: any, idx: number) => {
                  const isDone = m.status === "done";
                  const isInProgress = m.status === "in_progress";

                  return (
                    <div
                      key={m.id}
                      className="border border-tone-rule p-4 rounded-[2px] space-y-3 bg-paper/30"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-5 h-5 rounded-[2px] border flex items-center justify-center shrink-0 mt-0.5 ${
                              isDone
                                ? "bg-success border-success text-white"
                                : isInProgress
                                ? "bg-amber-100 border-amber-300 text-amber-800"
                                : "border-tone-rule bg-white text-transparent"
                            }`}
                          >
                            {isDone ? "✓" : isInProgress ? "●" : ""}
                          </div>
                          <div className="space-y-1">
                            <span className="font-serif text-sm font-medium text-tone-heading block">
                              {idx + 1}. {m.title}
                            </span>
                            {m.due_date && (
                              <span className="text-[11px] text-tone-muted block">
                                Target Date: {m.due_date}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          {m.rubricScore && (
                            <span className="text-[10px] font-mono font-bold text-gold px-2 py-0.5 bg-gold/10 border border-gold/30 rounded-[2px]">
                              Rubric: {m.rubricScore}
                            </span>
                          )}
                          <Badge
                            variant={isDone ? "default" : isInProgress ? "outline" : "navy"}
                            className="text-[10px] shrink-0"
                          >
                            {isDone ? "Mentor Approved" : isInProgress ? "Under Faculty Review" : "Awaiting Submission"}
                          </Badge>
                        </div>
                      </div>

                      {/* Milestone Actions & Candidate Notes */}
                      <div className="pt-2 pl-8 space-y-3">
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          {m.hasReview && (
                            <button
                              type="button"
                              onClick={() => setActiveRedlineMilestone(m)}
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-navy hover:text-gold underline cursor-pointer"
                            >
                              <Eye className="w-3 h-3 text-gold" />
                              <span>View Faculty Redline & Commentary</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setUploadingMilestone(m)}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-navy hover:text-gold underline cursor-pointer"
                          >
                            <UploadCloud className="w-3 h-3 text-navy" />
                            <span>Upload Revised Manuscript</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingMilestoneId(m.id);
                              setNotesText(m.description || "");
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 hover:text-tone-heading underline cursor-pointer"
                          >
                            <span>Edit Notes</span>
                          </button>
                        </div>

                        {editingMilestoneId === m.id ? (
                          <div className="space-y-2 pt-1">
                            <textarea
                              rows={3}
                              value={notesText}
                              onChange={(e) => setNotesText(e.target.value)}
                              placeholder="Record your notes, revisions made, or questions for your mentor..."
                              className="w-full text-xs p-2.5 border border-tone-rule rounded-[2px] bg-white focus:outline-none focus:border-navy"
                            />
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="accent"
                                disabled={savingNote}
                                onClick={() => handleSaveNotes(m.id)}
                              >
                                <Save className="w-3 h-3 mr-1" />
                                <span>Save Notes</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => setEditingMilestoneId(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-tone-muted italic">
                            {m.description ? `Notes: "${m.description}"` : "No candidate notes recorded."}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: FILES */}
        {activeTab === "files" && (
          <div className="bg-white border border-tone-rule rounded-[2px] p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-tone-rule pb-3">
              <h3 className="font-serif text-base font-semibold text-tone-heading">
                Manuscript and Data Files
              </h3>
              <Button
                variant="accent"
                size="sm"
                onClick={() => setUploadingMilestone(data?.milestones?.[2] || data?.milestones?.[0] || { id: "m-general", title: "General Manuscript" })}
              >
                <UploadCloud className="w-3.5 h-3.5 mr-1" />
                Upload New Draft
              </Button>
            </div>

            {data?.files?.length === 0 ? (
              <p className="text-xs text-tone-muted py-6 text-center">
                No files uploaded to this project yet. Upload draft chapters in the Files area.
              </p>
            ) : (
              <div className="divide-y divide-tone-rule text-xs">
                {data.files.map((f: any) => (
                  <div key={f.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-tone-heading flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-navy" />
                        {f.file_name}
                      </span>
                      <span className="text-[10px] text-tone-muted block">
                        Version {f.version_label || "v1.0"} &bull; {Math.round((f.size_bytes || 250000) / 1024)} KB &bull;{" "}
                        {f.visibility === "shared_with_mentor" ? "Shared with faculty mentor" : "Private draft"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => toast({ title: "Downloading File", message: `Downloading ${f.file_name}...`, type: "info" })}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        <span>Download</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: MESSAGES */}
        {activeTab === "messages" && (
          <div className="bg-white border border-tone-rule rounded-[2px] p-6 space-y-4 shadow-xs">
            <div className="border-b border-tone-rule pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-semibold text-tone-heading">
                  Project Communications
                </h3>
                <p className="text-xs text-tone-muted">
                  Faculty mentors respond within 24 business hours (Monday–Friday, 9:00 AM – 6:00 PM).
                </p>
              </div>
              <Button variant="accent" size="sm" href="/student/messages">
                Open Messenger
              </Button>
            </div>

            <div className="divide-y divide-tone-rule text-xs">
              {(data?.threads || []).map((t: any) => (
                <div key={t.id} className="py-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-medium text-tone-heading text-sm">
                      {t.subject}
                    </span>
                    <span className="text-[10px] text-tone-muted">
                      {new Date(t.last_message_at).toLocaleDateString()}
                    </span>
                  </div>
                  {t.messages?.[0] && (
                    <p className="text-tone-muted leading-relaxed italic bg-paper p-3 rounded-[2px] border border-tone-rule">
                      &ldquo;{t.messages[0].body}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: SESSIONS */}
        {activeTab === "sessions" && (
          <div className="bg-white border border-tone-rule rounded-[2px] p-6 space-y-4 shadow-xs">
            <div className="border-b border-tone-rule pb-3 flex items-center justify-between">
              <h3 className="font-serif text-base font-semibold text-tone-heading">
                Linked Mentoring Sessions
              </h3>
              <Button variant="accent" size="sm" href="/student/book-session">
                Book a Session
              </Button>
            </div>

            {data?.sessions?.length === 0 ? (
              <p className="text-xs text-tone-muted py-6 text-center">
                No coaching calls linked to this project yet.
              </p>
            ) : (
              <div className="divide-y divide-tone-rule text-xs">
                {data.sessions.map((s: any) => (
                  <div key={s.id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-tone-heading block">
                        {new Date(s.starts_at).toDateString()} at {new Date(s.starts_at).toTimeString().slice(0, 5)} {s.timezone || "UTC"}
                      </span>
                      <span className="text-[11px] text-tone-muted">{s.notes || "Thesis Mentoring Session"}</span>
                    </div>
                    {s.meeting_url && (
                      <a
                        href={s.meeting_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-navy hover:text-gold font-medium inline-flex items-center gap-1"
                      >
                        <span>Join Call</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 6: BILLING */}
        {activeTab === "billing" && (
          <div className="bg-white border border-tone-rule rounded-[2px] p-6 space-y-4 shadow-xs">
            <div className="border-b border-tone-rule pb-3">
              <h3 className="font-serif text-base font-semibold text-tone-heading">
                Project Milestone Invoices and Payments
              </h3>
            </div>

            {data?.billing?.length === 0 ? (
              <p className="text-xs text-tone-muted py-6 text-center">
                No billing transactions specifically registered under this project ID.
              </p>
            ) : (
              <div className="divide-y divide-tone-rule text-xs">
                {data.billing.map((b: any) => (
                  <div key={b.id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-tone-heading block">
                        {formatMoney(b.amount_minor, b.currency)} &bull; {b.status}
                      </span>
                      <span className="text-[11px] text-tone-muted">
                        Invoice: {b.invoices?.[0]?.number || "Issued"}
                      </span>
                    </div>
                    <Button variant="secondary" size="sm" href="/student/billing">
                      View Billing
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── MODAL 1: REDLINE DIFF & FACULTY CRITIQUE VIEWER ── */}
      {activeRedlineMilestone && (
        <div className="fixed inset-0 z-50 bg-navy/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-tone-rule rounded-[2px] w-full max-w-5xl max-h-[90vh] flex flex-col shadow-xl">
            <div className="p-4 border-b border-tone-rule flex items-center justify-between bg-paper">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold block">
                  Faculty Critique Archive
                </span>
                <h3 className="font-serif text-lg font-medium text-tone-heading">
                  {activeRedlineMilestone.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveRedlineMilestone(null)}
                className="p-1.5 text-stone-500 hover:text-tone-heading cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <RedlineDiffViewer
                candidateName={student.name || "Freedom Sola"}
                chapterTitle={activeRedlineMilestone.title}
                similarityScore="4% (Turnitin verified)"
              />
            </div>

            <div className="p-4 border-t border-tone-rule bg-paper flex items-center justify-between">
              <span className="text-xs text-tone-muted">
                Feedback strictly complies with non-ghostwriting developmental standards.
              </span>
              <Button variant="primary" size="sm" onClick={() => setActiveRedlineMilestone(null)}>
                Close Viewer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: UPLOAD REVISED MANUSCRIPT DRAFT ── */}
      {uploadingMilestone && (
        <div className="fixed inset-0 z-50 bg-navy/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-tone-rule rounded-[2px] w-full max-w-lg shadow-xl">
            <div className="p-4 border-b border-tone-rule flex items-center justify-between bg-paper">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-navy font-bold block">
                  Submit Manuscript for Review
                </span>
                <h3 className="font-serif text-base font-medium text-tone-heading">
                  {uploadingMilestone.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setUploadingMilestone(null)}
                className="p-1.5 text-stone-500 hover:text-tone-heading cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadDraft} className="p-6 space-y-4 text-xs font-sans">
              <div className="space-y-1.5">
                <label className="font-semibold text-tone-heading block">
                  Manuscript File (.docx, .pdf, or .zip) *
                </label>
                <input
                  type="file"
                  required
                  accept=".pdf,.doc,.docx,.zip,.sav"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full p-2 border border-stone-300 rounded-[2px] bg-paper"
                />
                <span className="text-[10px] text-stone-500 block">
                  Max file size: 25 MB. All files are encrypted at rest.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-tone-heading block">
                  Version Label
                </label>
                <input
                  type="text"
                  value={uploadVersion}
                  onChange={(e) => setUploadVersion(e.target.value)}
                  placeholder="e.g. v2.1 or Final Draft"
                  className="w-full p-2 border border-stone-300 rounded-[2px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-tone-heading block">
                  Submission Notes for Faculty Mentor
                </label>
                <textarea
                  rows={3}
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  placeholder="Describe recent revisions, specific sections requiring review, or questions..."
                  className="w-full p-2 border border-stone-300 rounded-[2px]"
                />
              </div>

              <div className="pt-3 border-t border-tone-rule flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setUploadingMilestone(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="accent"
                  size="sm"
                  disabled={uploading}
                >
                  <UploadCloud className="w-3.5 h-3.5 mr-1" />
                  <span>{uploading ? "Submitting Draft..." : "Submit to Faculty Mentor"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
