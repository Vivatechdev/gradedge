import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { PageBreadcrumb } from "@/components/marketing/page-components";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = buildMetadata({
  title: "Payment Could Not Be Processed",
  description: "Your payment attempt was not completed.",
  path: "/checkout/failed",
  noIndex: true,
});

export default function CheckoutFailedPage() {
  return (
    <>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Payment Failed" }]} />

      <div className="site-container py-16 md:py-24 max-w-xl text-center space-y-6">
        <div className="w-12 h-12 bg-error/10 border border-error/30 rounded-[2px] flex items-center justify-center mx-auto text-error font-bold text-xl">
          &times;
        </div>

        <div className="space-y-2">
          <h1 className="type-h2 text-tone-heading">Payment Could Not Be Completed</h1>
          <p className="type-body text-tone-muted leading-relaxed">
            Your card issuer or banking institution declined the transaction. No charges were deducted.
          </p>
        </div>

        <div className="bg-white p-6 border border-tone-rule rounded-[2px] text-left space-y-3">
          <h2 className="font-serif text-base text-tone-heading font-semibold border-b border-tone-rule pb-2">
            Possible resolutions
          </h2>
          <ul className="space-y-1.5 text-xs text-tone-muted">
            <li>&bull; Verify with your bank that online/international card transactions are authorized.</li>
            <li>&bull; Attempt payment using an alternative card (Mastercard/Visa) or bank transfer.</li>
            <li>&bull; Contact our finance desk if you require an alternative payment invoice.</li>
          </ul>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Button variant="accent" href="/pricing">
            Review Pricing & Try Again
          </Button>
          <Button variant="secondary" href="/contact">
            Contact Support
          </Button>
        </div>
      </div>
    </>
  );
}

