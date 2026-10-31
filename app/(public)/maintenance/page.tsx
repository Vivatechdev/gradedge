import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = buildMetadata({
  title: "Scheduled Maintenance in Progress",
  description: "GradEdge is temporarily undergoing scheduled platform maintenance.",
  path: "/maintenance",
  noIndex: true,
});

export default function MaintenancePage() {
  return (
    <div className="min-h-[70vh] bg-paper flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-4 h-4 bg-gold mx-auto" aria-hidden="true" />
        <p className="type-micro text-gold font-semibold">Scheduled Maintenance</p>
        <h1 className="type-h1 text-tone-heading">We are doing a quick update.</h1>
        <p className="type-body text-tone-muted leading-relaxed">
          GradEdge is temporarily undergoing routine infrastructure maintenance. We will be back online shortly. If you need immediate assistance with an ongoing submission deadline, please email us directly at:{" "}
          <span className="font-semibold text-tone-heading">[CONTACT EMAIL TO BE CONFIRMED]</span>.
        </p>

        <div className="pt-2">
          <Button variant="primary" href="/">
            Refresh Page
          </Button>
        </div>
      </div>
    </div>
  );
}

