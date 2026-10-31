import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { PageBreadcrumb } from "@/components/marketing/page-components";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = buildMetadata({
  title: "Payment Authorization Pending",
  description: "Your transaction is awaiting confirmation from your banking institution.",
  path: "/checkout/pending",
  noIndex: true,
});

export default function CheckoutPendingPage() {
  return (
    <>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Payment Pending" }]} />

      <div className="site-container py-16 md:py-24 max-w-xl text-center space-y-6">
        <div className="w-12 h-12 bg-gold/10 border border-gold/30 rounded-[2px] flex items-center justify-center mx-auto text-gold font-bold text-xl">
          &hellip;
        </div>

        <div className="space-y-2">
          <h1 className="type-h2 text-tone-heading">Payment Authorization Pending</h1>
          <p className="type-body text-tone-muted leading-relaxed">
            Your payment is currently being confirmed by the banking network. This usually resolves within a few minutes.
          </p>
        </div>

        <div className="bg-white p-6 border border-tone-rule rounded-[2px] text-left space-y-3">
          <p className="text-xs text-tone-muted leading-relaxed">
            As soon as Paystack confirms clearance, your student portal will unlock and a formal confirmation will arrive in your email.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Button variant="primary" href="/student">
            Go to Student Dashboard
          </Button>
          <Button variant="secondary" href="/">
            Return to Homepage
          </Button>
        </div>
      </div>
    </>
  );
}

