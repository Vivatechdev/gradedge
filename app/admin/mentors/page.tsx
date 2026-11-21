"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  Award,
  Users,
  CreditCard,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  Plus,
  Send,
  Download,
} from "lucide-react";

interface FacultyMentor {
  id: string;
  name: string;
  title: string;
  institution: string;
  specialization: string;
  activeMentees: number;
  maxCapacity: number;
  averageRating: number;
  lifetimeHonorariumGbp: number;
  pendingHonorariumGbp: number;
  verifiedAt: string;
  status: "active" | "at_capacity" | "sabbatical";
}

const MENTORS_DATA: FacultyMentor[] = [
  {
    id: "f-101",
    name: "Dr. Eleanor Vance",
    title: "Associate Professor of Quantitative Methodology",
    institution: "University of Cambridge",
    specialization: "Propensity Score Matching, Stata & R, Panel Econometrics",
    activeMentees: 4,
    maxCapacity: 4,
    averageRating: 4.96,
    lifetimeHonorariumGbp: 18450,
    pendingHonorariumGbp: 450,
    verifiedAt: "Oct 2024",
    status: "at_capacity",
  },
  {
    id: "f-102",
    name: "Prof. Arthur Pendelton",
    title: "Chair of Econometric Theory & Public Policy",
    institution: "London School of Economics",
    specialization: "Dynamic Panel GMM, Instrumental Variables, Macroeconomics",
    activeMentees: 3,
    maxCapacity: 5,
    averageRating: 4.92,
    lifetimeHonorariumGbp: 22800,
    pendingHonorariumGbp: 800,
    verifiedAt: "Jan 2024",
    status: "active",
  },
  {
    id: "f-103",
    name: "Dr. Miriam Al-Hassan",
    title: "Senior Lecturer in Qualitative Research Methods",
    institution: "University of Oxford",
    specialization: "Phenomenology, Grounded Theory, NVivo Reflexive Coding",
    activeMentees: 2,
    maxCapacity: 4,
    averageRating: 4.98,
    lifetimeHonorariumGbp: 14200,
    pendingHonorariumGbp: 650,
    verifiedAt: "May 2025",
    status: "active",
  },
  {
    id: "f-104",
    name: "Dr. Kwesi Mensah",
    title: "Reader in Biostatistics & Epidemiology",
    institution: "Imperial College London",
    specialization: "Survival Analysis, Cox Proportional Hazards, Clinical Trials",
    activeMentees: 4,
    maxCapacity: 4,
    averageRating: 4.95,
    lifetimeHonorariumGbp: 19600,
    pendingHonorariumGbp: 1200,
    verifiedAt: "Sep 2024",
    status: "at_capacity",
  },
];

