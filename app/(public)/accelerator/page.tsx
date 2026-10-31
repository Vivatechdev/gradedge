import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import {
  PageHero,
  PageBreadcrumb,
  IntegrityCallout,
  MentorTeamBlock,
  CtaStrip,
} from "@/components/marketing/page-components";
import { SectionLabel, StepList } from "@/components/ui/editorial";
import { Button } from "@/components/ui/button";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Dissertation Accelerator Program — 9-Month Doctoral Mentoring",
  description:
    "A nine-month structured mentoring programme for doctoral candidates. Monthly milestones, a dedicated mentor and a clear path from proposal to submission. Application-based.",
  path: "/accelerator",
});

export default function AcceleratorOverviewPage() {
  const phase1Steps = [
    {
      title: "Confirm research question and methodology",
      description:
        "Rigorous scoping to ensure your inquiry is empirically feasible and theoretically justifiable.",
    },
    {
      title: "Synthesize literature review",
      description:
        "Build a conceptual matrix positioning your study against existing scholarly debates.",
    },
    {
      title: "Design and validate instruments",
      description:
        "Draft survey scales, interview protocols, or experimental frameworks with ethics board compliance.",
    },
    {
      title: "Begin data collection with protocol checks",
      description:
        "Establish audit trails and preliminary diagnostics before full empirical deployment.",
    },
  ];

  const phase2Steps = [
    {
      title: "Execute rigorous data analysis",
      description:
        "Iterative mentoring through quantitative models or qualitative coding structures.",
    },
    {
      title: "Draft findings and discussion chapters",
      description:
        "Present statistical tables and thematic narratives with clear scholarly interpretation.",
    },
    {
      title: "Conduct structural and stylistic revision",
      description:
        "Address committee revisions and tighten overall dissertation cohesion.",
    },
    {
      title: "Viva voce simulation and defense prep",
      description:
        "Structured mock defense with discipline-specific inquiry and slide coaching.",
    },
  ];

  return (
    <>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Dissertation Accelerator" }]} />

      <PageHero
        background="navy"
        sectionLabel="Doctoral Cohort Program"
        headline="Nine months. One mentor. One dissertation."
        standfirst="The Dissertation Accelerator is a structured programme for doctoral candidates who need more than one-off sessions. You get a dedicated mentor, monthly milestones and a clear path from proposal to submission."
        cta={{ label: "Apply for the next cohort", href: "/accelerator/apply" }}
        secondaryCta={{ label: "Read program FAQs", href: "/accelerator/faq" }}
        image={{
          src: "/images/accelerator/library.jpg",
          alt: "Doctoral research library stacks with study desks and natural sunlight",
          aspectRatio: "4:3",
          caption: "Structured nine-month completion environment for doctoral researchers.",
        }}
      />

      <div className="site-container py-12 md:py-16 space-y-16 max-w-4xl ui-interface">
        {/* Who it is for */}
        <section className="space-y-4">
          <SectionLabel label="Candidate Profiles" />
          <h2 className="type-h2 text-tone-heading">Who the Accelerator is built for</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 bg-white border border-tone-rule rounded-[2px] space-y-2 shadow-xs">
              <h3 className="font-serif text-base text-tone-heading font-semibold">
                Sustained doctoral candidates
              </h3>
              <p className="text-sm text-tone-muted leading-relaxed">
                Researchers writing full-time or part-time who require accountability and steady pacing.
              </p>
            </div>
            <div className="p-5 bg-white border border-tone-rule rounded-[2px] space-y-2 shadow-xs">
              <h3 className="font-serif text-base text-tone-heading font-semibold">
                Stalled dissertations
              </h3>
              <p className="text-sm text-tone-muted leading-relaxed">
                Scholars who have paused for months and need a systematic roadmap to restart and finish.
              </p>
            </div>
            <div className="p-5 bg-white border border-tone-rule rounded-[2px] space-y-2 shadow-xs">
              <h3 className="font-serif text-base text-tone-heading font-semibold">
                Stretched supervision
              </h3>
              <p className="text-sm text-tone-muted leading-relaxed">
                Candidates whose university supervisors lack time for frequent developmental feedback.
              </p>
            </div>
          </div>
        </section>

        {/* What the program covers: Two Phases */}
        <section className="space-y-8 pt-8 border-t border-tone-rule">
          <SectionLabel label="Nine-Month Progression" />
          <h2 className="type-h2 text-tone-heading">Two-phase structured progression</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="border-b border-tone-rule pb-2">
                <span className="type-micro text-gold">Phase 01</span>
                <h3 className="font-serif text-xl text-tone-heading font-medium">
                  Months 1 to 6: Foundations
                </h3>
              </div>
              <StepList steps={phase1Steps} />
            </div>

            <div className="space-y-4">
              <div className="border-b border-tone-rule pb-2">
                <span className="type-micro text-gold">Phase 02</span>
                <h3 className="font-serif text-xl text-tone-heading font-medium">
                  Months 7 to 9: Completion
                </h3>
              </div>
              <StepList steps={phase2Steps} />
            </div>
          </div>
        </section>

        {/* What members receive */}
        <section className="space-y-6 pt-8 border-t border-tone-rule">
          <SectionLabel label="Core Program Deliverables" />
          <h2 className="type-h2 text-tone-heading">What members receive</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "Monthly 1-on-1 consultations",
                desc: "Live video advisory sessions focused on immediate obstacles.",
              },
              {
                title: "Annotated draft feedback",
                desc: "Line-level critique on every chapter draft submitted during the cycle.",
              },
              {
                title: "Dedicated discipline specialist",
                desc: "A single mentor matched to your field who follows your project from start to defense.",
              },
              {
                title: "Student dashboard tracking",
                desc: "Private portal with milestone calendars, feedback archives, and audit records.",
              },
              {
                title: "Priority 48-hour response",
                desc: "Direct messaging access to your advisor for timely methodological queries.",
              },
              {
                title: "Viva preparation suite",
                desc: "Simulated oral defense panel and slide deck review included prior to submission.",
              },
            ].map((item, i) => (
              <div key={i} className="p-4 bg-paper border border-tone-rule rounded-[2px] space-y-1">
                <h4 className="font-serif text-base text-tone-heading font-semibold">
                  {item.title}
                </h4>
                <p className="text-xs text-tone-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Limited places callout */}
        <div className="bg-cream border border-tone-rule p-6 rounded-[2px] space-y-2">
          <p className="type-micro text-gold font-semibold">Cohort Admissions</p>
          <h3 className="font-serif text-lg text-tone-heading font-medium">
            Limited places per academic intake
          </h3>
          <p className="type-body text-tone-muted leading-relaxed">
            We cap cohort enrollment strictly to ensure every doctoral scholar receives rigorous, personalized feedback from their assigned mentor. If an intake reaches capacity, approved candidates are placed on priority waiting lists for the subsequent cohort.
          </p>
        </div>

        {/* Integrity Callout */}
        <IntegrityCallout serviceName="Dissertation Accelerator Program" />

        {/* Application flow */}
        <section className="space-y-6 pt-8 border-t border-tone-rule">
          <SectionLabel number={4} label="Admissions process" />
          <h2 className="type-h2 text-tone-heading">How application and admission works</h2>
          <div className="space-y-3">
            {[
              "Submit an online application detailing your dissertation topic, timeline, and current draft status.",
              "Our academic advisory board reviews your methodology and identifies an appropriate mentor within 5 working days.",
              "If accepted, you receive a formal invitation and schedule your cohort start date.",
              "Tuition invoice is issued; upon confirmation, your private dashboard and mentor onboarding begin.",
            ].map((step, idx) => (
              <div key={idx} className="flex items-start gap-4 p-3 bg-white border border-tone-rule rounded-[2px]">
                <span className="font-serif text-lg text-gold font-bold">
                  0{idx + 1}
                </span>
                <p className="text-sm text-tone-muted leading-relaxed">{step}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <Button variant="accent" size="lg" href="/accelerator/apply">
              Begin your application
            </Button>
            <Button variant="secondary" size="lg" href="/accelerator/faq">
              Review program FAQ
            </Button>
          </div>
        </section>
      </div>

      <MentorTeamBlock />

      <CtaStrip
        headline="Ready for steady doctoral progress?"
        subtext="Complete your application today. Our academic admissions committee reviews submissions weekly."
        ctaLabel="Apply for the Accelerator"
        ctaHref="/accelerator/apply"
        secondaryLabel="Read program FAQ"
        secondaryHref="/accelerator/faq"
      />
    </>
  );
}

