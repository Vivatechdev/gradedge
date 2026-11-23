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
  FolderKanban,
  Calendar,
  User,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function StudentProjectsPage() {
  const student = useStudent();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/student/projects");
        const json = await res.json();
        if (res.ok) {
          setProjects(json.projects || []);
        }
      } catch (e) {
        console.error("Failed to load projects", e);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <DashboardShell
      role="student"
      title="My Projects"
      user={{
        name: student.name,
        email: student.email,
        institution: student.institution,
      }}
    >
      <div className="space-y-6">
        {/* Header with Action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-tone-rule pb-5">
          <div className="space-y-1">
            <span className="type-micro text-gold">Milestone Tracking</span>
            <h1 className="font-serif text-2xl font-medium text-tone-heading">
              Research Mentoring Projects
            </h1>
            <p className="text-xs text-tone-muted leading-relaxed font-sans">
              Track active chapter milestones, mentor critiques, draft versions, and deliverables.
            </p>
          </div>
          <Button variant="accent" href="/student/requests/new" size="sm">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            <span>New Research Request</span>
          </Button>
        </div>

        {/* Projects List */}
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon={<FolderKanban className="w-8 h-8 text-tone-muted" />}
            title="No research projects in progress"
            description="When you purchase a mentoring milestone or submit an academic support request, your dedicated workspace and chapter progress will appear here."
            action={
              <Button variant="accent" href="/student/requests/new">
                Request Research Support
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {projects.map((p) => {
              const statusVariant =
                p.status === "active"
                  ? "navy"
                  : p.status === "completed"
                  ? "default"
                  : p.status === "scoping"
                  ? "gold"
                  : "muted";

              return (
                <div
                  key={p.id}
                  className="bg-white border border-tone-rule rounded-[2px] p-5 sm:p-6 space-y-4 shadow-xs hover:border-navy/40 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-tone-muted">
                          {p.serviceTitle}
                        </span>
                        <Badge variant={statusVariant as any} className="capitalize text-[10px]">
                          {p.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <h2 className="font-serif text-lg font-medium text-tone-heading">
                        <Link
                          href={`/student/projects/${p.id}`}
                          className="hover:text-navy hover:underline transition-colors"
                        >
                          {p.title}
                        </Link>
                      </h2>
                      <p className="text-xs text-tone-muted line-clamp-2 leading-relaxed">
                        {p.brief}
                      </p>
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      href={`/student/projects/${p.id}`}
                      className="shrink-0 text-xs"
                    >
                      <span>Open Workspace</span>
                      <ArrowRight className="w-3 h-3 ml-1.5" />
                    </Button>
                  </div>

                  {/* Metadata Row and Progress */}
                  <div className="pt-3 border-t border-tone-rule grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-tone-muted">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-gold shrink-0" />
                      <span className="truncate">Mentor: {p.mentorName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-gold shrink-0" />
                      <span>Due: {p.dueDate || "Flexible completion"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0" />
                      <span>
                        Milestones: {p.milestonesCompleted} of {p.milestonesTotal || 0} approved
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

