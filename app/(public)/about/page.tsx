import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import {
  PageHero,
  PageBreadcrumb,
  IntegrityCallout,
  MentorTeamBlock,
  CtaStrip,
} from "@/components/marketing/page-components";
import { SectionLabel, PullQuote, StepList } from "@/components/ui/editorial";

export const metadata: Metadata = buildMetadata({
  title: "About GradEdge Academic Solutions",
  description:
    "GradEdge gives graduate researchers dedicated mentoring for every stage of the research cycle. Learn about our approach to written feedback, mentor matching and academic integrity.",
  path: "/about",
});

export default function AboutPage() {
  const steps = [
    {
      title: "Free call: we understand your project",
      description:
        "We discuss your academic level, institutional requirements, discipline, and where you feel blocked.",
    },
    {
      title: "Matched with a mentor in your field",
      description:
        "We assign an advisor holding an advanced degree in your specific discipline and methodology.",
    },
    {
      title: "Work through short feedback cycles",
      description:
        "You submit chapters or analysis plans in focused batches. You receive rigorous written feedback to guide your next draft.",
    },
    {
      title: "Submit work that is entirely yours",
      description:
        "Every sentence, citation, and argument is produced by you. You defend your thesis with genuine authority.",
    },
  ];

  return (
    <>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "About" }]} />

      <PageHero
        sectionLabel="Our Academic Purpose"
        headline="We exist because graduate supervision is not always enough."
        standfirst="GradEdge gives researchers the dedicated, discipline-specific mentoring that university supervisors cannot always provide. We work with undergraduate, Masters, and doctoral researchers worldwide."
        image={{
          src: "/images/about/header.jpg",
          alt: "Graduate research library reading hall with academic desks and natural window light",
          aspectRatio: "4:3",
          caption: "Natural light across research desks in an academic library reading room.",
        }}
      />

      <div className="site-container py-12 md:py-16 space-y-12">
        {/* Founder note field clearly marked as requested */}
        <div className="border-l-4 border-l-gold bg-cream p-6 rounded-[2px] shadow-xs">
          <p className="type-micro text-gold mb-2 font-semibold">From the founder</p>
          <p className="type-body text-tone-body italic leading-relaxed">
            [FOUNDER NOTE TO BE SUPPLIED — add a personal paragraph here about why GradEdge was founded.]
          </p>
        </div>

        {/* Approach */}
        <div className="space-y-6 max-w-3xl">
          <SectionLabel label="Methodological Philosophy" />
          <h2 className="type-h2 text-tone-heading">
            Short cycles. Written feedback. Real progress.
          </h2>

          <PullQuote
            quote="We work in focused bursts, not marathon sessions. One chapter at a time, one argument at a time."
            attribution="GradEdge Mentoring Standard"
          />

          <div className="type-body text-tone-body space-y-4 leading-relaxed">
            <p>
              Every engagement starts with understanding where you are and what your immediate obstacle is. We give written feedback you can act on, not long verbal discussions that are hard to revisit when you sit down to write.
            </p>
            <p>
              We track your progress through milestones, not billable hours. When you complete a draft or audit a dataset, we review it critically, outline required revisions, and move systematically to the next stage.
            </p>
            <p>
              By breaking an overwhelming dissertation into verifiable, short cycles, researchers regain momentum and build scholarly confidence.
            </p>
          </div>
        </div>

        {/* Typical engagement */}
        <div className="space-y-8 max-w-3xl pt-8 border-t border-tone-rule">
          <SectionLabel label="Supervision Lifecycle" />
          <h2 className="type-h2 text-tone-heading">A typical engagement</h2>
          <StepList steps={steps} />
        </div>

        {/* Integrity Callout */}
        <div className="pt-4 max-w-3xl">
          <IntegrityCallout />
        </div>
      </div>

      <MentorTeamBlock />

      <CtaStrip
        headline="Ready to discuss your research milestones?"
        subtext="Schedule an introductory call with an academic advisor. We will discuss your project and recommend an appropriate level of support."
        ctaLabel="Book a free 20-minute call"
        ctaHref="/book"
      />
    </>
  );
}

