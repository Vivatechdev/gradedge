"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  CheckCircle2,
  CalendarCheck,
  Plus,
  Trash2,
  ExternalLink,
  Users,
  Settings,
} from "lucide-react";

interface ConsultationSession {
  id: string;
  candidateName: string;
  topic: string;
  dateStr: string;
  timeStr: string;
  durationMinutes: number;
  meetUrl: string;
  type: "viva_prep" | "methodology_review" | "proposal_refinement";
  status: "confirmed" | "completed";
  prepNote: string;
}

const UPCOMING_SESSIONS: ConsultationSession[] = [
  {
    id: "sess-301",
    candidateName: "Freedom Sola",
    topic: "Propensity Score Matching Caliper Diagnostics & Covariate Balance",
    dateStr: "Wednesday, Nov 25, 2026",
    timeStr: "14:00 - 15:00 UTC",
    durationMinutes: 60,
    meetUrl: "https://meet.google.com/abc-defg-hij",
    type: "methodology_review",
    status: "confirmed",
    prepNote: "Review Stata propensity log file prior to call; discuss overlap plots.",
  },
  {
    id: "sess-302",
    candidateName: "Amina Bello",
    topic: "Panel Econometrics: Two-Way Fixed Effects vs Arellano-Bond GMM",
    dateStr: "Friday, Nov 28, 2026",
    timeStr: "10:00 - 10:45 UTC",
    durationMinutes: 45,
    meetUrl: "https://meet.google.com/klm-nopq-rst",
    type: "methodology_review",
    status: "confirmed",
    prepNote: "Check serial correlation diagnostics table for lag justification.",
  },
  {
    id: "sess-303",
    candidateName: "Chidi Okafor",
    topic: "Qualitative Viva Defense Simulation: Defending Thematic Saturation",
    dateStr: "Tuesday, Dec 02, 2026",
    timeStr: "15:30 - 16:30 UTC",
    durationMinutes: 60,
    meetUrl: "https://meet.google.com/uvw-xyza-bcd",
    type: "viva_prep",
    status: "confirmed",
    prepNote: "Mock viva examiner interrogation focusing on epistemology and researcher bias.",
  },
];

export default function MentorSchedulePage() {
  const { showToast } = useToast();
  const [weeklyAvailability, setWeeklyAvailability] = useState([
    { day: "Monday", slots: ["14:00 - 17:00 UTC"], enabled: true },
    { day: "Wednesday", slots: ["10:00 - 13:00 UTC", "14:00 - 16:00 UTC"], enabled: true },
    { day: "Thursday", slots: ["13:00 - 16:00 UTC"], enabled: false },
    { day: "Friday", slots: ["09:00 - 12:00 UTC"], enabled: true },
  ]);

  const toggleDay = (idx: number) => {
    const updated = [...weeklyAvailability];
    updated[idx].enabled = !updated[idx].enabled;
    setWeeklyAvailability(updated);
    showToast(`Availability updated for ${updated[idx].day}`, "info");
  };

  return (
    <DashboardShell
      role="mentor"
      title="Consultation Schedule"
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
              Advisory Sessions &amp; Office Hours
            </h2>
            <p className="text-xs text-tone-muted mt-1">
              Live 1-on-1 methodology consultations, oral defense simulations, and dissertation diagnostics.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => showToast("Google Calendar and Outlook calendar sync confirmed active.", "success")}
            >
              <CalendarCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Calendar Synced
            </Button>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Upcoming Sessions (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-tone-muted">
                Confirmed Upcoming Consultations
              </span>
              <span className="text-xs text-stone-500 font-sans">Timezone: UTC (GMT+0)</span>
            </div>

            {UPCOMING_SESSIONS.map((session) => (
              <Card key={session.id} className="bg-white border-tone-rule">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-base text-tone-heading">
                          {session.candidateName}
                        </span>
                        <Badge variant={session.type === "viva_prep" ? "gold" : "outline"} className="text-[10px]">
                          {session.type === "viva_prep" ? "Viva Mock Defense" : "Methodology Advisory"}
                        </Badge>
                      </div>
                      <p className="text-xs font-serif text-stone-700 leading-snug">
                        {session.topic}
                      </p>
                    </div>
                    <a
                      href={session.meetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-deep text-white text-xs font-semibold rounded-[2px] hover:bg-navy-deep/90 transition-colors shrink-0"
                    >
                      <Video className="w-3.5 h-3.5 text-gold" />
                      Join Call
                    </a>
                  </div>

                  <div className="pt-2 border-t border-tone-rule/60 flex flex-wrap items-center justify-between text-xs font-sans text-stone-500 gap-2">
                    <span className="flex items-center gap-1 text-stone-800 font-medium">
                      <Clock className="w-3.5 h-3.5 text-gold" />
                      {session.dateStr} &bull; {session.timeStr}
                    </span>
                    <span>Duration: {session.durationMinutes} mins</span>
                  </div>

                  {session.prepNote && (
                    <div className="p-2.5 bg-paper rounded-[2px] border border-tone-rule/80 text-[11px] text-stone-600 font-sans">
                      <strong className="text-navy font-semibold">Pre-session agenda: </strong>
                      {session.prepNote}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Availability Settings (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-tone-muted block">
              Weekly Office Hours Availability
            </span>

            <Card className="bg-white border-tone-rule">
              <CardHeader className="pb-3 border-b border-tone-rule">
                <CardTitle className="font-serif text-base text-tone-heading">
                  Recurring Advisory Slots
                </CardTitle>
                <p className="text-xs text-stone-500 font-sans">
                  Active slots are bookable by assigned doctoral mentees.
                </p>
              </CardHeader>
              <CardContent className="p-4 space-y-3 font-sans text-xs">
                {weeklyAvailability.map((item, idx) => (
                  <div
                    key={item.day}
                    className="p-3 bg-paper rounded-[2px] border border-tone-rule flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-800">{item.day}</span>
                        {item.enabled ? (
                          <Badge variant="outline" className="text-[9px] text-emerald-700 border-emerald-300 bg-emerald-50">
                            Active
                          </Badge>
                        ) : (
                          <span className="text-[10px] text-stone-400">Unavailable</span>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-500 block">
                        {item.slots.join(", ")}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleDay(idx)}
                      className={`text-xs px-2.5 py-1 rounded-[2px] font-medium transition-colors ${
                        item.enabled
                          ? "bg-stone-200 text-stone-700 hover:bg-stone-300"
                          : "bg-navy-deep text-white hover:bg-navy-deep/90"
                      }`}
                    >
                      {item.enabled ? "Disable" : "Enable"}
                    </button>
                  </div>
                ))}

                <div className="pt-3 border-t border-tone-rule space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-600">
                    <span>Session Buffer Time</span>
                    <span className="font-semibold text-stone-800">15 minutes</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-stone-600">
                    <span>Minimum Advance Notice</span>
                    <span className="font-semibold text-stone-800">24 hours</span>
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

