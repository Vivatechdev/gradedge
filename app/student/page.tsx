"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useStudent } from "@/components/layout/student-context";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  FileText,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  CreditCard,
  Plus,
} from "lucide-react";
import { formatSlotForTimezone } from "@/lib/booking/availability";

export default function StudentOverviewPage() {
  const student = useStudent();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOverview() {
      try {
        const res = await fetch("/api/student/overview");
        const json = await res.json();
        if (res.ok) {
          setData(json);
        }
      } catch (e) {
        console.error("Failed to load overview", e);
      } finally {
        setLoading(false);
      }
    }
    loadOverview();
  }, []);

  const firstName = student.name.split(" ")[0] || "Researcher";

  // Derive plain headline sentence about what matters next
  let nextHeadline = "You have no upcoming sessions scheduled.";
  if (data?.nextSession) {
    const slot = formatSlotForTimezone(
      new Date(data.nextSession.starts_at),
      new Date(data.nextSession.ends_at),
      student.timezone || "UTC"
    );
    nextHeadline = `Your next session is ${slot.localDate} at ${slot.localTime} (${slot.timezoneShort}).`;
  } else if (data?.unreadMessages > 0) {
    nextHeadline = `You have ${data.unreadMessages} unread message${data.unreadMessages === 1 ? "" : "s"} from your advisory mentor.`;
  } else if (data?.milestoneProgress?.nextTitle) {
    nextHeadline = `Your current milestone "${data.milestoneProgress.nextTitle}" is in progress.`;
  } else if (data?.activeProject) {
    nextHeadline = `Your research project "${data.activeProject.title}" is active.`;
  }

  return (
    <DashboardShell
      role="student"
      title="Overview"
      user={{
        name: student.name,
        email: student.email,
        institution: student.institution,
      }}
    >
      <div className="space-y-6">
        {/* Header Greeting & Plain Sentence */}
        <div className="border-b border-tone-rule pb-5 space-y-1.5">
          <span className="type-micro text-gold">Researcher Workspace</span>
          <h1 className="font-serif text-2xl sm:text-3xl text-tone-heading font-medium">
            Welcome, {firstName}.
          </h1>
          <p className="text-xs sm:text-sm text-tone-muted leading-relaxed font-sans">
            {loading ? "Checking schedule and active research milestones..." : nextHeadline}
          </p>
        </div>

        {/* At most one small row of numbers (no big stat tiles) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3.5 border border-tone-rule rounded-[2px] text-xs">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-tone-muted block">
              Active Scope
            </span>
            <span className="font-serif text-base font-semibold text-tone-heading">
              {loading ? "–" : data?.activeProject ? "1 Active Project" : "None"}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-tone-muted block">
              Upcoming Session
            </span>
            <span className="font-serif text-base font-semibold text-tone-heading">
              {loading ? "–" : data?.nextSession ? "1 Confirmed" : "None"}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-tone-muted block">
              Milestones Due
            </span>
            <span className="font-serif text-base font-semibold text-tone-heading">
              {loading ? "–" : data?.milestoneProgress?.total ? `${data.milestoneProgress.completed}/${data.milestoneProgress.total}` : "Up to date"}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-tone-muted block">
              Timezone Context
            </span>
            <span className="font-serif text-base font-semibold text-navy truncate block">
              {student.timezone || "UTC"}
            </span>
          </div>
        </div>

        {/* Main 2-Column Dense Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 spans): Next Steps & Active Project */}
          <div className="lg:col-span-2 space-y-6">
            {/* NEXT STEPS LIST */}
            <div className="bg-white border border-tone-rule rounded-[2px] p-5 sm:p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-tone-rule pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gold" />
                  <h2 className="font-serif text-base font-medium text-tone-heading">
                    Next Steps
                  </h2>
                </div>
                <Link
                  href="/student/requests/new"
                  className="text-xs text-navy hover:text-gold font-medium inline-flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Request Support</span>
                </Link>
              </div>

              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <div className="divide-y divide-tone-rule text-xs">
                  {/* Next session item */}
                  {data?.nextSession ? (
                    <div className="py-3 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <span className="font-semibold text-tone-heading flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gold" />
                          Upcoming Mentoring Session
                        </span>
                        <p className="text-tone-muted text-[11px]">
                          {formatSlotForTimezone(
                            new Date(data.nextSession.starts_at),
                            new Date(data.nextSession.ends_at),
                            student.timezone || "UTC"
                          ).localDate}{" "}
                          at{" "}
                          {formatSlotForTimezone(
                            new Date(data.nextSession.starts_at),
                            new Date(data.nextSession.ends_at),
                            student.timezone || "UTC"
                          ).localTime}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {data.nextSession.meeting_url && (
                          <a
                            href={data.nextSession.meeting_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-semibold text-navy bg-paper px-2.5 py-1 border border-tone-rule rounded-[2px] hover:border-navy transition-colors inline-flex items-center gap-1"
                          >
                            <span>Join Meet</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        <Link
                          href="/student/sessions"
                          className="text-[11px] text-tone-muted hover:text-tone-heading underline"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="py-3 flex items-center justify-between text-tone-muted">
                      <span>No consultation scheduled for this week.</span>
                      <Link
                        href="/student/book-session"
                        className="text-navy hover:text-gold font-medium"
                      >
                        Book a session &rarr;
                      </Link>
                    </div>
                  )}

                  {/* Active milestone item */}
                  {data?.milestoneProgress?.nextTitle && (
                    <div className="py-3 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <span className="font-semibold text-tone-heading flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-navy" />
                          Next Milestone Due: {data.milestoneProgress.nextTitle}
                        </span>
                        <p className="text-tone-muted text-[11px]">
                          Target submission: {data.milestoneProgress.nextDue || "Flexible pacing"}
                        </p>
                      </div>
                      <Link
                        href={`/student/projects/${data.activeProject?.id || ""}`}
                        className="text-[11px] text-navy hover:text-gold font-medium shrink-0"
                      >
                        Review scope &rarr;
                      </Link>
                    </div>
                  )}

                  {/* Unread messages item */}
                  {data?.unreadMessages > 0 && (
                    <div className="py-3 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <span className="font-semibold text-tone-heading flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-navy" />
                          Unread Faculty Critique ({data.unreadMessages} new {data.unreadMessages === 1 ? "message" : "messages"})
                        </span>
                        <p className="text-tone-muted text-[11px]">
                          Your mentor has responded to your research consultation thread.
                        </p>
                      </div>
                      <Link
                        href="/student/messages"
                        className="text-[11px] text-navy hover:text-gold font-medium shrink-0"
                      >
                        Read messages &rarr;
                      </Link>
                    </div>
                  )}

                  {/* Pending invoices / notifications item */}
                  {data?.pendingInvoices > 0 && (
                    <div className="py-3 flex items-start justify-between gap-4 bg-paper/60 px-2 -mx-2 rounded-[2px]">
                      <div className="space-y-1">
                        <span className="font-semibold text-tone-heading flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-gold" />
                          Pending Payment Authorization
                        </span>
                        <p className="text-tone-muted text-[11px]">
                          An invoice awaiting confirmation is registered on your account.
                        </p>
                      </div>
                      <Link
                        href="/student/billing"
                        className="text-[11px] text-navy hover:text-gold font-medium shrink-0"
                      >
                        Billing desk &rarr;
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ACTIVE PROJECT WITH SIMPLE MILESTONE PROGRESS LINE */}
            <div className="bg-white border border-tone-rule rounded-[2px] p-5 sm:p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-tone-rule pb-3">
                <h2 className="font-serif text-base font-medium text-tone-heading">
                  Active Research Project
                </h2>
                {data?.activeProject && (
                  <span className="text-[10px] font-mono uppercase bg-paper border border-tone-rule px-2 py-0.5 rounded-[2px] text-navy">
                    Status: {data.activeProject.status}
                  </span>
                )}
              </div>

              {loading ? (
                <Skeleton className="h-24 w-full" />
              ) : data?.activeProject ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-serif text-lg font-medium text-tone-heading">
                      {data.activeProject.title}
                    </h3>
                    <p className="text-xs text-tone-muted mt-1 leading-relaxed">
                      {data.activeProject.brief}
                    </p>
                  </div>

                  {/* Simple milestone progress line */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-[11px] font-medium text-tone-muted">
                      <span>Milestone Progress</span>
                      <span className="font-mono text-tone-heading">
                        {data.milestoneProgress.completed} of {data.milestoneProgress.total || 4} Completed
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-paper rounded-full overflow-hidden border border-tone-rule">
                      <div
                        className="h-full bg-gold transition-all duration-300"
                        style={{
                          width: `${
                            data.milestoneProgress.total > 0
                              ? Math.round((data.milestoneProgress.completed / data.milestoneProgress.total) * 100)
                              : 25
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-tone-rule text-xs">
                    <span className="text-tone-muted">
                      Assigned Mentor:{" "}
                      <strong className="text-tone-heading font-medium">
                        {data.activeProject.mentors?.full_name || "Faculty Review Desk"}
                      </strong>
                    </span>
                    <Link
                      href={`/student/projects/${data.activeProject.id}`}
                      className="text-navy hover:text-gold font-medium inline-flex items-center gap-1"
                    >
                      <span>Open Workspace</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-tone-muted space-y-3">
                  <p>You do not have an active research mentoring project yet.</p>
                  <Button variant="secondary" href="/services" size="sm">
                    Explore Research Services
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Quiet Activity List & Integrity Note */}
          <div className="space-y-6">
            {/* QUIET RECENT ACTIVITY */}
            <div className="bg-white border border-tone-rule rounded-[2px] p-5 sm:p-6 space-y-4 shadow-xs">
              <div className="border-b border-tone-rule pb-3">
                <h2 className="font-serif text-base font-medium text-tone-heading">
                  Recent Activity
                </h2>
              </div>

              {loading ? (
                <div className="space-y-2.5">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : (data?.recentActivity || []).length > 0 ? (
                <ul className="space-y-3 text-xs">
                  {data.recentActivity.map((act: any, i: number) => (
                    <li key={i} className="flex items-start gap-2.5 text-tone-body">
                      <span className="text-gold font-bold mt-0.5">&bull;</span>
                      <div className="space-y-0.5">
                        <p className="text-xs text-tone-heading leading-tight">{act.label}</p>
                        <span className="text-[10px] text-tone-muted font-mono block">
                          {new Date(act.timestamp).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-tone-muted">No recent logged actions.</p>
              )}
            </div>

            {/* Quiet Academic Integrity Card */}
            <div className="p-4 bg-paper border border-tone-rule rounded-[2px] space-y-2 text-xs">
              <span className="text-[10px] uppercase font-mono tracking-wider text-gold font-semibold block">
                Academic Standard
              </span>
              <p className="text-tone-muted leading-relaxed text-[11px]">
                GradEdge adheres strictly to university ethics frameworks. We coach your argument, methodology, and defense; all final writing remains 100% your scholarly property.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
