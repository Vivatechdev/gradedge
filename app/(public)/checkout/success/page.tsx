import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { PageBreadcrumb } from "@/components/marketing/page-components";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText, ArrowRight } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Payment Confirmed — GradEdge",
  description: "Your payment has been successfully processed and settled.",
  path: "/checkout/success",
  noIndex: true,
});

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; invoice?: string }>;
}) {
  const { reference, invoice } = await searchParams;

  return (
    <>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Payment Success" }]} />

      <div className="site-container py-16 md:py-24 max-w-xl text-center space-y-6">
        <div className="w-12 h-12 bg-success/10 border border-success/30 rounded-[2px] flex items-center justify-center mx-auto text-success">
          <CheckCircle2 className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <span className="type-micro text-gold">Transaction Settled</span>
          <h1 className="font-serif text-3xl text-tone-heading font-medium">Payment Confirmed</h1>
          <p className="text-xs sm:text-sm text-tone-muted leading-relaxed max-w-md mx-auto">
            Your transaction was authorized. Your research milestone has been unlocked, and an official PDF tax invoice has been dispatched to your email.
          </p>
        </div>

        {/* Invoice & Reference Pill */}
        <div className="bg-white p-6 border border-tone-rule rounded-[2px] text-left space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-tone-rule pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gold" />
              <span className="text-xs font-semibold text-tone-heading">Tax Invoice</span>
            </div>
            <span className="font-mono text-xs font-semibold text-navy bg-paper px-2 py-0.5 border border-tone-rule rounded-[2px]">
              {invoice || "GE-2026-CONFIRMED"}
            </span>
          </div>

          {reference && (
            <div className="flex items-center justify-between text-[11px] text-tone-muted">
              <span>Transaction Reference:</span>
              <span className="font-mono text-[10px] text-tone-heading">{reference}</span>
            </div>
          )}

          <div className="pt-2 text-xs text-tone-muted leading-relaxed">
            Your intellectual property, research questions, and manuscript drafts remain completely your own. You can track your assigned faculty mentor and milestones directly inside your researcher workspace.
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Button variant="accent" href="/student">
            <span>Enter Student Workspace</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
          <Button variant="secondary" href="/">
            Return to Homepage
          </Button>
        </div>
      </div>
    </>
  );
}
