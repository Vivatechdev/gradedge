import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import { PageBreadcrumb } from "@/components/marketing/page-components";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { PaymentPurpose, Currency } from "@/lib/payments/types";

export const metadata: Metadata = buildMetadata({
  title: "Secure Academic Checkout — GradEdge",
  description: "Complete your research mentoring or dissertation coaching enrollment.",
  path: "/checkout",
  noIndex: true,
});

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{
    purpose?: string;
    packageId?: string;
    service?: string;
    currency?: string;
    bookingId?: string;
    applicationId?: string;
  }>;
}) {
  const { purpose, packageId, service: serviceSlug, currency = "USD", bookingId, applicationId } =
    await searchParams;

  // If visiting /checkout without query parameters, redirect to pricing
  if (!purpose && !packageId && !bookingId && !applicationId) {
    redirect("/pricing");
  }

  const currentPurpose = (purpose as PaymentPurpose) || (packageId ? "package" : "booking");

  let title = "Academic Mentoring Scope";
  let description = "One-on-one doctoral consultation, thesis critique, or methodology review.";
  let includes = [
    "One-on-one doctoral advisor review",
    "Comprehensive written marginal commentary",
    "Turnaround with clear revision milestones",
  ];
  let priceUsdMinor = 7500;
  let priceNgnMinor = 3500000;

  if (currentPurpose === "booking") {
    title = "Paid Academic Mentoring Session (60 mins)";
    description = "One-on-one doctoral consultation, thesis critique, or methodology review.";
    includes = [
      "60-minute direct live session with assigned discipline mentor",
      "Written session summary & actionable revision roadmap",
      "Follow-up clarification window",
    ];
    priceUsdMinor = 7500;
    priceNgnMinor = 3500000;
  }

  return (
    <>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Checkout" }]} />

      <div className="site-container py-12 md:py-20 max-w-xl text-center space-y-6">
        <div className="w-3 h-3 bg-gold mx-auto" aria-hidden="true" />

        <div className="space-y-1">
          <span className="type-micro text-gold">Verified Checkout</span>
          <h1 className="font-serif text-3xl text-tone-heading font-medium">
            Confirm Your Research Mentoring
          </h1>
          <p className="text-xs sm:text-sm text-tone-muted max-w-md mx-auto leading-relaxed">
            Review your inclusions and finalize payment to confirm your reservation.
          </p>
        </div>

        <CheckoutForm
          purpose={currentPurpose}
          title={title}
          description={description}
          includes={includes}
          priceUsdMinor={priceUsdMinor}
          priceNgnMinor={priceNgnMinor}
          initialCurrency={currency === "NGN" ? "NGN" : "USD"}
          serviceSlug={serviceSlug}
          packageId={packageId}
          bookingId={bookingId}
          applicationId={applicationId}
        />
      </div>
    </>
  );
}

