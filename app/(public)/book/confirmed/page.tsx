import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { PageBreadcrumb } from "@/components/marketing/page-components";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = buildMetadata({
  title: "Consultation Call Confirmed",
  description: "Your free 20-minute advisory consultation is confirmed.",
  path: "/book/confirmed",
  noIndex: true,
});

export default function BookingConfirmedPage() {
  return (
    <>
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Book a Call", href: "/book" },
          { label: "Confirmed" },
        ]}
      />

      <div className="site-container py-16 md:py-24 max-w-xl text-center space-y-6">
        <div className="w-4 h-4 bg-gold mx-auto" aria-hidden="true" />

        <div className="space-y-2">
          <h1 className="type-h1 text-tone-heading">Your consultation is scheduled.</h1>
          <p className="type-lead text-tone-muted leading-relaxed">
            We have sent a calendar invitation and meeting link to your email address.
          </p>
        </div>

        <div className="p-6 bg-white border border-tone-rule rounded-[2px] text-left space-y-4">
          <h2 className="font-serif text-base text-tone-heading font-semibold border-b border-tone-rule pb-2">
            How to prepare for your 20-minute call
          </h2>
          <ul className="space-y-2 text-xs text-tone-muted leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-gold font-bold">&check;</span>
              <span>Have your working thesis or dissertation title ready.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold font-bold">&check;</span>
              <span>Identify your primary bottleneck (e.g., proposal revision, data analysis, literature review).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold font-bold">&check;</span>
              <span>Know your degree deadline and any upcoming committee defense dates.</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Button variant="primary" href="/">
            Return to Homepage
          </Button>
          <Button variant="secondary" href="/services">
            Browse Services
          </Button>
        </div>
      </div>
    </>
  );
}

