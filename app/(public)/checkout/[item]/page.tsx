import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { PageBreadcrumb } from "@/components/marketing/page-components";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, CheckCircle2, FileText, ArrowLeft, Calendar } from "lucide-react";
import { getServiceBySlug } from "@/lib/data/services-content";

export const metadata: Metadata = buildMetadata({
  title: "Service Order & Milestone Scope — GradEdge",
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
  const { service: serviceSlug, currency = "NGN" } = await searchParams;
  const decodedItem = decodeURIComponent(item);

  // Look up matching service if available
  const matchedService = serviceSlug ? getServiceBySlug(serviceSlug) : null;
  const matchedPackage = matchedService?.packages.find(
    (p) => p.id === decodedItem || p.name.toLowerCase() === decodedItem.toLowerCase()
  );

  const priceDisplay = matchedPackage
    ? currency === "USD"
      ? `$${matchedPackage.price_usd.toLocaleString()}`
      : `₦${matchedPackage.price_ngn.toLocaleString()}`
    : matchedService
    ? currency === "USD"
      ? `$${matchedService.starting_price_usd.toLocaleString()}`
      : `₦${matchedService.starting_price_ngn.toLocaleString()}`
    : null;

  return (
    <>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: "Milestone Scope" }]} />

      <div className="site-container py-12 md:py-20 max-w-xl text-center space-y-6">
        <div className="w-3 h-3 bg-gold mx-auto" aria-hidden="true" />

        <div className="space-y-1">
          <span className="type-micro text-gold">Milestone Commitment</span>
          <h1 className="font-serif text-3xl text-tone-heading font-medium">
            Confirm Your Mentoring Scope
          </h1>
          <p className="text-xs sm:text-sm text-tone-muted max-w-md mx-auto leading-relaxed">
            Review the deliverables and investment for your selected research milestone before finalizing.
          </p>
        </div>

        {/* Milestone Scope Card */}
        <div className="bg-white p-6 sm:p-8 border border-tone-rule rounded-[2px] text-left space-y-6 shadow-xs">
          <div className="border-b border-tone-rule pb-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-tone-muted">
                Selected Package
              </span>
              <Badge variant="navy">Fixed Milestone Quote</Badge>
            </div>

            <h2 className="font-serif text-xl sm:text-2xl text-tone-heading font-medium">
              {matchedPackage ? matchedPackage.name : decodedItem}
            </h2>

            {matchedService && (
              <p className="text-xs text-tone-muted">
                Service: <strong className="text-tone-heading">{matchedService.title}</strong>
              </p>
            )}

            {priceDisplay && (
              <div className="pt-2 flex items-baseline justify-between">
                <span className="text-xs text-tone-muted">Total Milestone Investment:</span>
                <span className="font-serif text-2xl font-semibold text-tone-heading">
                  {priceDisplay}
                </span>
              </div>
            )}
          </div>

          {/* Deliverables List */}
          {matchedPackage && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-tone-heading">
                Included in this package:
              </h3>
              <ul className="space-y-2 text-xs text-tone-body">
                {matchedPackage.includes.map((inc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-gold font-bold">&check;</span>
                    <span>{inc}</span>
                  </li>
                ))}
                <li className="flex items-start gap-2 text-tone-muted">
                  <span className="text-gold font-bold">&check;</span>
                  <span>Turnaround speed: {matchedPackage.turnaround}</span>
                </li>
                <li className="flex items-start gap-2 text-tone-muted">
                  <span className="text-gold font-bold">&check;</span>
                  <span>Feedback iterations: {matchedPackage.rounds_of_feedback}</span>
                </li>
              </ul>
            </div>
          )}

          {/* Next Step Action */}
          <div className="space-y-3 pt-2">
            <Button
              variant="accent"
              size="lg"
              className="w-full font-semibold text-xs"
              href={`/book?service=${serviceSlug || ""}&package=${decodedItem}&currency=${currency}`}
            >
              Lock in Mentoring Milestone & Book Call &rarr;
            </Button>
            <Button
              variant="secondary"
              size="md"
              className="w-full text-xs"
              href={`/contact?subject=Scope Confirmation for ${matchedPackage ? matchedPackage.name : decodedItem}`}
            >
              Request Custom Written Invoice
            </Button>
          </div>

          <div className="pt-4 border-t border-tone-rule flex items-start gap-2 text-[11px] text-tone-muted">
            <ShieldCheck className="w-4 h-4 text-gold shrink-0 mt-0.5" />
            <span>
              All prices are fixed with zero hidden administrative fees. You receive an official, downloadable invoice in your student portal.
            </span>
          </div>
        </div>

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
