"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  BarChart3,
  TrendingUp,
  CreditCard,
  Clock,
  ShieldCheck,
  Download,
  Users,
  Award,
  ArrowUpRight,
  Filter,
} from "lucide-react";

export default function AdminAnalyticsPage() {
  const { showToast } = useToast();
  const [timeRange, setTimeRange] = useState("30d");

  const handleExport = () => {
    showToast("Operations & Revenue Analytics Report (.CSV) downloaded.", "success");
  };

  return (
    <DashboardShell
      role="admin"
      title="Operations Analytics"
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
              Platform Operations, SLA &amp; Revenue Analytics
            </h2>
            <p className="text-xs text-tone-muted mt-1">
              Multi-currency platform performance, turnaround compliance, and doctoral accelerator milestones.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white border border-tone-rule rounded-[2px] p-0.5 text-xs">
              {[
                { id: "30d", label: "Last 30 Days" },
                { id: "q4", label: "Q4 2026" },
                { id: "ytd", label: "YTD" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTimeRange(t.id)}
                  className={`px-2.5 py-1 rounded-[2px] transition-colors ${
                    timeRange === t.id
                      ? "bg-navy-deep text-white font-semibold"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export Report
            </Button>
          </div>
        </div>

        {/* 4 Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white border-tone-rule">
            <CardHeader className="pb-1">
              <span className="type-micro uppercase text-tone-muted tracking-wider">
                Total Platform GMV (GBP Eq.)
              </span>
              <div className="flex items-center justify-between pt-1">
                <span className="font-serif text-2xl font-bold text-tone-heading">
                  £148,250
                </span>
                <TrendingUp className="w-5 h-5 text-gold" />
              </div>
            </CardHeader>
            <CardContent>
              <span className="text-[11px] text-emerald-700 font-sans font-medium">
                +24.6% vs previous period
              </span>
            </CardContent>
          </Card>

          <Card className="bg-white border-tone-rule">
            <CardHeader className="pb-1">
              <span className="type-micro uppercase text-tone-muted tracking-wider">
                Faculty SLA Turnaround Rate
              </span>
              <div className="flex items-center justify-between pt-1">
                <span className="font-serif text-2xl font-bold text-emerald-700">
                  98.4%
                </span>
                <Clock className="w-5 h-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <span className="text-[11px] text-stone-500 font-sans">
                Avg: 36.8 hours (Target: 48h SLA)
              </span>
            </CardContent>
          </Card>

          <Card className="bg-white border-tone-rule">
            <CardHeader className="pb-1">
              <span className="type-micro uppercase text-tone-muted tracking-wider">
                Active Doctoral Scholars
              </span>
              <div className="flex items-center justify-between pt-1">
                <span className="font-serif text-2xl font-bold text-tone-heading">
                  48 Candidates
                </span>
                <Users className="w-5 h-5 text-navy" />
              </div>
            </CardHeader>
            <CardContent>
              <span className="text-[11px] text-stone-500 font-sans">
                Across 18 global universities
              </span>
            </CardContent>
          </Card>

          <Card className="bg-white border-tone-rule">
            <CardHeader className="pb-1">
              <span className="type-micro uppercase text-tone-muted tracking-wider">
                Accelerator Completion Rate
              </span>
              <div className="flex items-center justify-between pt-1">
                <span className="font-serif text-2xl font-bold text-gold">
                  94.2%
                </span>
                <Award className="w-5 h-5 text-gold" />
              </div>
            </CardHeader>
            <CardContent>
              <span className="text-[11px] text-stone-500 font-sans">
                Dissertation defended on first submission
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Multi-Currency Revenue Breakdown */}
        <Card className="bg-white border-tone-rule">
          <CardHeader className="border-b border-tone-rule pb-4">
            <CardTitle className="font-serif text-base text-tone-heading">
              Multi-Currency Platform Volume Breakdown
            </CardTitle>
            <p className="text-xs text-stone-500 font-sans">
              Reconciled across Stripe, Paystack, and international institutional wires.
            </p>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full min-w-[600px] text-xs font-sans text-left">
              <thead className="bg-paper border-b border-tone-rule text-stone-500 uppercase tracking-wide text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Currency</th>
                  <th className="py-3 px-4 font-semibold">Gateway / Channel</th>
                  <th className="py-3 px-4 font-semibold text-right">Transactions</th>
                  <th className="py-3 px-4 font-semibold text-right">Gross Volume</th>
                  <th className="py-3 px-4 font-semibold text-right">GBP Equivalent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tone-rule">
                {[
                  { code: "GBP (£)", channel: "Stripe UK / B2B Wires", count: 84, gross: "£78,400", gbp: "£78,400" },
                  { code: "USD ($)", channel: "Stripe US / International", count: 52, gross: "$56,200", gbp: "£44,600" },
                  { code: "EUR (€)", channel: "SEPA / Stripe EU", count: 18, gross: "€14,800", gbp: "£12,700" },
                  { code: "NGN (₦)", channel: "Paystack Nigeria", count: 32, gross: "₦14,800,000", gbp: "£8,450" },
                  { code: "KES (KSh)", channel: "Paystack East Africa", count: 12, gross: "KSh 680,000", gbp: "£4,100" },
                ].map((row) => (
                  <tr key={row.code} className="hover:bg-paper/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-navy">{row.code}</td>
                    <td className="py-3 px-4 text-stone-600">{row.channel}</td>
                    <td className="py-3 px-4 text-right text-stone-800">{row.count}</td>
                    <td className="py-3 px-4 text-right font-mono font-medium text-stone-900">{row.gross}</td>
                    <td className="py-3 px-4 text-right font-serif font-bold text-stone-900">{row.gbp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Operations Health Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-paper border-tone-rule">
            <CardHeader className="pb-2">
              <CardTitle className="font-serif text-sm text-tone-heading">
                Turnaround SLA by Discipline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 font-sans text-xs">
              {[
                { discipline: "Quantitative Econometrics & Biostatistics", avg: "34.2 hrs", compliance: "99.1%" },
                { discipline: "Qualitative Phenomenology & Education", avg: "38.5 hrs", compliance: "97.8%" },
                { discipline: "Corporate Governance & Legal Theory", avg: "36.0 hrs", compliance: "98.5%" },
              ].map((d) => (
                <div key={d.discipline} className="flex items-center justify-between p-2.5 bg-white border border-tone-rule rounded-[2px]">
                  <div>
                    <span className="font-medium text-stone-800 block">{d.discipline}</span>
                    <span className="text-[11px] text-stone-500">Average Turnaround: {d.avg}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-300 bg-emerald-50">
                    {d.compliance} SLA
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-paper border-tone-rule">
            <CardHeader className="pb-2">
              <CardTitle className="font-serif text-sm text-tone-heading">
                Academic Integrity &amp; Turnitin Zero-Breach Record
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2 text-xs font-sans text-stone-600 leading-relaxed">
              <p>
                Zero ghostwriting violations reported across 142 total milestone reviews in 2026. All manuscripts scored beneath the 8% similarity threshold (citations &amp; standard formulas excluded).
              </p>
              <div className="pt-2">
                <a href="/admin/integrity" className="text-gold font-medium hover:underline text-[11px]">
                  Audit Full Integrity Registry &rarr;
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}

