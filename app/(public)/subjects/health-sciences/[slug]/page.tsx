import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";
import {
  PageHero,
  PageBreadcrumb,
  MentorTeamBlock,
  CtaStrip,
} from "@/components/marketing/page-components";
import { SectionLabel } from "@/components/ui/editorial";

export const revalidate = 3600;
export const dynamicParams = true;

const SUBFIELD_DETAILS_MAP: Record<string, string[]> = {
  "clinical-medicine-surgery": [
    "Reviewing clinical trial protocols and surgical case series designs against CONSORT/STROBE criteria.",
    "Formulating patient-reported outcome measures (PROMs) and survival analysis methodologies.",
    "Addressing institutional review board and hospital ethical committee revisions.",
  ],
  "public-health-epidemiology": [
    "Developing epidemiological cohort and cross-sectional survey sampling frameworks.",
    "Interpreting adjusted odds ratios, relative risks, and survival curves in SPSS, Stata, or R.",
    "Structuring systematic reviews and meta-analyses following strict PRISMA protocols.",
  ],
  "nursing-midwifery": [
    "Guiding evidence-based clinical audits and health service quality improvement initiatives.",
    "Advising on mixed-methods healthcare inquiry and clinical phenomenology.",
    "Synthesizing qualitative interview transcripts from healthcare providers and patients.",
  ],
  "biomedical-sciences-pharmacology": [
    "Advising on in vitro assay protocols, dose-response modeling, and animal model ethics.",
    "Interpreting laboratory assay statistical output and dose-dependent regression curves.",
    "Structuring laboratory findings chapters for peer-reviewed biomedical journal standards.",
  ],
  "health-informatics-systems": [
    "Evaluating electronic health records (EHR) and telemedicine implementation science frameworks.",
    "Methodological coaching on usability studies, user acceptance testing, and data privacy.",
    "Structuring healthcare analytics, diagnostic accuracy metrics, and clinical decision support evaluations.",
  ],
};

interface SubFieldData {
  slug: string;
  title: string;
  summary: string;
  description: string;
}

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = await createClient();
    const { data: hub } = await supabase
      .from("subjects")
      .select("id")
      .eq("slug", "health-sciences")
      .single();
    if (!hub) return [];
    const { data } = await supabase
      .from("subjects")
      .select("slug")
      .eq("parent_id", hub.id);
    return (data ?? []).map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  let description = "Specialized health sciences research mentoring.";

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("subjects")
        .select("title, description")
        .eq("slug", slug)
        .single();
      if (data) {
        title = data.title;
        description = data.description;
      }
    } catch {
      // Keep fallback
    }
  }

  return buildMetadata({
    title: `${title} — Health Sciences Mentoring`,
    description,
    path: `/subjects/health-sciences/${slug}`,
  });
}

export default async function HealthSubFieldPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let subfield: SubFieldData | null = null;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("subjects")
        .select("*")
        .eq("slug", slug)
        .single();
      if (data) {
        subfield = data as SubFieldData;
      }
    } catch {
      subfield = null;
    }
  }

  // Fallback
  if (!subfield) {
    const fallbackTitle = slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    subfield = {
      slug,
      title: fallbackTitle,
      summary: `Research mentoring and clinical methodology support for ${fallbackTitle}.`,
      description: `GradEdge provides specialized coaching for ${fallbackTitle} researchers. We assist with protocol design, epidemiological modeling, statistical syntax, and peer-reviewed manuscript preparation.`,
    };
  }

  const focusPoints = SUBFIELD_DETAILS_MAP[slug] ?? [
    "Assisting with clinical protocol design and ethical committee compliance.",
    "Biostatistical execution and assumption verification.",
    "Formative manuscript critique prior to journal or committee submission.",
  ];

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Subject Areas", href: "/subjects" },
          { label: "Health Sciences", href: "/subjects/health-sciences" },
          { label: subfield.title },
        ]}
      />

      <PageHero
        sectionNumber={1}
        sectionLabel="Health Sciences Specialty"
        headline={subfield.title}
        standfirst={subfield.summary}
        cta={{ label: "Book a consultation", href: "/book" }}
        secondaryCta={{ label: "View health hub", href: "/subjects/health-sciences" }}
      />

      <div className="site-container py-12 md:py-16 space-y-16 max-w-4xl">
        {/* Discipline description */}
        <section className="space-y-4">
          <SectionLabel number={1} label="Specialty Scope" />
          <h2 className="type-h2 text-tone-heading">Field overview</h2>
          <div className="type-body text-tone-body space-y-4 leading-relaxed">
            <p>{subfield.description}</p>
          </div>
        </section>

        {/* How we support researchers in this area */}
        <section className="space-y-6 pt-8 border-t border-tone-rule">
          <SectionLabel number={2} label="Clinical Mentoring Focus" />
          <h2 className="type-h2 text-tone-heading">How we support researchers in this area</h2>
          <div className="space-y-3">
            {focusPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-paper border border-tone-rule rounded-[2px]">
                <span className="text-gold font-serif font-bold text-lg leading-none">
                  0{i + 1}
                </span>
                <p className="text-sm text-tone-muted leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <MentorTeamBlock />

      <CtaStrip
        headline={`Progress your ${subfield.title} research.`}
        subtext="Schedule an introductory call with an advisor experienced in clinical health sciences and biostatistics."
        ctaLabel="Book a free consultation"
        ctaHref="/book"
      />
    </>
  );
}

