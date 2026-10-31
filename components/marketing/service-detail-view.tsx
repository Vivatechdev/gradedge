"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Photo } from "@/components/ui/photo";
import { Check, ShieldCheck, Sparkles, BookOpen, Terminal, FileCode, Award, Users } from "lucide-react";
import type { ServiceContentItem } from "@/lib/data/services-content";
import {
  ThesisArchitectureVisualizer,
  DataLabModelVisualizer,
  RedlineDiffVisualizer,
  JournalSubmissionVisualizer,
  VivaDefenseVisualizer,
} from "@/components/marketing/service-visuals";

interface ServiceDetailViewProps {
  service: ServiceContentItem;
  relatedServices: ServiceContentItem[];
  relatedPosts: Array<{
    slug: string;
    title: string;
    standfirst: string;
    reading_time_minutes: number;
  }>;
}

interface CategoryConfig {
  trackBadge: string;
  heroPill: string;
  visualizerTitle: string;
  visualizerSubtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  navSections: Array<{ id: string; label: string }>;
  accentColor: string;
  guaranteeText: string;
}

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  "dissertation-support": {
    trackBadge: "Doctoral Manuscript Track",
    heroPill: "Thesis Architecture & Chapter Roadmapping",
    visualizerTitle: "Interactive Thesis Architecture & Milestone Navigator",
    visualizerSubtitle: "Explore chapter-by-chapter supervisory hurdles, target word lengths, and our structured mentor interventions.",
    icon: BookOpen,
    accentColor: "border-gold/40 bg-gold/5 text-gold",
    guaranteeText: "Chapter-by-chapter structural integrity with zero ghostwriting. 100% researcher-authored scholarship.",
    navSections: [
      { id: "overview", label: "Overview" },
      { id: "interactive-lab", label: "Thesis Architecture" },
      { id: "is-this-for-you", label: "Candidate Alignment" },
      { id: "what-you-get", label: "Deliverables" },
      { id: "how-it-works", label: "Workflow" },
      { id: "example", label: "Mentor Feedback" },
      { id: "packages", label: "Packages & Pricing" },
      { id: "faq", label: "FAQ" },
    ],
  },
  "data-analysis": {
    trackBadge: "Empirical Laboratory Track",
    heroPill: "Computational Modeling & Fit Diagnostics",
    visualizerTitle: "Interactive Computational Workbench & Fit Diagnostics",
    visualizerSubtitle: "Switch between statistical packages (R, Python, SPSS, Stata, SmartPLS) to inspect reproducible syntax and model fit indexes.",
    icon: Terminal,
    accentColor: "border-navy/40 bg-navy/5 text-navy",
    guaranteeText: "Reproducible code repository with full dataset audit trails. Clear methodology reports with zero synthetic fabrication.",
    navSections: [
      { id: "overview", label: "Overview" },
      { id: "interactive-lab", label: "Code & Diagnostics" },
      { id: "is-this-for-you", label: "Empirical Scope" },
      { id: "what-you-get", label: "Deliverables & Data" },
      { id: "how-it-works", label: "Pipeline" },
      { id: "example", label: "Audit Evidence" },
      { id: "packages", label: "Packages & Pricing" },
      { id: "faq", label: "FAQ" },
    ],
  },
  "editing-and-writing-quality": {
    trackBadge: "Editorial & Style Compliance Track",
    heroPill: "Redline Proofroom & Style Manual Compliance",
    visualizerTitle: "Scholarly Redline Proofroom & Tracked Changes Diff",
    visualizerSubtitle: "Inspect line-level tracked changes, academic prose transformations, and strict style manual compliance (APA 7th, Chicago, IEEE, Harvard).",
    icon: FileCode,
    accentColor: "border-gold/50 bg-cream text-tone-heading",
    guaranteeText: "Strict human editorial scholarship complying with publisher style guides. Double-blind peer-review formatting guaranteed.",
    navSections: [
      { id: "overview", label: "Overview" },
      { id: "interactive-lab", label: "Redline Proofroom" },
      { id: "is-this-for-you", label: "Editorial Standards" },
      { id: "what-you-get", label: "Edited Deliverables" },
      { id: "how-it-works", label: "Revision Cycles" },
      { id: "example", label: "Annotations" },
      { id: "packages", label: "Tiers & Turnaround" },
      { id: "faq", label: "FAQ" },
    ],
  },
  "publishing-and-career": {
    trackBadge: "High-Impact Journal Dispatch Track",
    heroPill: "Q1/Q2 Scopus Alignment & Peer Review Diplomacy",
    visualizerTitle: "Journal Submission Blueprint & Author Rebuttal Simulator",
    visualizerSubtitle: "Simulate rigorous point-by-point author rebuttals responding diplomatically to critical reviewer commentary.",
    icon: Award,
    accentColor: "border-gold/60 bg-gold/10 text-gold",
    guaranteeText: "Target journal selection aligned with Scopus/Clarivate impact factors. Rigorous reviewer rebuttal diplomacy.",
    navSections: [
      { id: "overview", label: "Overview" },
      { id: "interactive-lab", label: "Journal Rebuttal Matrix" },
      { id: "is-this-for-you", label: "Target Tiering" },
      { id: "what-you-get", label: "Dispatch Deliverables" },
      { id: "how-it-works", label: "Submission Flow" },
      { id: "example", label: "Reviewer Response Sample" },
      { id: "packages", label: "Scope & Investment" },
      { id: "faq", label: "FAQ" },
    ],
  },
  "coaching-and-training": {
    trackBadge: "Oral Examination & Defense Chamber Track",
    heroPill: "Viva Voce Simulation & Committee Cross-Examination",
    visualizerTitle: "Viva Voce Oral Defense Simulation Chamber",
    visualizerSubtitle: "Practice structured academic responses against external examiner methodological traps, committee challenges, and policy translation probes.",
    icon: Users,
    accentColor: "border-navy/40 bg-cream text-navy",
    guaranteeText: "Realistic 1-on-1 mock cross-examination by senior doctoral supervisors. Rehearsal slides and defense strategies.",
    navSections: [
      { id: "overview", label: "Overview" },
      { id: "interactive-lab", label: "Defense Simulation" },
      { id: "is-this-for-you", label: "Defense Readiness" },
      { id: "what-you-get", label: "Coaching Materials" },
      { id: "how-it-works", label: "Rehearsal Protocol" },
      { id: "example", label: "Examiner Dialogue" },
      { id: "packages", label: "Rehearsal Packages" },
      { id: "faq", label: "FAQ" },
    ],
  },
};

