"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  CreditCard,
  Download,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileSpreadsheet,
  ArrowUpRight,
  ShieldCheck,
  Building,
} from "lucide-react";

interface PayoutTransaction {
  id: string;
  date: string;
  candidateName: string;
  milestoneTitle: string;
  amount: number;
  currency: string;
  status: "cleared" | "processing" | "escrow";
  referenceId: string;
}

const TRANSACTIONS: PayoutTransaction[] = [
  {
    id: "tx-401",
    date: "Nov 19, 2026",
    candidateName: "Freedom Sola",
    milestoneTitle: "Chapter 3: Methodology Redline & Caliper Matching Diagnostics",
    amount: 450,
    currency: "GBP",
    status: "processing",
    referenceId: "HON-2026-8812",
  },
  {
    id: "tx-402",
    date: "Nov 14, 2026",
    candidateName: "Amina Bello",
    milestoneTitle: "Live Advisory: Dynamic Panel GMM Regression Interpretation",
    amount: 180,
    currency: "GBP",
    status: "cleared",
    referenceId: "HON-2026-8740",
  },
  {
    id: "tx-403",
    date: "Nov 08, 2026",
    candidateName: "Chidi Okafor",
    milestoneTitle: "Chapter 2: Conceptual Framework Review & Thematic Matrix",
    amount: 400,
    currency: "GBP",
    status: "cleared",
    referenceId: "HON-2026-8692",
  },
  {
    id: "tx-404",
    date: "Nov 03, 2026",
    candidateName: "Khadija Umar",
    milestoneTitle: "Research Proposal Addendum & Empirical Scope Audit",
    amount: 250,
    currency: "GBP",
    status: "cleared",
    referenceId: "HON-2026-8519",
  },
  {
    id: "tx-405",
    date: "Oct 28, 2026",
    candidateName: "Freedom Sola",
    milestoneTitle: "Chapter 1: Problem Statement & Epidemiological Hypotheses",
    amount: 350,
    currency: "GBP",
    status: "cleared",
    referenceId: "HON-2026-8401",
  },
];

export default function MentorEarningsPage() {
  const { showToast } = useToast();
  const [selectedCurrency, setSelectedCurrency] = useState("GBP");

  const totalCleared = TRANSACTIONS.filter((t) => t.status === "cleared").reduce(
    (sum, t) => sum + t.amount,
    0
  );
  const totalProcessing = TRANSACTIONS.filter((t) => t.status === "processing").reduce(
    (sum, t) => sum + t.amount,
    0
  );

  const handleExportCSV = () => {
    showToast("Faculty Honorarium Statement (CSV) generated and downloaded.", "success");
  };

  return (
    <DashboardShell
      role="mentor"
      title="Honorarium & Payouts"
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
              Faculty Honorarium &amp; Payouts Ledger
            </h2>
            <p className="text-xs text-tone-muted mt-1">
              Transparent, milestone-based compensation for doctoral mentoring, manuscript redlining, and oral defense coaching.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download Statement (.CSV)
            </Button>
          </div>
        </div>

        {/* Financial Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-white border-tone-rule">
            <CardHeader className="pb-1">
              <span className="type-micro uppercase text-tone-muted tracking-wider">
                Total Earned This Quarter (Q4)
              </span>
              <div className="flex items-center justify-between pt-1">
                <span className="font-serif text-3xl font-bold text-tone-heading">
                  £{(totalCleared + totalProcessing).toLocaleString()}
                </span>
                <TrendingUp className="w-5 h-5 text-gold" />
              </div>
            </CardHeader>
            <CardContent>
              <span className="text-[11px] text-stone-500 font-sans">
                Across 5 completed doctoral milestones
              </span>
            </CardContent>
          </Card>

          <Card className="bg-white border-tone-rule">
            <CardHeader className="pb-1">
              <span className="type-micro uppercase text-tone-muted tracking-wider">
                Cleared &amp; Disbursed
              </span>
              <div className="flex items-center justify-between pt-1">
                <span className="font-serif text-3xl font-bold text-emerald-700">
                  £{totalCleared.toLocaleString()}
                </span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <span className="text-[11px] text-stone-500 font-sans">
                Transferred via Wise UK Direct Debit
              </span>
            </CardContent>
          </Card>

          <Card className="bg-white border-tone-rule">
            <CardHeader className="pb-1">
              <span className="type-micro uppercase text-tone-muted tracking-wider">
                Pending Clearing Cycle
              </span>
              <div className="flex items-center justify-between pt-1">
                <span className="font-serif text-3xl font-bold text-amber-700">
                  £{totalProcessing.toLocaleString()}
                </span>
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <span className="text-[11px] text-stone-500 font-sans">
                Scheduled payout: Friday, Nov 27, 2026
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card className="bg-white border-tone-rule">
          <CardHeader className="border-b border-tone-rule pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-serif text-lg text-tone-heading">
                Honorarium Disbursements Ledger
              </CardTitle>
              <p className="text-xs text-stone-500 font-sans">
                Milestones are disbursed upon candidate sign-off or within 7 days of verified completion.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-stone-400">Display Currency:</span>
              <span className="font-semibold text-navy">GBP (£)</span>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs font-sans text-left">
              <thead className="bg-paper border-b border-tone-rule text-stone-500 uppercase tracking-wide text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Date &amp; Ref</th>
                  <th className="py-3 px-4 font-semibold">Doctoral Candidate</th>
                  <th className="py-3 px-4 font-semibold">Milestone / Scope</th>
                  <th className="py-3 px-4 font-semibold text-right">Amount</th>
                  <th className="py-3 px-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tone-rule">
                {TRANSACTIONS.map((tx) => (
                  <tr key={tx.id} className="hover:bg-paper/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-stone-800">
                      <div>{tx.date}</div>
                      <span className="text-[10px] text-stone-400">{tx.referenceId}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-navy">
                      {tx.candidateName}
                    </td>
                    <td className="py-3 px-4 text-stone-700 max-w-sm">
                      {tx.milestoneTitle}
                    </td>
                    <td className="py-3 px-4 text-right font-serif font-bold text-stone-900">
                      £{tx.amount}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {tx.status === "cleared" ? (
                        <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-300 bg-emerald-50">
                          Cleared
                        </Badge>
                      ) : (
                        <Badge variant="gold" className="text-[10px]">
                          Clearing
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Bank & Tax Profile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-paper border-tone-rule">
            <CardContent className="p-4 space-y-2 text-xs font-sans">
              <span className="font-serif font-semibold text-tone-heading block">
                Disbursement Account Details
              </span>
              <p className="text-stone-600">
                Primary Account: <strong className="text-stone-800">Barclays UK Current Account (ending in 8912)</strong>
              </p>
              <p className="text-stone-500 text-[11px]">
                IBAN: GB82 BARC 2000 0089 1234 56 &bull; Automatic payouts scheduled weekly on Friday mornings.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-paper border-tone-rule">
            <CardContent className="p-4 space-y-2 text-xs font-sans">
              <span className="font-serif font-semibold text-tone-heading block">
                Tax &amp; Compliance Withholding
              </span>
              <p className="text-stone-600">
                Classification: <strong className="text-stone-800">Independent Academic Consultant (HMRC Self-Employed)</strong>
              </p>
              <p className="text-stone-500 text-[11px]">
                Annual P60 / Statement of Honorarium issued automatically in April.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}

