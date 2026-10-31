import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import {
  PageHero,
  PageBreadcrumb,
  MentorTeamBlock,
  CtaStrip,
  ArrowRight,
} from "@/components/marketing/page-components";
import { SectionLabel, StepList } from "@/components/ui/editorial";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "For Institutions — Postgraduate Research Workshops & Faculty Partnerships",
  description:
    "GradEdge partners with universities and polytechnics to deliver research mentoring workshops and coaching for postgraduate students.",
  path: "/institutions",
});

export default function InstitutionsOverviewPage() {
  const offerings = [
    {
      title: "Cohort Research Workshops",
      desc: "Half-day and multi-day intensives covering research design, statistical modeling, NVivo qualitative coding, and viva defense strategies.",
    },
    {
      title: "Embedded Faculty Mentoring",
      desc: "Supplement departmental faculty by providing dedicated external feedback cycles for overloaded postgraduate programs.",
    },
    {
      title: "Doctoral Completion Sprints",
      desc: "Structured milestone programs designed to accelerate graduation rates for ABD (All But Dissertation) doctoral scholars.",
    },
    {
      title: "Institutional Referral Agreements",
      desc: "Formal university agreements granting enrolled researchers direct subsidized access to GradEdge mentors.",
    },
  ];

  const workflowSteps = [
    {
      title: "Initial institutional consultation",
      description: "We discuss your faculty priorities, cohort size, research bottlenecks, and delivery preferences.",
    },
    {
      title: "Tailored curriculum formulation",
      description: "We customize workshop syllabi and mentoring rubrics to align with your university guidelines.",
    },
    {
      title: "Session delivery (Online or On-Campus)",
      description: "Expert mentors deliver rigorous, interactive training accompanied by practical research workbooks.",
    },
    {
      title: "Executive engagement reporting",
      description: "Deans and program directors receive comprehensive summary analytics on attendance, feedback, and skill development.",
    },
  ];

  return (
    <>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Institutions" }]} />

      <PageHero
        sectionNumber={1}
        sectionLabel="Institutional Advisory"
        headline="Supporting researchers across universities and polytechnics."
        standfirst="We partner with universities to give postgraduate students access to expert research mentoring. Our workshops and coaching programmes are tailored to your faculty and your research community."
        cta={{ label: "Request an institutional workshop", href: "/institutions/request-a-workshop" }}
        secondaryCta={{ label: "Explore workshop catalog", href: "/institutions/workshops" }}
        image={{
          src: "/images/institutions/header.jpg",
          alt: "University lecture theater and postgraduate seminar room",
          aspectRatio: "21:9",
          caption: "Institutional partnerships and research capability workshops for universities.",
        }}
      />

      <div className="site-container py-12 md:py-16 space-y-16 max-w-4xl">
        {/* What we offer */}
        <section className="space-y-6">
          <SectionLabel number={1} label="Institutional Programs" />
          <h2 className="type-h2 text-tone-heading">What we provide university faculties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {offerings.map((offering, i) => (
              <div key={i} className="p-6 bg-white border border-tone-rule rounded-[2px] space-y-2">
                <h3 className="font-serif text-lg text-tone-heading font-semibold">
                  {offering.title}
                </h3>
                <p className="text-xs text-tone-muted leading-relaxed">
                  {offering.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="space-y-6 pt-8 border-t border-tone-rule">
          <SectionLabel number={2} label="Implementation" />
          <h2 className="type-h2 text-tone-heading">How university partnerships operate</h2>
          <StepList steps={workflowSteps} />
        </section>

        {/* Navigation links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-tone-rule">
          <Link
            href="/institutions/workshops"
            className="p-6 bg-paper border border-tone-rule hover:border-navy rounded-[2px] space-y-2 group transition-colors"
          >
            <h4 className="font-serif text-base text-tone-heading font-semibold group-hover:text-navy">
              Workshop Catalog
            </h4>
            <p className="text-xs text-tone-muted leading-relaxed">
              Browse syllabus outlines for 8 standardized research methodology modules.
            </p>
            <div className="pt-2 text-xs font-medium text-gold group-hover:text-navy flex items-center gap-1">
              <span>View catalog</span>
              <ArrowRight />
            </div>
          </Link>

          <Link
            href="/institutions/request-a-workshop"
            className="p-6 bg-paper border border-tone-rule hover:border-navy rounded-[2px] space-y-2 group transition-colors"
          >
            <h4 className="font-serif text-base text-tone-heading font-semibold group-hover:text-navy">
              Request a Workshop
            </h4>
            <p className="text-xs text-tone-muted leading-relaxed">
              Submit your faculty requirements, desired dates, and estimated cohort numbers.
            </p>
            <div className="pt-2 text-xs font-medium text-gold group-hover:text-navy flex items-center gap-1">
              <span>Submit request</span>
              <ArrowRight />
            </div>
          </Link>

          <Link
            href="/institutions/partnerships"
            className="p-6 bg-paper border border-tone-rule hover:border-navy rounded-[2px] space-y-2 group transition-colors"
          >
            <h4 className="font-serif text-base text-tone-heading font-semibold group-hover:text-navy">
              Strategic Partnerships
            </h4>
            <p className="text-xs text-tone-muted leading-relaxed">
              Multi-year agreements, department subsidization, and embedded writing centers.
            </p>
            <div className="pt-2 text-xs font-medium text-gold group-hover:text-navy flex items-center gap-1">
              <span>Learn more</span>
              <ArrowRight />
            </div>
          </Link>
        </div>
      </div>

      <MentorTeamBlock />

      <CtaStrip
        headline="Enhance your postgraduate completion rates."
        subtext="Contact our institutional partnership team to design a customized mentoring seminar for your faculty."
        ctaLabel="Discuss an institutional partnership"
        ctaHref="/institutions/request-a-workshop"
      />
    </>
  );
}