export function ServiceDetailView({
  service,
  relatedServices,
  relatedPosts,
}: ServiceDetailViewProps) {
  const [currency, setCurrency] = useState<"NGN" | "USD">("NGN");

  const categoryConfig = CATEGORY_CONFIG[service.category] || CATEGORY_CONFIG["dissertation-support"];
  const navSections = categoryConfig.navSections;
  const [activeSection, setActiveSection] = useState(navSections[0].id);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 220;
      for (let i = navSections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(navSections[i].id);
        if (sectionEl && sectionEl.offsetTop <= scrollPosition) {
          setActiveSection(navSections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navSections]);

  const startingPriceDisplay =
    currency === "NGN"
      ? `₦${service.starting_price_ngn.toLocaleString()}`
      : `$${service.starting_price_usd}`;

  const renderVisualizer = () => {
    switch (service.category) {
      case "data-analysis":
        return <DataLabModelVisualizer />;
      case "editing-and-writing-quality":
        return <RedlineDiffVisualizer />;
      case "publishing-and-career":
        return <JournalSubmissionVisualizer />;
      case "coaching-and-training":
        return <VivaDefenseVisualizer />;
      case "dissertation-support":
      default:
        return <ThesisArchitectureVisualizer />;
    }
  };

  const TrackIcon = categoryConfig.icon;

  return (
    <div className="relative">
      {/* ── 1. IN-PAGE STICKY ANCHOR NAVIGATION BAR ───────────────────────── */}
      <nav
        aria-label="Service sections"
        className="sticky top-16 z-30 bg-paper/95 backdrop-blur-xs border-y border-tone-rule shadow-xs"
      >
        <div className="site-container">
          <div className="subnav-fade-mask relative">
            <div className="flex items-center gap-1.5 sm:gap-4 overflow-x-auto py-2.5 subnav-track text-xs scroll-smooth px-2 sm:px-0">
              {navSections.map((sec) => {
                const isActive = activeSection === sec.id;
                return (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className={`px-3 py-1.5 rounded-[2px] font-medium whitespace-nowrap transition-colors shrink-0 ${isActive
                        ? "bg-navy text-white shadow-xs"
                        : "text-tone-muted hover:text-tone-heading hover:bg-cream/60"
                      }`}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {sec.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT CONTAINER WITH TWO-COLUMN DESKTOP LAYOUT ───────────── */}
      <div className="site-container py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* ════ LEFT COLUMN: WIDE EDITORIAL CONTENT (8 Cols) ══════════════ */}
          <div className="lg:col-span-8 space-y-16">
            {/* ── SECTION 1: OVERVIEW & HERO ──────────────────────────────── */}
            <section id="overview" className="scroll-mt-32 space-y-8">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-xs font-mono font-medium border ${categoryConfig.accentColor}`}>
                    <TrackIcon className="w-3.5 h-3.5" />
                    <span>{categoryConfig.trackBadge}</span>
                  </span>
                  <span className="type-micro text-tone-muted">
                    {service.category_name}
                  </span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-tone-heading leading-tight">
                  {service.title}
                </h1>

                <p className="font-serif text-lg sm:text-xl text-tone-body leading-relaxed max-w-2xl">
                  {service.two_sentence_promise}
                </p>
              </div>

              {/* Hero Image (3:2) */}
              <div className="rounded-[2px] overflow-hidden border border-tone-rule shadow-sm">
                <Photo
                  src={service.hero_image}
                  alt={service.hero_image_alt}
                  aspectRatio="3:2"
                  priority={true}
                  caption={service.hero_summary}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button variant="accent" size="lg" href={`/book?service=${service.slug}`}>
                  Book a free 20-min consultation
                </Button>
                <Button variant="secondary" size="lg" href={`/contact?subject=Service Inquiry: ${service.title}`}>
                  Request custom scope quote
                </Button>
              </div>

              {/* At-A-Glance 4-Fact Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-cream/70 border border-tone-rule rounded-[2px] text-xs">
                <div className="space-y-1">
                  <span className="type-micro text-tone-muted block">Format</span>
                  <span className="font-medium text-tone-heading block">{service.format_text}</span>
                </div>
                <div className="space-y-1">
                  <span className="type-micro text-tone-muted block">Turnaround</span>
                  <span className="font-medium text-tone-heading block">{service.turnaround_text}</span>
                </div>
                <div className="space-y-1">
                  <span className="type-micro text-tone-muted block">Candidate Stage</span>
                  <span className="font-medium text-tone-heading block">{service.best_for}</span>
                </div>
                <div className="space-y-1">
                  <span className="type-micro text-tone-muted block">Starting Investment</span>
                  <span className="font-semibold text-tone-heading block text-sm">
                    {startingPriceDisplay}
                  </span>
                </div>
              </div>

              {/* Category Guarantee Strip */}
              <div className="p-4 bg-white border border-tone-rule rounded-[2px] flex items-start gap-3 shadow-xs">
                <ShieldCheck className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-tone-heading block">
                    Academic Integrity & Quality Standard
                  </span>
                  <p className="text-xs text-tone-body leading-relaxed">
                    {categoryConfig.guaranteeText}
                  </p>
                </div>
              </div>
            </section>

            {/* ── SECTION 2: BESPOKE INTERACTIVE MODULE (POLYMORPHIC LAB) ──── */}
            <section id="interactive-lab" className="scroll-mt-32 space-y-6 pt-8 border-t border-tone-rule">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span className="type-micro text-gold">Interactive Demonstration</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-tone-heading font-medium">
                  {categoryConfig.visualizerTitle}
                </h2>
                <p className="text-xs sm:text-sm text-tone-muted max-w-2xl leading-relaxed">
                  {categoryConfig.visualizerSubtitle}
                </p>
              </div>

              {/* Dynamic Interactive Visualizer Module */}
              <div className="pt-2">
                {renderVisualizer()}
              </div>
            </section>

            {/* ── SECTION 3: IS THIS FOR YOU? (CANDIDATE ALIGNMENT) ────────── */}
            <section id="is-this-for-you" className="scroll-mt-32 space-y-6 pt-8 border-t border-tone-rule">
              <div className="space-y-2">
                <span className="type-micro text-tone-muted">Candidate Alignment</span>
                <h2 className="font-serif text-2xl sm:text-3xl text-tone-heading font-medium">
                  Is this service right for your research?
                </h2>
                <p className="text-xs sm:text-sm text-tone-muted max-w-xl">
                  Review these common scholar scenarios. If two or more apply to your project, this service is calibrated for your exact milestone.
                </p>
              </div>

              <div className="space-y-3">
                {service.signs_you_need_this.map((sign, i) => (
                  <div
                    key={i}
                    className="p-4 bg-white border border-tone-rule rounded-[2px] flex items-start gap-3 shadow-xs"
                  >
                    <span className="w-5 h-5 mt-0.5 rounded-full bg-cream border border-gold/40 text-gold flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <p className="text-xs sm:text-sm text-tone-body leading-relaxed">{sign}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-paper border border-tone-rule rounded-[2px] text-xs text-tone-muted space-y-2">
                <strong className="text-tone-heading block">Who we mentor under this service:</strong>
                <ul className="list-disc list-inside space-y-1">
                  {service.who_its_for.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>

            {/* ── SECTION 4: WHAT YOU GET (DOCUMENTED DELIVERABLES) ────────── */}
            <section id="what-you-get" className="scroll-mt-32 space-y-6 pt-8 border-t border-tone-rule">
              <div className="space-y-2">
                <span className="type-micro text-tone-muted">Tangible Deliverables</span>
                <h2 className="font-serif text-2xl sm:text-3xl text-tone-heading font-medium">
                  What you receive
                </h2>
                <p className="text-xs sm:text-sm text-tone-muted max-w-xl">
                  Every engagement produces tangible, documented deliverables that you retain permanently in your student dashboard.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.deliverables.map((del, i) => (
                  <div
                    key={i}
                    className="p-5 bg-white border border-tone-rule rounded-[2px] space-y-2 hover:border-gold/60 transition-colors"
                  >
                    <span className="font-mono text-xs text-gold font-medium">Deliverable 0{i + 1}</span>
                    <h3 className="font-serif text-base font-medium text-tone-heading">{del.title}</h3>
                    <p className="text-xs text-tone-body leading-relaxed">{del.description}</p>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-cream/70 border border-gold/30 rounded-[2px] space-y-3">
                <h4 className="font-serif text-base font-medium text-tone-heading">
                  Concrete outcomes you can expect:
                </h4>
                <ul className="space-y-2 text-xs text-tone-body">
                  {service.outcomes.map((outcome, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-gold font-bold">&rarr;</span>
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* ── SECTION 5: HOW IT WORKS (WORKFLOW) ───────────────────────── */}
            <section id="how-it-works" className="scroll-mt-32 space-y-6 pt-8 border-t border-tone-rule">
              <div className="space-y-2">
                <span className="type-micro text-tone-muted">Structured Workflow</span>
                <h2 className="font-serif text-2xl sm:text-3xl text-tone-heading font-medium">
                  How the engagement works
                </h2>
                <p className="text-xs sm:text-sm text-tone-muted max-w-xl">
                  A disciplined, step-by-step workflow designed to move your research forward without ambiguity or delay.
                </p>
              </div>

              <div className="relative border-l border-tone-rule ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8">
                {service.process_steps.map((step) => (
                  <div key={step.step} className="relative group">
                    <div className="absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full bg-paper border border-tone-rule flex items-center justify-center font-serif text-sm font-semibold text-navy group-hover:border-gold transition-colors">
                      0{step.step}
                    </div>

                    <div className="space-y-1.5 pt-0.5">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-serif text-lg font-medium text-tone-heading">
                          {step.title}
                        </h3>
                        <span className="text-[11px] font-mono text-tone-muted bg-cream px-2 py-0.5 rounded-[1px] border border-tone-rule">
                          {step.typical_duration}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-tone-body leading-relaxed max-w-xl">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── SECTION 6: WHAT MENTOR FEEDBACK LOOKS LIKE ───────────────── */}
            <section id="example" className="scroll-mt-32 space-y-6 pt-8 border-t border-tone-rule">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div className="space-y-1">
                  <span className="type-micro text-tone-muted">Annotated Sample</span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-tone-heading font-medium">
                    What mentor feedback looks like
                  </h2>
                </div>
                <Badge variant="navy">Illustrative Academic Example</Badge>
              </div>

              <div className="p-4 bg-cream/50 border border-tone-rule text-xs text-tone-muted rounded-[2px]">
                <strong>Confidentiality Notice:</strong> The sample below is an instructional demonstration of our line-level annotations. Under our Scholar Privacy Policy, client dissertations and empirical datasets are never displayed publicly.
              </div>

              {/* Annotated Mock-up Card */}
              <div className="bg-paper border border-tone-rule shadow-sm rounded-[2px] p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between border-b border-tone-rule pb-3 text-xs">
                  <div>
                    <span className="font-serif font-medium text-tone-heading block text-sm">
                      {service.sample_feedback.title}
                    </span>
                    <span className="text-[11px] text-tone-muted">
                      Context: {service.sample_feedback.manuscript_context}
                    </span>
                  </div>
                  <span className="font-mono text-gold text-[11px]">Milestone Review Annotation</span>
                </div>

                {/* Draft vs Annotated Revision */}
                <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-tone-muted block mb-1">
                      Submitted Scholar Draft:
                    </span>
                    <p className="line-through text-tone-muted/60 decoration-error/70 font-mono text-xs bg-white/60 p-3 rounded-[2px] border border-tone-rule/60">
                      &ldquo;{service.sample_feedback.original_text}&rdquo;
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-tone-heading block mb-1">
                      Revised Text with Academic Precision:
                    </span>
                    <p className="bg-cream/90 p-3.5 border-l-2 border-gold text-tone-heading font-mono text-xs rounded-[1px]">
                      &ldquo;{service.sample_feedback.annotated_excerpt}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Mentor Margin Note */}
                <div className="p-4 bg-white border border-tone-rule rounded-[2px] text-xs space-y-1.5 shadow-xs">
                  <span className="font-semibold text-tone-heading block text-[11px]">
                    Mentor Margin Annotation:
                  </span>
                  <p className="italic text-tone-body leading-normal">
                    {service.sample_feedback.mentor_marginal_note}
                  </p>
                </div>

                {/* Takeaway */}
                <div className="flex items-center gap-2 pt-2 text-xs text-tone-body">
                  <strong className="text-tone-heading">Core takeaway:</strong>
                  <span>{service.sample_feedback.actionable_takeaway}</span>
                </div>
              </div>
            </section>

            {/* ── SECTION 7: TOOLS AND METHODS ────────────────────────────── */}
            <section className="space-y-4 pt-8 border-t border-tone-rule">
              <span className="type-micro text-tone-muted">Methodology & Software</span>
              <h3 className="font-serif text-xl text-tone-heading font-medium">
                Tools and software environments covered:
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {service.software_tools.map((tool, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white border border-tone-rule text-tone-heading text-xs rounded-[2px] font-medium"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </section>

            {/* ── SECTION 8: WHAT WE WON'T DO (INTEGRITY PLEDGE) ───────────── */}
            <section className="space-y-4 pt-8 border-t border-tone-rule">
              <div className="p-6 sm:p-8 bg-cream border border-gold/40 rounded-[2px] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="type-micro text-tone-muted">Integrity Pledge</span>
                  <Badge variant="navy">Strict Academic Integrity</Badge>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl text-tone-heading font-medium">
                  What we will not do under this service
                </h3>

                <p className="text-xs sm:text-sm text-tone-body leading-relaxed">
                  GradEdge operates strictly within university academic integrity regulations and higher-education codes of conduct. Our mission is to mentor you into an independent scholar, not to replace your scholarship.
                </p>

                <ul className="space-y-2.5 text-xs text-tone-body pt-2">
                  {service.what_we_wont_do.map((rule, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-danger font-bold text-sm shrink-0">&times;</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-[11px] text-tone-muted pt-2 border-t border-gold/20">
                  Read our full{" "}
                  <Link href="/about/academic-integrity" className="text-navy underline font-medium hover:text-gold">
                    Academic Integrity Position
                  </Link>{" "}
                  and{" "}
                  <Link href="/legal/academic-integrity" className="text-navy underline font-medium hover:text-gold">
                    Institutional Code of Conduct
                  </Link>.
                </p>
              </div>
            </section>

            {/* ── SECTION 9: PACKAGES & PRICING COMPARISON TABLE ───────────── */}
            <section id="packages" className="scroll-mt-32 space-y-6 pt-8 border-t border-tone-rule">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-2">
                  <span className="type-micro text-tone-muted">Investment Tiers</span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-tone-heading font-medium">
                    Packages & Pricing
                  </h2>
                  <p className="text-xs sm:text-sm text-tone-muted max-w-xl">
                    Transparent investment with no hidden charges. Choose the scope that matches your chapter milestone.
                  </p>
                </div>

                {/* Currency Toggle */}
                <div className="flex items-center gap-1 bg-white border border-tone-rule p-1 rounded-[2px] text-xs shrink-0">
                  <button
                    type="button"
                    onClick={() => setCurrency("NGN")}
                    className={`px-3 py-1 rounded-[1px] font-medium transition-colors cursor-pointer ${currency === "NGN" ? "bg-navy text-white" : "text-tone-muted hover:text-tone-heading"
                      }`}
                  >
                    NGN (₦)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency("USD")}
                    className={`px-3 py-1 rounded-[1px] font-medium transition-colors cursor-pointer ${currency === "USD" ? "bg-navy text-white" : "text-tone-muted hover:text-tone-heading"
                      }`}
                  >
                    USD ($)
                  </button>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="border border-tone-rule rounded-[2px] overflow-hidden bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-cream border-b border-tone-rule font-serif text-tone-heading text-sm">
                        <th className="p-4 sm:p-5 font-medium min-w-[200px]">Package Tier</th>
                        <th className="p-4 sm:p-5 font-medium min-w-[120px]">Feedback Cycles</th>
                        <th className="p-4 sm:p-5 font-medium min-w-[110px]">Turnaround</th>
                        <th className="p-4 sm:p-5 font-medium min-w-[130px]">Investment</th>
                        <th className="p-4 sm:p-5 font-medium text-right min-w-[140px]">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-tone-rule">
                      {service.packages.map((pkg) => {
                        const price =
                          currency === "NGN"
                            ? `₦${pkg.price_ngn.toLocaleString()}`
                            : `$${pkg.price_usd}`;

                        return (
                          <tr key={pkg.id} className="hover:bg-paper/60 transition-colors">
                            <td className="p-4 sm:p-5 align-top space-y-1.5">
                              <div className="flex items-center gap-2">
                                <span className="font-serif font-medium text-tone-heading text-sm">
                                  {pkg.name}
                                </span>
                                {pkg.popular && <Badge variant="gold">Most Selected</Badge>}
                              </div>
                              <p className="text-xs text-tone-muted">{pkg.description}</p>
                              <ul className="pt-2 space-y-1 text-[11px] text-tone-body">
                                {pkg.includes.map((inc, i) => (
                                  <li key={i} className="flex items-center gap-1.5">
                                    <span className="text-gold font-bold">&check;</span>
                                    <span>{inc}</span>
                                  </li>
                                ))}
                              </ul>
                            </td>
                            <td className="p-4 sm:p-5 align-top text-tone-body font-medium">
                              {pkg.rounds_of_feedback}
                            </td>
                            <td className="p-4 sm:p-5 align-top text-tone-muted">
                              {pkg.turnaround}
                            </td>
                            <td className="p-4 sm:p-5 align-top">
                              <span className="font-serif text-base font-semibold text-tone-heading block">
                                {price}
                              </span>
                              <span className="text-[10px] text-tone-muted block">One-time package</span>
                            </td>
                            <td className="p-4 sm:p-5 align-top text-right">
                              <Button
                                variant={pkg.popular ? "accent" : "secondary"}
                                size="sm"
                                href={`/checkout/${pkg.id}?service=${service.slug}&currency=${currency}`}
                              >
                                Select Package &rarr;
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* ── SECTION 10: SERVICE FAQS WITH ACCORDION SEMANTICS ────────── */}
            <section id="faq" className="scroll-mt-32 space-y-6 pt-8 border-t border-tone-rule">
              <div className="space-y-2">
                <span className="type-micro text-tone-muted">Inquiries</span>
                <h2 className="font-serif text-2xl sm:text-3xl text-tone-heading font-medium">
                  Frequently Asked Questions
                </h2>
                <p className="text-xs sm:text-sm text-tone-muted max-w-xl">
                  Specific questions about this service, mentor assignment, and submission mechanics.
                </p>
              </div>

              <div className="divide-y divide-tone-rule border-y border-tone-rule">
                {service.faqs.map((faq, i) => (
                  <details key={i} className="group py-4 cursor-pointer">
                    <summary className="flex items-center justify-between font-serif text-base sm:text-lg text-tone-heading font-medium hover:text-navy transition-colors list-none">
                      <span>{faq.question}</span>
                      <span className="text-gold text-lg transition-transform group-open:rotate-45 ml-4 shrink-0">
                        +
                      </span>
                    </summary>
                    <div className="pt-3 pr-8 text-xs sm:text-sm text-tone-body leading-relaxed">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>

            {/* ── SECTION 11: RELATED SERVICES & BLOG POSTS ────────────────── */}
            <section className="space-y-8 pt-8 border-t border-tone-rule">
              <div className="space-y-4">
                <span className="type-micro text-tone-muted">Complementary Support</span>
                <h3 className="font-serif text-xl sm:text-2xl text-tone-heading font-medium">
                  Related research services
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedServices.map((rel) => (
                    <div
                      key={rel.slug}
                      className="border border-tone-rule bg-white rounded-[2px] p-4 flex flex-col justify-between hover:border-navy transition-colors space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="border border-tone-rule rounded-[1px] overflow-hidden">
                          <Photo
                            src={rel.hero_image}
                            alt={rel.hero_image_alt}
                            aspectRatio="3:2"
                            sizes="200px"
                          />
                        </div>
                        <h4 className="font-serif text-sm font-medium text-tone-heading line-clamp-1">
                          {rel.title}
                        </h4>
                        <p className="text-xs text-tone-muted line-clamp-2">
                          {rel.two_sentence_promise}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-tone-rule flex items-center justify-between text-xs">
                        <span className="text-[11px] text-tone-muted">
                          From ₦{rel.starting_price_ngn.toLocaleString()}
                        </span>
                        <Link
                          href={`/services/${rel.slug}`}
                          className="font-medium text-navy hover:text-gold transition-colors"
                        >
                          Details &rarr;
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {relatedPosts.length > 0 && (
                <div className="space-y-4 pt-4">
                  <span className="type-micro text-tone-muted">Scholarly Guidance</span>
                  <h3 className="font-serif text-xl sm:text-2xl text-tone-heading font-medium">
                    Articles related to this stage
                  </h3>

                  <div className="divide-y divide-tone-rule border-y border-tone-rule">
                    {relatedPosts.map((post) => (
                      <div key={post.slug} className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                        <div className="space-y-1 max-w-xl">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="font-serif text-base text-tone-heading hover:text-navy font-medium transition-colors"
                          >
                            {post.title}
                          </Link>
                          <p className="text-xs text-tone-muted line-clamp-1">{post.standfirst}</p>
                        </div>
                        <span className="text-[11px] text-tone-muted shrink-0 font-mono">
                          {post.reading_time_minutes} min read
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* ════ RIGHT COLUMN: STICKY SIDEBAR (4 Cols Desktop) ══════════════ */}
          <aside className="lg:col-span-4 hidden lg:block sticky top-28 space-y-6">
            <div className="bg-white border border-tone-rule rounded-[2px] p-6 shadow-sm space-y-6">
              <div className="border-b border-tone-rule pb-4 space-y-1">
                <span className="type-micro text-tone-muted">Investment</span>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-2xl font-semibold text-tone-heading">
                    From {startingPriceDisplay}
                  </span>
                  <span className="text-xs text-tone-muted">{service.turnaround_text}</span>
                </div>
              </div>

              <div className="p-3 bg-cream/70 border border-gold/30 rounded-[2px] text-xs text-tone-body space-y-1">
                <strong className="text-tone-heading block">Next consultation availability:</strong>
                <span>Tomorrow, 2:00 PM WAT (Verified slot)</span>
              </div>

              <div className="space-y-3 pt-1">
                <Button variant="accent" size="lg" className="w-full" href={`/book?service=${service.slug}`}>
                  Book a free 20-min call
                </Button>
                <Button variant="secondary" size="md" className="w-full" href={`/contact?subject=Service Inquiry: ${service.title}`}>
                  Request support quote
                </Button>
              </div>

              <div className="pt-4 border-t border-tone-rule space-y-2 text-xs text-center text-tone-muted">
                <p>
                  Have questions first?{" "}
                  <Link href="/contact" className="text-navy underline hover:text-gold font-medium">
                    Send us a message
                  </Link>
                </p>
                <p className="text-[11px]">We typically respond within 1 business day.</p>
              </div>
            </div>

            {/* Integrity Micro Badge */}
            <div className="p-4 bg-paper border border-tone-rule rounded-[2px] text-xs text-tone-muted space-y-1 text-center">
              <strong className="text-tone-heading block font-serif">GradEdge Integrity Standard</strong>
              <p className="text-[11px]">No ghostwriting. All analysis and writing remains 100% authored by you.</p>
            </div>
          </aside>
        </div>
      </div>

      {/* ── MOBILE FIXED BOTTOM ACTION BAR ─────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-tone-rule px-4 py-3 shadow-lg flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-tone-muted block uppercase tracking-wider">Starting from</span>
          <span className="font-serif text-base font-semibold text-tone-heading">
            {startingPriceDisplay}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" href={`/contact?subject=Inquiry: ${service.title}`}>
            Inquire
          </Button>
          <Button variant="accent" size="sm" href={`/book?service=${service.slug}`}>
            Book Call
          </Button>
        </div>
      </div>
    </div>
  );
}
