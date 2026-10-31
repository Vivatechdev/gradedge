"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, ShieldCheck, Check, Sparkles } from "lucide-react";

interface ScopeTier {
  id: string;
  name: string;
  baseNgn: number;
  baseUsd: number;
}

const DEGREE_LEVELS = [
  { id: "phd", label: "Doctoral / PhD Candidate", multiplier: 1.4 },
  { id: "masters", label: "Masters / MPhil Researcher", multiplier: 1.0 },
  { id: "undergrad", label: "Undergraduate Honors", multiplier: 0.75 },
];

const RESEARCH_MILESTONES = [
  {
    id: "full-thesis",
    label: "Full Manuscript Architecture (Ch 1–5)",
    baseNgn: 450000,
    baseUsd: 450,
    turnaround: "8–12 weeks",
    recommendedPackage: "Doctoral Completion Suite",
  },
  {
    id: "data-empirical",
    label: "Data Analysis, Syntax Audit & SEM Fit",
    baseNgn: 180000,
    baseUsd: 180,
    turnaround: "2–3 weeks",
    recommendedPackage: "Quantitative Empirical Workbench",
  },
  {
    id: "methodology",
    label: "Research Design, Sampling & Codebooks",
    baseNgn: 140000,
    baseUsd: 140,
    turnaround: "10–14 days",
    recommendedPackage: "Methodology Clearance Review",
  },
  {
    id: "literature",
    label: "Literature Synthesis & Thematic Matrix",
    baseNgn: 120000,
    baseUsd: 120,
    turnaround: "10–14 days",
    recommendedPackage: "Literature Synthesis Sprint",
  },
  {
    id: "viva",
    label: "Viva Voce & Mock Committee Defense",
    baseNgn: 95000,
    baseUsd: 95,
    turnaround: "1 week intensive",
    recommendedPackage: "Viva Voce Defense Chamber",
  },
];

const SPEED_OPTIONS = [
  { id: "standard", label: "Standard Review Cycle", multiplier: 1.0 },
  { id: "priority", label: "Priority Fast-Track (Committee Urgent)", multiplier: 1.25 },
];

