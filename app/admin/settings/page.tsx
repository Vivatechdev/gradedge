"use client";

import React, { useState, useEffect } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PaginatedTable, ColumnDef } from "@/components/ui/paginated-table";
import { useToast } from "@/components/ui/toast";
import {
  Mail,
  Clock,
  Activity,
  Save,
  Play,
  CheckCircle2,
  AlertCircle,
  FileText,
  RotateCcw,
} from "lucide-react";
import { DEFAULT_EMAIL_TEMPLATES, EmailTemplateKey, TemplateConfig } from "@/lib/email/settings";

const TEMPLATE_OPTIONS: { key: EmailTemplateKey; label: string; group: string }[] = [
  { key: "welcome", label: "Welcome / Account Created", group: "Onboarding" },
  { key: "email_verification", label: "Email Verification", group: "Onboarding" },
  { key: "password_reset", label: "Password Reset", group: "Auth" },
  { key: "consultation_confirmed", label: "Consultation Confirmed", group: "Bookings" },
  { key: "session_reminder_24h", label: "Session Reminder (24h)", group: "Bookings" },
  { key: "session_reminder_1h", label: "Session Reminder (1h)", group: "Bookings" },
  { key: "booking_cancelled_or_rescheduled", label: "Session Cancelled / Rescheduled", group: "Bookings" },
  { key: "payment_receipt", label: "Payment Receipt and Invoice", group: "Billing" },
  { key: "payment_failed", label: "Payment Failed", group: "Billing" },
  { key: "membership_renewal_notice", label: "Membership Renewal (3-day)", group: "Billing" },
  { key: "membership_cancelled", label: "Membership Cancelled", group: "Billing" },
  { key: "accelerator_application_received", label: "Accelerator Application Received", group: "Accelerator" },
  { key: "accelerator_accepted", label: "Accelerator Accepted with Offer", group: "Accelerator" },
  { key: "accelerator_waitlisted", label: "Accelerator Waitlisted", group: "Accelerator" },
  { key: "accelerator_declined", label: "Accelerator Declined (Kind and Respectful)", group: "Accelerator" },
  { key: "mentor_assigned", label: "Mentor Appointed to Candidate", group: "Advisory" },
  { key: "new_message_digest", label: "Unread Message Digest", group: "Advisory" },
  { key: "project_status_changed", label: "Project Milestone Status Changed", group: "Projects" },
  { key: "newsletter_double_opt_in", label: "Newsletter Double Opt-in", group: "Marketing" },
  { key: "workshop_request_received", label: "Workshop Inquiry Received", group: "Institutional" },
  { key: "resource_download_delivery", label: "Resource Download Delivery", group: "Resources" },
];

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"email" | "operations" | "cron">("email");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [triggeringCron, setTriggeringCron] = useState(false);

  // Email template state
  const [templates, setTemplates] = useState<Record<string, TemplateConfig>>(DEFAULT_EMAIL_TEMPLATES);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<EmailTemplateKey>("welcome");

  // Operational settings
  const [mentorResponseWindow, setMentorResponseWindow] = useState(
    "24 business hours (Monday–Friday, 9:00 AM – 6:00 PM)"
  );

  // Cron runs
  const [cronRuns, setCronRuns] = useState<any[]>([]);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.emailTemplates) setTemplates(data.emailTemplates);
          if (data.mentorResponseWindow) setMentorResponseWindow(data.mentorResponseWindow);
          if (data.cronRuns) setCronRuns(data.cronRuns);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const currentTemplate = templates[selectedTemplateKey] || DEFAULT_EMAIL_TEMPLATES[selectedTemplateKey];

  const handleTemplateChange = (field: "subject" | "intro", value: string) => {
    setTemplates((prev) => ({
      ...prev,
      [selectedTemplateKey]: {
        ...prev[selectedTemplateKey],
        [field]: value,
      },
    }));
  };

  const handleResetCurrentTemplate = () => {
    const defaultVal = DEFAULT_EMAIL_TEMPLATES[selectedTemplateKey];
    setTemplates((prev) => ({
      ...prev,
      [selectedTemplateKey]: defaultVal,
    }));
    toast({
      title: "Template Reset",
      message: "Reverted current template to GradEdge canonical default.",
      type: "info",
    });
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailTemplates: templates,
          mentorResponseWindow,
        }),
      });

      if (!res.ok) throw new Error("Failed to save platform settings.");

      toast({
        title: "Settings Saved",
        message: "Email templates and operational parameters have been updated.",
        type: "success",
      });
    } catch (err: any) {
      toast({
        title: "Save Failed",
        message: err.message,
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTriggerCronAll = async () => {
    setTriggeringCron(true);
    try {
      const res = await fetch("/api/cron/all", { method: "POST" });
      const data = await res.json();

      toast({
        title: "Cron Tasks Dispatched",
        message: "Background jobs (reminders, holds, renewals, digest) executed.",
        type: "success",
      });

      // Reload settings and cron runs
      const reload = await fetch("/api/admin/settings");
      if (reload.ok) {
        const d = await reload.json();
        if (d.cronRuns) setCronRuns(d.cronRuns);
      }
    } catch (err: any) {
      toast({
        title: "Cron Execution Error",
        message: err.message,
        type: "error",
      });
    } finally {
      setTriggeringCron(false);
    }
  };

  const cronColumns: ColumnDef<any>[] = [
    {
      key: "job_name",
      header: "Job Name",
      sortable: true,
      render: (r) => (
        <span className="font-mono text-xs font-semibold text-tone-heading">{r.job_name}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (r) => (
        <Badge variant={r.status === "success" ? "success" : r.status === "failed" ? "error" : "outline"}>
          {r.status}
        </Badge>
      ),
    },
    {
      key: "started_at",
      header: "Started At",
      sortable: true,
      render: (r) => (
        <span className="text-[11px] text-tone-muted">
          {new Date(r.started_at).toLocaleString("en-US", { dateStyle: "short", timeStyle: "medium" })}
        </span>
      ),
    },
    {
      key: "duration_ms",
      header: "Duration",
      sortable: true,
      render: (r) => (
        <span className="text-[11px] font-mono text-tone-heading">
          {r.duration_ms != null ? `${r.duration_ms}ms` : "—"}
        </span>
      ),
    },
    {
      key: "details",
      header: "Summary Output",
      render: (r) => (
        <span className="text-[11px] text-tone-muted font-mono truncate max-w-xs block">
          {r.details ? JSON.stringify(r.details) : r.error_message || "—"}
        </span>
      ),
    },
  ];

  return (
    <DashboardShell
      role="admin"
      title="Platform Settings"
      user={{ name: "System Administrator", email: "admin@gradedge.com" }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-tone-rule pb-4">
          <div className="space-y-1">
            <span className="type-micro text-gold">Governance and Infrastructure</span>
            <h1 className="font-serif text-2xl font-medium text-tone-heading">
              Platform and Communications Settings
            </h1>
          </div>

          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={saving}
            onClick={handleSaveSettings}
            className="gap-2 text-xs"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{saving ? "Saving Changes..." : "Save Settings"}</span>
          </Button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-tone-rule gap-6 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("email")}
            className={`pb-2.5 transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === "email"
                ? "border-gold text-tone-heading font-semibold"
                : "border-transparent text-tone-muted hover:text-tone-heading"
            }`}
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Email Templates ({TEMPLATE_OPTIONS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("operations")}
            className={`pb-2.5 transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === "operations"
                ? "border-gold text-tone-heading font-semibold"
                : "border-transparent text-tone-muted hover:text-tone-heading"
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Advisory Response Windows</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("cron")}
            className={`pb-2.5 transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === "cron"
                ? "border-gold text-tone-heading font-semibold"
                : "border-transparent text-tone-muted hover:text-tone-heading"
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Background Jobs and Cron Log</span>
          </button>
        </div>

        {/* TAB 1: EMAIL TEMPLATES */}
        {activeTab === "email" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Template Selector Column */}
            <div className="lg:col-span-4 space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-tone-muted block">
                Select Template
              </label>
              <div className="bg-white border border-tone-rule rounded-[2px] divide-y divide-tone-rule max-h-[560px] overflow-y-auto">
                {TEMPLATE_OPTIONS.map((opt) => {
                  const isSelected = selectedTemplateKey === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setSelectedTemplateKey(opt.key)}
                      className={`w-full p-3 text-left transition-colors flex flex-col gap-0.5 ${
                        isSelected
                          ? "bg-paper border-l-2 border-l-gold text-tone-heading font-medium"
                          : "hover:bg-paper/40 text-tone-body"
                      }`}
                    >
                      <span className="text-xs font-semibold">{opt.label}</span>
                      <span className="text-[10px] text-tone-muted uppercase tracking-wider">
                        {opt.group} &bull; {opt.key}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Template Editor Column */}
            <div className="lg:col-span-8 space-y-4">
              <div className="p-5 bg-white border border-tone-rule rounded-[2px] space-y-4">
                <div className="flex items-center justify-between border-b border-tone-rule pb-3">
                  <div>
                    <h3 className="font-serif text-base font-semibold text-tone-heading">
                      {TEMPLATE_OPTIONS.find((t) => t.key === selectedTemplateKey)?.label}
                    </h3>
                    <p className="text-xs text-tone-muted">
                      Customise the outgoing subject line and introductory context paragraph.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleResetCurrentTemplate}
                    className="text-xs text-tone-muted hover:text-tone-heading gap-1.5"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reset Default</span>
                  </Button>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-tone-heading">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={currentTemplate.subject}
                    onChange={(e) => handleTemplateChange("subject", e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-paper border border-tone-rule rounded-[2px] text-tone-heading focus:bg-white focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-tone-heading">
                    Introductory Context Text (Shown in Callout Card)
                  </label>
                  <textarea
                    rows={4}
                    value={currentTemplate.intro || ""}
                    onChange={(e) => handleTemplateChange("intro", e.target.value)}
                    placeholder="Enter scholarly greeting context..."
                    className="w-full p-3 text-xs bg-paper border border-tone-rule rounded-[2px] text-tone-heading focus:bg-white focus:outline-none focus:border-gold resize-none"
                  />
                </div>

                {/* Live Preview Box */}
                <div className="pt-3 border-t border-tone-rule space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-tone-muted block">
                    Branded Layout Preview
                  </span>
                  <div className="border border-tone-rule rounded-[2px] overflow-hidden bg-paper text-xs">
                    <div className="bg-navy p-3 text-white flex items-center justify-between border-b-2 border-gold">
                      <span className="font-serif font-semibold">GradEdge Academic Solutions</span>
                      <span className="text-[10px] text-gold uppercase tracking-wider">Template Preview</span>
                    </div>
                    <div className="p-4 bg-white m-3 border border-tone-rule space-y-3">
                      <h4 className="font-serif font-bold text-sm text-navy">{currentTemplate.subject}</h4>
                      {currentTemplate.intro && (
                        <div className="p-2.5 bg-cream border-l-2 border-gold text-[11px] text-tone-heading italic">
                          {currentTemplate.intro}
                        </div>
                      )}
                      <p className="text-[11px] text-tone-muted">
                        [Personalised manuscript feedback / session details / receipt content is inserted here in the GradEdge academic voice.]
                      </p>
                      <div className="pt-2 border-t border-tone-rule/60 text-[10px] text-tone-muted">
                        With scholarly regard,<br />
                        <strong>The GradEdge Advisory Team</strong>
                      </div>
                    </div>
                    <div className="p-3 bg-paper text-[10px] text-tone-muted border-t border-tone-rule">
                      <strong>Why you received this:</strong> You hold an active account with GradEdge.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: OPERATIONAL SETTINGS */}
        {activeTab === "operations" && (
          <div className="max-w-2xl bg-white border border-tone-rule rounded-[2px] p-6 space-y-5">
            <div className="border-b border-tone-rule pb-3">
              <h3 className="font-serif text-base font-semibold text-tone-heading">
                Mentor and Advisory Desk Response Windows
              </h3>
              <p className="text-xs text-tone-muted">
                Define the stated turnaround expectations displayed across student messaging channels.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-tone-heading">
                Mentor Response Window Commitment
              </label>
              <input
                type="text"
                value={mentorResponseWindow}
                onChange={(e) => setMentorResponseWindow(e.target.value)}
                placeholder="e.g. 24 business hours (Monday–Friday, 9:00 AM – 6:00 PM)"
                className="w-full h-9 px-3 text-xs bg-paper border border-tone-rule rounded-[2px] text-tone-heading focus:bg-white focus:outline-none focus:border-gold"
              />
              <p className="text-[11px] text-tone-muted">
                Displayed to candidates on the messaging interface and included in booking confirmations.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: CRON and BACKGROUND JOBS */}
        {activeTab === "cron" && (
          <div className="space-y-4">
            <div className="p-5 bg-white border border-tone-rule rounded-[2px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-serif text-base font-semibold text-tone-heading">
                  Background Cron Operations
                </h3>
                <p className="text-xs text-tone-muted">
                  Idempotent scheduled jobs for session reminders (24h/1h), unpaid booking release (15m), membership renewal notices (3d), and daily executive digest.
                </p>
              </div>

              <Button
                type="button"
                variant="accent"
                size="sm"
                disabled={triggeringCron}
                onClick={handleTriggerCronAll}
                className="gap-2 text-xs shrink-0"
              >
                <Play className="h-3.5 w-3.5" />
                <span>{triggeringCron ? "Dispatching Jobs..." : "Run All Jobs Now"}</span>
              </Button>
            </div>

            {/* Cron Runs Table */}
            <div className="bg-white border border-tone-rule rounded-[2px] p-5">
              <h4 className="text-xs font-semibold text-tone-heading uppercase tracking-wider mb-3">
                Execution History ({cronRuns.length} runs recorded)
              </h4>
              <PaginatedTable
                data={cronRuns}
                columns={cronColumns}
                defaultPageSize={10}
                searchPlaceholder="Filter cron runs by job name or status..."
                caption="Cron Execution Logs"
                emptyMessage="No background job runs recorded yet. Click 'Run All Jobs Now' to execute manually."
              />
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
