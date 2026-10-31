import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import {
  PageHero,
  PageBreadcrumb,
  DraftLegalBanner,
} from "@/components/marketing/page-components";

export const metadata: Metadata = buildMetadata({
  title: "Acceptable Use Policy",
  description: "Standards of behavior and platform integrity expected of all GradEdge users.",
  path: "/legal/acceptable-use",
});

export default function AcceptableUsePage() {
  return (
    <>
      <DraftLegalBanner />
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Acceptable Use Policy" }]} />

      <PageHero
        sectionNumber={1}
        sectionLabel="Platform Security"
        headline="Acceptable Use Policy"
        standfirst="Guidelines for professional engagement and respectful scholarly collaboration on the GradEdge platform."
      />

      <div className="site-container py-12 md:py-16 max-w-3xl prose prose-sm text-tone-body leading-relaxed space-y-8">
        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">1. Professional Demeanor</h2>
          <p>
            GradEdge fosters a disciplined, collegial environment for academic inquiry. Users agree to communicate respectfully with advisors and administrative staff. Abusive language, harassment, discrimination, or threats will result in immediate permanent expulsion from the platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">2. Prohibition on Plagiarism Solicitation</h2>
          <p>
            Users are strictly forbidden from attempting to coerce, bribe, or induce any GradEdge mentor or contractor into producing original text, falsifying empirical data, or violating university academic honesty codes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">3. Platform and Network Integrity</h2>
          <p>
            You agree not to scrape, reverse-engineer, crawl, or exploit our web infrastructure, student dashboards, or proprietary training materials. Any attempt to bypass access controls or security permissions is strictly prohibited.
          </p>
        </section>
      </div>
    </>
  );
}

