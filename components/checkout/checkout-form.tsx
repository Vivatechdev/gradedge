"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock, AlertCircle } from "lucide-react";
import { Currency, PaymentPurpose, formatMoney } from "@/lib/payments/types";

interface CheckoutFormProps {
  purpose: PaymentPurpose;
  title: string;
  description: string;
  includes: string[];
  priceUsdMinor: number;
  priceNgnMinor: number;
  initialCurrency?: Currency;
  serviceSlug?: string;
  packageId?: string;
  bookingId?: string;
  applicationId?: string;
  allowInstallments?: boolean;
  installmentTotal?: number;
}

export function CheckoutForm({
  purpose,
  title,
  description,
  includes,
  priceUsdMinor,
  priceNgnMinor,
  initialCurrency = "USD",
  serviceSlug,
  packageId,
  bookingId,
  applicationId,
  allowInstallments = false,
  installmentTotal = 3,
}: CheckoutFormProps) {
  const [currency, setCurrency] = useState<Currency>(initialCurrency);
  const [isInstallment, setIsInstallment] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fullAmountMinor = currency === "USD" ? priceUsdMinor : priceNgnMinor;
  const installmentAmountMinor = Math.round(fullAmountMinor / installmentTotal);
  const currentPayAmountMinor = isInstallment ? installmentAmountMinor : fullAmountMinor;
  const formattedButtonAmount = formatMoney(currentPayAmountMinor, currency);

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purpose,
          currency,
          customerEmail: customerEmail.trim() || undefined,
          customerName: customerName.trim() || undefined,
          serviceSlug,
          packageId,
          bookingId,
          applicationId,
          isInstallment,
          installmentNumber: 1,
          installmentTotal: isInstallment ? installmentTotal : 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to initiate payment.");
      }

      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else {
        throw new Error("Missing checkout authorization URL.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleCheckout} className="bg-white border border-tone-rule rounded-[2px] p-6 sm:p-8 text-left space-y-6 shadow-xs">
      {/* Purpose & Inclusions */}
      <div className="space-y-3 pb-5 border-b border-tone-rule">
        <span className="type-micro text-gold">Item Summary</span>
        <h2 className="font-serif text-xl sm:text-2xl font-medium text-tone-heading">{title}</h2>
        <p className="text-xs text-tone-muted leading-relaxed">{description}</p>

        {includes.length > 0 && (
          <div className="pt-3 space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-tone-heading">
              What is included:
            </span>
            <ul className="space-y-1.5 text-xs text-tone-body">
              {includes.map((inc, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-gold font-bold">&check;</span>
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Currency Switcher */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-tone-heading">Select Billing Currency</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setCurrency("USD")}
            className={`py-2 px-3 text-xs font-medium rounded-[2px] border transition-colors ${
              currency === "USD"
                ? "border-navy bg-navy text-white"
                : "border-tone-rule bg-paper text-tone-heading hover:bg-tone-rule/20"
            }`}
          >
            US Dollar (USD $)
          </button>
          <button
            type="button"
            onClick={() => setCurrency("NGN")}
            className={`py-2 px-3 text-xs font-medium rounded-[2px] border transition-colors ${
              currency === "NGN"
                ? "border-navy bg-navy text-white"
                : "border-tone-rule bg-paper text-tone-heading hover:bg-tone-rule/20"
            }`}
          >
            Nigerian Naira (NGN ₦)
          </button>
        </div>
      </div>

      {/* Optional Installment Selector for Accelerator */}
      {allowInstallments && (
        <div className="space-y-2 p-3 bg-paper border border-tone-rule rounded-[2px]">
          <span className="text-xs font-semibold text-tone-heading">Payment Schedule</span>
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="paymentSchedule"
                checked={!isInstallment}
                onChange={() => setIsInstallment(false)}
                className="text-navy"
              />
              <span className="text-tone-heading">
                Full Program Tuition — <strong>{formatMoney(fullAmountMinor, currency)}</strong>
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="paymentSchedule"
                checked={isInstallment}
                onChange={() => setIsInstallment(true)}
                className="text-navy"
              />
              <span className="text-tone-heading">
                3-Part Installment Plan — <strong>{formatMoney(installmentAmountMinor, currency)}</strong> today, then 2 monthly installments
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Customer Details Intake */}
      <div className="space-y-3 pt-2">
        <div className="space-y-1">
          <label htmlFor="customerName" className="text-xs font-medium text-tone-heading">
            Your Full Name
          </label>
          <input
            id="customerName"
            type="text"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="e.g. Dr. Jane Doe"
            className="w-full text-xs px-3 py-2 border border-tone-rule rounded-[2px] bg-white focus:outline-none focus:border-navy"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="customerEmail" className="text-xs font-medium text-tone-heading">
            Academic / Billing Email
          </label>
          <input
            id="customerEmail"
            type="email"
            required
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="e.g. j.doe@oxford.ac.uk"
            className="w-full text-xs px-3 py-2 border border-tone-rule rounded-[2px] bg-white focus:outline-none focus:border-navy"
          />
          <span className="text-[10px] text-tone-muted">
            Your official PDF tax invoice and access links are dispatched to this address.
          </span>
        </div>
      </div>

      {/* Total Due Callout */}
      <div className="pt-3 border-t border-tone-rule flex items-baseline justify-between">
        <span className="text-xs text-tone-muted">Total Due Now:</span>
        <span className="font-serif text-2xl font-semibold text-tone-heading">
          {formattedButtonAmount}
        </span>
      </div>

      {error && (
        <div className="p-3 bg-error/10 border border-error/30 rounded-[2px] text-xs text-error flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Pay Button */}
      <div className="space-y-3 pt-2">
        <Button
          type="submit"
          variant="accent"
          size="lg"
          disabled={loading}
          className="w-full font-semibold text-xs py-3 flex items-center justify-center gap-2"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>{loading ? "Preparing Secure Checkout..." : `Pay ${formattedButtonAmount} securely`}</span>
        </Button>

        <p className="text-[11px] text-center text-tone-muted">
          Protected by 256-bit SSL encryption. We never store credit or debit card numbers on our servers.
        </p>
      </div>

      {/* Refund Policy Guarantee */}
      <div className="pt-3 border-t border-tone-rule flex items-start gap-2 text-[11px] text-tone-muted">
        <ShieldCheck className="w-4 h-4 text-gold shrink-0 mt-0.5" />
        <span>
          Academic Integrity & Satisfaction Policy: Clear milestone deliverables with zero hidden fees. Read our{" "}
          <Link href="/legal/terms#refunds" className="text-navy hover:text-gold underline font-medium">
            Refund & Cancellation Policy
          </Link>
          .
        </span>
      </div>
    </form>
  );
}

