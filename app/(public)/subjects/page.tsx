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
  title: "Subject Areas — Discipline-Specific Research Mentoring",
  description:
    "GradEdge offers research mentoring across all major disciplines. Find your subject area and see how we support researchers in your field.",
  path: "/subjects",
});

interface SubjectItem {
  slug: string;
  title: string;
  summary: string;
}

export default async function SubjectsIndexPage() {
  let subjects: SubjectItem[] = [];

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("subjects")
        .select("slug, title, summary")
        .is("parent_id", null)
        .order("sort_order");
      subjects = (data ?? []) as SubjectItem[];
    } catch {
      subjects = [];
    }
  }

  // Fallback subjects if unseeded
  if (subjects.length === 0) {
    subjects = [
      {
        slug: "health-sciences",
        title: "Health Sciences & Medicine",
        summary: "Clinical medicine, epidemiology, public health, nursing, and biomedical research.",
      },
      {
        slug: "social-sciences-education",
        title: "Social Sciences & Education",
        summary: "Sociology, anthropology, pedagogy, education policy, and curriculum studies.",
      },
      {
        slug: "business-management-finance",
        title: "Business, Management & Finance",
        summary: "Corporate strategy, econometrics, organizational behavior, and marketing research.",
      },
      {
        slug: "humanities-literature-history",
        title: "Humanities, Literature & History",
        summary: "Cultural studies, philosophical inquiries, historiography, and literary analysis.",
      },
      {
        slug: "computer-science-it",
        title: "Computer Science & Information Technology",
        summary: "Machine learning, data science, human-computer interaction, and software systems.",
      },
      {
        slug: "engineering-physical-sciences",
        title: "Engineering & Physical Sciences",
        summary: "Mechanical, electrical, civil engineering, physics, and applied mathematics.",
      },
      {
        slug: "environmental-sciences-agriculture",
        title: "Environmental Sciences & Agriculture",
        summary: "Ecology, climate adaptation, agronomy, and sustainability policy.",
      },
      {
        slug: "law-criminology-policy",
        title: "Law, Criminology & Policy Studies",
        summary: "Jurisprudence, comparative law, criminal justice, and public administration.",
      },
      {
        slug: "psychology-behavioural-sciences",
        title: "Psychology & Behavioural Sciences",
        summary: "Clinical psychology, cognitive science, psychometrics, and experimental psychology.",
      },
    ];
  }

  return (
    <>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Subject Areas" }]} />

      <PageHero
        sectionNumber={1}
        sectionLabel="Discipline Taxonomy"
        headline="Find support in your discipline."
        standfirst="We coach researchers across all major academic fields. Select your subject area to see supported methodologies, diagnostic software, and common research designs."
        image={{
          src: "/images/subjects/sciences.jpg",
          alt: "Academic research books, scientific journals, and scholarly notebooks across disciplines",
          aspectRatio: "21:9",
          caption: "Mentorship matched to your discipline, methodology, and analytical software.",
        }}
      />

      <div className="site-container py-12 md:py-16 space-y-12 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((s) => {
            const href =
              s.slug === "health-sciences"
                ? "/subjects/health-sciences"
                : `/subjects/${s.slug}`;

            return (
              <Link
                key={s.slug}
                href={href}
                className="p-6 bg-white border border-tone-rule hover:border-navy rounded-[2px] space-y-3 flex flex-col justify-between group transition-colors"
              >
                <div className="space-y-2">
                  <h3 className="font-serif text-lg font-semibold text-tone-heading group-hover:text-navy transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs text-tone-muted leading-relaxed">
                    {s.summary}
                  </p>
                </div>
                <div className="pt-2 text-xs font-medium text-gold group-hover:text-navy flex items-center gap-1 transition-colors">
                  <span>Explore discipline</span>
                  <ArrowRight />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="p-6 bg-paper border border-tone-rule rounded-[2px] space-y-2">
          <SectionLabel number={2} label="Interdisciplinary Inquiry" />
          <h3 className="font-serif text-base text-tone-heading font-semibold">
            Do not see your exact discipline?
          </h3>
          <p className="type-body text-tone-muted leading-relaxed">
            We work with researchers across emerging, interdisciplinary, and non-traditional fields. Contact our team with your working title and methodology, and we will confirm whether an appropriate specialist is available in our mentor network.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="type-small font-medium text-navy hover:text-tone-heading border-b border-navy/30 pb-0.5 inline-block"
            >
              Inquire about your topic
            </Link>
          </div>
        </div>
      </div>

      <MentorTeamBlock />

      <CtaStrip
        headline="Ready to match with a mentor in your field?"
        subtext="Schedule an introductory call. We will review your departmental guidelines and assign a discipline specialist."
        ctaLabel="Book a free consultation"
        ctaHref="/book"
      />
    </>
  );
}