export function PricingScopeCalculator() {
  const [degreeLevel, setDegreeLevel] = useState("phd");
  const [milestone, setMilestone] = useState("data-empirical");
  const [speed, setSpeed] = useState("standard");
  const [currency, setCurrency] = useState<"NGN" | "USD">("NGN");

  const selectedDegree = DEGREE_LEVELS.find((d) => d.id === degreeLevel) || DEGREE_LEVELS[0];
  const selectedMilestone = RESEARCH_MILESTONES.find((m) => m.id === milestone) || RESEARCH_MILESTONES[0];
  const selectedSpeed = SPEED_OPTIONS.find((s) => s.id === speed) || SPEED_OPTIONS[0];

  const totalMultiplier = selectedDegree.multiplier * selectedSpeed.multiplier;
  const calculatedNgn = Math.round((selectedMilestone.baseNgn * totalMultiplier) / 1000) * 1000;
  const calculatedUsd = Math.round(selectedMilestone.baseUsd * totalMultiplier);

  const displayPrice =
    currency === "NGN"
      ? `₦${calculatedNgn.toLocaleString()}`
      : `$${calculatedUsd.toLocaleString()}`;

  return (
    <div className="border border-tone-rule bg-white rounded-[2px] p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-tone-rule pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <Calculator className="w-4 h-4 text-gold" />
            <span className="type-micro text-gold">Interactive Tool</span>
          </div>
          <h3 className="font-serif text-2xl text-tone-heading font-medium">
            Doctoral Milestone Scope Calculator
          </h3>
          <p className="text-xs text-tone-muted">
            Estimate your investment based on your academic level, chapter milestone, and timeline.
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-1 bg-cream border border-tone-rule p-1 rounded-[2px] text-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setCurrency("NGN")}
            className={`px-3 py-1 rounded-[1px] font-medium transition-colors cursor-pointer ${
              currency === "NGN" ? "bg-navy text-white" : "text-tone-muted hover:text-tone-heading"
            }`}
          >
            NGN (₦)
          </button>
          <button
            type="button"
            onClick={() => setCurrency("USD")}
            className={`px-3 py-1 rounded-[1px] font-medium transition-colors cursor-pointer ${
              currency === "USD" ? "bg-navy text-white" : "text-tone-muted hover:text-tone-heading"
            }`}
          >
            USD ($)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Academic Level */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-tone-heading block">
              1. Your Academic Degree Level:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {DEGREE_LEVELS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDegreeLevel(d.id)}
                  className={`p-3 text-left border rounded-[2px] text-xs transition-colors cursor-pointer ${
                    degreeLevel === d.id
                      ? "border-navy bg-navy/5 text-navy font-semibold"
                      : "border-tone-rule bg-paper text-tone-muted hover:border-tone-heading"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Research Milestone */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-tone-heading block">
              2. Target Research Deliverable:
            </label>
            <div className="space-y-2">
              {RESEARCH_MILESTONES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMilestone(m.id)}
                  className={`w-full p-3 text-left border rounded-[2px] text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    milestone === m.id
                      ? "border-navy bg-navy/5 text-navy font-semibold shadow-xs"
                      : "border-tone-rule bg-white text-tone-body hover:border-tone-heading"
                  }`}
                >
                  <span>{m.label}</span>
                  <span className="font-mono text-[11px] text-tone-muted ml-2 shrink-0">
                    {m.turnaround}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Review Urgency */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-tone-heading block">
              3. Turnaround Speed:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SPEED_OPTIONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSpeed(s.id)}
                  className={`p-3 text-left border rounded-[2px] text-xs transition-colors cursor-pointer ${
                    speed === s.id
                      ? "border-navy bg-navy/5 text-navy font-semibold"
                      : "border-tone-rule bg-paper text-tone-muted hover:border-tone-heading"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Summary Card (5 cols) */}
        <div className="lg:col-span-5 bg-cream border border-gold/40 rounded-[2px] p-6 space-y-5">
          <div className="border-b border-tone-rule pb-3 space-y-1">
            <span className="type-micro text-gold">Estimated Investment Bracket</span>
            <div className="flex items-baseline justify-between">
              <span className="font-serif text-3xl font-semibold text-tone-heading">
                {displayPrice}
              </span>
              <Badge variant="navy">Starting Quote</Badge>
            </div>
            <p className="text-[11px] text-tone-muted">
              Estimated scope based on {selectedDegree.label.split(" ")[0]} standards.
            </p>
          </div>

          <div className="space-y-2 text-xs text-tone-body">
            <div className="flex justify-between py-1 border-b border-tone-rule/60">
              <span className="text-tone-muted">Deliverable:</span>
              <span className="font-medium text-tone-heading text-right max-w-[200px] truncate">
                {selectedMilestone.label}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-tone-rule/60">
              <span className="text-tone-muted">Typical Turnaround:</span>
              <span className="font-medium text-tone-heading">{selectedMilestone.turnaround}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-tone-rule/60">
              <span className="text-tone-muted">Recommended Tier:</span>
              <span className="font-medium text-navy">{selectedMilestone.recommendedPackage}</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              variant="accent"
              size="md"
              className="w-full text-xs font-semibold"
              href={`/book?milestone=${milestone}&degree=${degreeLevel}&currency=${currency}`}
            >
              Lock in Consultation Call &rarr;
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="w-full text-xs"
              href={`/contact?subject=Scope Inquiry for ${selectedMilestone.label}`}
            >
              Request Custom Written Brief
            </Button>
          </div>

          <div className="pt-3 border-t border-gold/20 flex items-start gap-2 text-[11px] text-tone-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
            <span>Fixed milestone pricing. No billable hourly overruns or ghostwriting charges.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

