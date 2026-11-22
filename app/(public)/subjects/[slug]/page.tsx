import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import {
  PageHero,
  PageBreadcrumb,
  MentorTeamBlock,
  CtaStrip,
} from "@/components/marketing/page-components";
import { SectionLabel } from "@/components/ui/editorial";

export const dynamic = "force-dynamic";

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

const SUBJECTS_DATA_MAP: Record<string, SubjectData> = {
  "social-sciences-education": {
    slug: "social-sciences-education",
    title: "Social Sciences & Education",
    summary: "Sociology, anthropology, pedagogy, education policy, and curriculum studies.",
    description: "GradEdge supports researchers in Social Sciences & Education through research proposal formulation, quantitative and qualitative data analysis, developmental chapter reviews, and defense preparation.",
  },
  "business-management-finance": {
    slug: "business-management-finance",
    title: "Business, Management & Finance",
    summary: "Corporate strategy, econometrics, organizational behavior, and marketing research.",
    description: "GradEdge supports researchers in Business, Management & Finance through empirical modeling, survey validation, econometrics, and publication guidance.",
  },
  "humanities-literature-history": {
    slug: "humanities-literature-history",
    title: "Humanities, Literature & History",
    summary: "Cultural studies, philosophical inquiries, historiography, and literary analysis.",
    description: "GradEdge supports researchers in Humanities, Literature & History with archival inquiry, qualitative discourse analysis, and developmental prose editing.",
  },
  "computer-science-it": {
    slug: "computer-science-it",
    title: "Computer Science & Information Technology",
    summary: "Machine learning, data science, human-computer interaction, and software systems.",
    description: "GradEdge supports researchers in Computer Science & IT with algorithmic benchmarking, experiment design, syntax auditing, and IEEE/ACM journal structuring.",
  },
  "engineering-physical-sciences": {
    slug: "engineering-physical-sciences",
    title: "Engineering & Physical Sciences",
    summary: "Mechanical, electrical, civil engineering, physics, and applied mathematics.",
    description: "GradEdge supports researchers in Engineering & Physical Sciences with mathematical modeling, experimental design, and technical writing.",
  },
  "environmental-sciences-agriculture": {
    slug: "environmental-sciences-agriculture",
    title: "Environmental Sciences & Agriculture",
    summary: "Ecology, climate adaptation, agronomy, and sustainability policy.",
    description: "GradEdge supports researchers in Environmental Sciences & Agriculture through field trial designs, geospatial analyses, and policy synthesis.",
  },
  "law-criminology-policy": {
    slug: "law-criminology-policy",
    title: "Law, Criminology & Policy Studies",
    summary: "Jurisprudence, comparative law, criminal justice, and public administration.",
    description: "GradEdge supports researchers in Law, Criminology & Policy with doctrinal legal inquiry, statutory analysis, and socio-legal frameworks.",
  },
  "psychology-behavioural-sciences": {
    slug: "psychology-behavioural-sciences",
    title: "Psychology & Behavioural Sciences",
    summary: "Clinical psychology, cognitive science, psychometrics, and experimental psychology.",
    description: "GradEdge supports researchers in Psychology & Behavioural Sciences through psychometric scale validation, experimental design, and APA 7 results reporting.",
  },
};

const FALLBACK_SERVICES = [
  { slug: "dissertation-thesis-mentoring", title: "Dissertation & Thesis Mentoring", summary: "One-on-one developmental chapter feedback." },
  { slug: "quantitative-data-analysis", title: "Quantitative Data Analysis", summary: "Statistical syntax audits and results interpretation in SPSS, R, and Stata." },
  { slug: "qualitative-data-analysis", title: "Qualitative Data Analysis", summary: "Thematic coding, codebook development, and NVivo/ATLAS.ti mentoring." },
  { slug: "academic-editing-proofreading", title: "Academic Editing & Proofreading", summary: "Substantive line-level editing and academic register refinement." },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const known = SUBJECTS_DATA_MAP[slug];
  const title = known ? known.title : slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const description = known ? known.summary : "Specialized postgraduate research mentoring.";

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

  let subject: SubjectData = SUBJECTS_DATA_MAP[slug] ?? {
    slug,
    title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    summary: `Research mentoring and methodological advisory for ${slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}.`,
    description: `GradEdge supports researchers through research proposal formulation, quantitative and qualitative data analysis, developmental chapter reviews, and defense preparation.`,
  };

  let services = FALLBACK_SERVICES;

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

