"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  Lock,
  Calendar,
  FileCheck,
  RefreshCw,
} from "lucide-react";

interface AuditLogItem {
  id: string;
  action: string;
  actor: string;
  role: string;
  targetCandidate: string;
  timestamp: string;
  verificationHash: string;
  complianceStatus: "verified" | "flagged_clean";
}

const AUDIT_LOGS: AuditLogItem[] = [
  {
    id: "log-801",
    action: "Milestone Feedback Redline Uploaded",
    actor: "Dr. Eleanor Vance",
    role: "Faculty Mentor",
    targetCandidate: "Freedom Sola (Cambridge)",
    timestamp: "Nov 20, 2026, 16:42 UTC",
    verificationHash: "sha256-8f3a9e10c...",
    complianceStatus: "verified",
  },
  {
    id: "log-802",
    action: "Advisory Session Audio Digest Recorded",
    actor: "System AI / Google Meet",
    role: "System Automated",
    targetCandidate: "Amina Bello (LSE)",
    timestamp: "Nov 19, 2026, 11:15 UTC",
    verificationHash: "sha256-4b2c1d89e...",
    complianceStatus: "verified",
  },
  {
    id: "log-803",
    action: "Turnitin Similarity Index Audit Passed (8%)",
    actor: "System Integrity Engine",
    role: "Automated Audit",
    targetCandidate: "Khadija Umar (Imperial)",
    timestamp: "Nov 18, 2026, 09:30 UTC",
    verificationHash: "sha256-9a7f6e54d...",
    complianceStatus: "verified",
  },
  {
    id: "log-804",
    action: "Statistical Code Syntax Validated in Stata",
    actor: "Dr. Alex Taylor",
    role: "Faculty Mentor",
    targetCandidate: "Amina Bello (LSE)",
    timestamp: "Nov 17, 2026, 14:20 UTC",
    verificationHash: "sha256-1c3e5a79b...",
    complianceStatus: "verified",
  },
  {
    id: "log-805",
    action: "Annual Mentor Integrity Pledge Re-certified",
    actor: "Dr. Marcus King",
    role: "Faculty Mentor",
    targetCandidate: "Faculty Pool Roster",
    timestamp: "Nov 15, 2026, 10:00 UTC",
    verificationHash: "sha256-7d9b1f35a...",
    complianceStatus: "verified",
  },
];

export default function AdminIntegrityPage() {
  const [search, setSearch] = useState("");
  const [runningAudit, setRunningAudit] = useState(false);
  const [auditSuccess, setAuditSuccess] = useState(false);

  const filteredLogs = AUDIT_LOGS.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.actor.toLowerCase().includes(search.toLowerCase()) ||
      l.targetCandidate.toLowerCase().includes(search.toLowerCase())
  );

  const handleRunSpotCheck = () => {
    setRunningAudit(true);
    setAuditSuccess(false);
    setTimeout(() => {
      setRunningAudit(false);
      setAuditSuccess(true);
    }, 1500);
  };

  return (
    <DashboardShell
      role="admin"
      title="Academic Integrity Hub"
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
              <span className="type-micro text-gold">Compliance &amp; Governance</span>
              <span className="text-tone-rule">&bull;</span>
              <span className="text-xs text-tone-muted font-mono">Zero-Ghostwriting Certified</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif text-tone-heading font-medium">
              Academic Integrity &amp; Audit Logs
            </h1>
            <p className="text-xs sm:text-sm text-tone-muted mt-1 max-w-xl leading-relaxed">
              Verify compliance with institutional ethics, supervise mentor coaching logs, and ensure no ghostwriting occurs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="accent"
              size="sm"
              disabled={runningAudit}
              onClick={handleRunSpotCheck}
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${runningAudit ? "animate-spin" : ""}`} />
              {runningAudit ? "Auditing Sessions..." : "Run Spot Check"}
            </Button>
          </div>
        </div>

        {auditSuccess && (
          <div className="p-3 bg-success/10 border border-success/30 rounded-[2px] text-xs font-sans text-tone-heading flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                Spot check complete: <strong>100% compliance verified</strong> across all recent session transcripts and draft redlines.
              </span>
            </div>
            <button
              onClick={() => setAuditSuccess(false)}
              className="text-stone-400 hover:text-stone-600 text-xs"
            >
              &times;
            </button>
          </div>
        )}

        {/* Four Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card background="white" className="border-tone-rule shadow-2xs">
            <CardHeader className="pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-tone-muted">
                Ghostwriting Violations
              </span>
              <CardTitle className="text-2xl font-serif text-emerald-700">0 Reported</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-stone-500">100% strict adherence</p>
            </CardContent>
          </Card>

          <Card background="white" className="border-tone-rule shadow-2xs">
            <CardHeader className="pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-tone-muted">
                Faculty Pledges Signed
              </span>
              <CardTitle className="text-2xl font-serif text-navy">100% Active</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-stone-500">All 5 mentors certified</p>
            </CardContent>
          </Card>

          <Card background="white" className="border-tone-rule shadow-2xs">
            <CardHeader className="pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-tone-muted">
                Average Similarity Index
              </span>
              <CardTitle className="text-2xl font-serif text-gold">6.4%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-stone-500">Well below 15% threshold</p>
            </CardContent>
          </Card>

          <Card background="white" className="border-tone-rule shadow-2xs">
            <CardHeader className="pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-tone-muted">
                Cryptographic Audit Log
              </span>
              <CardTitle className="text-2xl font-serif text-navy">Tamper-Proof</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-stone-500">SHA-256 hashed records</p>
            </CardContent>
          </Card>
        </div>

        {/* Zero Ghostwriting Policy Mandate */}
        <div className="p-5 bg-navy-deep text-white rounded-[4px] border border-tone-rule space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-gold" />
            <h3 className="font-serif text-base font-semibold">GradEdge Academic Integrity Standard</h3>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed font-sans max-w-3xl">
            GradEdge guarantees that no ghostwriting, automated manuscript generation, or unauthorized text substitution occurs. All advisory feedback must be delivered as margin redlines, methodology coaching, and pedagogical instruction. Authorship remains 100% with the doctoral researcher.
          </p>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white border border-tone-rule rounded-[4px] overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-tone-rule bg-paper flex items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search audit action or mentor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-8 pl-9 pr-3 text-xs font-sans bg-white border border-tone-rule rounded-[2px] text-tone-heading focus:outline-none focus:border-gold"
              />
            </div>
            <span className="text-xs text-stone-500 font-sans hidden sm:inline">
              Real-time audit ledger
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-paper border-b border-tone-rule text-[11px] uppercase tracking-wider text-tone-muted font-semibold">
                <tr>
                  <th className="py-3 px-4">Log ID &amp; Timestamp</th>
                  <th className="py-3 px-4">Audit Event</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Target Context</th>
                  <th className="py-3 px-4">Hash</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tone-rule">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-paper/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-[10px] text-gold font-semibold">{log.id}</div>
                      <div className="text-[11px] text-stone-400 mt-0.5">{log.timestamp}</div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-tone-heading">
                      {log.action}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-navy">{log.actor}</div>
                      <div className="text-[10px] text-stone-400">{log.role}</div>
                    </td>

                    <td className="py-3.5 px-4 text-stone-600">
                      {log.targetCandidate}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[10px] text-stone-400">
                      {log.verificationHash}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Badge variant="success">Verified Clean</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
