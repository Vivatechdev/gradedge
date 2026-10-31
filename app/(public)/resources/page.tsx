import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import {
  PageHero,
  PageBreadcrumb,
  MentorTeamBlock,
  CtaStrip,
  ArrowRight,
} from "@/components/marketing/page-components";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Academic Research Resources — Templates, Guides & Glossary",
  description:
    "Free proposal, chapter outline and defense-slide templates, downloadable methodology guides, and an extensive research methods glossary.",
  path: "/resources",
});

export default function ResourcesHubPage() {
  const sections = [
    {
      title: "Proposal & Dissertation Templates",
      href: "/resources/templates",
      description:
        "Structured, institutional-ready templates for research proposals, chapter outlines, literature synthesis matrices, and oral defense slide decks.",
    },
    {
      title: "Research & Methodology Guides",
      href: "/resources/guides",
      description:
        "In-depth downloadable PDF manuals on quantitative assumption checking, qualitative coding frameworks, and committee feedback navigation.",
    },
    {
      title: "Research Methods Glossary",
      href: "/resources/glossary",
      description:
        "An A-to-Z reference defining core epistemological, statistical, and methodological terminology in plain academic prose.",
    },
  ];

  return (
    <>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Resources" }]} />

      <PageHero
        sectionNumber={1}
        sectionLabel="Scholarly Toolkit"
        headline="Free resources for researchers."
        standfirst="Practical templates, comprehensive methodology manuals, and an authoritative research glossary. Designed to help you structure and write your dissertation with precision."
        image={{
          src: "/images/resources/header.jpg",
          alt: "Academic research templates, notebooks, and reference materials neatly organized on a study desk",
          aspectRatio: "21:9",
          caption: "Templates, reference glossaries, and methodology guides created to support rigorous graduate research.",
        }}
      />

      <div className="site-container py-12 md:py-16 space-y-12 max-w-4xl">
        <ul className="divide-y divide-tone-rule border-y border-tone-rule">
          {sections.map((sec) => (
            <li key={sec.href}>
              <Link
                href={sec.href}
                className="py-8 px-3 -mx-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 group hover:bg-cream/40 transition-colors"
              >
                <div className="space-y-2 max-w-xl">
                  <h3 className="font-serif text-2xl text-tone-heading font-medium group-hover:text-navy transition-colors">
                    {sec.title}
                  </h3>
                  <p className="type-body text-tone-muted leading-relaxed">
                    {sec.description}
                  </p>
                </div>
                <div className="pt-2 text-xs font-medium text-gold group-hover:text-navy flex items-center gap-1 shrink-0">
                  <span>Access resources</span>
                  <ArrowRight />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <MentorTeamBlock />

      <CtaStrip
        headline="Need personalized feedback on your research draft?"
        subtext="Schedule an introductory consultation with a discipline-matched mentor to review your chapters."
        ctaLabel="Book a free consultation"
        ctaHref="/book"
      />
    </>
  );
}

