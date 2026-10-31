import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { PageBreadcrumb, PageHero } from "@/components/marketing/page-components";
import { AdvisoryBookingChamber } from "@/components/marketing/advisory-booking-chamber";
import { ShieldCheck, CalendarCheck, Clock, Award } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Book a Free 20-Minute Advisory Consultation — GradEdge",
  description:
    "Schedule a confidential 20-minute call with an academic advisor. We discuss your dissertation status, bottlenecks, and mentor availability.",
  path: "/book",
});

export default function BookConsultationPage() {
  const expectations = [
    {
      title: "We discuss your current milestone",
      desc: "We evaluate your academic level, department expectations, topic scope, and where your committee or drafts feel blocked.",
      icon: CalendarCheck,
    },
    {
      title: "We recommend exact scope",
      desc: "Whether you need a single statistical audit, chapter developmental review, or ongoing membership, we explain what fits.",
      icon: Award,
    },
    {
      title: "Zero obligation to proceed",
      desc: "The consultation is designed to verify compatibility and confirm we have an appropriate specialist in your field.",
      icon: ShieldCheck,
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

      <div className="site-container py-12 md:py-16 max-w-4xl space-y-12">
        {/* Interactive Advisory Booking Chamber */}
        <section>
          <AdvisoryBookingChamber />
        </section>

        {/* What to expect */}
        <section className="space-y-4 pt-4 border-t border-tone-rule">
          <div className="space-y-1">
            <span className="type-micro text-tone-muted">Advisory Protocol</span>
            <h2 className="font-serif text-2xl text-tone-heading font-medium">What to expect on your call</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {expectations.map((e, idx) => {
              const IconComp = e.icon;
              return (
                <div key={idx} className="p-5 bg-white border border-tone-rule rounded-[2px] space-y-2 shadow-xs">
                  <div className="w-8 h-8 rounded-[2px] bg-cream border border-tone-rule flex items-center justify-center text-gold">
                    <IconComp className="w-4 h-4 text-gold" />
                  </div>
                  <h3 className="font-serif text-base font-semibold text-tone-heading">{e.title}</h3>
                  <p className="text-xs text-tone-muted leading-relaxed">{e.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
