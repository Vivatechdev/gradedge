"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageBreadcrumb, PageHero } from "@/components/marketing/page-components";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface PlanItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_monthly_minor: number;
  currency: string;
  features: string[];
}

function PlanSelector() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("plan");

  const [plans, setPlans] = useState<PlanItem[]>([
    {
      id: "plan-foundation",
      slug: "foundation",
      name: "Research Foundation",
      description: "For scholars drafting literature reviews or early proposals.",
      price_monthly_minor: 3500000,
      currency: "NGN",
      features: ["1 monthly written review cycle", "1 live 45-minute consultation", "Milestone dashboard"],
    },
    {
      id: "plan-advanced",
      slug: "advanced-scholar",
      name: "Advanced Scholar",
      description: "For active dissertation writers producing empirical chapters.",
      price_monthly_minor: 6500000,
      currency: "NGN",
      features: ["2 monthly written review cycles", "2 live 45-minute consultations", "Statistical syntax review"],
    },
    {
      id: "plan-intensive",
      slug: "doctoral-completion",
      name: "Doctoral Completion",
      description: "For scholars within 6 months of defense requiring weekly revision audits.",
      price_monthly_minor: 11000000,
      currency: "NGN",
      features: ["Weekly written review cycles", "4 consultations monthly", "Mock viva simulation"],
    },
  ]);

  const [selectedSlug, setSelectedSlug] = useState<string>(preselected || "advanced-scholar");

  useEffect(() => {
    async function loadPlans() {
      try {
        const res = await fetch("/api/membership/plans");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setPlans(data);
          }
        }
      } catch {
        // Keep fallback
      }
    }
    loadPlans();
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {plans.map((p) => {
          const isSelected = selectedSlug === p.slug;
          return (
            <label
              key={p.slug}
              className={`block p-5 border cursor-pointer transition-all rounded-[2px] ${
                isSelected
                  ? "border-navy bg-cream/30 ring-1 ring-navy"
                  : "border-tone-rule bg-white hover:border-ink-soft"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="membership_plan"
                    value={p.slug}
                    checked={isSelected}
                    onChange={() => setSelectedSlug(p.slug)}
                    className="mt-1 text-navy focus:ring-navy h-4 w-4"
                  />
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-tone-heading">
                      {p.name}
                    </h3>
                    <p className="text-xs text-tone-muted mt-0.5">{p.description}</p>
                    <ul className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-tone-muted">
                      {p.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <span className="text-gold font-bold">&check;</span> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono text-lg font-medium text-tone-heading">
                    {formatCurrency(p.price_monthly_minor, p.currency)}
                  </span>
                  <span className="text-xs text-tone-muted block">/ month</span>
                </div>
              </div>
            </label>
          );
        })}
      </div>

      <div className="pt-4 border-t border-tone-rule space-y-4">
        <Button
          variant="accent"
          size="lg"
          className="w-full"
          href={`/checkout/membership?plan=${selectedSlug}`}
        >
          Continue to Milestone Confirmation
        </Button>
        <p className="text-xs text-center text-tone-muted">
          Protected by industry-standard 256-bit SSL encryption. Cancel subscription renewal anytime from your student dashboard.
        </p>
      </div>
    </div>
  );
}

export default function MembershipJoinPage() {
  return (
    <>
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Membership", href: "/membership" },
          { label: "Join" },
        ]}
      />

      <PageHero
        sectionNumber={1}
        sectionLabel="Plan Selection"
        headline="Choose the plan that fits your research stage."
        standfirst="Select your desired mentoring tier. You can upgrade, downgrade, or cancel your subscription at any time."
      />

      <div className="site-container py-12 md:py-16 max-w-2xl">
        <Suspense fallback={<div className="p-8 text-center text-tone-muted">Loading plans...</div>}>
          <PlanSelector />
        </Suspense>
      </div>
    </>
  );
}

