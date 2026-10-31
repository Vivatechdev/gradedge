import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import {
  PageHero,
  PageBreadcrumb,
  CtaStrip,
  ArrowRight,
} from "@/components/marketing/page-components";
import { SectionLabel } from "@/components/ui/editorial";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Research Methodology Workshops for Universities & Polytechnics",
  description:
    "GradEdge delivers methodology, writing and data analysis workshops for postgraduate cohorts. Book for your faculty.",
  path: "/institutions/workshops",
});

export default function InstitutionalWorkshopsPage() {
  const workshops = [
    {
      title: "Introduction to Research Design & Methodology",
      duration: "2 to 3 hours",
      audience: "Masters and early-stage doctoral candidates",
      summary: "Framing defensible research questions, aligning ontological paradigms with empirical methods, and avoiding common proposal rejections.",
    },
    {
      title: "Quantitative Data Analysis with SPSS or R",
      duration: "3 to 4 hours (Hands-on)",
      audience: "Researchers with collected empirical data",
      summary: "Testing parametric assumptions, running multivariate linear regressions, evaluating mediation/moderation, and generating APA tables.",
    },
    {
      title: "Qualitative Methods: Thematic Analysis and NVivo",
      duration: "3 hours",
      audience: "Scholars conducting interview or focus group studies",
      summary: "Differentiating descriptive vs. interpretive coding, establishing inter-coder reliability, and synthesizing qualitative quotes.",
    },
    {
      title: "Writing the Literature Review: Synthesis over Summary",
      duration: "2 hours",
      audience: "All postgraduate researchers",
      summary: "Building conceptual matrices, identifying empirical gaps, and crafting an argumentative narrative rather than a paper-by-paper summary.",
    },
    {
      title: "Ethics in Research: IRB Applications and Informed Consent",
      duration: "2 hours",
      audience: "Scholars working with human subjects or sensitive data",
      summary: "Drafting institutional ethics protocols, risk mitigations, anonymization standards, and responding to committee revisions.",
    },
    {
      title: "Preparing for the Viva Voce: Mock Defense Simulation",
      duration: "3 hours",
      audience: "Candidates within 6 months of thesis submission",
      summary: "Deconstructing committee questioning patterns, defending methodological limitations, and presenting slides with scholarly authority.",
    },
    {
      title: "Turning Your Thesis into a Peer-Reviewed Journal Article",
      duration: "2 hours",
      audience: "Doctoral graduates and early-career faculty",
      summary: "Condensing extended dissertations into concise journal manuscripts, navigating peer review, and responding to reviewer critiques.",
    },
    {
      title: "Grant and Scholarship Proposal Formulation",
      duration: "2 to 3 hours",
      audience: "Postgraduate candidates seeking external funding",
      summary: "Writing compelling significance narratives, framing methodology for funding panels, and building realistic budget justifications.",
    },
  ];

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Institutions", href: "/institutions" },
          { label: "Workshops" },
        ]}
      />

      <PageHero
        sectionNumber={1}
        sectionLabel="Faculty Curriculum"
        headline="Research methodology workshops for postgraduate cohorts."
        standfirst="Each workshop is practical, discipline-relevant and delivered by an expert who has conducted real research. Delivered online via secure video conferencing or in-person on campus."
        cta={{ label: "Request a workshop for your faculty", href: "/institutions/request-a-workshop" }}
        secondaryCta={{ label: "Partnership information", href: "/institutions/partnerships" }}
      />

      <div className="site-container py-12 md:py-16 space-y-12 max-w-4xl">
        <div className="space-y-6">
          <SectionLabel number={1} label="Standardized Modules" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workshops.map((w, i) => (
              <div key={i} className="p-6 bg-white border border-tone-rule rounded-[2px] flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="type-micro text-gold">{w.duration}</span>
                  <h3 className="font-serif text-lg text-tone-heading font-semibold">
                    {w.title}
                  </h3>
                  <p className="text-xs text-tone-body font-medium">Audience: {w.audience}</p>
                  <p className="text-xs text-tone-muted leading-relaxed">{w.summary}</p>
                </div>

                <div className="pt-2 border-t border-tone-rule">
                  <Link
                    href={`/institutions/request-a-workshop?topic=${encodeURIComponent(w.title)}`}
                    className="text-xs font-medium text-gold hover:text-navy flex items-center gap-1 transition-colors"
                  >
                    <span>Request this module</span>
                    <ArrowRight />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-paper border border-tone-rule rounded-[2px] space-y-2">
          <SectionLabel number={2} label="Custom Workshops" />
          <h3 className="font-serif text-base text-tone-heading font-semibold">
            Customised syllabus formulation
          </h3>
          <p className="type-body text-tone-muted leading-relaxed">
            All modules can be adapted to specific faculty requirements or discipline guidelines (e.g. Health Sciences, Law, Humanities, Business). We provide participant workbooks and hands-on exercises for every attendee.
          </p>
        </div>
      </div>

      <CtaStrip
        headline="Ready to book for your postgraduate cohort?"
        subtext="Contact our academic director to discuss dates, participant numbers, and institutional pricing."
        ctaLabel="Request a workshop proposal"
        ctaHref="/institutions/request-a-workshop"
      />
    </>
  );
}

