import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import {
  PageHero,
  PageBreadcrumb,
  DraftLegalBanner,
} from "@/components/marketing/page-components";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: "Terms and conditions governing the use of GradEdge Academic Solutions.",
  path: "/legal/terms",
});

export default function TermsPage() {
  return (
    <>
      <DraftLegalBanner />
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]} />

      <PageHero
        sectionNumber={1}
        sectionLabel="Legal Agreement"
        headline="Terms of Service"
        standfirst="Please read these terms carefully before engaging GradEdge services or creating a student account."
      />

      <div className="site-container py-12 md:py-16 max-w-3xl prose prose-sm text-tone-body leading-relaxed space-y-8">
        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">1. Nature of the Service</h2>
          <p>
            GradEdge Academic Solutions operates strictly as a research coaching, feedback, and developmental advisory business. We provide structured critique, statistical advisory, and academic mentoring. We do not write dissertations, theses, seminar papers, or coursework on behalf of any student. All submissions produced through or with our assistance must be solely authored by the enrolled scholar.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">2. Student Acknowledgement and Integrity</h2>
          <p>
            By booking a service, purchasing a package, or enrolling in a membership plan, you expressly warrant that you will adhere to the academic honesty regulations of your institution. Misrepresenting GradEdge commentary as institutional grading or attempting to commission ghostwritten text will result in immediate termination of service without refund. Review our full{" "}
            <Link href="/legal/academic-integrity" className="text-navy font-semibold underline">
              Academic Integrity Policy
            </Link>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">3. Payments, Fees, and Invoicing</h2>
          <p>
            Fees for sessions, milestone packages, and monthly memberships must be remitted in advance through our authorized payment processor (Paystack). All fees are quoted in Nigerian Naira (NGN) or US Dollars (USD). Downloadable electronic invoices are issued for all settled transactions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">4. Intellectual Property</h2>
          <p>
            Students retain exclusive copyright and intellectual property rights in their raw draft manuscripts, empirical datasets, and completed dissertations. GradEdge retains copyright in its proprietary training frameworks, syllabus guides, and standardized review rubrics. Written mentor feedback annotations become the non-exclusive property of the student upon delivery.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">5. Limitation of Liability</h2>
          <p>
            GradEdge mentors provide informed professional critique based on standard scholarly methodologies. We do not guarantee thesis acceptance, committee approval, degree conferral, or publication acceptance. Final grading decisions rest solely with your institutional examiners and peer reviewers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">6. Governing Law</h2>
          <p>
            [JURISDICTION TO BE CONFIRMED BY LEGAL REVIEW]. These Terms shall be construed and governed in accordance with applicable laws without regard to conflict of law principles.
          </p>
        </section>
      </div>
    </>
  );
}

