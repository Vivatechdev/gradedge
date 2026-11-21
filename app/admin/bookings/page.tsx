"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Video,
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Filter,
} from "lucide-react";

interface BookingItem {
  id: string;
  candidateName: string;
  candidateEmail: string;
  mentorName: string;
  serviceTitle: string;
  scheduledTime: string;
  timezone: string;
  meetingUrl: string;
  status: "confirmed" | "completed" | "pending_payment";
}

interface MentorFaculty {
  id: string;
  name: string;
  discipline: string;
  activeMentees: number;
  capacity: number;
  rating: number;
  status: "Available" | "At Capacity" | "On Leave";
}

const INITIAL_BOOKINGS: BookingItem[] = [
  {
    id: "bk-301",
    candidateName: "Freedom Sola",
    candidateEmail: "freedom.sola@cam.ac.uk",
    mentorName: "Dr. Eleanor Vance",
    serviceTitle: "Chapter 3 Methodology Consultation",
    scheduledTime: "Nov 23, 2026 at 14:00 UTC",
    timezone: "UTC",
    meetingUrl: "https://meet.google.com/abc-defg-hij",
    status: "confirmed",
  },
  {
    id: "bk-302",
    candidateName: "Amina Bello",
    candidateEmail: "a.bello@lse.ac.uk",
    mentorName: "Dr. Alex Taylor",
    serviceTitle: "Stata Econometric Syntax Audit",
    scheduledTime: "Nov 24, 2026 at 10:30 UTC",
    timezone: "UTC",
    meetingUrl: "https://meet.google.com/xyz-uvwx-rst",
    status: "confirmed",
  },
  {
    id: "bk-303",
    candidateName: "Chidi Okafor",
    candidateEmail: "chidi.okafor@ed.ac.uk",
    mentorName: "Dr. Marcus King",
    serviceTitle: "Qualitative Thematic Coding Review",
    scheduledTime: "Nov 25, 2026 at 15:00 UTC",
    timezone: "UTC",
    meetingUrl: "https://meet.google.com/qrs-tuvw-xyz",
    status: "confirmed",
  },
  {
    id: "bk-304",
    candidateName: "Khadija Umar",
    candidateEmail: "k.umar@imperial.ac.uk",
    mentorName: "Dr. Heather Wright",
    serviceTitle: "Journal Submission Strategy",
    scheduledTime: "Nov 26, 2026 at 11:00 UTC",
    timezone: "UTC",
    meetingUrl: "https://meet.google.com/klm-nopq-rst",
    status: "pending_payment",
  },
];

const MENTOR_POOL: MentorFaculty[] = [
  {
    id: "m-01",
    name: "Dr. Eleanor Vance",
    discipline: "Biostatistics & Quantitative Modeling",
    activeMentees: 4,
    capacity: 5,
    rating: 4.95,
    status: "Available",
  },
  {
    id: "m-02",
    name: "Dr. Alex Taylor",
    discipline: "Applied Econometrics & Stata/Python",
    activeMentees: 3,
    capacity: 4,
    rating: 4.92,
    status: "Available",
  },
  {
    id: "m-03",
    name: "Dr. Marcus King",
    discipline: "Qualitative Inquiry & NVivo Hierarchy",
    activeMentees: 4,
    capacity: 4,
    rating: 4.88,
    status: "At Capacity",
  },
  {
    id: "m-04",
    name: "Dr. Heather Wright",
    discipline: "Literature Synthesis & Academic Prose",
    activeMentees: 2,
    capacity: 4,
    rating: 4.97,
    status: "Available",
  },
  {
    id: "m-05",
    name: "Dr. Samuel Oladipo",
    discipline: "Research Design & Mixed Methods",
    activeMentees: 1,
    capacity: 3,
    rating: 4.90,
    status: "Available",
  },
];

