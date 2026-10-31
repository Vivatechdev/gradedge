import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { PageBreadcrumb } from "@/components/marketing/page-components";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = buildMetadata({
  title: "Manage Your Consultation Booking",
  description: "Reschedule or cancel your advisory consultation.",
  path: "/booking/manage",
  noIndex: true,
});

export default async function ManageBookingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Manage Booking" },
        ]}
      />

      <div className="site-container py-16 md:py-24 max-w-xl text-center space-y-6">
        <div className="w-3 h-3 bg-gold mx-auto" aria-hidden="true" />

        <div className="space-y-2">
          <h1 className="type-h2 text-tone-heading">Manage your booking</h1>
          <p className="type-body text-tone-muted leading-relaxed">
            Booking reference: <code className="font-mono text-xs bg-cream px-2 py-0.5">{token}</code>
          </p>
        </div>

        <div className="p-6 bg-white border border-tone-rule rounded-[2px] text-left space-y-4">
          <p className="type-body text-tone-muted text-sm leading-relaxed">
            Interactive self-service rescheduling and cancellation is wired in Stage 6 alongside our real-time calendar integration.
          </p>
          <p className="type-body text-tone-muted text-sm leading-relaxed">
            To reschedule or cancel your consultation right now, please send a brief message with your preferred replacement times.
          </p>
          <div className="pt-2">
            <Button variant="accent" size="md" href="/contact">
              Contact us to reschedule
            </Button>
          </div>
        </div>

        <div>
          <Link href="/" className="type-small text-navy hover:underline">
            Return to Homepage
          </Link>
        </div>
      </div>
    </>
  );
}

