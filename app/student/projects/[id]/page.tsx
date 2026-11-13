"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useStudent } from "@/components/layout/student-context";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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

  useEffect(() => {
    async function loadProject() {
      try {
        const res = await fetch(`/api/student/projects/${projectId}`);
        const json = await res.json();
        if (res.ok) {
          setData(json);
        } else {
          toast({ title: "Error", message: json.error || "Project not found", type: "error" });
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
        // Update local state
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
                  Research Brief & Scope
                </h3>
                <p className="text-xs text-tone-muted leading-relaxed">
                  {project?.brief || "No detailed brief provided for this project."}
                </p>
              </div>

              <div className="bg-white border border-tone-rule rounded-[2px] p-6 space-y-3">
                <h3 className="font-serif text-base font-semibold text-tone-heading">
                  Pedagogic Framework & Authorship Guarantee
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
            <div className="border-b border-tone-rule pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-semibold text-tone-heading">
                  Chapter & Research Milestones
                </h3>
                <p className="text-xs text-tone-muted">
                  Milestones require faculty mentor verification before completion. You can record your drafting notes below.
                </p>
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
                  return (
                    <div
                      key={m.id}
                      className="border border-tone-rule p-4 rounded-[2px] space-y-3 bg-paper/30"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-5 h-5 rounded-[2px] border flex items-center justify-center shrink-0 mt-0.5 ${
                              isDone
                                ? "bg-success border-success text-white"
                                : "border-tone-rule bg-white text-transparent"
                            }`}
                          >
                            &check;
                          </div>
                          <div>
                            <span className="font-serif text-sm font-medium text-tone-heading">
                              {idx + 1}. {m.title}
                            </span>
                            {m.due_date && (
                              <span className="text-[11px] text-tone-muted block mt-0.5">
                                Target Date: {m.due_date}
                              </span>
                            )}
                          </div>
                        </div>

                        <Badge
                          variant={isDone ? "default" : "navy"}
                          className="text-[10px] shrink-0"
                        >
                          {isDone ? "Mentor Approved" : "Awaiting Mentor Sign-off"}
                        </Badge>
                      </div>

                      {/* Candidate Notes Field */}
                      <div className="pt-2 pl-8 space-y-2">
                        {editingMilestoneId === m.id ? (
                          <div className="space-y-2">
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
                          <div className="flex items-center justify-between text-xs text-tone-muted">
                            <span className="italic">
                              {m.description ? `Notes: "${m.description}"` : "No candidate notes recorded."}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingMilestoneId(m.id);
                                setNotesText(m.description || "");
                              }}
                              className="text-navy hover:text-gold text-[11px] underline font-medium cursor-pointer"
                            >
                              Edit Notes
                            </button>
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
                Manuscript & Data Files
              </h3>
              <Button variant="accent" size="sm" href="/student/files">
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
                        Version {f.version_label || "v1.0"} &bull; {Math.round(f.size_bytes / 1024)} KB &bull;{" "}
                        {f.visibility === "shared_with_mentor" ? "Shared with mentor" : "Private draft"}
                      </span>
                    </div>
                    <Button variant="secondary" size="sm" href="/student/files">
                      <Download className="w-3 h-3 mr-1" />
                      <span>View</span>
                    </Button>
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
                  Mentors respond within 24 business hours (Monday–Friday, 9:00 AM – 6:00 PM).
                </p>
              </div>
              <Button variant="accent" size="sm" href="/student/messages">
                Open Messenger
              </Button>
            </div>

            <div className="py-4 text-xs text-tone-muted">
              Direct all inquiries regarding this project&apos;s methodology and review drafts through the central messaging system.
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
                        <span>Join</span>
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
                Project Milestone Invoices & Payments
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
    </DashboardShell>
  );
}

