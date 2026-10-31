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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, BookOpen, Terminal, Award, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "About GradEdge Academic Solutions — Scholarly Mentoring & Faculty Standards",
  description:
    "GradEdge provides graduate researchers with dedicated, discipline-specific doctoral mentoring. Learn about our Socratic approach, mentor credentials, and unwavering commitment to academic integrity.",
  path: "/about",
});

export default function AboutPage() {
  const steps = [
    {
      title: "Diagnostic Intake & Research Scoping",
      description:
        "We review your current chapter draft, research questions, supervisory committee notes, and empirical data challenges during a confidential 20-minute consultation.",
    },
    {
      title: "Discipline-Matched Doctoral Faculty Assignment",
      description:
        "We pair you with an advisor holding an earned doctorate in your exact field and methodology (e.g. biostatistics, structural equation modeling, qualitative phenomenology).",
    },
    {
      title: "Iterative Written Feedback & Socratic Annotation",
      description:
        "You submit chapters in focused batches. Your mentor delivers exhaustive line-level annotations, identifying logical gaps, methodological vulnerabilities, and citation weaknesses.",
    },
    {
      title: "Independent Defense & Full Scholarly Ownership",
      description:
        "Every sentence, dataset transformation, and theoretical synthesis is authored by you. You enter your committee defense with complete intellectual command of your thesis.",
    },
  ];

  const facultyStandards = [
    {
      title: "Earned Terminal Degrees",
      description:
        "Every GradEdge advisor holds an earned PhD or doctoral equivalent from an internationally accredited research institution with extensive supervisory track records.",
      icon: Award,
    },
    {
      title: "Computational & Methodological Rigor",
      description:
        "Our data specialists maintain verified command of statistical software environments (R, Python, SPSS Hayes PROCESS, Stata, SmartPLS 4, NVivo, ATLAS.ti).",
      icon: Terminal,
    },
    {
      title: "Line-Level Socratic Guidance",
      description:
        "We reject vague verbal advice. Our mentors provide forensic written margin notes that pinpoint structural flaws and explain the underlying academic conventions.",
      icon: BookOpen,
    },
    {
      title: "Uncompromising Integrity Oath",
      description:
        "Our faculty operates under a strict code: zero ghostwriting, zero data fabrication, and zero proxy writing. We coach candidates into independent scholars.",
      icon: ShieldCheck,
    },
  ];

  return (
    <>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "About" }]} />

      <PageHero
        sectionLabel="Our Academic Purpose"
        headline="We exist because graduate supervision is not always enough."
        standfirst="GradEdge gives researchers the dedicated, discipline-specific doctoral mentoring that university supervisors cannot always provide. We work with undergraduate, Masters, and doctoral candidates worldwide."
        image={{
          src: "/images/about/header.jpg",
          alt: "Graduate research library reading hall with academic desks and natural window light",
          aspectRatio: "4:3",
          caption: "Confidential doctoral mentoring tailored to international research standards.",
        }}
      />

      <div className="site-container py-12 md:py-16 space-y-16">
        {/* ── 1. FOUNDER STATEMENT & ETHICAL CONVICTION ────────────────────── */}
        <div className="border border-tone-rule bg-cream p-8 sm:p-10 rounded-[2px] shadow-xs relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="flex items-center gap-2">
              <span className="type-micro text-gold">The Founding Conviction</span>
              <span className="text-tone-rule">&bull;</span>
              <span className="text-xs text-tone-muted font-serif italic">From the Academic Directorate</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl text-tone-heading font-medium leading-snug">
              &ldquo;The modern university expects doctoral excellence, but supervisory bandwidth has never been thinner.&rdquo;
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-tone-body leading-relaxed font-sans pt-2">
              <p>
                GradEdge was established from a clear conviction: graduate researchers face unprecedented expectations, yet supervisory bandwidth in global higher education is stretched thinner than ever. Between institutional committee demands, heavy teaching loads, and research grant pressures, faculty supervisors rarely have the hours required for line-level manuscript development.
              </p>
              <p>
                Unethical ghostwriting mills exploit this gap, offering fraudulent shortcuts that rob scholars of their intellectual autonomy and put academic credentials at perpetual risk. GradEdge was founded to be the principled alternative — rigorous, Socratic mentorship that challenges your scholarship, audits your computational models, and ensures every word and argument remains indisputably yours.
              </p>
            </div>

            <div className="pt-4 border-t border-tone-rule/80 flex items-center justify-between text-xs text-tone-muted">
              <span className="font-serif text-tone-heading font-medium">Academic Directorate & Faculty Council</span>
              <span className="font-mono text-[11px]">GradEdge Academic Solutions</span>
            </div>
          </div>
        </div>

        {/* ── 2. PHILOSOPHY: SHORT CYCLES & WRITTEN FEEDBACK ───────────────── */}
        <div className="space-y-6 max-w-3xl">
          <SectionLabel label="Methodological Philosophy" />
          <h2 className="type-h2 text-tone-heading">
            Short cycles. Written feedback. Real progress.
          </h2>

          <PullQuote
            quote="We work in focused bursts, not marathon sessions. One chapter at a time, one empirical model at a time."
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

        {/* ── 3. FACULTY STANDARDS & CREDENTIALS MATRIX ────────────────────── */}
        <div className="space-y-8 pt-8 border-t border-tone-rule">
          <div className="space-y-2 max-w-2xl">
            <SectionLabel label="Academic Governance" />
            <h2 className="type-h2 text-tone-heading">
              Our Doctoral Faculty Standard
            </h2>
            <p className="type-body text-tone-muted">
              We maintain rigorous criteria for advisor selection. We do not employ generalist copywriters or student tutors; our faculty consists of seasoned doctoral supervisors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {facultyStandards.map((item, i) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={i}
                  className="p-6 bg-white border border-tone-rule rounded-[2px] space-y-3 hover:border-gold/60 transition-colors shadow-xs"
                >
                  <div className="w-10 h-10 rounded-[2px] bg-cream border border-tone-rule flex items-center justify-center text-navy">
                    <IconComponent className="w-5 h-5 text-navy" />
                  </div>
                  <h3 className="font-serif text-lg font-medium text-tone-heading">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-tone-body leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 4. SUPERVISION LIFECYCLE ─────────────────────────────────────── */}
        <div className="space-y-8 max-w-3xl pt-8 border-t border-tone-rule">
          <SectionLabel label="Supervision Lifecycle" />
          <h2 className="type-h2 text-tone-heading">A typical engagement</h2>
          <StepList steps={steps} />
        </div>

        {/* ── 5. INTEGRITY CALLOUT ─────────────────────────────────────────── */}
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
