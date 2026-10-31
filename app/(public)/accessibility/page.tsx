import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import {
  PageHero,
  PageBreadcrumb,
} from "@/components/marketing/page-components";

export const metadata: Metadata = buildMetadata({
  title: "Accessibility Statement",
  description: "GradEdge commitment to digital accessibility and WCAG 2.1 compliance.",
  path: "/accessibility",
});

export default function AccessibilityPage() {
  return (
    <>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Accessibility" }]} />

      <PageHero
        sectionNumber={1}
        sectionLabel="Inclusive Design"
        headline="Accessibility Statement"
        standfirst="Our ongoing commitment to ensuring digital access for researchers of all abilities."
      />

      <div className="site-container py-12 md:py-16 max-w-3xl prose prose-sm text-tone-body leading-relaxed space-y-8">
        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">1. Conformance Standards</h2>
          <p>
            GradEdge Academic Solutions is committed to providing an accessible web environment in accordance with the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. We design our platforms with high color contrast ratios, clear typographic hierarchy, semantic HTML elements, and full keyboard navigation support.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">2. Accessible Features</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Semantic landmarks, headings, and breadcrumbs for screen reader navigation.</li>
            <li>Accessible forms with explicit label bindings and visible error cues.</li>
            <li>Full keyboard tab-order navigation across all navigation bars, modals, and accordions.</li>
            <li>Respect for reduced motion preferences via CSS media queries.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">3. Feedback and Assistance</h2>
          <p>
            We welcome feedback regarding the accessibility of the GradEdge platform. If you encounter barriers or require materials in an alternative format, please contact our accessibility coordinator via our contact form.
          </p>
        </section>
      </div>
    </>
  );
}

