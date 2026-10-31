import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { PageBreadcrumb } from "@/components/marketing/page-components";
import { StepList } from "@/components/ui/editorial";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = buildMetadata({
  title: "Application Received — Dissertation Accelerator",
  description:
    "Your Dissertation Accelerator application has been received. We review every application personally.",
  path: "/accelerator/application-received",
  noIndex: true,
});

export default function ApplicationReceivedPage() {
  const steps = [
    {
      title: "Application review (3 to 5 working days)",
      description:
        "Our academic directors examine your research questions, methodology, and submission deadline.",
    },
    {
      title: "Methodological alignment check",
      description:
        "We identify a mentor with an advanced degree in your field who has availability for the nine-month period.",
    },
    {
      title: "Admissions decision & tuition notice",
      description:
        "You will receive an email detailing your admissions decision, confirmed start date, and tuition invoice.",
    },
    {
      title: "Mentor onboarding & dashboard access",
      description:
        "Once payment is confirmed, your student portal is unlocked and your initial diagnostic session is scheduled.",
    },
  ];

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Dissertation Accelerator", href: "/accelerator" },
          { label: "Application Received" },
        ]}
      />

      <div className="site-container py-16 md:py-24 max-w-2xl text-center space-y-8">
        <div className="w-4 h-4 bg-gold mx-auto" aria-hidden="true" />

        <div className="space-y-3">
          <h1 className="type-h1 text-tone-heading">We have received your application.</h1>
          <p className="type-lead text-tone-muted max-w-lg mx-auto">
            Thank you for applying. We review every doctoral application personally and respond within five working days.
          </p>
        </div>

        <div className="text-left bg-white p-8 border border-tone-rule rounded-[2px] space-y-6">
          <h2 className="font-serif text-xl text-tone-heading font-medium border-b border-tone-rule pb-2">
            What happens next
          </h2>
          <StepList steps={steps} />
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Button variant="primary" href="/accelerator">
            Return to Accelerator overview
          </Button>
          <Button variant="secondary" href="/services">
            Explore other services
          </Button>
        </div>
      </div>
    </>
  );
}

