"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useStudent } from "@/components/layout/student-context";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { formatSlotForTimezone } from "@/lib/booking/availability";
import { generateICSString } from "@/lib/booking/calendar-ics";
import {
  CalendarCheck,
  Calendar,
  Clock,
  ExternalLink,
  Plus,
  User,
  Download,
  AlertCircle,
  RotateCcw,
  XCircle,
} from "lucide-react";

export default function StudentSessionsPage() {
  const student = useStudent();
  const { toast } = useToast();

  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [data, setData] = useState<{ upcoming: any[]; past: any[]; timezone: string }>({
    upcoming: [],
    past: [],
    timezone: student.timezone || "UTC",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSessions() {
      try {
        const res = await fetch("/api/student/sessions");
        const json = await res.json();
        if (res.ok) {
          setData(json);
        }
      } catch (err: any) {
        toast({ title: "Error", message: "Failed to load session schedule", type: "error" });
      } finally {
        setLoading(false);
      }
    }
    loadSessions();
  }, [toast]);

  const tz = data.timezone || student.timezone || "UTC";

  const handleDownloadIcs = (s: any) => {
    try {
      const ics = generateICSString({
        uid: `session-${s.id}@gradedge.com`,
        summary: `GradEdge Mentoring: ${s.services?.title || "Doctoral Consultation"}`,
        description: `Your one-on-one academic mentoring session with ${s.mentors?.full_name || "Faculty Advisor"}.\nMeeting URL: ${s.meeting_url || "Link sent prior to call"}`,
        startsAt: new Date(s.starts_at),
        endsAt: new Date(s.ends_at),
        location: s.meeting_url || undefined,
      });

      const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gradedge-session-${s.id.slice(0, 8)}.ics`;
      a.click();
      URL.revokeObjectURL(url);

      toast({ title: "Calendar Invite Exported", message: ".ics file saved to your downloads.", type: "success" });
    } catch (err: any) {
      toast({ title: "Export Error", message: err.message, type: "error" });
    }
  };

  const list = tab === "upcoming" ? data.upcoming : data.past;

  return (
    <DashboardShell
      role="student"
      title="Sessions"
      user={{
        name: student.name,
        email: student.email,
        institution: student.institution,
      }}
    >
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-tone-rule pb-5">
          <div className="space-y-1">
            <span className="type-micro text-gold">Advisory Schedule</span>
            <h1 className="font-serif text-2xl font-medium text-tone-heading">
              Mentoring & Consultation Sessions
            </h1>
            <p className="text-xs text-tone-muted leading-relaxed font-sans">
              All times displayed in your detected local timezone:{" "}
              <strong className="text-tone-heading font-mono">{tz}</strong>.
            </p>
          </div>
          <Button variant="accent" href="/student/book-session" size="sm">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            <span>Book a Session</span>
          </Button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-tone-rule text-xs">
          <button
            type="button"
            onClick={() => setTab("upcoming")}
            className={`py-2 px-3 font-medium transition-colors border-b-2 -mb-px cursor-pointer ${
              tab === "upcoming"
                ? "border-navy text-navy font-semibold"
                : "border-transparent text-tone-muted hover:text-tone-heading"
            }`}
          >
            Upcoming Sessions ({data.upcoming.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("past")}
            className={`py-2 px-3 font-medium transition-colors border-b-2 -mb-px cursor-pointer ${
              tab === "past"
                ? "border-navy text-navy font-semibold"
                : "border-transparent text-tone-muted hover:text-tone-heading"
            }`}
          >
            Past & Completed ({data.past.length})
          </button>
        </div>

        {/* Sessions List */}
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        ) : list.length === 0 ? (
          <EmptyState
            icon={<CalendarCheck className="w-8 h-8 text-tone-muted" />}
            title={tab === "upcoming" ? "No upcoming sessions booked" : "No past sessions found"}
            description={
              tab === "upcoming"
                ? "Schedule a 60-minute one-on-one session to review your methodology, data analysis syntax, or thesis chapters."
                : "Your completed consultation records and summaries will appear here."
            }
            action={
              tab === "upcoming" ? (
                <Button variant="accent" href="/student/book-session">
                  Book a Session
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="space-y-4">
            {list.map((s) => {
              const slot = formatSlotForTimezone(
                new Date(s.starts_at),
                new Date(s.ends_at),
                tz
              );

              return (
                <div
                  key={s.id}
                  className="bg-white border border-tone-rule rounded-[2px] p-5 sm:p-6 space-y-4 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-tone-muted">
                          {s.services?.title || "Academic Mentoring Session"}
                        </span>
                        <Badge
                          variant={s.status === "confirmed" ? "navy" : "outline"}
                          className="text-[10px] capitalize"
                        >
                          {s.status}
                        </Badge>
                      </div>

                      <h2 className="font-serif text-lg font-medium text-tone-heading">
                        {slot.localDate} at {slot.localTime} ({slot.timezoneShort})
                      </h2>

                      <p className="text-xs text-tone-muted">
                        Mentor:{" "}
                        <strong className="text-tone-heading font-medium">
                          {s.mentors?.full_name || "Assigned Faculty Advisor"}
                        </strong>
                      </p>

                      {s.notes && (
                        <p className="text-xs text-tone-body italic">
                          &ldquo;{s.notes}&rdquo;
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {s.meeting_url && s.status === "confirmed" && (
                        <a
                          href={s.meeting_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-navy hover:bg-navy/90 text-white text-xs font-semibold px-3 py-2 rounded-[2px] inline-flex items-center gap-1.5 transition-colors"
                        >
                          <span>Join Meeting</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleDownloadIcs(s)}
                        title="Add to Google/Apple/Outlook Calendar"
                        className="text-xs"
                      >
                        <Download className="w-3.5 h-3.5 mr-1" />
                        <span>.ics</span>
                      </Button>

                      {s.status === "confirmed" && s.cancellation_token && (
                        <Link
                          href={`/booking/manage/${s.cancellation_token}`}
                          className="text-xs text-tone-muted hover:text-navy underline px-2 py-1"
                        >
                          Reschedule / Cancel
                        </Link>
                      )}
                    </div>
                  </div>

                  {s.status === "confirmed" && (
                    <div className="pt-3 border-t border-tone-rule flex items-center justify-between text-[11px] text-tone-muted">
                      <span>
                        Notice Policy: Rescheduling or cancellation is permitted up to 6 hours before the session start time.
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

