import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { PageBreadcrumb } from "@/components/marketing/page-components";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, HelpCircle } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Payment Could Not Be Completed — GradEdge",
  description: "Your payment attempt was not completed.",
  path: "/checkout/failed",
  noIndex: true,
});

export default async function CheckoutFailedPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; reason?: string }>;
}) {
  const { reference, reason } = await searchParams;

  const displayReason = reason
    ? decodeURIComponent(reason)
    : "The issuing bank or card network was unable to complete the authorization.";

  return (
    <>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Payment Unsuccessful" }]} />

      <div className="site-container py-16 md:py-24 max-w-xl text-center space-y-6">
        <div className="w-12 h-12 bg-error/10 border border-error/30 rounded-[2px] flex items-center justify-center mx-auto text-error">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <span className="type-micro text-error font-semibold">Transaction Incomplete</span>
          <h1 className="font-serif text-3xl text-tone-heading font-medium">Payment Could Not Be Completed</h1>
          <p className="text-xs sm:text-sm text-tone-muted leading-relaxed max-w-md mx-auto">
            No funds were deducted from your account. Your selected mentoring slot or package remains preserved for a short window.
          </p>
        </div>

        <div className="bg-white p-6 border border-tone-rule rounded-[2px] text-left space-y-4 shadow-xs">
          <div className="space-y-1 border-b border-tone-rule pb-3">
            <span className="text-[10px] uppercase font-mono tracking-wider text-tone-muted">
              Reported Status
            </span>
            <p className="text-xs font-medium text-tone-heading">{displayReason}</p>
            {reference && (
              <p className="text-[10px] font-mono text-tone-muted">Reference: {reference}</p>
            )}
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-sm font-semibold text-tone-heading">
              Common reasons and quick fixes:
            </h2>
            <ul className="space-y-1.5 text-xs text-tone-muted">
              <li>
                &bull; <strong>Online or International Limits:</strong> Check with your bank or banking app that online card payments are enabled.
              </li>
              <li>
                &bull; <strong>3D-Secure Authentication:</strong> The one-time passcode (OTP) prompt may have timed out or failed to deliver.
              </li>
              <li>
                &bull; <strong>Alternative Channel:</strong> If using a debit card, you can switch between Visa and Mastercard, or switch the currency toggle (USD / NGN).
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Button variant="accent" href="/pricing">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            <span>Try Again</span>
          </Button>
          <Button variant="secondary" href="/contact?subject=Assistance with Checkout">
            <HelpCircle className="w-3.5 h-3.5 mr-1.5" />
            <span>Contact Finance Desk</span>
          </Button>
        </div>
      </div>
    </>
  );
}
