import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { PageBreadcrumb } from "@/components/marketing/page-components";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = buildMetadata({
  title: "Doctoral Accelerator Enrollment — GradEdge",
  description: "Finalize your doctoral accelerator enrollment and lock in your cohort seat.",
  path: "/checkout/accelerator",
  noIndex: true,
});

export default async function AcceleratorCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; applicationId?: string; currency?: string }>;
}) {
  const { token, applicationId, currency = "USD" } = await searchParams;

  const title = "12-Week Doctoral Research Accelerator";
  const description =
    "An intensive, cohort-based completion journey guiding you from research design to defended dissertation.";
  const includes = [
    "Bi-weekly 60-minute one-on-one video coaching calls with your faculty mentor",
    "Line-level developmental critique across all chapters (Ch 1–5)",
    "Statistical syntax audits and empirical model validation (R, Python, SPSS, Stata)",
    "Comprehensive pre-defense mock viva clearance with mock examiners",
    "Private workspace repository audit and ethics protocol guidance",
  ];

  // Full program pricing: $1,200 (120,000 cents) or ₦1,200,000 (120,000,000 kobo)
  const priceUsdMinor = 120000;
  const priceNgnMinor = 120000000;

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Accelerator", href: "/accelerator" },
          { label: "Enrollment & Tuition" },
        ]}
      />

      <div className="site-container py-12 md:py-20 max-w-xl text-center space-y-6">
        <div className="w-3 h-3 bg-gold mx-auto" aria-hidden="true" />

        <div className="space-y-1">
          <span className="type-micro text-gold">Admissions Clearance</span>
          <h1 className="font-serif text-3xl text-tone-heading font-medium">
            Lock in Your Accelerator Seat
          </h1>
          <p className="text-xs sm:text-sm text-tone-muted max-w-md mx-auto leading-relaxed">
            Your research application has been approved. Complete your tuition registration below to receive your cohort onboarding dossier.
          </p>
        </div>

        {token && (
          <div className="p-3 bg-success/10 border border-success/30 rounded-[2px] text-xs text-tone-heading flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
            <span>Admissions Token Verified: Candidate Clearance Granted</span>
          </div>
        )}

        <CheckoutForm
          purpose="program"
          title={title}
          description={description}
          includes={includes}
          priceUsdMinor={priceUsdMinor}
          priceNgnMinor={priceNgnMinor}
          initialCurrency={currency === "NGN" ? "NGN" : "USD"}
          applicationId={applicationId}
          allowInstallments={true}
          installmentTotal={3}
        />

        <div>
          <Link
            href="/accelerator"
            className="inline-flex items-center gap-1.5 text-xs text-navy hover:text-gold font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to program overview</span>
          </Link>
        </div>
      </div>
    </>
  );
}

