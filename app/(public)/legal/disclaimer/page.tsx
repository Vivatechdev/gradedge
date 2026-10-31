import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import {
  PageHero,
  PageBreadcrumb,
  DraftLegalBanner,
} from "@/components/marketing/page-components";

export const metadata: Metadata = buildMetadata({
  title: "Academic and Professional Disclaimer",
  description: "Important disclaimers regarding research mentoring and examiner outcomes.",
  path: "/legal/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <>
      <DraftLegalBanner />
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Disclaimer" }]} />

      <PageHero
        sectionNumber={1}
        sectionLabel="Academic Disclaimers"
        headline="Academic & Professional Disclaimer"
        standfirst="Important boundaries regarding mentoring feedback, committee authority, and scholarly outcomes."
      />

      <div className="site-container py-12 md:py-16 max-w-3xl prose prose-sm text-tone-body leading-relaxed space-y-8">
        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">1. Independent Advisory Status</h2>
          <p>
            GradEdge Academic Solutions is an independent academic coaching service and is not affiliated with, endorsed by, or accredited by any university, higher education commission, or degree-awarding body. Mentoring advice reflects the informed professional opinions of our academic advisors based on standard research conventions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">2. No Guarantee of Academic Outcomes</h2>
          <p>
            Academic research is subject to institutional subjectivity, supervisor preferences, and committee deliberations. GradEdge makes no warranties or guarantees regarding grade outcomes, thesis approval, dissertation defense results, scholarship awards, or journal acceptance. Final academic evaluation belongs solely to your university examiners.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">3. Responsibility for Implementation</h2>
          <p>
            Mentors provide suggestions, annotations, and structural recommendations. The student retains sole responsibility for verifying whether any suggestion conforms to their institution&apos;s specific departmental dissertation handbook and ethical guidelines.
          </p>
        </section>
      </div>
    </>
  );
}

