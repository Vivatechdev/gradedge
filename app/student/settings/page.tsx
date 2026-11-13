"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useStudent } from "@/components/layout/student-context";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input, Select, FormField } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Modal } from "@/components/ui/modal";
import {
  User,
  Shield,
  Bell,
  HardDrive,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Clock,
  Building,
  GraduationCap,
  KeyRound,
} from "lucide-react";

const STANDARD_TIMEZONES = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "Africa/Lagos", label: "Africa/Lagos (WAT, UTC+1)" },
  { value: "Africa/Johannesburg", label: "Africa/Johannesburg (SAST, UTC+2)" },
  { value: "Africa/Nairobi", label: "Africa/Nairobi (EAT, UTC+3)" },
  { value: "Europe/London", label: "Europe/London (GMT/BST)" },
  { value: "Europe/Berlin", label: "Europe/Berlin (CET/CEST)" },
  { value: "America/New_York", label: "America/New_York (EST/EDT)" },
  { value: "America/Chicago", label: "America/Chicago (CST/CDT)" },
  { value: "America/Denver", label: "America/Denver (MST/MDT)" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles (PST/PDT)" },
  { value: "America/Toronto", label: "America/Toronto (EST/EDT)" },
  { value: "Asia/Dubai", label: "Asia/Dubai (GST, UTC+4)" },
  { value: "Asia/Kolkata", label: "Asia/Kolkata (IST, UTC+5:30)" },
  { value: "Asia/Singapore", label: "Asia/Singapore (SGT, UTC+8)" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo (JST, UTC+9)" },
  { value: "Australia/Sydney", label: "Australia/Sydney (AEST/AEDT)" },
];

function SettingsContent() {
  const student = useStudent();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications" | "data">(
    tabParam === "notifications"
      ? "notifications"
      : tabParam === "security"
      ? "security"
      : tabParam === "data"
      ? "data"
      : "profile"
  );

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [downloadingData, setDownloadingData] = useState(false);

  // Profile Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [studyLevel, setStudyLevel] = useState("masters");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [phone, setPhone] = useState("");

  // Notification Preferences State
  const [prefs, setPrefs] = useState({
    email_sessions: true,
    email_messages: true,
    email_billing: true,
    marketing: false,
  });

  // Password State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Delete Account Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteReason, setDeleteReason] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/student/settings");
        const json = await res.json();
        if (res.ok && json.profile) {
          const p = json.profile;
          setFullName(p.full_name || "");
          setEmail(p.email || "");
          setInstitution(p.institution || "");
          setStudyLevel(p.study_level || "masters");
          setFieldOfStudy(p.field_of_study || "");
          setTimezone(p.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
          setPhone(p.phone || "");
          if (p.notification_preferences) {
            setPrefs({
              email_sessions: p.notification_preferences.email_sessions ?? true,
              email_messages: p.notification_preferences.email_messages ?? true,
              email_billing: p.notification_preferences.email_billing ?? true,
              marketing: p.notification_preferences.marketing ?? false,
            });
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const res = await fetch("/api/student/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          institution,
          study_level: studyLevel,
          field_of_study: fieldOfStudy,
          timezone,
          phone,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to update profile");
      }

      toast({
        title: "Profile Updated",
        message: "Your academic scholar information has been saved.",
        type: "success",
      });
    } catch (err: any) {
      toast({
        title: "Update Failed",
        message: err.message,
        type: "error",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch("/api/student/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to change password.");
      }

      setNewPassword("");
      setConfirmPassword("");
      toast({
        title: "Password Changed",
        message: "Your login credentials have been securely updated.",
        type: "success",
      });
    } catch (err: any) {
      toast({
        title: "Password Error",
        message: err.message,
        type: "error",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSavePreferences = async () => {
    setSavingPrefs(true);
    try {
      const res = await fetch("/api/student/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notification_preferences: prefs }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to save preferences.");
      }

      toast({
        title: "Preferences Saved",
        message: "Notification channels updated.",
        type: "success",
      });
    } catch (err: any) {
      toast({
        title: "Save Failed",
        message: err.message,
        type: "error",
      });
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleDownloadData = async () => {
    setDownloadingData(true);
    try {
      const res = await fetch("/api/student/settings/download-data");
      if (!res.ok) throw new Error("Could not generate archive.");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gradedge-scholar-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Archive Downloaded",
        message: "Your complete academic export bundle is ready.",
        type: "success",
      });
    } catch (err: any) {
      toast({
        title: "Export Failed",
        message: err.message,
        type: "error",
      });
    } finally {
      setDownloadingData(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      const res = await fetch("/api/student/settings/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirmation: deleteConfirmation,
          reason: deleteReason,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to delete account.");
      }

      toast({
        title: "Account Purged",
        message: "Your account data has been removed. Redirecting...",
        type: "info",
      });

      setTimeout(() => {
        window.location.href = "/login?message=account_deleted";
      }, 1500);
    } catch (err: any) {
      toast({
        title: "Deletion Blocked",
        message: err.message,
        type: "error",
      });
      setDeletingAccount(false);
    }
  };

  return (
    <DashboardShell
      role="student"
      title="Settings & Privacy"
      user={{
        name: student.name,
        email: student.email,
        institution: student.institution,
      }}
    >
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="border-b border-tone-rule pb-4 space-y-1">
          <span className="type-micro text-gold">Researcher Profile</span>
          <h1 className="font-serif text-2xl font-medium text-tone-heading">
            Account, Security & Privacy
          </h1>
          <p className="text-xs text-tone-muted leading-relaxed font-sans">
            Manage your academic credentials, scheduling timezone, notification rules, and data governance.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-tone-rule gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "profile"
                ? "border-navy-deep text-navy-deep font-semibold"
                : "border-transparent text-tone-muted hover:text-tone-heading hover:border-tone-rule"
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>Profile & Institution</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "security"
                ? "border-navy-deep text-navy-deep font-semibold"
                : "border-transparent text-tone-muted hover:text-tone-heading hover:border-tone-rule"
            }`}
          >
            <KeyRound className="h-3.5 w-3.5" />
            <span>Password & Security</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("notifications")}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "notifications"
                ? "border-navy-deep text-navy-deep font-semibold"
                : "border-transparent text-tone-muted hover:text-tone-heading hover:border-tone-rule"
            }`}
          >
            <Bell className="h-3.5 w-3.5" />
            <span>Notification Rules</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("data")}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "data"
                ? "border-navy-deep text-navy-deep font-semibold"
                : "border-transparent text-tone-muted hover:text-tone-heading hover:border-tone-rule"
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Data & Privacy</span>
          </button>
        </div>

        {loading ? (
          <div className="space-y-4 bg-white p-6 border border-tone-rule rounded-[2px]">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-2/3" />
          </div>
        ) : (
          <>
            {/* TAB 1: PROFILE */}
            {activeTab === "profile" && (
              <form onSubmit={handleSaveProfile} className="bg-white border border-tone-rule rounded-[2px] p-6 space-y-6">
                <div>
                  <h2 className="font-serif text-lg font-medium text-tone-heading">
                    Academic Identity
                  </h2>
                  <p className="text-xs text-tone-muted mt-0.5">
                    Your institutional details ensure mentors are matched with subject matter and methodological precision.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />

                  <Input
                    label="Account Email"
                    value={email}
                    disabled
                    helperText="Institutional email migration requires admin verification."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="University / Institution"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. University of Oxford, MIT, University of Cape Town"
                  />

                  <Select
                    label="Academic Level"
                    value={studyLevel}
                    onChange={(e) => setStudyLevel(e.target.value)}
                    options={[
                      { value: "undergraduate", label: "Undergraduate (Final Year / Honors)" },
                      { value: "masters", label: "Master's Degree Candidate" },
                      { value: "phd", label: "Doctoral / PhD Candidate" },
                      { value: "researcher", label: "Postdoctoral / Faculty Researcher" },
                      { value: "other", label: "Independent Scholar" },
                    ]}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Primary Field / Department"
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    placeholder="e.g. Health Economics, Clinical Epidemiology, Public Law"
                  />

                  <Select
                    label="Scheduling Timezone"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    options={STANDARD_TIMEZONES}
                    helperText="All session bookings and reminders will display in this timezone."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number (Optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+44 7911 123456"
                    helperText="For urgent pre-session reminders or scheduling notices."
                  />
                </div>

                <div className="pt-4 border-t border-tone-rule flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={savingProfile}
                    className="font-sans text-xs"
                  >
                    {savingProfile ? "Saving changes..." : "Save Profile Details"}
                  </Button>
                </div>
              </form>
            )}

            {/* TAB 2: SECURITY & PASSWORD */}
            {activeTab === "security" && (
              <form onSubmit={handleUpdatePassword} className="bg-white border border-tone-rule rounded-[2px] p-6 space-y-6">
                <div>
                  <h2 className="font-serif text-lg font-medium text-tone-heading">
                    Password & Credentials
                  </h2>
                  <p className="text-xs text-tone-muted mt-0.5">
                    Update your account password. Choose a strong combination of letters, numbers, and symbols.
                  </p>
                </div>

                {passwordError && (
                  <div className="p-3 bg-error/10 border border-error/30 rounded-[2px] text-xs text-error">
                    {passwordError}
                  </div>
                )}

                <div className="space-y-4 max-w-md">
                  <Input
                    type="password"
                    label="New Password"
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    helperText="Must be at least 8 characters long."
                  />

                  <Input
                    type="password"
                    label="Confirm New Password"
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="pt-4 border-t border-tone-rule flex justify-start">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={savingPassword || !newPassword}
                    className="font-sans text-xs"
                  >
                    {savingPassword ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </form>
            )}

            {/* TAB 3: NOTIFICATIONS */}
            {activeTab === "notifications" && (
              <div className="bg-white border border-tone-rule rounded-[2px] p-6 space-y-6">
                <div>
                  <h2 className="font-serif text-lg font-medium text-tone-heading">
                    Email Notification Preferences
                  </h2>
                  <p className="text-xs text-tone-muted mt-0.5">
                    Control which updates and reminders arrive in your institutional inbox.
                  </p>
                </div>

                <div className="divide-y divide-tone-rule border border-tone-rule rounded-[2px]">
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-semibold text-tone-heading">
                        Session & Coaching Reminders
                      </h3>
                      <p className="text-xs text-tone-muted mt-0.5">
                        Receive 24-hour and 1-hour pre-session calendar alerts with video meeting links.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={prefs.email_sessions}
                      onChange={(e) => setPrefs({ ...prefs, email_sessions: e.target.checked })}
                      className="h-4 w-4 text-navy rounded border-tone-rule focus:ring-navy"
                    />
                  </div>

                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-semibold text-tone-heading">
                        Mentor Notes & Manuscript Feedback
                      </h3>
                      <p className="text-xs text-tone-muted mt-0.5">
                        Receive email alerts whenever your mentor annotates drafts or posts messages.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={prefs.email_messages}
                      onChange={(e) => setPrefs({ ...prefs, email_messages: e.target.checked })}
                      className="h-4 w-4 text-navy rounded border-tone-rule focus:ring-navy"
                    />
                  </div>

                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-semibold text-tone-heading">
                        Invoices & Billing Receipts
                      </h3>
                      <p className="text-xs text-tone-muted mt-0.5">
                        Receive sequential PDF tax invoices upon session or membership payments.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={prefs.email_billing}
                      onChange={(e) => setPrefs({ ...prefs, email_billing: e.target.checked })}
                      className="h-4 w-4 text-navy rounded border-tone-rule focus:ring-navy"
                    />
                  </div>

                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-semibold text-tone-heading">
                        Academic Methodology & Writing Guides
                      </h3>
                      <p className="text-xs text-tone-muted mt-0.5">
                        Receive quiet, occasional editorial essays, statistical guides, and symposium invitations.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={prefs.marketing}
                      onChange={(e) => setPrefs({ ...prefs, marketing: e.target.checked })}
                      className="h-4 w-4 text-navy rounded border-tone-rule focus:ring-navy"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleSavePreferences}
                    disabled={savingPrefs}
                    className="font-sans text-xs"
                  >
                    {savingPrefs ? "Saving..." : "Save Notification Preferences"}
                  </Button>
                </div>
              </div>
            )}

            {/* TAB 4: DATA & PRIVACY */}
            {activeTab === "data" && (
              <div className="space-y-6">
                {/* Download Data Card */}
                <div className="bg-white border border-tone-rule rounded-[2px] p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-paper-light border border-tone-rule rounded-[2px] text-navy">
                      <Download className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="font-serif text-lg font-medium text-tone-heading">
                        Export My Academic Data
                      </h2>
                      <p className="text-xs text-tone-muted leading-relaxed font-sans">
                        Download an immutable, machine-readable JSON archive containing your full profile record, project milestones, booking histories, file inventories, and invoice manifests.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="secondary"
                      onClick={handleDownloadData}
                      disabled={downloadingData}
                      className="font-sans text-xs"
                    >
                      <Download className="h-3.5 w-3.5 mr-1.5 text-gold" />
                      {downloadingData ? "Generating export bundle..." : "Download JSON Archive (.json)"}
                    </Button>
                  </div>
                </div>

                {/* Delete Account Card */}
                <div className="bg-white border border-error/30 rounded-[2px] p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-error/10 border border-error/20 rounded-[2px] text-error">
                      <Trash2 className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="font-serif text-lg font-medium text-error">
                        Delete Account & Data Retention
                      </h2>
                      <p className="text-xs text-tone-muted leading-relaxed font-sans">
                        Permanently purge your account, drafts, mentor correspondence, and booking associations.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-error/5 border border-error/20 rounded-[2px] space-y-2 text-xs text-tone-body font-sans">
                    <span className="font-semibold text-error block">Academic & Legal Consequences:</span>
                    <ul className="list-disc list-inside space-y-1 text-tone-muted">
                      <li>Active scoping projects and ongoing milestone reviews will be immediately terminated.</li>
                      <li>Upcoming booked consultations will be cancelled and released to the open pool.</li>
                      <li>Any unspent coaching balance or unused continuous membership days are forfeited.</li>
                      <li>Uploaded manuscript drafts, notes, and mentor messages will be permanently expunged.</li>
                    </ul>
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="secondary"
                      onClick={() => setShowDeleteModal(true)}
                      className="font-sans text-xs text-error border-error/40 hover:bg-error/5 hover:text-error hover:border-error"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                      Request Permanent Account Deletion
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Irreversible Account Deletion"
        description="This action cannot be undone. All research projects and mentor notes will be permanently purged."
      >
        <div className="space-y-4 pt-2">
          <div className="p-3 bg-error/10 border border-error/30 rounded-[2px] text-xs text-error font-sans leading-relaxed">
            Please confirm by typing <span className="font-mono font-bold">DELETE</span> into the input field below.
          </div>

          <FormField>
            <Input
              label="Type DELETE to confirm"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="DELETE"
            />
          </FormField>

          <FormField>
            <Input
              label="Reason for leaving (Optional)"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              placeholder="e.g. Degree completed, defended dissertation"
            />
          </FormField>

          <div className="pt-4 border-t border-tone-rule flex items-center justify-end gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowDeleteModal(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={deleteConfirmation !== "DELETE" && deleteConfirmation !== email || deletingAccount}
              onClick={handleDeleteAccount}
              className="text-xs text-error border-error/40 hover:bg-error/5 hover:text-error hover:border-error"
            >
              {deletingAccount ? "Purging data..." : "Confirm & Delete Account"}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardShell>
  );
}

export default function StudentSettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-tone-muted">
          Loading settings...
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
