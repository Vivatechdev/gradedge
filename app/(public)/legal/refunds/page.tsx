import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import {
  PageHero,
  PageBreadcrumb,
  DraftLegalBanner,
} from "@/components/marketing/page-components";

export const metadata: Metadata = buildMetadata({
  title: "Refund and Cancellation Policy",
  description:
    "Refund, cancellation, and rescheduling guidelines for GradEdge mentoring sessions and packages.",
  path: "/legal/refunds",
});

export default function RefundsPage() {
  return (
    <>
      <DraftLegalBanner />
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Refund Policy" }]} />

      <PageHero
        sectionNumber={1}
        sectionLabel="Consumer Terms"
        headline="Refund and Cancellation Policy"
        standfirst="Clear, fair rules regarding cancellations, rescheduling, and pro-rated refunds for research packages."
      />

      <div className="site-container py-12 md:py-16 max-w-3xl prose prose-sm text-tone-body leading-relaxed space-y-8">
        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">1. Individual Mentoring Sessions</h2>
          <p>
            Appointments cancelled with more than 24 hours notice prior to the scheduled consultation time receive a 100% refund or full credit toward a rescheduled appointment. Sessions cancelled with less than 24 hours notice or missed without notice (no-show) are non-refundable.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">2. Multi-Milestone Project Packages</h2>
          <p>
            Project packages (e.g. multi-chapter reviews, comprehensive proposal support) are evaluated on a completed milestone basis. If you elect to discontinue mentoring, you are entitled to a pro-rated refund for all uninitiated chapter milestones. Notice must be provided in writing with at least two working days notice prior to the start of the next milestone.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">3. Membership Subscriptions</h2>
          <p>
            Monthly memberships may be cancelled at any point via your student dashboard. Cancellation halts all future automated billing renewals. No pro-rated refunds are granted for the remaining days of an active monthly billing period, but your mentoring and feedback privileges remain active until that period expires.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">4. Dissertation Accelerator Program</h2>
          <p>
            Due to strict cohort caps, admitted Accelerator candidates who remit tuition may withdraw for a 100% refund up to 7 calendar days prior to their official cohort onboarding date. Once the initial diagnostic session and mentor matching have commenced, withdrawals are subject to the milestone schedule detailed in your formal enrollment agreement.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">5. Refund Processing Timeline</h2>
          <p>
            Approved refunds are credited back to the original funding source (credit card or bank account) via Paystack within 5 to 10 working days, subject to your issuing bank&apos;s settlement procedures.
          </p>
        </section>
      </div>
    </>
  );
}

