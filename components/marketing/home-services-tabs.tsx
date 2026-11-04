"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface HomeServiceItem {
  slug: string;
  title: string;
  stage: "Starting out" | "Doing the research" | "Writing it up" | "Getting it out" | "Skills and training";
  stageId: "starting-out" | "doing-research" | "writing-up" | "getting-out" | "skills-training";
  description: string;
}

export const HOME_SERVICES: HomeServiceItem[] = [
  // Starting out
  {
    slug: "topic-proposal-development",
    title: "Topic & Proposal Development",
    stage: "Starting out",
    stageId: "starting-out",
    description: "Narrow your focus, frame your research questions, and structure a defensible proposal.",
  },
  {
    slug: "research-design-ethics",
    title: "Research Design & Ethics Support",
    stage: "Starting out",
    stageId: "starting-out",
    description: "Choose methodology, plan sampling instruments, and prepare institutional ethics applications.",
  },
  // Doing the research
  {
    slug: "literature-review-support",
    title: "Literature Review Support",
    stage: "Doing the research",
    stageId: "doing-research",
    description: "Synthesize disparate literature into an argumentative narrative that positions your study.",
  },
  {
    slug: "quantitative-data-analysis",
    title: "Quantitative Data Analysis",
    stage: "Doing the research",
    stageId: "doing-research",
    description: "Statistical guidance in SPSS, R, Python, and Stata with syntax audits and model diagnostics.",
  },
  {
    slug: "qualitative-data-analysis",
    title: "Qualitative Data Analysis",
    stage: "Doing the research",
    stageId: "doing-research",
    description: "Thematic coding, grounded theory, and framework analysis using NVivo and ATLAS.ti.",
  },
  {
    slug: "structural-equation-modeling",
    title: "Structural Equation Modeling",
    stage: "Doing the research",
    stageId: "doing-research",
    description: "Latent variable modeling, confirmatory factor analysis, and path analysis in SmartPLS and AMOS.",
  },
  {
    slug: "mixed-methods-research-design",
    title: "Mixed Methods Research Design",
    stage: "Doing the research",
    stageId: "doing-research",
    description: "Integrate quantitative and qualitative research strands into a unified empirical methodology.",
  },
  // Writing it up
  {
    slug: "dissertation-thesis-mentoring",
    title: "Dissertation & Thesis Mentoring",
    stage: "Writing it up",
    stageId: "writing-up",
    description: "Chapter-by-chapter developmental feedback on structure, argument clarity, and academic register.",
  },
  {
    slug: "academic-editing-proofreading",
    title: "Academic Editing & Proofreading",
    stage: "Writing it up",
    stageId: "writing-up",
    description: "Line-level editorial refinement to elevate scholarly clarity, style, and argumentative coherence.",
  },
  {
    slug: "referencing-formatting-compliance",
    title: "Referencing & Formatting Compliance",
    stage: "Writing it up",
    stageId: "writing-up",
    description: "Precision alignment with APA, Chicago, Harvard, IEEE, and university manuscript guidelines.",
  },
  {
    slug: "similarity-report-review",
    title: "Similarity Report Review",
    stage: "Writing it up",
    stageId: "writing-up",
    description: "Turnitin and similarity report analysis, source attribution review, and paraphrasing coaching.",
  },
  {
    slug: "esl-academic-writing-support",
    title: "ESL Academic Writing Support",
    stage: "Writing it up",
    stageId: "writing-up",
    description: "Specialized coaching for multilingual researchers to articulate conceptual ideas with clarity.",
  },
  // Getting it out
  {
    slug: "journal-article-conversion",
    title: "Journal Article Conversion",
    stage: "Getting it out",
    stageId: "getting-out",
    description: "Convert dissertation chapters and research studies into peer-reviewed journal submissions.",
  },
  {
    slug: "target-journal-selection-audit",
    title: "Target Journal Selection Audit",
    stage: "Getting it out",
    stageId: "getting-out",
    description: "Indexation analysis, scope verification, and impact factor strategic outlet auditing.",
  },
  {
    slug: "response-to-reviewers-strategy",
    title: "Response to Reviewers Strategy",
    stage: "Getting it out",
    stageId: "getting-out",
    description: "Construct persuasive, respectful, and methodologically sound peer-review rebuttal letters.",
  },
  {
    slug: "grant-scholarship-coaching",
    title: "Grant & Scholarship Coaching",
    stage: "Getting it out",
    stageId: "getting-out",
    description: "Structure competitive research grant proposals and fellowship applications.",
  },
  // Skills and training
  {
    slug: "defense-presentation-coaching",
    title: "Defense & Viva Voce Coaching",
    stage: "Skills and training",
    stageId: "skills-training",
    description: "Prepare for your oral examination with mock questions, defense slides, and examiner handling.",
  },
  {
    slug: "research-productivity-coaching",
    title: "Research Productivity Coaching",
    stage: "Skills and training",
    stageId: "skills-training",
    description: "Overcome writing blocks, design sustainable daily routines, and accelerate thesis momentum.",
  },
  {
    slug: "statistical-software-intensive",
    title: "Statistical Software Intensive",
    stage: "Skills and training",
    stageId: "skills-training",
    description: "Hands-on one-on-one sessions mastering R, SPSS, Stata, or Python syntax from scratch.",
  },
  {
    slug: "academic-career-postdoc-guidance",
    title: "Academic Career & Postdoc Guidance",
    stage: "Skills and training",
    stageId: "skills-training",
    description: "Academic CV development, research statements, and postdoctoral job market positioning.",
  },
];