export default function AdminBookingsPage() {
  const [activeTab, setActiveTab] = useState<"sessions" | "mentors">("sessions");
  const [search, setSearch] = useState("");

  const filteredBookings = INITIAL_BOOKINGS.filter(
    (b) =>
      b.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      b.mentorName.toLowerCase().includes(search.toLowerCase()) ||
      b.serviceTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardShell
      role="admin"
      title="Bookings & Faculty Mentor Pool"
      user={{
        name: "Freedom Sola",
        email: "admin@gradedge.com",
        institution: "Academic Operations Hub",
      }}
    >
      <div className="space-y-6 max-w-6xl">
        {/* Top Header */}
        <div className="border-b border-tone-rule pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="type-micro text-gold">Advisory Scheduling &amp; Capacity</span>
              <span className="text-tone-rule">&bull;</span>
              <span className="text-xs text-tone-muted font-mono">100% Calendar Sync</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif text-tone-heading font-medium">
              Consultation Sessions &amp; Faculty Pool
            </h1>
            <p className="text-xs sm:text-sm text-tone-muted mt-1 max-w-xl leading-relaxed">
              Track 1-on-1 methodology consultations, Google Meet links, and manage mentor workload distribution.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="accent"
              size="sm"
              onClick={() => alert("Calendar Sync check: All 5 faculty calendars are in sync with Google Workspace.")}
            >
              Sync Calendars
            </Button>
          </div>
        </div>

        {/* Operational Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card background="white" className="border-tone-rule shadow-2xs">
            <CardHeader className="pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-tone-muted">
                Upcoming Sessions
              </span>
              <CardTitle className="text-2xl font-serif text-navy">
                {INITIAL_BOOKINGS.filter((b) => b.status === "confirmed").length} Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-stone-500">Confirmed next 7 days</p>
            </CardContent>
          </Card>

          <Card background="white" className="border-tone-rule shadow-2xs">
            <CardHeader className="pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-tone-muted">
                Faculty Mentors Active
              </span>
              <CardTitle className="text-2xl font-serif text-emerald-700">
                {MENTOR_POOL.length} Scholars
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-stone-500">All doctoral supervisors</p>
            </CardContent>
          </Card>

          <Card background="white" className="border-tone-rule shadow-2xs">
            <CardHeader className="pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-tone-muted">
                Total Pool Capacity
              </span>
              <CardTitle className="text-2xl font-serif text-navy">
                {MENTOR_POOL.reduce((acc, m) => acc + m.activeMentees, 0)} /{" "}
                {MENTOR_POOL.reduce((acc, m) => acc + m.capacity, 0)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-gold font-medium">70% capacity utilized</p>
            </CardContent>
          </Card>

          <Card background="white" className="border-tone-rule shadow-2xs">
            <CardHeader className="pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-tone-muted">
                Average Mentor Rating
              </span>
              <CardTitle className="text-2xl font-serif text-navy">4.92 / 5.0</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-stone-500">Post-session student feedback</p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-3 border-b border-tone-rule pb-2">
          <button
            onClick={() => setActiveTab("sessions")}
            className={`pb-2 px-1 text-sm font-sans font-semibold transition-colors cursor-pointer border-b-2 -mb-2.5 ${
              activeTab === "sessions"
                ? "border-gold text-navy"
                : "border-transparent text-tone-muted hover:text-tone-heading"
            }`}
          >
            Scheduled Consultations ({INITIAL_BOOKINGS.length})
          </button>
          <button
            onClick={() => setActiveTab("mentors")}
            className={`pb-2 px-1 text-sm font-sans font-semibold transition-colors cursor-pointer border-b-2 -mb-2.5 ${
              activeTab === "mentors"
                ? "border-gold text-navy"
                : "border-transparent text-tone-muted hover:text-tone-heading"
            }`}
          >
            Faculty Mentor Pool ({MENTOR_POOL.length})
          </button>
        </div>

        {/* Tab 1: Scheduled Sessions */}
        {activeTab === "sessions" && (
          <div className="bg-white border border-tone-rule rounded-[4px] overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-tone-rule bg-paper flex items-center justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search student or mentor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-8 pl-9 pr-3 text-xs font-sans bg-white border border-tone-rule rounded-[2px] text-tone-heading focus:outline-none focus:border-gold"
                />
              </div>
              <span className="text-xs text-stone-500 font-sans hidden sm:inline">
                All video links encrypted via Google Meet
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-paper border-b border-tone-rule text-[11px] uppercase tracking-wider text-tone-muted font-semibold">
                  <tr>
                    <th className="py-3 px-4">Ref &amp; Date</th>
                    <th className="py-3 px-4">Candidate Scholar</th>
                    <th className="py-3 px-4">Consultation Topic</th>
                    <th className="py-3 px-4">Allocated Mentor</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Session Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-tone-rule">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-paper/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-[10px] text-gold font-semibold mb-0.5">
                          {b.id}
                        </div>
                        <div className="flex items-center gap-1 text-tone-heading font-medium">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span>{b.scheduledTime}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-tone-heading">{b.candidateName}</div>
                        <div className="text-[11px] text-stone-400">{b.candidateEmail}</div>
                      </td>

                      <td className="py-3.5 px-4 font-serif text-sm text-navy">
                        {b.serviceTitle}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-tone-heading">{b.mentorName}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge variant={b.status === "confirmed" ? "success" : "warning"}>
                          {b.status === "confirmed" ? "Confirmed" : "Payment Pending"}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <a
                          href={b.meetingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-navy hover:text-gold transition-colors px-2.5 py-1 bg-paper border border-tone-rule rounded-[2px]"
                        >
                          <Video className="w-3.5 h-3.5 text-gold" />
                          <span>Google Meet</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Faculty Mentor Pool */}
        {activeTab === "mentors" && (
          <div className="bg-white border border-tone-rule rounded-[4px] overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-paper border-b border-tone-rule text-[11px] uppercase tracking-wider text-tone-muted font-semibold">
                  <tr>
                    <th className="py-3 px-4">Mentor Name</th>
                    <th className="py-3 px-4">Discipline &amp; Specialty</th>
                    <th className="py-3 px-4">Active Mentees</th>
                    <th className="py-3 px-4">Capacity Status</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-tone-rule">
                  {MENTOR_POOL.map((m) => (
                    <tr key={m.id} className="hover:bg-paper/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-tone-heading">{m.name}</div>
                        <div className="font-mono text-[10px] text-stone-400">{m.id}</div>
                      </td>

                      <td className="py-3.5 px-4 text-tone-body font-medium">
                        {m.discipline}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-navy">{m.activeMentees}</span>
                          <span className="text-stone-400">/ {m.capacity} max</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge variant={m.status === "Available" ? "success" : "warning"}>
                          {m.status}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-gold">★ {m.rating}</span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => alert(`Profile for ${m.name}: Available for new doctoral assignments.`)}
                        >
                          View Profile
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
