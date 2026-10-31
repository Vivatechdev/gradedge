import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { PageBreadcrumb } from "@/components/marketing/page-components";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = buildMetadata({
  title: "Payment Confirmed",
  description: "Your payment has been successfully processed.",
  path: "/checkout/success",
  noIndex: true,
});

export default function CheckoutSuccessPage() {
  return (
    <>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Payment Success" }]} />

      <div className="site-container py-16 md:py-24 max-w-xl text-center space-y-6">
        <div className="w-12 h-12 bg-success/10 border border-success/30 rounded-[2px] flex items-center justify-center mx-auto text-success font-bold text-xl">
          &check;
        </div>

        <div className="space-y-2">
          <h1 className="type-h1 text-tone-heading">Payment Confirmed</h1>
          <p className="type-lead text-tone-muted leading-relaxed">
            Thank you. Your transaction was authorized and an official invoice has been dispatched to your email.
          </p>
        </div>

        <div className="bg-white p-6 border border-tone-rule rounded-[2px] text-left space-y-3">
          <h2 className="font-serif text-base text-tone-heading font-semibold border-b border-tone-rule pb-2">
            Next steps
          </h2>
          <p className="text-xs text-tone-muted leading-relaxed">
            Your project milestone has been registered. Log in to your student dashboard to view your assigned discipline mentor and schedule your initial milestone consultation.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Button variant="accent" href="/student">
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

