import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import {
  PageHero,
  PageBreadcrumb,
  MentorTeamBlock,
  CtaStrip,
} from "@/components/marketing/page-components";
import { SectionLabel, StepList } from "@/components/ui/editorial";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "University & Institutional Strategic Partnerships",
  description:
    "Long-term research mentoring partnerships, faculty referral agreements, and embedded writing centers for universities.",
  path: "/institutions/partnerships",
});

export default function InstitutionalPartnershipsPage() {
  const models = [
    {
      title: "Embedded Postgraduate Support Units",
      desc: "GradEdge functions as an extended external writing and statistical clinic for your university, providing regular chapter review quotas for all registered doctoral students.",
    },
    {
      title: "Subsidized Department Vouchers",
      desc: "Faculties purchase bulk mentoring vouchers, allocating feedback cycles directly to scholars encountering specific committee roadblocks.",
    },
    {
      title: "Doctoral Completion Acceleration Programs",
      desc: "Contractual cohorts designed specifically to assist prolonged PhD candidates in completing deferred dissertations within a 6 to 9-month window.",
    },
  ];

  const steps = [
    {
      title: "Dean or Director of Research discovery meeting",
      description: "We review institutional completion data, faculty supervisor capacity, and key departmental challenges.",
    },
    {
      title: "Formal Service Level Agreement (SLA) drafting",
      description: "Establishing clear boundaries of academic integrity, confidentiality, and data protection.",
    },
    {
      title: "Cohort onboarding and portal integration",
      description: "Enrolled students gain prioritized dashboard access with customized institutional milestone rubrics.",
    },
    {
      title: "Biannual progress reporting and quality audits",
      description: "Deans receive anonymized performance data regarding chapter completion and methodological mastery.",
    },
  ];

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Institutions", href: "/institutions" },
          { label: "Partnerships" },
        ]}
      />

      <PageHero
        sectionNumber={1}
        sectionLabel="Strategic Collaboration"
        headline="Long-term research partnerships for universities."
        standfirst="Build institutional capacity, improve postgraduate retention, and support overloaded faculty through formal mentoring agreements."
        cta={{ label: "Schedule a partnership discussion", href: "/contact" }}
        secondaryCta={{ label: "Explore workshops", href: "/institutions/workshops" }}
      />

      <div className="site-container py-12 md:py-16 space-y-16 max-w-4xl">
        <section className="space-y-6">
          <SectionLabel number={1} label="Partnership Models" />
          <h2 className="type-h2 text-tone-heading">Collaborative frameworks</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {models.map((m, i) => (
              <div key={i} className="p-6 bg-white border border-tone-rule rounded-[2px] space-y-2">
                <h3 className="font-serif text-lg text-tone-heading font-semibold">
                  {m.title}
                </h3>
                <p className="text-xs text-tone-muted leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6 pt-8 border-t border-tone-rule">
          <SectionLabel number={2} label="Implementation Roadmap" />
          <h2 className="type-h2 text-tone-heading">How partnerships are structured</h2>
          <StepList steps={steps} />
        </section>
      </div>

      <MentorTeamBlock />

      <CtaStrip
        headline="Discuss an institutional collaboration."
        subtext="Speak directly with our academic director to formulate an institutional support proposal for your university."
        ctaLabel="Contact our partnership team"
        ctaHref="/contact"
      />
    </>
  );
}

