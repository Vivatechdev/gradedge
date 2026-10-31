import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import {
  PageHero,
  PageBreadcrumb,
  MentorTeamBlock,
  CtaStrip,
} from "@/components/marketing/page-components";
import { SectionLabel, StepList } from "@/components/ui/editorial";

export const metadata: Metadata = buildMetadata({
  title: "How GradEdge Works — Mentor Matching, Feedback Cycles and Progress Tracking",
  description:
    "A step-by-step explanation of how GradEdge mentoring works: from your first call to mentor matching, written feedback cycles and final submission.",
  path: "/about/how-it-works",
});

export default function HowItWorksPage() {
  const feedbackSteps = [
    {
      title: "You submit a draft or a specific question",
      description:
        "Upload your chapter draft, statistical syntax, or ethics application directly through your secure student dashboard.",
    },
    {
      title: "Your mentor reads it and writes a detailed response",
      description:
        "Within the agreed turnaround time, your matched advisor provides developmental commentary, methodological audits, and structural annotations.",
    },
    {
      title: "You act on the feedback and revise",
      description:
        "You rewrite your work based on clear scholarly guidance. The writing remains entirely yours.",
    },
    {
      title: "You resubmit the revised section if needed",
      description:
        "For multi-cycle projects, your mentor verifies that critical concerns and committee objections have been resolved.",
    },
    {
      title: "We move to the next milestone together",
      description:
        "Once a chapter or analytical model is defensible, we advance to your next dissertation deliverable.",
    },
  ];

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "How It Works" },
        ]}
      />

      <PageHero
        sectionNumber={1}
        sectionLabel="Methodology & Process"
        headline="Here is exactly what happens when you work with us."
        standfirst="No surprises. From your first call to your final submission, here is how our research coaching process operates."
      />

      <div className="site-container py-12 md:py-16 space-y-16 max-w-3xl">
        {/* Before booking */}
        <section className="space-y-4">
          <SectionLabel number={1} label="Before you book" />
          <h2 className="type-h2 text-tone-heading">Initial assessment</h2>
          <p className="type-body text-tone-body leading-relaxed">
            Browse our services and subject areas to find the support you need. If you are not sure, book a free twenty-minute call. We will ask you about your level, your topic, and where you are stuck. We do not need a full brief for that first call.
          </p>
        </section>

        {/* After booking: matching */}
        <section className="space-y-4 pt-8 border-t border-tone-rule">
          <SectionLabel number={2} label="After you book" />
          <h2 className="type-h2 text-tone-heading">Discipline-matched mentor assignment</h2>
          <p className="type-body text-tone-body leading-relaxed">
            A mentor is selected by our team based on your discipline, your methodology, and the software you are using. You see their name and a short background note inside your student dashboard. We do not publish mentor profiles publicly. If the match is not right for any reason, tell us and we will find a better fit.
          </p>
        </section>

        {/* During support */}
        <section className="space-y-6 pt-8 border-t border-tone-rule">
          <SectionLabel number={3} label="During your support" />
          <h2 className="type-h2 text-tone-heading">Structured written feedback cycles</h2>
          <StepList steps={feedbackSteps} />
        </section>

        {/* What we track */}
        <section className="space-y-6 pt-8 border-t border-tone-rule">
          <SectionLabel number={4} label="Accountability" />
          <h2 className="type-h2 text-tone-heading">What we track</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div className="p-4 bg-paper border border-tone-rule rounded-[2px] space-y-2">
              <h3 className="font-serif text-base text-tone-heading font-semibold">
                Milestones, not hours
              </h3>
              <p className="text-sm text-tone-muted leading-relaxed">
                We measure deliverables: completed methodology sections, validated scales, and revised chapters.
              </p>
            </div>
            <div className="p-4 bg-paper border border-tone-rule rounded-[2px] space-y-2">
              <h3 className="font-serif text-base text-tone-heading font-semibold">
                Written feedback
              </h3>
              <p className="text-sm text-tone-muted leading-relaxed">
                Verifiable line-item notes and structural feedback you can review whenever you write.
              </p>
            </div>
            <div className="p-4 bg-paper border border-tone-rule rounded-[2px] space-y-2">
              <h3 className="font-serif text-base text-tone-heading font-semibold">
                Submission deadlines
              </h3>
              <p className="text-sm text-tone-muted leading-relaxed">
                Pacing calendars synchronized with your department submission dates and committee milestones.
              </p>
            </div>
          </div>
        </section>

        {/* Confidentiality */}
        <section className="space-y-4 pt-8 border-t border-tone-rule">
          <SectionLabel number={5} label="Privacy & Security" />
          <h2 className="type-h2 text-tone-heading">Scholarly confidentiality</h2>
          <p className="type-body text-tone-body leading-relaxed">
            All submissions are treated as confidential. We do not share your work with third parties. Mentor assignments are private. Your personal data is stored securely and processed in accordance with our Privacy Policy.
          </p>
        </section>
      </div>

      <MentorTeamBlock />

      <CtaStrip
        headline="Ready to start? Book a call first."
        subtext="Tell us about your dissertation requirements and let us confirm whether we have the appropriate mentor available."
        ctaLabel="Book a free call"
        ctaHref="/book"
      />
    </>
  );
}

