import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import {
  PageHero,
  PageBreadcrumb,
} from "@/components/marketing/page-components";
import { ResourceGate } from "@/components/marketing/ResourceGate";
import { SectionLabel } from "@/components/ui/editorial";

export const metadata: Metadata = buildMetadata({
  title: "Downloadable Research & Methodology Guides",
  description:
    "Comprehensive PDF guides on quantitative diagnostics, qualitative coding, and viva preparation.",
  path: "/resources/guides",
});

export default function GuidesPage() {
  const guides = [
    {
      title: "The Dissertation Methodology Handbook",
      desc: "A 45-page practical guide on selecting research paradigms, defending sampling rationale, and mitigating common committee objections.",
    },
    {
      title: "Quantitative Assumption Testing in SPSS & R",
      desc: "Step-by-step diagnostic workflows for normality, homoscedasticity, multicollinearity, and outlier treatment.",
    },
    {
      title: "Mastering Qualitative Coding with NVivo",
      desc: "Techniques for transitioning from descriptive first-cycle coding to conceptual second-cycle thematic frameworks.",
    },
  ];

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Guides" },
        ]}
      />

      <PageHero
        sectionNumber={1}
        sectionLabel="Methodology Manuals"
        headline="Downloadable research & writing guides."
        standfirst="Monographs and practical guides authored by our academic mentoring team. Enter your academic email to unlock full digital copies."
      />

      <div className="site-container py-12 md:py-16 space-y-12 max-w-3xl">
        <div className="space-y-6">
          <SectionLabel number={1} label="Methodology Guides" />
          <div className="space-y-6">
            {guides.map((g) => (
              <div key={g.title} className="p-6 bg-white border border-tone-rule rounded-[2px] space-y-4">
                <div>
                  <h3 className="font-serif text-lg text-tone-heading font-semibold">
                    {g.title}
                  </h3>
                  <p className="text-xs text-tone-muted mt-1 leading-relaxed">
                    {g.desc}
                  </p>
                </div>
                <ResourceGate resourceTitle={g.title} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

