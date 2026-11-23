"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useStudent } from "@/components/layout/student-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import {
  GraduationCap,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Video,
  FileText,
} from "lucide-react";

export default function StudentAcceleratorPage() {
  const student = useStudent();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/student/accelerator");
        const json = await res.json();
        if (res.ok) {
          setData(json);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const application = data?.application;
  const isPaid = data?.isPaid;
  const cohort = data?.cohortDetails;

  return (
    <DashboardShell
      role="student"
      title="Doctoral Accelerator"
      user={{
        name: student.name,
        email: student.email,
        institution: student.institution,
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-tone-rule pb-4 space-y-1">
          <span className="type-micro text-gold">Intensive Cohort Program</span>
          <h1 className="font-serif text-2xl font-medium text-tone-heading">
            12-Week Doctoral Research Accelerator
          </h1>
          <p className="text-xs text-tone-muted leading-relaxed font-sans">
            Guiding candidates from research questions to defended dissertations through bi-weekly live clinics and methodology reviews.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
          </div>
        ) : !application ? (
          /* NO APPLICATION YET */
          <EmptyState
            icon={<GraduationCap className="w-8 h-8 text-tone-muted" />}
            title="You have not submitted an Accelerator application"
            description="The 12-Week Doctoral Research Accelerator is our structured cohort journey for researchers completing their dissertation. Applications are reviewed on a rolling basis."
            action={
              <Button variant="accent" href="/accelerator/apply">
                Apply for Next Cohort
              </Button>
            }
          />
        ) : isPaid && application.status === "accepted" ? (
          /* ACCEPTED and PAID -> PROGRAM HOME PLACEHOLDER */
          <div className="space-y-6">
            {/* Program Home Banner */}
            <div className="bg-white border border-tone-rule rounded-[2px] p-6 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-tone-rule pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-[10px]">
                      Enrolled Candidate
                    </Badge>
                    <span className="text-[10px] font-mono text-tone-muted">
                      ID: {application.id.slice(0, 8)}
                    </span>
                  </div>
                  <h2 className="font-serif text-xl font-medium text-tone-heading">
                    {cohort?.cohortName}
                  </h2>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-mono uppercase text-tone-muted block">
                    Cohort Start Date
                  </span>
                  <span className="font-serif text-base font-semibold text-navy">
                    {cohort?.startDate}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-tone-muted pt-1">
                <div>
                  <span className="font-medium text-tone-heading block">Advisory Oversight:</span>
                  <span>{cohort?.advisorDesk}</span>
                </div>
                <div>
                  <span className="font-medium text-tone-heading block">Format:</span>
                  <span>Bi-weekly 60-min live clinics, written chapter critiques and mock defense</span>
                </div>
              </div>
            </div>

            {/* Timetable / Schedule of Live Sessions */}
            <div className="bg-white border border-tone-rule rounded-[2px] p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-tone-rule pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gold" />
                  <h3 className="font-serif text-base font-semibold text-tone-heading">
                    Live Session and Workshop Timetable
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-tone-muted">12-Week Syllabus</span>
              </div>

              <div className="divide-y divide-tone-rule text-xs">
                {cohort?.schedule.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-paper/30 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] bg-paper px-1.5 py-0.5 border border-tone-rule rounded-[2px] text-tone-muted">
                          {item.week}
                        </span>
                        <span className="font-medium text-tone-heading">
                          {item.topic}
                        </span>
                      </div>
                      <span className="text-[11px] text-tone-muted block">
                        Date: {item.date} &bull; Time: {item.time}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-stone-400 shrink-0">
                      Link generated 24h prior
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* "Lessons will appear here" Empty State (Phase 2 notice) */}
            <div className="border border-dashed border-tone-rule bg-paper p-8 text-center rounded-[2px] space-y-2">
              <BookOpen className="w-6 h-6 text-tone-muted mx-auto" />
              <h4 className="font-serif text-base font-medium text-tone-heading">
                Lessons will appear here
              </h4>
              <p className="text-xs text-tone-muted max-w-md mx-auto leading-relaxed">
                Asynchronous curriculum video modules, syllabus readings, and statistical analysis templates will unlock here as each milestone week begins.
              </p>
            </div>
          </div>
        ) : (
          /* APPLICATION STATUS REVIEW (With plain language explanations) */
          <div className="bg-white border border-tone-rule rounded-[2px] p-6 sm:p-8 space-y-6 shadow-xs max-w-2xl">
            <div className="border-b border-tone-rule pb-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-tone-muted">
                  Admissions Status
                </span>
                <Badge
                  variant={
                    application.status === "accepted"
                      ? "default"
                      : application.status === "waitlisted"
                      ? "gold"
                      : application.status === "declined"
                      ? "outline"
                      : "navy"
                  }
                  className="capitalize text-[10px]"
                >
                  {application.status.replace("_", " ")}
                </Badge>
              </div>

              <h2 className="font-serif text-xl font-medium text-tone-heading">
                {application.status === "submitted" && "Application Submitted and Under Desk Review"}
                {application.status === "under_review" && "Detailed Faculty Committee Assessment"}
                {application.status === "accepted" && "Candidate Clearance Granted: Action Required"}
                {application.status === "waitlisted" && "Application Waitlisted for Subsequent Cohort"}
                {application.status === "declined" && "Admissions Assessment Concluded"}
              </h2>
            </div>

            {/* Plain-Language Status Explanation */}
            <div className="p-4 bg-paper border border-tone-rule rounded-[2px] text-xs space-y-2 leading-relaxed">
              <span className="font-semibold text-tone-heading block">Status Explanation:</span>
              {application.status === "submitted" && (
                <p className="text-tone-muted">
                  Our academic admissions desk is reviewing your research proposal, stage of research, and cohort readiness. Decision notifications are delivered within 48 business hours.
                </p>
              )}
              {application.status === "under_review" && (
                <p className="text-tone-muted">
                  A senior faculty reviewer in your discipline is currently evaluating your methodology framework and empirical requirements.
                </p>
              )}
              {application.status === "accepted" && !isPaid && (
                <div className="space-y-3">
                  <p className="text-tone-heading font-medium">
                    Congratulations! Your research proposal has been cleared by the faculty admissions committee.
                  </p>
                  <p className="text-tone-muted">
                    To finalize your seat in the upcoming cohort and receive your onboarding materials, please complete your tuition registration below.
                  </p>
                  <Button
                    variant="accent"
                    size="md"
                    href={`/checkout/accelerator?applicationId=${application.id}`}
                  >
                    <span>Proceed to Tuition Registration &rarr;</span>
                  </Button>
                </div>
              )}
              {application.status === "waitlisted" && (
                <p className="text-tone-muted">
                  Your research meets our academic rigor standards, but all faculty seats in your specific field are currently at capacity. If an enrolled candidate reschedules, you will be offered immediate entry.
                </p>
              )}
              {application.status === "declined" && (
                <p className="text-tone-muted">
                  Our admissions board determined that our current faculty cohort cannot provide the specialized methodology supervision your thesis requires at this time.
                </p>
              )}
            </div>

            {/* Application Summary Intake Copy */}
            <div className="space-y-3 text-xs pt-2">
              <span className="font-semibold text-tone-heading uppercase tracking-wider text-[10px] block">
                Submitted Application Summary:
              </span>
              <div className="bg-paper/50 p-3.5 border border-tone-rule rounded-[2px] space-y-2 text-tone-body">
                <div>
                  <strong className="text-tone-heading">Stage of Research:</strong>{" "}
                  <span>{application.stage_of_research}</span>
                </div>
                <div>
                  <strong className="text-tone-heading">Dissertation Focus:</strong>{" "}
                  <p className="mt-0.5 text-tone-muted leading-relaxed">{application.topic_summary}</p>
                </div>
                <div>
                  <strong className="text-tone-heading">Primary Objectives:</strong>{" "}
                  <p className="mt-0.5 text-tone-muted leading-relaxed">{application.goals}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
