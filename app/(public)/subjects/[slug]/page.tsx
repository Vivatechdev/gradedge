import type { Metadata } from "next";
import Link from "next/link";
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

const METHODOLOGIES_MAP: Record<
  string,
  { methods: string[]; software: string[] }
> = {
  "social-sciences-education": {
    methods: [
      "Qualitative phenomenology",
      "Survey & instrument design",
      "Mixed-methods sequential design",
      "Ethnographic field study",
      "Action research in educational settings",
    ],
    software: ["SPSS", "NVivo", "ATLAS.ti", "R", "Dedoose"],
  },
  "business-management-finance": {
    methods: [
      "Cross-sectional survey modeling",
      "Comparative case study methodology",
      "Structural Equation Modeling (PLS-SEM)",
      "Econometric time-series & panel regressions",
      "Grounded theory in organizational dynamics",
    ],
    software: ["SmartPLS", "SPSS", "Stata", "R", "EViews"],
  },
  "humanities-literature-history": {
    methods: [
      "Archival & primary source analysis",
      "Hermeneutic textual analysis",
      "Critical discourse analysis",
      "Historiographical synthesis",
      "Philosophical dialectic critique",
    ],
    software: ["NVivo", "Zotero", "Mendeley", "Scrivener"],
  },
  "computer-science-it": {
    methods: [
      "Empirical software engineering evaluations",
      "Human-computer interaction user studies",
      "Algorithm benchmarking & complexity analysis",
      "Machine learning model evaluation metrics",
      "Systematic literature mapping (SLR)",
    ],
    software: ["Python", "R", "MATLAB", "LaTeX", "TensorFlow"],
  },
  "engineering-physical-sciences": {
    methods: [
      "Factorial experimental design",
      "Finite element analysis & numerical simulation",
      "Mathematical modeling of physical systems",
      "Empirical material characterization",
      "Benchmarking & sensitivity audits",
    ],
    software: ["MATLAB", "Python", "ANSYS", "R", "LaTeX"],
  },
  "environmental-sciences-agriculture": {
    methods: [
      "Ecological field sampling & longitudinal trials",
      "Geospatial GIS modeling & remote sensing",
      "Environmental impact assessment matrices",
      "Agricultural randomized complete block design",
      "Climate trend statistical downscaling",
    ],
    software: ["R", "ArcGIS", "QGIS", "SPSS", "Python"],
  },
  "law-criminology-policy": {
    methods: [
      "Doctrinal legal inquiry & statutory interpretation",
      "Comparative constitutional analysis",
      "Socio-legal empirical investigations",
      "Criminological policy evaluations",
      "Qualitative jurisprudence content analysis",
    ],
    software: ["NVivo", "Zotero", "MaxQDA", "Excel"],
  },
  "psychology-behavioural-sciences": {
    methods: [
      "Psychometric scale construction & factor analysis",
      "Experimental between/within-subjects designs",
      "Multivariate ANOVA / MANOVA diagnostics",
      "Systematic review with meta-analytic pooling",
      "Longitudinal behavioral modeling",
    ],
    software: ["SPSS", "R", "Mplus", "G*Power", "JASP"],
  },
};

interface SubjectData {
  slug: string;
  title: string;
  summary: string;
  description: string;
}

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("subjects")
      .select("slug")
      .is("parent_id", null)
      .neq("slug", "health-sciences");
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
  let description = "Specialized postgraduate research mentoring.";

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("subjects")
        .select("title, description")
        .eq("slug", slug)
        .is("parent_id", null)
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
    title: `${title} — Research Mentoring`,
    description,
    path: `/subjects/${slug}`,
  });
}

function getSubjectCategoryImage(slug: string): string {
  if (slug.includes("health") || slug.includes("med") || slug.includes("nurs") || slug.includes("pharm")) {
    return "/images/subjects/health.jpg";
  }
  if (slug.includes("tech") || slug.includes("computer") || slug.includes("it") || slug.includes("software")) {
    return "/images/subjects/technology.jpg";
  }
  if (slug.includes("business") || slug.includes("manage") || slug.includes("finance") || slug.includes("econ")) {
    return "/images/subjects/business.jpg";
  }
  if (slug.includes("edu") || slug.includes("teach") || slug.includes("pedagogy")) {
    return "/images/subjects/education.jpg";
  }
  if (slug.includes("humanities") || slug.includes("hist") || slug.includes("lit") || slug.includes("philos") || slug.includes("law") || slug.includes("theolog")) {
    return "/images/subjects/humanities.jpg";
  }
  return "/images/subjects/sciences.jpg";
}

