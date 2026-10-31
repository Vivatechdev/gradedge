import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import {
  PageHero,
  PageBreadcrumb,
  DraftLegalBanner,
} from "@/components/marketing/page-components";

export const metadata: Metadata = buildMetadata({
  title: "Academic Integrity Policy (Legal)",
  description:
    "Formal legal statement of GradEdge academic integrity rules, boundaries, and student warranties.",
  path: "/legal/academic-integrity",
});

export default function LegalAcademicIntegrityPage() {
  return (
    <>
      <DraftLegalBanner />
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Academic Integrity Policy" }]} />

      <PageHero
        sectionNumber={1}
        sectionLabel="Institutional Ethics"
        headline="Academic Integrity Policy"
        standfirst="The non-negotiable legal principles governing all coaching, mentoring, and editorial engagements at GradEdge Academic Solutions."
      />

      <div className="site-container py-12 md:py-16 max-w-3xl prose prose-sm text-tone-body leading-relaxed space-y-8">
        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">1. Core Mission & Definitions</h2>
          <p>
            GradEdge Academic Solutions is an academic mentoring and developmental feedback service. Our function is to assist researchers in building scholarly capabilities, mastering empirical methodologies, and refining scholarly arguments. In this policy, &ldquo;Coaching&rdquo; and &ldquo;Mentoring&rdquo; denote critical, formative commentary, methodological auditing, and structural questioning. These terms expressly exclude ghostwriting, co-authorship, or text generation on behalf of the client.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">2. Prohibited Services and Ghostwriting Ban</h2>
          <p>
            GradEdge maintains an absolute, permanent ban on contract cheating and ghostwriting. Under no circumstances will GradEdge or any matched mentor:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Author, write, or compose any portion of a dissertation, thesis, literature review, or essay intended for institutional assessment.</li>
            <li>Directly rewrite student draft text to produce a substitute manuscript for submission.</li>
            <li>Fabricate, alter, falsify, or synthesize empirical datasets or survey responses.</li>
            <li>Complete university examinations, coursework assignments, or oral defenses on behalf of a student.</li>
            <li>Guarantee specific grades, examiner outcomes, or Turnitin similarity percentages.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">3. Permissible Mentoring Scope</h2>
          <p>
            Services authorized by GradEdge include:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Critical reading of student-authored drafts with developmental margin annotations.</li>
            <li>Advisory on theoretical framing, research question scoping, and literature synthesis matrices.</li>
            <li>Methodological auditing of sampling plans, research designs, and ethical review applications.</li>
            <li>Statistical syntax coaching (SPSS, R, Stata, NVivo, SmartPLS) and diagnostic output interpretation.</li>
            <li>Copyediting and proofreading for academic register, flow, and citation style compliance (APA, Harvard, Chicago, IEEE).</li>
            <li>Simulated viva voce examinations and presentation coaching.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">4. Student Warranties and Legal Indemnity</h2>
          <p>
            By commissioning any service from GradEdge, you formally warrant that:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>You are the sole author of all text submitted to your university or examining committee.</li>
            <li>You will cite external guidance where required by your university&apos;s specific research disclosure policy.</li>
            <li>You indemnify and hold harmless GradEdge Academic Solutions, its officers, and mentors from any academic sanction, disciplinary proceeding, or degree revocation arising from your own misrepresentation or breach of university regulations.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">5. Immediate Termination for Breach</h2>
          <p>
            Any client request to produce text for submission, forge datasets, or circumvent university anti-plagiarism mechanisms constitutes an irremediable breach of contract. GradEdge reserves the right to immediately terminate the client relationship with immediate forfeiture of all fees paid.
          </p>
        </section>
      </div>
    </>
  );
}

