import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { PageBreadcrumb } from "@/components/marketing/page-components";
import { ArrowLeft } from "lucide-react";
import { getServiceBySlug, SERVICES_CONTENT, ServicePackage } from "@/lib/data/services-content";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { Currency } from "@/lib/payments/types";

export const metadata: Metadata = buildMetadata({
  title: "Mentoring Scope & Secure Checkout — GradEdge",
  description: "Review and confirm your academic mentoring package and deliverables.",
  path: "/checkout",
  noIndex: true,
});

export default async function CheckoutItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ item: string }>;
  searchParams: Promise<{ service?: string; currency?: string }>;
}) {
  const { item } = await params;
  const { service: serviceSlug, currency = "USD" } = await searchParams;
  const decodedItem = decodeURIComponent(item);

  // Look up matching service and package
  const matchedService = serviceSlug ? getServiceBySlug(serviceSlug) : null;
  let matchedPackage = matchedService?.packages.find(
    (p) => p.id === decodedItem || p.name.toLowerCase() === decodedItem.toLowerCase()
  );

  if (!matchedPackage) {
    for (const svc of Object.values(SERVICES_CONTENT)) {
      const p = svc.packages.find(
        (pkg: ServicePackage) => pkg.id === decodedItem || pkg.name.toLowerCase() === decodedItem.toLowerCase()
      );
      if (p) {
        matchedPackage = p;
        break;
      }
    }
  }

  const title = matchedPackage ? matchedPackage.name : decodedItem;
  const description = matchedPackage
    ? matchedPackage.description
    : "Comprehensive academic mentoring package tailored to your thesis requirements.";
  const includes = matchedPackage ? matchedPackage.includes : [
    "One-on-one doctoral advisor review",
    "Comprehensive written marginal commentary",
    "Methodological and empirical validation",
    "Turnaround with clear revision milestones",
  ];

  const priceUsdMinor = matchedPackage ? matchedPackage.price_usd * 100 : 9500;
  const priceNgnMinor = matchedPackage ? matchedPackage.price_ngn * 100 : 4500000;

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: "Checkout" },
        ]}
      />

      <div className="site-container py-12 md:py-20 max-w-xl text-center space-y-6">
        <div className="w-3 h-3 bg-gold mx-auto" aria-hidden="true" />

        <div className="space-y-1">
          <span className="type-micro text-gold">Secure Mentoring Checkout</span>
          <h1 className="font-serif text-3xl text-tone-heading font-medium">
            Confirm Your Research Milestone
          </h1>
          <p className="text-xs sm:text-sm text-tone-muted max-w-md mx-auto leading-relaxed">
            Review your package deliverables and proceed with verified bank or card payment.
          </p>
        </div>

        <CheckoutForm
          purpose="package"
          title={title}
          description={description}
          includes={includes}
          priceUsdMinor={priceUsdMinor}
          priceNgnMinor={priceNgnMinor}
          initialCurrency={currency === "NGN" ? "NGN" : "USD"}
          serviceSlug={serviceSlug}
          packageId={matchedPackage?.id || decodedItem}
        />

        <div>
          <Link
            href={matchedService ? `/services/${matchedService.slug}` : "/services"}
            className="inline-flex items-center gap-1.5 text-xs text-navy hover:text-gold font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to service details</span>
          </Link>
        </div>
      </div>
    </>
  );
}