export default function AdminMentorsPage() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMentors = MENTORS_DATA.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.institution.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPendingPayout = MENTORS_DATA.reduce((sum, m) => sum + m.pendingHonorariumGbp, 0);

  const handleDisburseBatch = () => {
    showToast(
      `Batch Honorarium of £${totalPendingPayout.toLocaleString()} approved and triggered via Wise Batch API.`,
      "success"
    );
  };

  const handleInviteScholar = () => {
    showToast("Faculty Appointment Invitation Portal opened.", "info");
  };

  return (
    <DashboardShell
      role="admin"
      title="Faculty Management"
      user={{
        id: "admin-1",
        name: "System Administrator",
        email: "admin@gradedge.org",
        institution: "GradEdge Operations",
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-tone-rule pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-medium text-tone-heading">
              Faculty Roster &amp; Honorarium Management
            </h2>
            <p className="text-xs text-tone-muted mt-1">
              Active PhD advisors, caseload distribution, turnaround metrics, and batch honorarium disbursements.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleInviteScholar}>
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Recruit Senior Scholar
            </Button>
            <Button variant="accent" size="sm" onClick={handleDisburseBatch}>
              <CreditCard className="w-3.5 h-3.5 mr-1.5" />
              Disburse Batch (£{totalPendingPayout.toLocaleString()})
            </Button>
          </div>
        </div>

        {/* 3 Top Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-white border-tone-rule">
            <CardHeader className="pb-1">
              <span className="type-micro uppercase text-tone-muted tracking-wider">
                Vetted Senior Faculty
              </span>
              <div className="flex items-center justify-between pt-1">
                <span className="font-serif text-2xl font-bold text-tone-heading">
                  14 PhD Advisors
                </span>
                <Award className="w-5 h-5 text-gold" />
              </div>
            </CardHeader>
            <CardContent>
              <span className="text-[11px] text-stone-500 font-sans">
                Oxford, Cambridge, LSE &amp; Imperial faculty
              </span>
            </CardContent>
          </Card>

          <Card className="bg-white border-tone-rule">
            <CardHeader className="pb-1">
              <span className="type-micro uppercase text-tone-muted tracking-wider">
                Average Faculty Rating
              </span>
              <div className="flex items-center justify-between pt-1">
                <span className="font-serif text-2xl font-bold text-emerald-700">
                  4.95 / 5.0
                </span>
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <span className="text-[11px] text-stone-500 font-sans">
                Across 240+ completed student evaluations
              </span>
            </CardContent>
          </Card>

          <Card className="bg-white border-tone-rule">
            <CardHeader className="pb-1">
              <span className="type-micro uppercase text-tone-muted tracking-wider">
                Pending Honorarium Clearing
              </span>
              <div className="flex items-center justify-between pt-1">
                <span className="font-serif text-2xl font-bold text-amber-700">
                  £{totalPendingPayout.toLocaleString()}
                </span>
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <span className="text-[11px] text-stone-500 font-sans">
                Ready for weekly Friday disbursement
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Faculty Roster Table */}
        <Card className="bg-white border-tone-rule">
          <CardHeader className="border-b border-tone-rule pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="font-serif text-base text-tone-heading">
                  Faculty Advisory Roster
                </CardTitle>
                <p className="text-xs text-stone-500 font-sans">
                  Caseload capacity is monitored continuously to guarantee 48-hour manuscript turnaround.
                </p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filter faculty by name, school..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1 text-xs bg-paper border border-stone-200 rounded-[2px] focus:outline-hidden focus:border-gold"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full min-w-[700px] text-xs font-sans text-left">
              <thead className="bg-paper border-b border-tone-rule text-stone-500 uppercase tracking-wide text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Faculty Scholar</th>
                  <th className="py-3 px-4 font-semibold">Specializations</th>
                  <th className="py-3 px-4 font-semibold text-center">Caseload</th>
                  <th className="py-3 px-4 font-semibold text-center">Rating</th>
                  <th className="py-3 px-4 font-semibold text-right">Lifetime Paid</th>
                  <th className="py-3 px-4 font-semibold text-right">Pending</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tone-rule">
                {filteredMentors.map((m) => (
                  <tr key={m.id} className="hover:bg-paper/50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-tone-heading block font-serif text-sm">
                        {m.name}
                      </span>
                      <span className="text-[11px] text-stone-500 block">
                        {m.institution} &bull; {m.title}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-700 max-w-xs">
                      {m.specialization}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-semibold text-navy">
                        {m.activeMentees} / {m.maxCapacity}
                      </span>
                      {m.status === "at_capacity" && (
                        <Badge variant="gold" className="text-[9px] block mt-0.5 mx-auto w-fit">
                          At Capacity
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-stone-800">
                      ★ {m.averageRating}
                    </td>
                    <td className="py-3 px-4 text-right font-serif font-bold text-stone-900">
                      £{m.lifetimeHonorariumGbp.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-serif font-bold text-amber-700">
                      £{m.pendingHonorariumGbp}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => showToast(`Opening caseload allocation drawer for ${m.name}`, "info")}
                      >
                        Caseload
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