type TabId = "all" | "starting-out" | "doing-research" | "writing-up" | "getting-out" | "skills-training";

const TABS: { id: TabId; label: string }[] = [
  { id: "all", label: "All services" },
  { id: "starting-out", label: "Starting out" },
  { id: "doing-research", label: "Doing the research" },
  { id: "writing-up", label: "Writing it up" },
  { id: "getting-out", label: "Getting it out" },
  { id: "skills-training", label: "Skills and training" },
];

export function HomeServicesTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("all");

  const filteredServices =
    activeTab === "all"
      ? HOME_SERVICES
      : HOME_SERVICES.filter((s) => s.stageId === activeTab);

  return (
    <div className="space-y-8">
      {/* Accessible Filter Tabs */}
      <div
        role="tablist"
        aria-label="Filter services by research stage"
        className="flex flex-wrap items-center gap-2 border-b border-tone-rule pb-4"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`service-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`service-panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-3.5 py-1.5 text-xs sm:text-sm font-sans font-medium rounded-[2px] transition-all duration-150 border",
                isActive
                  ? "bg-navy text-white border-navy shadow-xs"
                  : "bg-paper text-tone-body border-tone-rule hover:border-gold hover:text-tone-heading"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Two-Column List of Rows */}
      <div
        role="tabpanel"
        id={`service-panel-${activeTab}`}
        aria-labelledby={`service-tab-${activeTab}`}
        className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-12"
      >
        {filteredServices.map((svc) => (
          <div
            key={svc.slug}
            className="relative group border-t border-tone-rule pt-3.5 pb-4 transition-colors"
          >
            {/* On hover, a short gold line appears on the top rule */}
            <span
              className="absolute top-0 left-0 w-0 group-hover:w-12 h-[2px] bg-gold transition-all duration-200 pointer-events-none"
              aria-hidden="true"
            />
            <Link
              href={`/services/${svc.slug}`}
              className="block focus:outline-none focus-visible:ring-1 focus-visible:ring-gold"
            >
              <div className="flex items-baseline justify-between gap-3">
                {/* Service name in serif, changes color on hover */}
                <h3 className="font-serif text-base sm:text-lg font-medium text-tone-heading group-hover:text-navy transition-colors">
                  {svc.title}
                </h3>
                {/* Small stage tag at the right */}
                <span className="text-[10px] font-sans uppercase tracking-wider text-tone-muted px-2 py-0.5 rounded-[2px] bg-cream/80 border border-tone-rule/60 shrink-0 select-none">
                  {svc.stage}
                </span>
              </div>
              {/* One line of description */}
              <p className="text-xs sm:text-sm text-tone-muted truncate line-clamp-1 mt-1 font-sans">
                {svc.description}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
