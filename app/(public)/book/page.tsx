import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { PageBreadcrumb, PageHero } from "@/components/marketing/page-components";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = buildMetadata({
  title: "Book a Free 20-Minute Advisory Consultation",
  description:
    "Schedule a confidential 20-minute call with an academic advisor. We discuss your dissertation status, bottlenecks, and mentor availability.",
  path: "/book",
});

export default function BookConsultationPage() {
  const expectations = [
    {
      title: "We discuss your current stage",
      desc: "We will ask about your academic level, department expectations, topic scope, and where you feel blocked.",
    },
    {
      title: "We suggest the right service level",
      desc: "Whether you need a single statistical audit, chapter developmental review, or ongoing membership, we explain what fits.",
    },
    {
      title: "Zero obligation to book",
      desc: "The consultation is designed to verify compatibility and confirm we have an appropriate specialist in your field.",
    },
  ];

  return (
    <>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Book a Call" }]} />

      <PageHero
        sectionNumber={1}
        sectionLabel="Initial Advisory"
        headline="Book a free 20-minute consultation."
        standfirst="Tell us about your project. We will evaluate your methodology and tell you honestly whether we can help."
      />

      <div className="site-container py-12 md:py-16 max-w-3xl space-y-12">
        {/* What to expect */}
        <section className="space-y-4">
          <h2 className="type-h3 text-tone-heading">What to expect on your call</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {expectations.map((e, idx) => (
              <div key={idx} className="p-4 bg-white border border-tone-rule rounded-[2px] space-y-1">
                <span className="font-serif text-gold font-bold text-base">0{idx + 1}</span>
                <h3 className="font-serif text-sm font-semibold text-tone-heading">{e.title}</h3>
                <p className="text-xs text-tone-muted leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Booking Calendar Placeholder — full calendar system wired in Stage 6 */}
        <section className="p-8 bg-paper border border-tone-rule rounded-[2px] text-center space-y-4">
          <div className="w-3 h-3 bg-gold mx-auto" aria-hidden="true" />
          <h3 className="font-serif text-xl text-tone-heading font-semibold">
            Select an Appointment Slot
          </h3>
          <p className="type-body text-tone-muted max-w-md mx-auto leading-relaxed text-sm">
            Our interactive scheduling calendar is being calibrated for Stage 6. In the interim, please send us a brief description of your dissertation and your preferred times.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Button variant="accent" size="lg" href="/contact">
              Send your project brief via Contact Form
            </Button>
            <Button variant="secondary" size="lg" href="/book/confirmed">
              Preview confirmation screen
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}

