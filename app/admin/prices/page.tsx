"use client";

import React, { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import {
  SUPPORTED_CURRENCIES,
  CURRENCY_METADATA,
  SupportedCurrency,
} from "@/lib/currency/config";
import { formatPrice } from "@/lib/currency/format";
import {
  CreditCard,
  Percent,
  Save,
  RotateCcw,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Copy,
} from "lucide-react";

interface PriceItemRow {
  itemId: string;
  itemType: string;
  label: string;
  prices: Record<SupportedCurrency, number>; // in minor units
}

export default function AdminPricesPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<PriceItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Regional discount copy tool state
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [targetCurrency, setTargetCurrency] = useState<SupportedCurrency>("NGN");
  const [discountPercent, setDiscountPercent] = useState<number>(30); // 30% regional discount default
  const [selectedItemId, setSelectedItemId] = useState<string>("all");

  const loadPrices = async () => {
    try {
      const res = await fetch("/api/admin/prices");
      const json = await res.json();
      if (res.ok) {
        setItems(json.items || []);
      } else {
        toast({ title: "Failed to load", message: json.error, type: "error" });
      }
    } catch (e: any) {
      toast({ title: "Network Error", message: e.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrices();
  }, []);

  const handlePriceChange = (
    itemId: string,
    curr: SupportedCurrency,
    majorValueStr: string
  ) => {
    const num = parseFloat(majorValueStr);
    const amountMinor = isNaN(num) ? 0 : Math.round(num * 100);

    setItems((prev) =>
      prev.map((item) =>
        item.itemId === itemId
          ? {
              ...item,
              prices: {
                ...item.prices,
                [curr]: amountMinor,
              },
            }
          : item
      )
    );
  };

  /**
   * Helper: "Copy from USD with a regional discount %"
   * Applies purchasing-power-parity conversion:
   * Converted = USD_Major * ExchangeRate * (1 - discount% / 100)
   */
  const handleApplyRegionalDiscount = () => {
    const meta = CURRENCY_METADATA[targetCurrency];
    const rate = meta.approximateExchangeFromUsd;
    const discountFactor = 1 - discountPercent / 100;

    setItems((prev) =>
      prev.map((item) => {
        if (selectedItemId !== "all" && item.itemId !== selectedItemId) {
          return item;
        }

        const usdMinor = item.prices.USD || 0;
        const usdMajor = usdMinor / 100;
        const rawConvertedMajor = usdMajor * rate * discountFactor;

        // Clean rounding: if high-denomination currency (NGN, KES), round to nearest 100 or 500
        let cleanMajor = rawConvertedMajor;
        if (targetCurrency === "NGN") {
          cleanMajor = Math.round(rawConvertedMajor / 500) * 500;
        } else if (targetCurrency === "KES" || targetCurrency === "ZAR") {
          cleanMajor = Math.round(rawConvertedMajor / 10) * 10;
        } else if (targetCurrency === "GHS") {
          cleanMajor = Math.round(rawConvertedMajor / 5) * 5;
        } else {
          cleanMajor = Math.round(rawConvertedMajor);
        }

        const newAmountMinor = Math.round(cleanMajor * 100);

        return {
          ...item,
          prices: {
            ...item.prices,
            [targetCurrency]: newAmountMinor,
          },
        };
      })
    );

    toast({
      title: "Regional Pricing Applied",
      message: `Updated ${targetCurrency} prices based on USD with a ${discountPercent}% regional discount.`,
      type: "success",
    });

    setShowDiscountModal(false);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    const updates: Array<{
      itemId: string;
      itemType: string;
      currency: string;
      amountMinor: number;
    }> = [];

    for (const item of items) {
      for (const curr of SUPPORTED_CURRENCIES) {
        updates.push({
          itemId: item.itemId,
          itemType: item.itemType,
          currency: curr,
          amountMinor: item.prices[curr] || 0,
        });
      }
    }

    try {
      const res = await fetch("/api/admin/prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });
      const json = await res.json();
      if (res.ok) {
        toast({
          title: "Prices Saved",
          message: `Successfully synchronized ${json.count} currency price points to the database.`,
          type: "success",
        });
        await loadPrices();
      } else {
        toast({
          title: "Save Failed",
          message: json.error || (json.errors && json.errors.join(", ")),
          type: "error",
        });
      }
    } catch (err: any) {
      toast({ title: "Network Error", message: err.message, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell
      role="admin"
      title="Currency & Regional Pricing"
      user={{
        name: "Freedom Sola",
        email: "freedom.sola@gradedge.internal",
        institution: "Academic Administration",
      }}
    >
      <div className="space-y-6 max-w-7xl font-sans">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-tone-rule pb-4">
          <div className="space-y-1">
            <span className="type-micro text-gold">Financial Administration</span>
            <h1 className="font-serif text-2xl font-medium text-tone-heading">
              Local-Currency Pricing Matrix
            </h1>
            <p className="text-xs text-tone-muted leading-relaxed">
              Store explicit prices per currency for all services, packages, and membership plans. Missing local prices automatically fall back to USD.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowDiscountModal(true)}
              className="text-xs"
            >
              <Percent className="w-3.5 h-3.5 mr-1 text-gold" />
              <span>Regional Discount Tool</span>
            </Button>
            <Button
              variant="accent"
              size="sm"
              disabled={saving || loading}
              onClick={handleSaveAll}
              className="text-xs"
            >
              <Save className="w-3.5 h-3.5 mr-1" />
              <span>{saving ? "Saving..." : "Save All Changes"}</span>
            </Button>
          </div>
        </div>

        {/* Currency Legend Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 bg-white p-3 border border-tone-rule rounded-[2px] text-xs">
          {SUPPORTED_CURRENCIES.map((code) => {
            const meta = CURRENCY_METADATA[code];
            return (
              <div key={code} className="p-2 border border-tone-rule/60 rounded-[2px] bg-paper/40">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-navy">{code}</span>
                  <span className="text-[10px] text-gold font-semibold">{meta.symbol}</span>
                </div>
                <span className="text-[10px] text-tone-muted block truncate">{meta.name}</span>
                <span
                  className={`text-[9px] font-mono mt-1 inline-block px-1 rounded-[1px] ${
                    meta.paystackDirectSupported
                      ? "bg-success/10 text-success"
                      : "bg-paper border border-tone-rule text-stone-500"
                  }`}
                >
                  {meta.paystackDirectSupported ? "Paystack Direct" : "Approx (Charged in USD)"}
                </span>
              </div>
            );
          })}
        </div>

        {/* Pricing Matrix Table */}
        <div className="bg-white border border-tone-rule rounded-[2px] overflow-hidden shadow-xs">
          <div className="p-3.5 border-b border-tone-rule bg-paper/60 flex items-center justify-between">
            <span className="font-serif text-sm font-semibold text-tone-heading">
              Active Item Price Points ({items.length} items)
            </span>
            <span className="text-xs text-tone-muted">
              Prices stored in integer minor units (Rule 2: No floating-point math).
            </span>
          </div>

          {loading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-tone-rule bg-paper/80 font-mono text-[10px] text-tone-muted uppercase">
                    <th className="py-2.5 px-3 min-w-[200px]">Item & Scope</th>
                    <th className="py-2.5 px-3 min-w-[80px]">Type</th>
                    {SUPPORTED_CURRENCIES.map((code) => (
                      <th key={code} className="py-2.5 px-2 min-w-[110px]">
                        {code} ({CURRENCY_METADATA[code].symbol})
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-tone-rule font-sans">
                  {items.map((item) => (
                    <tr key={item.itemId} className="hover:bg-paper/30 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-serif font-medium text-tone-heading block">
                          {item.label}
                        </span>
                        <span className="font-mono text-[10px] text-stone-400">
                          {item.itemId}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="outline" className="text-[10px] uppercase font-mono">
                          {item.itemType.replace("_", " ")}
                        </Badge>
                      </td>
                      {SUPPORTED_CURRENCIES.map((curr) => {
                        const amountMinor = item.prices[curr] || 0;
                        const majorValue = amountMinor / 100;

                        return (
                          <td key={curr} className="py-3 px-2">
                            <div className="relative">
                              <span className="absolute left-2 top-2 text-stone-400 font-mono text-[11px] pointer-events-none">
                                {CURRENCY_METADATA[curr].symbol}
                              </span>
                              <input
                                type="number"
                                step="any"
                                value={majorValue === 0 ? "" : majorValue}
                                placeholder="0"
                                onChange={(e) =>
                                  handlePriceChange(item.itemId, curr, e.target.value)
                                }
                                className="w-full pl-6 pr-2 py-1.5 text-xs font-mono border border-tone-rule rounded-[2px] bg-white focus:outline-none focus:border-navy text-tone-heading"
                              />
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Regional Discount Modal */}
        {showDiscountModal && (
          <div className="fixed inset-0 z-50 bg-navy/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-tone-rule rounded-[2px] w-full max-w-md p-6 space-y-5 shadow-2xl">
              <div className="border-b border-tone-rule pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-gold" />
                  <h3 className="font-serif text-lg font-medium text-tone-heading">
                    Copy from USD with Regional Discount %
                  </h3>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <p className="text-tone-muted leading-relaxed">
                  Automatically populates target regional prices from the base USD rate, using standard purchasing-power exchange benchmarks and your designated discount percentage.
                </p>

                {/* Target Currency */}
                <div className="space-y-1">
                  <label className="font-semibold text-tone-heading block">
                    Target Currency:
                  </label>
                  <select
                    value={targetCurrency}
                    onChange={(e) => setTargetCurrency(e.target.value as SupportedCurrency)}
                    className="w-full p-2 border border-tone-rule rounded-[2px] bg-white text-xs font-mono"
                  >
                    {SUPPORTED_CURRENCIES.filter((c) => c !== "USD").map((c) => (
                      <option key={c} value={c}>
                        {c} ({CURRENCY_METADATA[c].name})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Scope Selection */}
                <div className="space-y-1">
                  <label className="font-semibold text-tone-heading block">
                    Apply To:
                  </label>
                  <select
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    className="w-full p-2 border border-tone-rule rounded-[2px] bg-white text-xs"
                  >
                    <option value="all">All items in catalog ({items.length} items)</option>
                    {items.map((it) => (
                      <option key={it.itemId} value={it.itemId}>
                        {it.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Discount Percentage Slider & Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold text-tone-heading">
                    <span>Regional Discount:</span>
                    <span className="font-mono text-gold font-bold">{discountPercent}% OFF</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    step="5"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(parseInt(e.target.value, 10))}
                    className="w-full accent-navy cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-tone-muted font-mono">
                    <span>0% (Raw Parity)</span>
                    <span>30% (Standard Regional)</span>
                    <span>60% (Max Grant)</span>
                  </div>
                </div>

                <div className="p-3 bg-paper border border-tone-rule rounded-[2px] space-y-1 text-[11px] text-tone-muted">
                  <span className="font-semibold text-tone-heading block">Formula Applied:</span>
                  <code>
                    Price = (USD * {CURRENCY_METADATA[targetCurrency].approximateExchangeFromUsd}) * (1 - {discountPercent / 100})
                  </code>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-tone-rule">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowDiscountModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="accent"
                  size="sm"
                  onClick={handleApplyRegionalDiscount}
                >
                  Apply Regional Prices
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

