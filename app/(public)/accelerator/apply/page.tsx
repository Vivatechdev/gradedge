"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProgramApplicationSchema, type ProgramApplicationInput } from "@/lib/validators";
import { PageBreadcrumb, PageHero } from "@/components/marketing/page-components";

export default function AcceleratorApplyPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProgramApplicationInput>({
    resolver: zodResolver(ProgramApplicationSchema),
    defaultValues: {
      doctoral_stage: "Mid-Candidacy / Writing Chapters",
      preferred_start: "Immediate Cohort (Within 2 Weeks)",
    },
  });

  async function onSubmit(data: ProgramApplicationInput) {
    setServerError("");
    try {
      const res = await fetch("/api/applications/accelerator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/accelerator/application-received");
      } else {
        const json = await res.json().catch(() => ({}));
        setServerError(json.error || "Failed to submit application. Please verify all required fields.");
      }
    } catch {
      setServerError("Network error. Please try again.");
    }
  }

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Dissertation Accelerator", href: "/accelerator" },
          { label: "Apply" },
        ]}
      />

      <PageHero
        sectionLabel="Admissions Application"
        headline="Apply for the Dissertation Accelerator."
        standfirst="We review every application personally to verify methodological fit and mentor availability. Admitted scholars receive dedicated one-on-one chapter coaching."
      />

      <div className="site-container py-12 md:py-16 max-w-2xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-white p-6 sm:p-8 border border-[#E4DFD5] rounded-[4px] shadow-sm font-sans"
        >
          {serverError && (
            <div
              role="alert"
              className="p-4 bg-burgundy/10 border-l-2 border-burgundy text-burgundy text-xs rounded-[4px]"
            >
              {serverError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 text-left">
              <label htmlFor="name" className="text-xs font-medium text-tone-heading block">
                Full name *
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className="w-full border border-[#E4DFD5] bg-paper px-3 py-2 text-xs sm:text-sm rounded-[4px] focus:outline-none focus:ring-1 focus:ring-gold"
                placeholder="Jane Doe"
              />
              {errors.name && (
                <p className="text-[11px] text-burgundy">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1 text-left">
              <label htmlFor="email" className="text-xs font-medium text-tone-heading block">
                Academic or primary email *
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="w-full border border-[#E4DFD5] bg-paper px-3 py-2 text-xs sm:text-sm rounded-[4px] focus:outline-none focus:ring-1 focus:ring-gold"
                placeholder="j.doe@university.edu"
              />
              {errors.email && (
                <p className="text-[11px] text-burgundy">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 text-left">
              <label htmlFor="institution" className="text-xs font-medium text-tone-heading block">
                University or Research Institution *
              </label>
              <input
                id="institution"
                type="text"
                {...register("institution")}
                className="w-full border border-[#E4DFD5] bg-paper px-3 py-2 text-xs sm:text-sm rounded-[4px] focus:outline-none focus:ring-1 focus:ring-gold"
                placeholder="University of Oxford / Harvard University"
              />
              {errors.institution && (
                <p className="text-[11px] text-burgundy">{errors.institution.message}</p>
              )}
            </div>

            <div className="space-y-1 text-left">
              <label htmlFor="doctoral_stage" className="text-xs font-medium text-tone-heading block">
                Doctoral / Research Stage *
              </label>
              <select
                id="doctoral_stage"
                {...register("doctoral_stage")}
                className="w-full border border-[#E4DFD5] bg-paper px-3 py-2 text-xs sm:text-sm rounded-[4px] focus:outline-none focus:ring-1 focus:ring-gold"
              >
                <option value="Proposal & Research Design">Proposal & Research Design</option>
                <option value="Data Collection / Empirical Fieldwork">Data Collection / Fieldwork</option>
                <option value="Data Analysis & Statistical Modeling">Data Analysis & Statistical Modeling</option>
                <option value="Mid-Candidacy / Writing Chapters">Mid-Candidacy / Writing Chapters</option>
                <option value="Final Revisions & Pre-Defense Clearance">Final Revisions & Pre-Defense Clearance</option>
                <option value="Response to External Reviewers">Response to External Reviewers</option>
              </select>
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label htmlFor="topic_summary" className="text-xs font-medium text-tone-heading block">
              Topic summary & research question *
            </label>
            <textarea
              id="topic_summary"
              rows={3}
              {...register("topic_summary")}
              className="w-full border border-[#E4DFD5] bg-paper px-3 py-2 text-xs sm:text-sm rounded-[4px] focus:outline-none focus:ring-1 focus:ring-gold"
              placeholder="State your central research question, conceptual framing, and intended methodology..."
            />
            {errors.topic_summary && (
              <p className="text-[11px] text-burgundy">{errors.topic_summary.message}</p>
            )}
          </div>

          <div className="space-y-1 text-left">
            <label htmlFor="completed_summary" className="text-xs font-medium text-tone-heading block">
              What you&apos;ve completed so far *
            </label>
            <textarea
              id="completed_summary"
              rows={3}
              {...register("completed_summary")}
              className="w-full border border-[#E4DFD5] bg-paper px-3 py-2 text-xs sm:text-sm rounded-[4px] focus:outline-none focus:ring-1 focus:ring-gold"
              placeholder="e.g. Chapter 1 approved, Chapter 2 literature review drafted (12,000 words), raw survey data collected in SPSS..."
            />
            {errors.completed_summary && (
              <p className="text-[11px] text-burgundy">{errors.completed_summary.message}</p>
            )}
          </div>

          <div className="space-y-1 text-left">
            <label htmlFor="desired_outcomes" className="text-xs font-medium text-tone-heading block">
              What do you want from the accelerator program? *
            </label>
            <textarea
              id="desired_outcomes"
              rows={3}
              {...register("desired_outcomes")}
              className="w-full border border-[#E4DFD5] bg-paper px-3 py-2 text-xs sm:text-sm rounded-[4px] focus:outline-none focus:ring-1 focus:ring-gold"
              placeholder="e.g. Line-level developmental critique on Chapters 3 & 4, structural equation modeling audit, 16-week defense readiness..."
            />
            {errors.desired_outcomes && (
              <p className="text-[11px] text-burgundy">{errors.desired_outcomes.message}</p>
            )}
          </div>

          <div className="space-y-1 text-left">
            <label htmlFor="preferred_start" className="text-xs font-medium text-tone-heading block">
              Preferred Start / Cohort Timing *
            </label>
            <select
              id="preferred_start"
              {...register("preferred_start")}
              className="w-full border border-[#E4DFD5] bg-paper px-3 py-2 text-xs sm:text-sm rounded-[4px] focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <option value="Immediate Cohort (Within 2 Weeks)">Immediate Cohort (Within 2 Weeks)</option>
              <option value="Next Month">Next Month</option>
              <option value="Next Academic Term">Next Academic Term</option>
              <option value="Flexible / Dependent on Faculty Fit">Flexible / Dependent on Faculty Fit</option>
            </select>
          </div>

          <div className="p-3.5 bg-[#FAF8F4] border border-[#E4DFD5] rounded-[4px] text-[11px] text-tone-muted leading-relaxed">
            <strong>Admissions Review Timeline:</strong> Our faculty methodologists review every submission personally within two business days. Upon acceptance, you will receive an admissions notice with your assigned mentor profile and secure payment link.
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-2.5 bg-gold text-navy font-semibold text-xs sm:text-sm rounded-[4px] transition-colors hover:bg-gold/90 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isSubmitting ? "Submitting Application..." : "Submit Accelerator Application &rarr;"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
