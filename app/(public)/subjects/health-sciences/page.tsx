import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";
import {
  PageHero,
  PageBreadcrumb,
  MentorTeamBlock,
  CtaStrip,
  ArrowRight,
} from "@/components/marketing/page-components";
import { SectionLabel } from "@/components/ui/editorial";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Health Sciences and Medicine — Research Mentoring",
  description:
    "GradEdge supports health sciences researchers through IRB applications, systematic reviews, clinical trial design, biostatistics and manuscript preparation.",
  path: "/subjects/health-sciences",
});

interface SubFieldItem {
  slug: string;
  title: string;
  summary: string;
}

export default async function HealthSciencesHubPage() {
  let subfields: SubFieldItem[] = [
    {
      slug: "clinical-medicine-surgery",
      title: "Clinical Medicine & Surgery",
      summary: "Clinical trials, case series, surgical outcome studies, and diagnostic accuracy reviews.",
    },
    {
      slug: "public-health-epidemiology",
      title: "Public Health & Epidemiology",
      summary: "Disease surveillance, cohort studies, biostatistics, and global health interventions.",
    },
    {
      slug: "nursing-midwifery",
      title: "Nursing & Midwifery",
      summary: "Evidence-based practice, patient care protocols, and qualitative clinical studies.",
    },
    {
      slug: "biomedical-sciences-pharmacology",
      title: "Biomedical Sciences & Pharmacology",
      summary: "Molecular biology, pharmacokinetics, cell assays, and translational laboratory research.",
    },
    {
      slug: "health-informatics-systems",
      title: "Health Informatics & Health Systems",
      summary: "Electronic health records, telemedicine evaluations, and healthcare analytics.",
    },
  ];

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("subjects")
        .select("slug, title, summary")
        .not("parent_id", "is", null)
        .order("sort_order");
      if (data && data.length > 0) {
        subfields = data;
      }
    } catch {
      // Keep fallback
    }
  }

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Subject Areas", href: "/subjects" },
          { label: "Health Sciences & Medicine" },
        ]}
      />

      <PageHero
        sectionNumber={1}
        sectionLabel="Discipline Hub"
        headline="Health Sciences and Medicine"
        standfirst="Clinical research, public health, nursing, biomedical sciences and health informatics. We understand IRBs, systematic reviews, CONSORT guidelines, and clinical trial protocols."
        cta={{ label: "Book a health sciences consultation", href: "/book" }}
        secondaryCta={{ label: "View all disciplines", href: "/subjects" }}
        image={{
          src: "/images/subjects/health.jpg",
          alt: "Medical textbooks, clinical research notebooks, and healthcare studies",
          aspectRatio: "21:9",
          caption: "Specialized clinical, epidemiological, and nursing research advisory.",
        }}
      />

      <div className="site-container py-12 md:py-16 space-y-16 max-w-4xl">
        {/* Sub-disciplines */}
        <section className="space-y-6">
          <SectionLabel number={1} label="Specialized Sub-Fields" />
          <h2 className="type-h2 text-tone-heading">Sub-disciplines we support</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {subfields.map((sub) => (
              <Link
                key={sub.slug}
                href={`/subjects/health-sciences/${sub.slug}`}
                className="p-6 bg-white border border-tone-rule hover:border-navy rounded-[2px] space-y-2 group transition-colors"
              >
                <h3 className="font-serif text-lg font-semibold text-tone-heading group-hover:text-navy transition-colors">
                  {sub.title}
                </h3>
                <p className="text-xs text-tone-muted leading-relaxed">
                  {sub.summary}
                </p>
                <div className="pt-2 text-xs font-medium text-gold group-hover:text-navy flex items-center gap-1">
                  <span>View sub-discipline</span>
                  <ArrowRight />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Common challenges */}
        <section className="space-y-6 pt-8 border-t border-tone-rule">
          <SectionLabel number={2} label="Clinical Rigor" />
          <h2 className="type-h2 text-tone-heading">Common research challenges in health sciences</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "Institutional Review Board compliance",
                desc: "Navigating hospital ethics protocols, patient consent documentation, and clinical audit clearance.",
              },
              {
                title: "Study design selection",
                desc: "Differentiating between systematic review (PRISMA), cohort study (STROBE), and randomized trial protocols.",
              },
              {
                title: "Biostatistical execution",
                desc: "Running survival analyses (Kaplan-Meier), odds ratios, and logistic regressions in SPSS, R, or Stata.",
              },
              {
                title: "Peer-reviewed manuscript conversion",
                desc: "Condensing extended dissertation findings into concise, high-impact clinical journal submissions.",
              },
            ].map((c, i) => (
              <div key={i} className="p-4 bg-paper border border-tone-rule rounded-[2px] space-y-1">
                <h4 className="font-serif text-base text-tone-heading font-semibold">
                  {c.title}
                </h4>
                <p className="text-xs text-tone-muted leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <MentorTeamBlock />

      <CtaStrip
        headline="Conducting clinical or health systems research?"
        subtext="Schedule an introductory call. We will match you with a mentor holding advanced clinical and epidemiological research credentials."
        ctaLabel="Book a free consultation"
        ctaHref="/book"
      />
    </>
  );
}

