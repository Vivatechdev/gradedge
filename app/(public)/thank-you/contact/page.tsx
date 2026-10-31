import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { PageBreadcrumb } from "@/components/marketing/page-components";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = buildMetadata({
  title: "Inquiry Received — Thank You",
  description: "We have received your message.",
  path: "/thank-you/contact",
  noIndex: true,
});

export default function ContactThankYouPage() {
  return (
    <>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Thank You" }]} />

      <div className="site-container py-16 md:py-24 max-w-xl text-center space-y-6">
        <div className="w-4 h-4 bg-gold mx-auto" aria-hidden="true" />
        <h1 className="type-h1 text-tone-heading">Message received.</h1>
        <p className="type-lead text-tone-muted leading-relaxed">
          We have received your inquiry and will respond within two working days.
        </p>
        <p className="type-body text-tone-muted text-sm leading-relaxed">
          In the meantime, you might find answers to common questions regarding our methodology and mentor matching in our FAQ.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Button variant="primary" href="/faq">
            Browse FAQ
          </Button>
          <Button variant="secondary" href="/services">
            Explore Services
          </Button>
        </div>
      </div>
    </>
  );
}

