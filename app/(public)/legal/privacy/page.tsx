import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import {
  PageHero,
  PageBreadcrumb,
  DraftLegalBanner,
} from "@/components/marketing/page-components";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How GradEdge collects, stores, and protects researcher data and drafts.",
  path: "/legal/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <DraftLegalBanner />
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />

      <PageHero
        sectionNumber={1}
        sectionLabel="Data Protection"
        headline="Privacy Policy"
        standfirst="How we collect, process, and safeguard your personal information and unpublished research manuscripts."
      />

      <div className="site-container py-12 md:py-16 max-w-3xl prose prose-sm text-tone-body leading-relaxed space-y-8">
        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">1. Information We Collect</h2>
          <p>
            We collect personal identification information including your full name, academic email address, university affiliation, degree level, field of study, and project abstracts. For payment processing, transactions are handled directly by Paystack; we never store complete credit or debit card numbers on our servers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">2. Confidentiality of Research Manuscripts</h2>
          <p>
            We recognize that unpublished dissertation manuscripts, survey instruments, and empirical datasets represent sensitive scholarly intellectual property. All files submitted through our student dashboard are encrypted in transit and at rest. Mentors access manuscripts solely for the purpose of formulating written feedback. We never share, publish, or index your research with third-party databases.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">3. Sub-Processors and Data Storage</h2>
          <p>
            We engage vetted infrastructure partners strictly necessary to deliver our services: Supabase (encrypted database and storage), Paystack (PCI-compliant payment gateway), and Resend (transactional email notifications). We do not sell, rent, or trade student records to commercial third parties.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">4. Data Retention and Erasure</h2>
          <p>
            You retain the right to request deletion of your account and archived draft manuscripts at any time. Upon verified request, project files and personal metadata are purged within 30 calendar days, subject to legal bookkeeping obligations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">5. Data Inquiries</h2>
          <p>
            To exercise your data protection rights, request document erasure, or submit privacy inquiries, please contact our data compliance officer at: [DATA CONTACT TO BE CONFIRMED].
          </p>
        </section>
      </div>
    </>
  );
}

