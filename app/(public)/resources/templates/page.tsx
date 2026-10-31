import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import {
  PageHero,
  PageBreadcrumb,
} from "@/components/marketing/page-components";
import { ResourceGate } from "@/components/marketing/ResourceGate";
import { SectionLabel } from "@/components/ui/editorial";

export const metadata: Metadata = buildMetadata({
  title: "Proposal, Dissertation & Defense Templates",
  description:
    "Free proposal, outline and defense-slide templates, downloadable after entering an email address.",
  path: "/resources/templates",
});

export default function TemplatesPage() {
  const templates = [
    {
      title: "Doctoral Research Proposal Template",
      desc: "A fully structured Word and LaTeX template covering background, problem statement, theoretical framework, and methodological design.",
      available: false,
    },
    {
      title: "Literature Review Synthesis Matrix (Excel)",
      desc: "Organize theoretical debates, empirical gaps, and author contributions into an actionable cross-reference matrix.",
      available: false,
    },
    {
      title: "Dissertation Defense Slide Deck (PowerPoint / Keynote)",
      desc: "Clean, university-press aesthetic slide deck calibrated for a 20-minute viva presentation.",
      available: false,
    },
  ];

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Templates" },
        ]}
      />

      <PageHero
        sectionNumber={1}
        sectionLabel="Document Scaffolding"
        headline="Free proposal and dissertation templates."
        standfirst="Rigorous document frameworks modeled on university committee requirements. Enter your email to receive direct file downloads."
      />

      <div className="site-container py-12 md:py-16 space-y-12 max-w-3xl">
        <div className="space-y-6">
          <SectionLabel number={1} label="Available Frameworks" />
          <div className="space-y-6">
            {templates.map((tpl) => (
              <div key={tpl.title} className="p-6 bg-white border border-tone-rule rounded-[2px] space-y-4">
                <div>
                  <h3 className="font-serif text-lg text-tone-heading font-semibold">
                    {tpl.title}
                  </h3>
                  <p className="text-xs text-tone-muted mt-1 leading-relaxed">
                    {tpl.desc}
                  </p>
                </div>

                {tpl.available ? (
                  <ResourceGate resourceTitle={tpl.title} />
                ) : (
                  <div className="p-4 bg-paper border border-tone-rule rounded-[2px] flex items-center justify-between gap-4">
                    <span className="text-xs text-tone-muted">
                      Currently undergoing academic formatting review.
                    </span>
                    <ResourceGate resourceTitle={tpl.title} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

