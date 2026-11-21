"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  Settings,
  User,
  GraduationCap,
  BookOpen,
  Award,
  Bell,
  Save,
  CheckCircle2,
} from "lucide-react";

export default function MentorSettingsPage() {
  const { showToast } = useToast();
  const [fullName, setFullName] = useState("Dr. Eleanor Vance");
  const [academicTitle, setAcademicTitle] = useState("Associate Professor of Quantitative Methodology");
  const [institution, setInstitution] = useState("Faculty of Social Sciences & Public Health");
  const [orcid, setOrcid] = useState("0000-0002-1825-0097");
  const [maxCaseload, setMaxCaseload] = useState(4);
  const [specializations, setSpecializations] = useState([
    "Propensity Score Matching",
    "Panel Econometrics",
    "Stata & R Programming",
    "Survival Analysis",
    "Viva Defense Interrogation",
  ]);
  const [notifySubmissions, setNotifySubmissions] = useState(true);
  const [notifySessions, setNotifySessions] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Faculty profile and mentoring preferences updated successfully.", "success");
  };

  return (
    <DashboardShell
      role="mentor"
      title="Faculty Settings"
      user={{
        id: "mentor-101",
        name: fullName,
        email: "e.vance@gradedge.org",
        institution: "Senior Faculty Mentor",
      }}
    >
      <form onSubmit={handleSave} className="space-y-6">
        {/* Header */}
        <div className="border-b border-tone-rule pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-medium text-tone-heading">
              Faculty Profile &amp; Mentoring Preferences
            </h2>
            <p className="text-xs text-tone-muted mt-1">
              Configure your academic credentials, methodological specializations, and doctoral mentee caseload capacity.
            </p>
          </div>
          <Button variant="accent" size="sm" type="submit">
            <Save className="w-3.5 h-3.5 mr-1.5" />
            Save Profile Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Credentials Form (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <Card className="bg-white border-tone-rule">
              <CardHeader className="border-b border-tone-rule pb-4">
                <CardTitle className="font-serif text-base text-tone-heading">
                  Academic Credentials &amp; Verification
                </CardTitle>
                <p className="text-xs text-stone-500 font-sans">
                  Details displayed to prospective doctoral candidates during faculty matching.
                </p>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-xs font-sans">
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Full Academic Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2 bg-paper border border-stone-200 rounded-[2px] focus:outline-hidden focus:border-gold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Academic Title &amp; Rank</label>
                  <input
                    type="text"
                    value={academicTitle}
                    onChange={(e) => setAcademicTitle(e.target.value)}
                    className="w-full p-2 bg-paper border border-stone-200 rounded-[2px] focus:outline-hidden focus:border-gold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Current University Affiliation</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full p-2 bg-paper border border-stone-200 rounded-[2px] focus:outline-hidden focus:border-gold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">ORCID Researcher ID</label>
                  <input
                    type="text"
                    value={orcid}
                    onChange={(e) => setOrcid(e.target.value)}
                    className="w-full p-2 bg-paper border border-stone-200 rounded-[2px] focus:outline-hidden focus:border-gold"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Methodological Specializations */}
            <Card className="bg-white border-tone-rule">
              <CardHeader className="border-b border-tone-rule pb-4">
                <CardTitle className="font-serif text-base text-tone-heading">
                  Methodology Specializations
                </CardTitle>
                <p className="text-xs text-stone-500 font-sans">
                  The GradEdge algorithm matches candidates according to these declared methodological strengths.
                </p>
              </CardHeader>
              <CardContent className="p-5 space-y-3 font-sans">
                <div className="flex flex-wrap gap-2">
                  {specializations.map((spec) => (
                    <span
                      key={spec}
                      className="px-2.5 py-1 bg-paper border border-tone-rule rounded-[2px] text-xs font-medium text-navy flex items-center gap-1.5"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-stone-400 pt-1">
                  To modify certified specializations or add advanced econometrics modules, contact Academic Operations.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Caseload & Notifications (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Caseload Capacity */}
            <Card className="bg-white border-tone-rule">
              <CardHeader className="border-b border-tone-rule pb-4">
                <CardTitle className="font-serif text-base text-tone-heading">
                  Doctoral Mentee Capacity
                </CardTitle>
                <p className="text-xs text-stone-500 font-sans">
                  Ensure balanced workloads to maintain the 48-hour SLA for manuscript redlines.
                </p>
              </CardHeader>
              <CardContent className="p-5 space-y-4 font-sans text-xs">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-stone-700">Maximum Active Scholars</span>
                    <span className="font-serif font-bold text-lg text-gold">{maxCaseload} Candidates</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={maxCaseload}
                    onChange={(e) => setMaxCaseload(parseInt(e.target.value, 10))}
                    className="w-full accent-gold h-1.5"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                    <span>1 (Light)</span>
                    <span>3 (Moderate)</span>
                    <span>6 (Full Faculty Load)</span>
                  </div>
                </div>

                <div className="p-3 bg-paper rounded-[2px] border border-tone-rule text-[11px] text-stone-600">
                  Current active load: <strong className="text-navy">4 / {maxCaseload} candidates</strong>. Your profile is currently marked as <Badge variant="gold" className="text-[9px] ml-1">At Capacity</Badge>.
                </div>
              </CardContent>
            </Card>

            {/* Notification Alerts */}
            <Card className="bg-white border-tone-rule">
              <CardHeader className="border-b border-tone-rule pb-4">
                <CardTitle className="font-serif text-base text-tone-heading">
                  SLA &amp; Notification Alerts
                </CardTitle>
                <p className="text-xs text-stone-500 font-sans">
                  Select your alert preferences for candidate submissions and consultations.
                </p>
              </CardHeader>
              <CardContent className="p-5 space-y-3 font-sans text-xs">
                <label className="flex items-center justify-between cursor-pointer p-2 rounded-[2px] hover:bg-paper">
                  <div>
                    <span className="font-medium text-stone-800 block">Chapter Submission Alerts</span>
                    <span className="text-[11px] text-stone-500">Instant email when a mentee submits a new draft</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifySubmissions}
                    onChange={(e) => setNotifySubmissions(e.target.checked)}
                    className="accent-gold w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer p-2 rounded-[2px] hover:bg-paper">
                  <div>
                    <span className="font-medium text-stone-800 block">Consultation Reminders</span>
                    <span className="text-[11px] text-stone-500">SMS / calendar reminder 2 hours prior to 1-on-1 calls</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifySessions}
                    onChange={(e) => setNotifySessions(e.target.checked)}
                    className="accent-gold w-4 h-4"
                  />
                </label>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </DashboardShell>
  );
}

