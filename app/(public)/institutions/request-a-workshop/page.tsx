"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workshopRequestSchema, type WorkshopRequestInput } from "@/lib/validators";
import { PageBreadcrumb, PageHero } from "@/components/marketing/page-components";
import { Button } from "@/components/ui/button";

function WorkshopFormContent() {
  const searchParams = useSearchParams();
  const defaultTopic = searchParams.get("topic") ?? "Introduction to Research Design & Methodology";

  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WorkshopRequestInput>({
    resolver: zodResolver(workshopRequestSchema),
    defaultValues: {
      topic: defaultTopic,
      attendee_count: 20,
    },
  });

  async function onSubmit(data: WorkshopRequestInput) {
    setServerError("");
    try {
      const res = await fetch("/api/workshops/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const json = await res.json().catch(() => ({}));
        setServerError(json.error || "Failed to submit request. Please verify all fields.");
      }
    } catch {
      setServerError("Network error. Please try again.");
    }
  }

  if (submitted) {
    return (
      <div className="bg-white p-8 border border-tone-rule rounded-[2px] text-center space-y-4">
        <div className="w-4 h-4 bg-gold mx-auto" aria-hidden="true" />
        <h2 className="type-h2 text-tone-heading">Workshop Request Received</h2>
        <p className="type-body text-tone-muted max-w-md mx-auto leading-relaxed">
          Thank you. Our institutional partnership director will review your request and contact you within three working days with a detailed proposal.
        </p>
        <div className="pt-4">
          <Button variant="primary" href="/institutions/workshops">
            Back to workshop catalog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 border border-tone-rule rounded-[2px]">
      {serverError && (
        <div className="p-4 bg-error/10 border border-error/30 text-error text-sm rounded-[2px]">
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="institution_name" className="type-small font-medium text-tone-body">
            University / Institution Name *
          </label>
          <input
            id="institution_name"
            type="text"
            {...register("institution_name")}
            className="w-full border border-tone-rule bg-paper px-3 py-2 text-sm text-tone-body rounded-[2px] focus:outline-2 focus:outline-navy"
            placeholder="e.g. University of Ibadan"
          />
          {errors.institution_name && (
            <p className="text-xs text-error">{errors.institution_name.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="contact_name" className="type-small font-medium text-tone-body">
            Faculty Contact Name *
          </label>
          <input
            id="contact_name"
            type="text"
            {...register("contact_name")}
            className="w-full border border-tone-rule bg-paper px-3 py-2 text-sm text-tone-body rounded-[2px] focus:outline-2 focus:outline-navy"
            placeholder="Prof. / Dr. / Dean..."
          />
          {errors.contact_name && (
            <p className="text-xs text-error">{errors.contact_name.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="email" className="type-small font-medium text-tone-body">
            Institutional Email Address *
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full border border-tone-rule bg-paper px-3 py-2 text-sm text-tone-body rounded-[2px] focus:outline-2 focus:outline-navy"
            placeholder="contact@university.edu"
          />
          {errors.email && (
            <p className="text-xs text-error">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="phone" className="type-small font-medium text-tone-body">
            Phone / WhatsApp Number (optional)
          </label>
          <input
            id="phone"
            type="tel"
            {...register("phone")}
            className="w-full border border-tone-rule bg-paper px-3 py-2 text-sm text-tone-body rounded-[2px] focus:outline-2 focus:outline-navy"
            placeholder="+234..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="topic" className="type-small font-medium text-tone-body">
            Selected Workshop Module *
          </label>
          <select
            id="topic"
            {...register("topic")}
            className="w-full border border-tone-rule bg-paper px-3 py-2 text-sm text-tone-body rounded-[2px] focus:outline-2 focus:outline-navy"
          >
            <option value="Introduction to Research Design & Methodology">
              Introduction to Research Design & Methodology
            </option>
            <option value="Quantitative Data Analysis with SPSS or R">
              Quantitative Data Analysis with SPSS or R
            </option>
            <option value="Qualitative Methods: Thematic Analysis and NVivo">
              Qualitative Methods: Thematic Analysis and NVivo
            </option>
            <option value="Writing the Literature Review">Writing the Literature Review</option>
            <option value="Ethics in Research: IRB Applications">
              Ethics in Research: IRB Applications
            </option>
            <option value="Preparing for the Viva Voce">Preparing for the Viva Voce</option>
            <option value="Turning Your Thesis into a Journal Article">
              Turning Your Thesis into a Journal Article
            </option>
            <option value="Grant and Scholarship Proposal Formulation">
              Grant and Scholarship Proposal Formulation
            </option>
            <option value="Customized Multi-Module Series">Customized Multi-Module Series</option>
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="attendee_count" className="type-small font-medium text-tone-body">
            Estimated Cohort Size *
          </label>
          <input
            id="attendee_count"
            type="number"
            min={5}
            max={500}
            {...register("attendee_count", { valueAsNumber: true })}
            className="w-full border border-tone-rule bg-paper px-3 py-2 text-sm text-tone-body rounded-[2px] focus:outline-2 focus:outline-navy"
          />
          {errors.attendee_count && (
            <p className="text-xs text-error">{errors.attendee_count.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="preferred_date" className="type-small font-medium text-tone-body">
          Preferred Date or Academic Term (optional)
        </label>
        <input
          id="preferred_date"
          type="text"
          {...register("preferred_date")}
          className="w-full border border-tone-rule bg-paper px-3 py-2 text-sm text-tone-body rounded-[2px] focus:outline-2 focus:outline-navy"
          placeholder="e.g. Next month, First Semester 2027, or specific date"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="notes" className="type-small font-medium text-tone-body">
          Specific faculty context or research goals (optional)
        </label>
        <textarea
          id="notes"
          rows={3}
          {...register("notes")}
          className="w-full border border-tone-rule bg-paper px-3 py-2 text-sm text-tone-body rounded-[2px] focus:outline-2 focus:outline-navy"
          placeholder="Describe your department's specific requirements or methodology bottlenecks..."
        />
      </div>

      <Button
        type="submit"
        variant="accent"
        size="lg"
        className="w-full"
        isLoading={isSubmitting}
      >
        Submit Workshop Enquiry
      </Button>
    </form>
  );
}

export default function RequestWorkshopPage() {
  return (
    <>
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Institutions", href: "/institutions" },
          { label: "Request a Workshop" },
        ]}
      />

      <PageHero
        sectionNumber={1}
        sectionLabel="Institutional Inquiry"
        headline="Request an institutional research workshop."
        standfirst="Provide details about your faculty, estimated cohort size, and preferred dates. We formulate a customized syllabus proposal within 3 working days."
      />

      <div className="site-container py-12 md:py-16 max-w-2xl">
        <Suspense fallback={<div className="p-8 text-tone-muted">Loading request form...</div>}>
          <WorkshopFormContent />
        </Suspense>
      </div>
    </>
  );
}