export default async function SubjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let subject: SubjectData | null = null;
  let services: { slug: string; title: string; summary: string }[] = [];

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createClient();
      const [sRes, svcRes] = await Promise.all([
        supabase
          .from("subjects")
          .select("*")
          .eq("slug", slug)
          .is("parent_id", null)
          .single(),
        supabase
          .from("services")
          .select("slug, title, summary")
          .eq("is_active", true)
          .limit(4),
      ]);
      if (sRes.data) {
        subject = sRes.data as SubjectData;
      }
      services = (svcRes.data ?? []) as typeof services;
    } catch {
      subject = null;
    }
  }

  // Fallback
  if (!subject) {
    const fallbackTitle = slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    subject = {
      slug,
      title: fallbackTitle,
      summary: `Research mentoring and methodological advisory for ${fallbackTitle}.`,
      description: `GradEdge supports researchers in ${fallbackTitle} through research proposal formulation, quantitative and qualitative data analysis, developmental chapter reviews, and defense preparation.`,
    };
  }

  const methodology = METHODOLOGIES_MAP[slug] ?? {
    methods: [
      "Rigorous qualitative inquiry",
      "Quantitative hypothesis modeling",
      "Systematic literature reviews",
      "Theoretical framework structuring",
    ],
    software: ["SPSS", "R", "NVivo", "Zotero"],
  };

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Subject Areas", href: "/subjects" },
          { label: subject.title },
        ]}
      />

      <PageHero
        sectionNumber={1}
        sectionLabel="Academic Discipline"
        headline={subject.title}
        standfirst={subject.summary}
        cta={{ label: "Book a consultation", href: "/book" }}
        secondaryCta={{ label: "View all disciplines", href: "/subjects" }}
        image={{
          src: getSubjectCategoryImage(slug),
          alt: `Academic research materials and scholarly texts in ${subject.title}`,
          aspectRatio: "21:9",
          caption: `Methodological advisory and mentor matching for ${subject.title}.`,
        }}
      />

      <div className="site-container py-12 md:py-16 space-y-16 max-w-4xl">
        {/* Research in this field */}
        <section className="space-y-4">
          <SectionLabel number={1} label="Field Scope" />
          <h2 className="type-h2 text-tone-heading">Research in this field</h2>
          <div className="type-body text-tone-body space-y-4 leading-relaxed">
            <p>{subject.description}</p>
          </div>
        </section>

        {/* Methodologies & Software */}
        <section className="space-y-6 pt-8 border-t border-tone-rule">
          <SectionLabel number={2} label="Methodological Coverage" />
          <h2 className="type-h2 text-tone-heading">Common research approaches & software</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h3 className="font-serif text-lg text-tone-heading font-semibold">
                Supported Methodologies
              </h3>
              <ul className="space-y-2">
                {methodology.methods.map((m, i) => (
                  <li key={i} className="text-sm text-tone-muted flex items-start gap-2">
                    <span className="text-gold font-bold">&check;</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-serif text-lg text-tone-heading font-semibold">
                Supported Software & Tools
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {methodology.software.map((sw, i) => (
                  <span
                    key={i}
                    className="inline-block px-3 py-1 bg-cream border border-tone-rule text-xs font-mono font-medium text-tone-heading rounded-[2px]"
                  >
                    {sw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Related services */}
        {services.length > 0 && (
          <section className="space-y-4 pt-8 border-t border-tone-rule">
            <h3 className="type-h3 text-tone-heading">Recommended services for this field</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((svc) => (
                <Link
                  key={svc.slug}
                  href={`/services/${svc.slug}`}
                  className="p-5 bg-white border border-tone-rule rounded-[2px] space-y-1.5 group hover:border-navy transition-colors"
                >
                  <p className="font-serif text-base font-semibold text-tone-heading group-hover:text-navy">
                    {svc.title}
                  </p>
                  <p className="text-xs text-tone-muted line-clamp-2 leading-relaxed">
                    {svc.summary}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <MentorTeamBlock />

      <CtaStrip
        headline={`Working on a ${subject.title} dissertation?`}
        subtext="Schedule an introductory session. We will evaluate your methodological framework and pair you with an advisor in this discipline."
        ctaLabel="Book a free consultation"
        ctaHref="/book"
      />
    </>
  );
}

