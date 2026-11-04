import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { PageBreadcrumb, PageHero } from "@/components/marketing/page-components";
import { SectionLabel, StepList } from "@/components/ui/editorial";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = buildMetadata({
  title: "Request Research Support & Submit Drafts",
  description:
    "How to submit chapters, methodologies, and datasets for mentor review. Existing students log in to their dashboard.",
  path: "/request-support",
});

export default function RequestSupportPage() {
  const steps = [
    {
      title: "Log in to your student dashboard",
      description: "Access your secure portal where active projects and assigned mentors are maintained.",
    },
    {
      title: "Create a new support request",
      description: "Specify the service category, working chapter title, word count, and upload your manuscript or dataset.",
    },
    {
      title: "Set submission deadlines",
      description: "Select standard 5-day review turnaround or request expedited review if facing an impending committee deadline.",
    },
    {
      title: "Receive line-level mentor critique",
      description: "Your assigned discipline specialist provides written annotations and revision roadmaps directly into your portal.",
    },
  ];

  return (
    <>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Request Support" }]} />

      <PageHero
        sectionLabel="Researcher Onboarding"
        headline="How to request research mentoring support."
        standfirst="Enrolled scholars submit chapters and datasets directly through their student dashboard. New to GradEdge? Schedule a consultation first or register an account."
      />

      <div className="site-container py-12 md:py-16 max-w-3xl space-y-12 ui-interface">
        <section className="space-y-6">
          <SectionLabel label="Four-Step Review Cycle" />
          <h2 className="type-h2 text-tone-heading">Four steps to receiving written feedback</h2>
          <StepList steps={steps} />
        </section>

        <section className="p-8 bg-paper border border-tone-rule rounded-[2px] space-y-6 shadow-xs">
          <div className="space-y-2">
            <h3 className="font-serif text-xl text-tone-heading font-semibold">
              Ready to initiate a review cycle?
            </h3>
            <p className="type-body text-tone-muted text-sm leading-relaxed">
              If you already have an account, sign in to your dashboard to create a new milestone. If you are a new researcher, book a 20-minute consultation or create an account.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-4">
            <Button variant="accent" size="lg" href="/student/support-request">
              Submit a Support Request
            </Button>
            <Button variant="primary" size="lg" href="/register">
              Create an Account
            </Button>
            <Button variant="secondary" size="lg" href="/book">
              Book a Free Call First
            </Button>
          </div>

          {/* Academic Trust Micro-Badges */}
          <div className="pt-6 border-t border-tone-rule/70 grid sm:grid-cols-3 gap-3 text-xs text-tone-muted">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
              <span>Zero Ghostwriting Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
              <span>Full NDA & Confidentiality</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
              <span>Peer-Reviewed Methodologists</span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

