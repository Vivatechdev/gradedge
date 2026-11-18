"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useStudent } from "@/components/layout/student-context";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Modal } from "@/components/ui/modal";
import { Input, Select, Textarea, FormField } from "@/components/ui/form";
import {
  Users,
  MessageSquare,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  BookOpen,
  Laptop,
  AlertCircle,
} from "lucide-react";

interface MentorData {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  headline: string;
  bio: string;
  credentials: string;
  disciplines: string[];
  software: string[];
  projectId: string | null;
}

interface NextSession {
  id: string;
  startsAt: string;
  endsAt: string;
  meetingUrl: string | null;
  notes: string | null;
  timezone: string;
  serviceTitle: string;
}

interface ChangeRequest {
  id: string;
  reason: string;
  preferred_disciplines: string[];
  additional_notes: string | null;
  status: string;
  created_at: string;
}

export default function StudentMentorPage() {
  const student = useStudent();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [mentor, setMentor] = useState<MentorData | null>(null);
  const [nextSession, setNextSession] = useState<NextSession | null>(null);
  const [matchingWindow, setMatchingWindow] = useState("48 business hours");
  const [responseWindow, setResponseWindow] = useState(
    "24 business hours (Monday–Friday, 9:00 AM – 6:00 PM)"
  );
  const [activeChangeRequest, setActiveChangeRequest] = useState<ChangeRequest | null>(null);
  const [associatedProjectId, setAssociatedProjectId] = useState<string | null>(null);

  // Modal State
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [changeReason, setChangeReason] = useState("Change of research topic / discipline");
  const [preferredDisciplines, setPreferredDisciplines] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [submittingChange, setSubmittingChange] = useState(false);

  const fetchMentor = async () => {
    try {
      const res = await fetch("/api/student/mentor");
      const data = await res.json();
      if (res.ok) {
        setMentor(data.mentor);
        setNextSession(data.nextSession);
        if (data.matchingWindow) setMatchingWindow(data.matchingWindow);
        if (data.responseWindow) setResponseWindow(data.responseWindow);
        setActiveChangeRequest(data.activeChangeRequest);
        setAssociatedProjectId(data.associatedProjectId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentor();
  }, []);

  const handleSubmitChangeRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingChange(true);

    try {
      const disciplinesArray = preferredDisciplines
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/student/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: changeReason,
          preferredDisciplines: disciplinesArray,
          additionalNotes,
          currentMentorId: mentor?.id || null,
          projectId: associatedProjectId,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to submit request.");

      toast({
        title: "Request Submitted",
        message: "Your mentor change request has been logged. Our academic team will review it.",
        type: "success",
      });

      setShowChangeModal(false);
      setActiveChangeRequest(json.request);
    } catch (err: any) {
      toast({
        title: "Submission Error",
        message: err.message,
        type: "error",
      });
    } finally {
      setSubmittingChange(false);
    }
  };

  return (
    <DashboardShell
      role="student"
      title="Your Mentor"
      user={{
        name: student.name,
        email: student.email,
        institution: student.institution,
      }}
    >
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="border-b border-tone-rule pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <span className="type-micro text-gold">Academic Faculty</span>
            <h1 className="font-serif text-2xl font-medium text-tone-heading">
              Faculty Mentor & Advisory
            </h1>
            <p className="text-xs text-tone-muted leading-relaxed font-sans">
              Your assigned faculty scholar guides your methodology, reviews draft iterations, and conducts 1-on-1 consultations.
            </p>
          </div>

          {mentor && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowChangeModal(true)}
              className="text-xs font-sans shrink-0"
              disabled={Boolean(activeChangeRequest)}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5 text-gold" />
              {activeChangeRequest ? "Change Request Pending" : "Request Mentor Change"}
            </Button>
          )}
        </div>

        {/* Pending Change Request Banner */}
        {activeChangeRequest && (
          <div className="p-4 bg-gold/10 border border-gold/30 rounded-[2px] flex items-start gap-3">
            <Clock className="h-4 w-4 text-gold shrink-0 mt-0.5" />
            <div className="text-xs text-tone-body font-sans space-y-1">
              <span className="font-semibold text-tone-heading block">
                Mentor Reassignment Request Logged ({activeChangeRequest.status.replace("_", " ")})
              </span>
              <p className="text-tone-muted">
                Our academic operations team is reviewing your reassignment request. We are evaluating faculty candidates with matching methodological and subject-matter expertise.
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="bg-white border border-tone-rule rounded-[2px] p-6 space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
            <Skeleton className="h-20 w-full" />
          </div>
        ) : mentor ? (
          /* ASSIGNED MENTOR VIEW */
          <div className="space-y-6">
            {/* Primary Profile Card */}
            <div className="bg-white border border-tone-rule rounded-[2px] p-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-full bg-navy-deep text-paper font-serif text-xl font-bold flex items-center justify-center shrink-0 border-2 border-gold/40 shadow-sm overflow-hidden">
                    {mentor.avatarUrl ? (
                      <img
                        src={mentor.avatarUrl}
                        alt={mentor.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      mentor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="font-serif text-xl font-medium text-tone-heading">
                        {mentor.name}
                      </h2>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-success/40 text-success">
                        Assigned Mentor
                      </Badge>
                    </div>
                    <p className="text-xs font-semibold text-gold font-sans">
                      {mentor.credentials}
                    </p>
                    <p className="text-xs text-tone-muted font-sans">
                      {mentor.headline}
                    </p>
                  </div>
                </div>

                <Link href="/student/messages">
                  <Button variant="primary" size="sm" className="text-xs font-sans">
                    <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                    Open Message Thread
                  </Button>
                </Link>
              </div>

              {/* Bio */}
              <div className="border-t border-tone-rule pt-4 space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-tone-heading">
                  Academic Background
                </h3>
                <p className="text-xs text-tone-body font-sans leading-relaxed">
                  {mentor.bio}
                </p>
              </div>

              {/* Disciplines & Software Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-paper-light border border-tone-rule rounded-[2px] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-tone-heading">
                    <BookOpen className="h-4 w-4 text-gold" />
                    <span>Specialized Disciplines</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {mentor.disciplines.map((d) => (
                      <span
                        key={d}
                        className="text-[11px] px-2 py-0.5 bg-white border border-tone-rule rounded-[2px] text-tone-body"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-paper-light border border-tone-rule rounded-[2px] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-tone-heading">
                    <Laptop className="h-4 w-4 text-navy" />
                    <span>Methodological & Data Tools</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {mentor.software.map((s) => (
                      <span
                        key={s}
                        className="text-[11px] px-2 py-0.5 bg-white border border-tone-rule rounded-[2px] text-tone-body font-mono text-[10px]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Response Window Callout */}
              <div className="p-3 bg-paper border border-tone-rule rounded-[2px] flex items-center justify-between text-xs text-tone-muted">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gold shrink-0" />
                  <span>
                    Stated Response Standard: <strong className="text-tone-heading">{responseWindow}</strong>
                  </span>
                </div>
                <Link
                  href="/student/messages"
                  className="text-navy hover:underline font-medium inline-flex items-center gap-1"
                >
                  <span>Go to messages</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Next Session Card */}
            <div className="bg-white border border-tone-rule rounded-[2px] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-medium text-tone-heading">
                    Next Coaching Session
                  </h3>
                  <p className="text-xs text-tone-muted mt-0.5">
                    1-on-1 consultations with {mentor.name}
                  </p>
                </div>
                <Link href="/student/sessions">
                  <Button variant="secondary" size="sm" className="text-xs">
                    View All Sessions
                  </Button>
                </Link>
              </div>

              {nextSession ? (
                <div className="p-4 bg-paper-light border border-tone-rule rounded-[2px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white border border-tone-rule rounded-[2px] text-gold">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-tone-heading block">
                        {nextSession.serviceTitle}
                      </span>
                      <p className="text-xs text-tone-body font-sans">
                        {new Date(nextSession.startsAt).toLocaleDateString(undefined, {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        at{" "}
                        {new Date(nextSession.startsAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        ({nextSession.timezone || "UTC"})
                      </p>
                    </div>
                  </div>

                  {nextSession.meetingUrl ? (
                    <a
                      href={nextSession.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-deep text-white text-xs font-medium rounded-[2px] hover:bg-navy transition-colors shrink-0"
                    >
                      <span>Join Video Consultation</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-tone-muted italic">
                      Meeting link will activate 15 minutes prior.
                    </span>
                  )}
                </div>
              ) : (
                <div className="p-6 bg-paper-light border border-tone-rule rounded-[2px] text-center space-y-2">
                  <p className="text-xs text-tone-muted">
                    You have no upcoming consultations scheduled with {mentor.name}.
                  </p>
                  <Link href="/student/sessions" className="inline-block pt-1">
                    <Button variant="primary" size="sm" className="text-xs font-sans">
                      <Calendar className="h-3.5 w-3.5 mr-1.5" />
                      Book a Coaching Session
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* UNASSIGNED HONEST EMPTY STATE */
          <div className="bg-white border border-tone-rule rounded-[2px] p-8 text-center max-w-2xl mx-auto space-y-6">
            <div className="h-16 w-16 mx-auto rounded-full bg-paper-light border border-tone-rule flex items-center justify-center text-gold">
              <Users className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <span className="type-micro text-gold">Matching in Progress</span>
              <h2 className="font-serif text-2xl font-medium text-tone-heading">
                We&apos;re matching you with a mentor in your field
              </h2>
              <p className="text-xs text-tone-muted leading-relaxed font-sans max-w-lg mx-auto">
                We&apos;re matching you with a mentor in your field. You&apos;ll see their details here within {matchingWindow}.
              </p>
            </div>

            <div className="p-4 bg-paper-light border border-tone-rule rounded-[2px] text-left space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-tone-heading">
                <Clock className="h-4 w-4 text-gold" />
                <span>Assignment Timeline: Within {matchingWindow}</span>
              </div>
              <ul className="text-xs text-tone-muted space-y-1.5 list-disc list-inside font-sans">
                <li>
                  <strong className="text-tone-heading">Methodology Alignment:</strong> Qualitative, quantitative, mixed methods, or theoretical framing.
                </li>
                <li>
                  <strong className="text-tone-heading">Subject Specialization:</strong> Direct faculty expertise in your departmental field.
                </li>
                <li>
                  <strong className="text-tone-heading">Software Stack:</strong> Matching in R, Stata, SPSS, Python, NVivo, or LaTeX.
                </li>
              </ul>
            </div>

            <p className="text-xs text-tone-muted font-sans">
              Have questions about your project scope or intake in the meantime?
            </p>

            <Link href="/student/requests/new">
              <Button variant="secondary" size="sm" className="text-xs font-sans">
                Submit Project Brief or Scope Notes
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Mentor Change Request Modal */}
      <Modal
        isOpen={showChangeModal}
        onClose={() => setShowChangeModal(false)}
        title="Request Mentor Reassignment"
        description="We take academic fit seriously. Please indicate why you would like to be paired with a different faculty advisor."
      >
        <form onSubmit={handleSubmitChangeRequest} className="space-y-4 pt-2">
          <Select
            label="Primary Reason for Request"
            value={changeReason}
            onChange={(e) => setChangeReason(e.target.value)}
            options={[
              {
                value: "Change of research topic / discipline",
                label: "Change of research topic or dissertation discipline",
              },
              {
                value: "Different methodological / software expertise required",
                label: "Different methodological or software stack required (e.g. Stata to R)",
              },
              {
                value: "Scheduling or timezone misalignment",
                label: "Scheduling or timezone availability misalignment",
              },
              {
                value: "Communication or pacing preference",
                label: "Communication or feedback pacing preference",
              },
              {
                value: "Other academic reason",
                label: "Other academic reason",
              },
            ]}
          />

          <Input
            label="Preferred Disciplines or Software Tools"
            placeholder="e.g. Biostatistics, Hierarchical Linear Modeling, R, Mplus"
            value={preferredDisciplines}
            onChange={(e) => setPreferredDisciplines(e.target.value)}
            helperText="Separate multiple disciplines or software with commas."
          />

          <Textarea
            label="Additional Context for Academic Operations"
            rows={3}
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Provide any specific details regarding your current dissertation phase or upcoming committee deadlines..."
          />

          <div className="pt-4 border-t border-tone-rule flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowChangeModal(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={submittingChange}
              className="text-xs font-sans"
            >
              {submittingChange ? "Submitting request..." : "Submit Reassignment Request"}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}
