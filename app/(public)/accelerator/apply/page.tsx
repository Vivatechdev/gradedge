"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { programApplicationSchema, type ProgramApplicationInput } from "@/lib/validators";
import { PageBreadcrumb, PageHero } from "@/components/marketing/page-components";
import { Button } from "@/components/ui/button";

export default function AcceleratorApplyPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProgramApplicationInput>({
    resolver: zodResolver(programApplicationSchema),
    defaultValues: {
      study_level: "phd",
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
        setServerError(json.error || "Failed to submit application. Please verify all fields.");
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
        sectionNumber={1}
        sectionLabel="Admissions Application"
        headline="Apply for the Dissertation Accelerator."
        standfirst="The form takes approximately 15 minutes. We review every application personally to verify methodological fit and mentor availability."
      />

      <div className="site-container py-12 md:py-16 max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 border border-tone-rule rounded-[2px]">
          {serverError && (
            <div className="p-4 bg-error/10 border border-error/30 text-error text-sm rounded-[2px]">
              {serverError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="full_name" className="type-small font-medium text-tone-body">
                Full name *
              </label>
              <input
                id="full_name"
                type="text"
                {...register("full_name")}
                className="w-full border border-tone-rule bg-paper px-3 py-2 text-sm text-tone-body rounded-[2px] focus:outline-2 focus:outline-navy"
                placeholder="Jane Doe"
              />
              {errors.full_name && (
                <p className="text-xs text-error">{errors.full_name.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="type-small font-medium text-tone-body">
                Academic or primary email *
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="w-full border border-tone-rule bg-paper px-3 py-2 text-sm text-tone-body rounded-[2px] focus:outline-2 focus:outline-navy"
                placeholder="j.doe@university.edu"
              />
              {errors.email && (
                <p className="text-xs text-error">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="institution" className="type-small font-medium text-tone-body">
                University or Institution *
              </label>
              <input
                id="institution"
                type="text"
                {...register("institution")}
                className="w-full border border-tone-rule bg-paper px-3 py-2 text-sm text-tone-body rounded-[2px] focus:outline-2 focus:outline-navy"
                placeholder="University of Lagos"
              />
              {errors.institution && (
                <p className="text-xs text-error">{errors.institution.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="study_level" className="type-small font-medium text-tone-body">
                Degree level *
              </label>
              <select
                id="study_level"
                {...register("study_level")}
                className="w-full border border-tone-rule bg-paper px-3 py-2 text-sm text-tone-body rounded-[2px] focus:outline-2 focus:outline-navy"
              >
                <option value="phd">Doctoral / PhD</option>
                <option value="masters">Masters Dissertation</option>
                <option value="other">Postgraduate Research / Other</option>
              </select>
              {errors.study_level && (
                <p className="text-xs text-error">{errors.study_level.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="field_of_study" className="type-small font-medium text-tone-body">
              Specific field / discipline *
            </label>
            <input
              id="field_of_study"
              type="text"
              {...register("field_of_study")}
              className="w-full border border-tone-rule bg-paper px-3 py-2 text-sm text-tone-body rounded-[2px] focus:outline-2 focus:outline-navy"
              placeholder="e.g. Public Health (Epidemiology), Education Policy, Econometrics"
            />
            {errors.field_of_study && (
              <p className="text-xs text-error">{errors.field_of_study.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="dissertation_title" className="type-small font-medium text-tone-body">
              Working dissertation or thesis title *
            </label>
            <input
              id="dissertation_title"
              type="text"
              {...register("dissertation_title")}
              className="w-full border border-tone-rule bg-paper px-3 py-2 text-sm text-tone-body rounded-[2px] focus:outline-2 focus:outline-navy"
              placeholder="e.g. Evaluating Maternal Health Interventions in Rural Districts"
            />
            {errors.dissertation_title && (
              <p className="text-xs text-error">{errors.dissertation_title.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="summary" className="type-small font-medium text-tone-body">
              Research summary (200 words or fewer) *
            </label>
            <textarea
              id="summary"
              rows={4}
              {...register("summary")}
              className="w-full border border-tone-rule bg-paper px-3 py-2 text-sm text-tone-body rounded-[2px] focus:outline-2 focus:outline-navy"
              placeholder="Describe your research questions, proposed methodology, and current bottleneck..."
            />
            {errors.summary && (
              <p className="text-xs text-error">{errors.summary.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="supervisor_feedback" className="type-small font-medium text-tone-body">
              Most recent supervisor feedback (optional)
            </label>
            <textarea
              id="supervisor_feedback"
              rows={3}
              {...register("supervisor_feedback")}
              className="w-full border border-tone-rule bg-paper px-3 py-2 text-sm text-tone-body rounded-[2px] focus:outline-2 focus:outline-navy"
              placeholder="Paste recent comments or committee concerns if available..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="timeline" className="type-small font-medium text-tone-body">
                Target submission deadline *
              </label>
              <input
                id="timeline"
                type="text"
                {...register("timeline")}
                className="w-full border border-tone-rule bg-paper px-3 py-2 text-sm text-tone-body rounded-[2px] focus:outline-2 focus:outline-navy"
                placeholder="e.g. November 2027"
              />
              {errors.timeline && (
                <p className="text-xs text-error">{errors.timeline.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="heard_from" className="type-small font-medium text-tone-body">
                How did you hear about GradEdge? (optional)
              </label>
              <input
                id="heard_from"
                type="text"
                {...register("heard_from")}
                className="w-full border border-tone-rule bg-paper px-3 py-2 text-sm text-tone-body rounded-[2px] focus:outline-2 focus:outline-navy"
                placeholder="Colleague, academic conference, web search..."
              />
            </div>
          </div>

          {/* Academic Integrity consent */}
          <div className="pt-2 border-t border-tone-rule space-y-2">
            <p className="text-xs text-tone-muted leading-relaxed">
              By submitting this application, you confirm that you understand GradEdge is an academic coaching and feedback service. All final submissions to your degree-granting institution must be entirely authored by you.
            </p>
          </div>

          <Button
            type="submit"
            variant="accent"
            size="lg"
            className="w-full"
            isLoading={isSubmitting}
          >
            Submit Application for Review
          </Button>

          <p className="text-xs text-center text-tone-muted">
            We review applications within 5 working days and respond to every applicant individually.
          </p>
        </form>
      </div>
    </>
  );
}

