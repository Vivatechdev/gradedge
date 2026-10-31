import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { PageBreadcrumb } from "@/components/marketing/page-components";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = buildMetadata({
  title: "Checkout & Secure Payment",
  description: "Secure checkout for GradEdge academic mentoring services.",
  path: "/checkout",
  noIndex: true,
});

export default async function CheckoutItemPage({
  params,
}: {
  params: Promise<{ item: string }>;
}) {
  const { item } = await params;
  const decodedItem = decodeURIComponent(item);

  return (
    <>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Checkout" }]} />

      <div className="site-container py-16 md:py-24 max-w-xl text-center space-y-6">
        <div className="w-4 h-4 bg-gold mx-auto" aria-hidden="true" />

        <div className="space-y-2">
          <p className="type-micro text-tone-muted">Secure Checkout Gateway</p>
          <h1 className="type-h2 text-tone-heading">Order Summary</h1>
          <p className="type-body text-tone-muted">
            Item requested: <span className="font-semibold text-tone-heading">{decodedItem}</span>
          </p>
        </div>

        <div className="bg-white p-6 border border-tone-rule rounded-[2px] text-left space-y-4">
          <div className="p-4 bg-cream border border-tone-rule text-xs text-tone-muted leading-relaxed">
            Payment processing is wired in Stage 7 with full Paystack integration. In this stage, please confirm your request via direct consultation or contact our advisory desk.
          </div>

          <div className="space-y-2 pt-2 border-t border-tone-rule text-xs text-tone-muted">
            <div className="flex justify-between">
              <span>Payment Provider:</span>
              <span className="font-semibold text-tone-heading">Paystack (PCI-DSS Level 1)</span>
            </div>
            <div className="flex justify-between">
              <span>Accepted Cards:</span>
              <span className="font-semibold text-tone-heading">Mastercard, Visa, Verve, Bank Transfer</span>
            </div>
          </div>

          <div className="pt-2">
            <Button variant="accent" size="lg" className="w-full" href="/book">
              Schedule Consultation to Finalize Order
            </Button>
          </div>
        </div>

        <div>
          <Link href="/services" className="type-small text-navy hover:underline">
            &larr; Return to services
          </Link>
        </div>
      </div>
    </>
  );
}

