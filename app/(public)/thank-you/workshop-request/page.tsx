import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { PageBreadcrumb } from "@/components/marketing/page-components";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = buildMetadata({
  title: "Workshop Request Received — Thank You",
  description: "We have received your workshop enquiry.",
  path: "/thank-you/workshop-request",
  noIndex: true,
});

export default function WorkshopThankYouPage() {
  return (
    <>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Workshop Request Received" }]} />

      <div className="site-container py-16 md:py-24 max-w-xl text-center space-y-6">
        <div className="w-4 h-4 bg-gold mx-auto" aria-hidden="true" />
        <h1 className="type-h1 text-tone-heading">Workshop request received.</h1>
        <p className="type-lead text-tone-muted leading-relaxed">
          Thank you for reaching out. Our academic director will review your faculty requirements and provide a detailed curriculum proposal within three working days.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Button variant="primary" href="/institutions/workshops">
            View Workshop Catalog
          </Button>
          <Button variant="secondary" href="/institutions">
            Institutional Programs
          </Button>
        </div>
      </div>
    </>
  );
}

