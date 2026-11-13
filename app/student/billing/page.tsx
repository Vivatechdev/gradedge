"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useStudent } from "@/components/layout/student-context";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { formatMoney } from "@/lib/payments/types";
import {
  CreditCard,
  Download,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  FileText,
  XCircle,
} from "lucide-react";

export default function StudentBillingPage() {
  const student = useStudent();
  const { toast } = useToast();

  const [data, setData] = useState<{ membership: any; payments: any[] }>({
    membership: null,
    payments: [],
  });
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const loadBilling = async () => {
    try {
      const res = await fetch("/api/student/billing");
      const json = await res.json();
      if (res.ok) {
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBilling();
  }, []);

  const handleCancelMembership = async () => {
    if (!data.membership) return;
    setCancelling(true);

    try {
      const res = await fetch("/api/student/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "cancel",
          membershipId: data.membership.id,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Cancellation failed");

      toast({
        title: "Membership Cancelled",
        message: json.message,
        type: "info",
      });

      setShowCancelModal(false);
      await loadBilling();
    } catch (err: any) {
      toast({ title: "Cancellation Error", message: err.message, type: "error" });
    } finally {
      setCancelling(false);
    }
  };

  const membership = data.membership;
  const plan = membership?.plan;

  return (
    <DashboardShell
      role="student"
      title="Billing & Membership"
      user={{
        name: student.name,
        email: student.email,
        institution: student.institution,
      }}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b border-tone-rule pb-4 space-y-1">
          <span className="type-micro text-gold">Financial Desk</span>
          <h1 className="font-serif text-2xl font-medium text-tone-heading">
            Billing, Invoices & Active Membership
          </h1>
          <p className="text-xs text-tone-muted leading-relaxed font-sans">
            Review your continuous coaching plan, download sequential PDF tax invoices, and manage payment records.
          </p>
        </div>

        {/* ACTIVE MEMBERSHIP SECTION */}
        <div className="bg-white border border-tone-rule rounded-[2px] p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-tone-rule pb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gold" />
              <h2 className="font-serif text-base font-semibold text-tone-heading">
                Research Membership Status
              </h2>
            </div>
            {membership && (
              <Badge
                variant={
                  membership.status === "active"
                    ? "default"
                    : membership.status === "cancelled"
                    ? "outline"
                    : "gold"
                }
                className="capitalize text-[10px]"
              >
                {membership.status}
              </Badge>
            )}
          </div>

          {loading ? (
            <Skeleton className="h-28 w-full" />
          ) : membership ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-medium text-tone-heading">
                    {plan?.name || "Scholar Membership"}
                  </h3>
                  <p className="text-xs text-tone-muted leading-relaxed max-w-xl">
                    {plan?.description}
                  </p>
                  {plan?.price_minor && (
                    <span className="font-serif text-base font-semibold text-navy block pt-1">
                      {formatMoney(plan.price_minor, plan.currency || "USD")} / {plan.interval}
                    </span>
                  )}
                </div>

                <div className="text-left sm:text-right shrink-0 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-tone-muted block">
                    {membership.status === "cancelled" ? "Access Until" : "Next Renewal Date"}
                  </span>
                  <span className="font-serif text-sm font-semibold text-tone-heading">
                    {new Date(membership.currentPeriodEnd).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Plan Perks */}
              {plan?.perks && plan.perks.length > 0 && (
                <div className="pt-2 border-t border-tone-rule space-y-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-tone-heading block">
                    Included membership perks:
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-tone-body">
                    {plan.perks.map((p: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-gold font-bold">&check;</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Plan Actions */}
              <div className="pt-4 border-t border-tone-rule flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" href="/pricing">
                    Change Plan
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    href="/contact?subject=Update Payment Method"
                  >
                    Update Payment Method
                  </Button>
                </div>

                {membership.status === "active" && (
                  <button
                    type="button"
                    onClick={() => setShowCancelModal(true)}
                    className="text-xs text-stone-500 hover:text-error underline transition-colors cursor-pointer"
                  >
                    Cancel Membership
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-tone-muted space-y-3">
              <p>You do not currently have an active monthly research coaching membership.</p>
              <Button variant="accent" href="/pricing" size="sm">
                View Membership Plans & Pricing
              </Button>
            </div>
          )}
        </div>

        {/* PAYMENT HISTORY & DOWNLOADABLE INVOICES */}
        <div className="bg-white border border-tone-rule rounded-[2px] p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-tone-rule pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gold" />
              <h2 className="font-serif text-base font-semibold text-tone-heading">
                Payment History & Official Tax Invoices
              </h2>
            </div>
            <span className="text-xs text-tone-muted">
              Records: {data.payments.length}
            </span>
          </div>

          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : data.payments.length === 0 ? (
            <p className="text-xs text-tone-muted py-8 text-center">
              No payment transactions registered to your account yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-tone-rule bg-paper/60 text-tone-muted font-mono uppercase text-[10px]">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Purpose</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Invoice Number</th>
                    <th className="py-2.5 px-3 text-right">Invoice Download</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-tone-rule">
                  {data.payments.map((p) => {
                    const statusVariant =
                      p.status === "succeeded"
                        ? "default"
                        : p.status === "refunded"
                        ? "muted"
                        : "gold";

                    return (
                      <tr key={p.id} className="hover:bg-paper/30 transition-colors">
                        <td className="py-3 px-3 font-mono text-[11px] text-tone-muted">
                          {new Date(p.paidAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-3 px-3 font-medium text-tone-heading capitalize">
                          {p.purpose.replace("_", " ")}
                        </td>
                        <td className="py-3 px-3 font-serif font-semibold text-tone-heading">
                          {formatMoney(p.amountMinor, p.currency)}
                        </td>
                        <td className="py-3 px-3">
                          <Badge variant={statusVariant as any} className="text-[10px] capitalize">
                            {p.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-navy">
                          {p.invoiceNumber || "–"}
                        </td>
                        <td className="py-3 px-3 text-right">
                          {p.invoiceDownloadUrl ? (
                            <a
                              href={p.invoiceDownloadUrl}
                              download={`${p.invoiceNumber || "invoice"}.pdf`}
                              className="inline-flex items-center btn-secondary text-[11px] py-1 px-2.5 rounded-[2px]"
                            >
                              <Download className="w-3 h-3 mr-1 text-gold" />
                              <span>PDF</span>
                            </a>
                          ) : (
                            <span className="text-[11px] text-stone-400">Available soon</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* CANCELLATION MODAL (Transparent, zero guilt-trips) */}
        {showCancelModal && membership && (
          <div className="fixed inset-0 z-50 bg-navy/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-tone-rule rounded-[2px] w-full max-w-md p-6 space-y-4 shadow-2xl">
              <div className="border-b border-tone-rule pb-3">
                <h3 className="font-serif text-lg font-medium text-tone-heading">
                  Cancel Research Membership
                </h3>
              </div>

              <div className="space-y-3 text-xs text-tone-muted leading-relaxed">
                <p>
                  You are cancelling your <strong>{plan?.name || "Membership"}</strong> subscription.
                </p>
                <div className="p-3 bg-paper border border-tone-rule rounded-[2px] text-tone-heading">
                  You will continue to have full access to your discipline mentor, milestone workspace, and revision critiques until{" "}
                  <strong>
                    {new Date(membership.currentPeriodEnd).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </strong>
                  . No further monthly charges will be debited.
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-tone-rule">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowCancelModal(false)}
                >
                  Keep Membership
                </Button>
                <Button
                  variant="accent"
                  size="sm"
                  disabled={cancelling}
                  onClick={handleCancelMembership}
                  className="bg-stone-800 text-white hover:bg-stone-900 font-medium"
                >
                  {cancelling ? "Processing..." : "Confirm Cancellation"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
