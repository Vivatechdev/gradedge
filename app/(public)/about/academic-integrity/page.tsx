import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import {
  PageHero,
  PageBreadcrumb,
  CtaStrip,
} from "@/components/marketing/page-components";
import { SectionLabel, PullQuote } from "@/components/ui/editorial";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = buildMetadata({
  title: "Academic Integrity at GradEdge — What We Do and Do Not Do",
  description:
    "GradEdge is a coaching and mentoring service. We give expert feedback on your research and writing. We do not write your work, guarantee grades or produce submissions on your behalf.",
  path: "/about/academic-integrity",
});

export default function AcademicIntegrityPage() {
  return (
    <>
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Academic Integrity" },
        ]}
      />

      <PageHero
        sectionNumber={1}
        sectionLabel="Core Principle"
        headline="We coach you. You write it."
        standfirst="Academic integrity is the whole point of what we do, not a rule we work around. Real scholarship requires that the author understands, produces, and defends their own work."
      />

      <div className="site-container py-12 md:py-16 space-y-16 max-w-3xl">
        {/* What GradEdge does */}
        <section className="space-y-6">
          <SectionLabel number={1} label="What we do" />
          <h2 className="type-h2 text-tone-heading">Our mentoring scope</h2>
          <div className="space-y-4">
            <div className="p-4 bg-white border border-tone-rule rounded-[2px] space-y-1">
              <h3 className="font-serif text-base text-tone-heading font-semibold">
                We read your drafts
              </h3>
              <p className="type-body text-tone-muted leading-relaxed">
                We examine your chapters in detail, identifying where the argument lacks coherence, where empirical evidence is insufficient, and where theoretical positioning is weak.
              </p>
            </div>

            <div className="p-4 bg-white border border-tone-rule rounded-[2px] space-y-1">
              <h3 className="font-serif text-base text-tone-heading font-semibold">
                We ask critical questions
              </h3>
              <p className="type-body text-tone-muted leading-relaxed">
                Targeted questions that challenge your methodology and force precision. These simulate the rigorous questioning you will face during committee reviews and oral defense.
              </p>
            </div>

            <div className="p-4 bg-white border border-tone-rule rounded-[2px] space-y-1">
              <h3 className="font-serif text-base text-tone-heading font-semibold">
                We explain academic standards
              </h3>
              <p className="type-body text-tone-muted leading-relaxed">
                We clarify what high-impact scholarly writing, valid psychometric scale development, and sound thematic synthesis look like in your specific discipline.
              </p>
            </div>

            <div className="p-4 bg-white border border-tone-rule rounded-[2px] space-y-1">
              <h3 className="font-serif text-base text-tone-heading font-semibold">
                We provide actionable written feedback
              </h3>
              <p className="type-body text-tone-muted leading-relaxed">
                Comprehensive, line-level notes and structural recommendations designed for you to study, apply, and preserve throughout your revisions.
              </p>
            </div>
          </div>
        </section>

        {/* What GradEdge does NOT do */}
        <section className="space-y-6 pt-8 border-t border-tone-rule">
          <SectionLabel number={2} label="Non-negotiable boundaries" />
          <h2 className="type-h2 text-tone-heading">What GradEdge does not do</h2>
          <div className="space-y-4">
            <div className="p-4 bg-cream border border-tone-rule rounded-[2px] space-y-1">
              <h3 className="font-serif text-base text-error font-semibold">
                We do not write your work
              </h3>
              <p className="type-body text-tone-body leading-relaxed">
                Not a sentence, not a paragraph, not a section. Submitting work composed by a third party constitutes academic dishonesty. We will never produce text intended for student submission.
              </p>
            </div>

            <div className="p-4 bg-cream border border-tone-rule rounded-[2px] space-y-1">
              <h3 className="font-serif text-base text-error font-semibold">
                We do not produce replacement drafts
              </h3>
              <p className="type-body text-tone-body leading-relaxed">
                We annotate drafts with marginal feedback and structural critiques. Rewriting and implementing revisions remains the student&apos;s exclusive responsibility.
              </p>
            </div>

            <div className="p-4 bg-cream border border-tone-rule rounded-[2px] space-y-1">
              <h3 className="font-serif text-base text-error font-semibold">
                We do not guarantee grades or similarity scores
              </h3>
              <p className="type-body text-tone-body leading-relaxed">
                Academic evaluation belongs entirely to university examiners, dissertation committees, and peer reviewers. We do not manipulate similarity reports or guarantee degree outcomes.
              </p>
            </div>

            <div className="p-4 bg-cream border border-tone-rule rounded-[2px] space-y-1">
              <h3 className="font-serif text-base text-error font-semibold">
                We do not impersonate students
              </h3>
              <p className="type-body text-tone-body leading-relaxed">
                We never communicate on your behalf with supervisors, university administration, journal editors, or ethics boards.
              </p>
            </div>
          </div>
        </section>

        {/* Quote */}
        <PullQuote
          quote="The skills you build working with a GradEdge mentor are the skills you carry into your viva, your next paper, and your research career."
          attribution="GradEdge Academic Integrity Framework"
        />

        {/* Student Agreement */}
        <section className="space-y-4 pt-8 border-t border-tone-rule">
          <SectionLabel number={3} label="Student agreement" />
          <h2 className="type-h2 text-tone-heading">Shared scholarly contract</h2>
          <p className="type-body text-tone-body leading-relaxed">
            When you book mentoring sessions or enroll in a program, you agree to these principles:
          </p>
          <ul className="list-disc pl-5 space-y-2 type-body text-tone-muted">
            <li>All work submitted to your university or journal is authored solely by you.</li>
            <li>Feedback from GradEdge mentors represents developmental guidance, not co-authorship.</li>
            <li>You will accurately represent the coaching and advisory support received.</li>
          </ul>

          <div className="pt-6 flex flex-wrap gap-4">
            <Button variant="primary" href="/legal/academic-integrity">
              Read the legal Academic Integrity Policy
            </Button>
            <Button variant="secondary" href="/book">
              Book a consultation call
            </Button>
          </div>
        </section>
      </div>

      <CtaStrip
        headline="Committed to authentic academic achievement?"
        subtext="Speak with our team to plan a rigorous, ethical mentoring roadmap for your research."
        ctaLabel="Book a free consultation"
        ctaHref="/book"
      />
    </>
  );
}

