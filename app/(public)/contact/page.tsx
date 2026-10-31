"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema, type LeadInput } from "@/lib/validators";
import { PageBreadcrumb, PageHero } from "@/components/marketing/page-components";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      source: "contact-form",
    },
  });

  async function onSubmit(data: LeadInput) {
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const json = await res.json().catch(() => ({}));
        setServerError(json.error || "Failed to deliver message. Please verify all fields.");
      }
    } catch {
      setServerError("Network error. Please try again.");
    }
  }

  return (
    <>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

      <PageHero
        sectionNumber={1}
        sectionLabel="Direct Inquiries"
        headline="Get in touch with our team."
        standfirst="Use this form for general inquiries, institutional questions, or scope assessments. To book a consultation directly, use our booking calendar."
        cta={{ label: "Book a consultation instead", href: "/book" }}
        image={{
          src: "/images/contact/header.jpg",
          alt: "Scholarly workspace with stationery, correspondence notes, and reference books",
          aspectRatio: "21:9",
          caption: "Reach our academic coordinators for consultations, partnerships, or program advice.",
        }}
      />

      <div className="site-container py-12 md:py-16 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Form */}
          <div className="md:col-span-7">
            {submitted ? (
              <div className="bg-white p-8 border border-tone-rule rounded-[2px] space-y-4">
                <div className="w-4 h-4 bg-gold" aria-hidden="true" />
                <h2 className="type-h2 text-tone-heading">Message received</h2>
                <p className="type-body text-tone-muted leading-relaxed">
                  Thank you for contacting GradEdge. We review incoming scholarly inquiries daily and will respond within two working days.
                </p>
                <div className="pt-2">
                  <Button variant="secondary" onClick={() => setSubmitted(false)}>
                    Send another message
                  </Button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-8 border border-tone-rule rounded-[2px] space-y-5"
              >
                {serverError && (
                  <div className="p-4 bg-error/10 border border-error/30 text-error text-sm rounded-[2px]">
                    {serverError}
                  </div>
                )}

                {/* Honeypot field for bot suppression */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                <div className="space-y-1">
                  <label htmlFor="name" className="type-small font-medium text-tone-body">
                    Your full name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register("name")}
                    className="w-full border border-tone-rule bg-paper px-3 py-2 text-sm text-tone-body rounded-[2px] focus:outline-2 focus:outline-navy"
                    placeholder="Jane Doe"
                  />
                  {errors.name && <p className="text-xs text-error">{errors.name.message}</p>}
                </div>

                <div className="space-y-1">
                  <label htmlFor="email" className="type-small font-medium text-tone-body">
                    Email address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="w-full border border-tone-rule bg-paper px-3 py-2 text-sm text-tone-body rounded-[2px] focus:outline-2 focus:outline-navy"
                    placeholder="you@university.edu"
                  />
                  {errors.email && <p className="text-xs text-error">{errors.email.message}</p>}
                </div>

                <div className="space-y-1">
                  <label htmlFor="message" className="type-small font-medium text-tone-body">
                    Your inquiry or research brief *
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    {...register("message")}
                    className="w-full border border-tone-rule bg-paper px-3 py-2 text-sm text-tone-body rounded-[2px] focus:outline-2 focus:outline-navy"
                    placeholder="Describe your research level, discipline, topic, and immediate questions..."
                  />
                  {errors.message && <p className="text-xs text-error">{errors.message.message}</p>}
                </div>

                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  className="w-full"
                  isLoading={isSubmitting}
                >
                  Send Inquiry
                </Button>
              </form>
            )}
          </div>

          {/* Context Sidebar */}
          <div className="md:col-span-5 space-y-6">
            <div className="p-6 bg-paper border border-tone-rule rounded-[2px] space-y-3">
              <h3 className="font-serif text-lg text-tone-heading font-semibold">
                Advisory response time
              </h3>
              <p className="text-xs text-tone-muted leading-relaxed">
                We respond to all academic inquiries within 2 working days (Monday through Friday, 9:00 to 17:00 UTC+1).
              </p>
            </div>

            <div className="p-6 bg-paper border border-tone-rule rounded-[2px] space-y-3">
              <h3 className="font-serif text-lg text-tone-heading font-semibold">
                Direct booking
              </h3>
              <p className="text-xs text-tone-muted leading-relaxed">
                If you are ready to speak with an advisor immediately, book a free twenty-minute consultation without waiting for an email reply.
              </p>
              <div>
                <Button variant="primary" size="sm" href="/book">
                  Book a free call
                </Button>
              </div>
            </div>

            <div className="p-6 bg-paper border border-tone-rule rounded-[2px] space-y-3">
              <h3 className="font-serif text-lg text-tone-heading font-semibold">
                Universities & Faculties
              </h3>
              <p className="text-xs text-tone-muted leading-relaxed">
                Institutions seeking cohort workshops, writing sprints, or embedded mentoring contracts should use our workshop request form.
              </p>
              <div>
                <Link
                  href="/institutions/request-a-workshop"
                  className="type-small font-medium text-navy hover:text-tone-heading border-b border-navy/30 pb-0.5"
                >
                  Workshop request form &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

