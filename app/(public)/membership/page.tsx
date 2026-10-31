import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import {
  PageHero,
  PageBreadcrumb,
  MentorTeamBlock,
  CtaStrip,
} from "@/components/marketing/page-components";
import { SectionLabel } from "@/components/ui/editorial";
import { AccordionItem, Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Membership Plans — Ongoing Research Mentoring",
  description:
    "GradEdge membership gives you regular access to a dedicated mentor, written feedback on your drafts and priority support. Monthly and annual plans. Cancel any time.",
  path: "/membership",
});

interface Plan {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_monthly_minor: number;
  price_annual_minor: number;
  currency: string;
  features: string[];
}

export default async function MembershipPage() {
  let plans: Plan[] = [];

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("membership_plans")
        .select("*")
        .eq("is_active", true)
        .order("price_monthly_minor");
      plans = (data ?? []) as Plan[];
    } catch {
      plans = [];
    }
  }

  // Fallback plans if unseeded
  if (plans.length === 0) {
    plans = [
      {
        id: "plan-foundation",
        slug: "foundation",
        name: "Research Foundation",
        description: "For scholars drafting literature reviews or early proposals needing monthly oversight.",
        price_monthly_minor: 3500000,
        price_annual_minor: 35000000,
        currency: "NGN",
        features: [
          "1 formal written review cycle per month (up to 4,000 words)",
          "1 live 45-minute advisory consultation",
          "Private student dashboard milestone tracker",
          "Email response within 48 business hours",
        ],
      },
      {
        id: "plan-accelerated",
        slug: "advanced-scholar",
        name: "Advanced Scholar",
        description: "For active dissertation writers producing consistent empirical chapters.",
        price_monthly_minor: 6500000,
        price_annual_minor: 65000000,
        currency: "NGN",
        features: [
          "2 formal written review cycles per month (up to 8,000 words total)",
          "2 live 45-minute advisory consultations",
          "Methodological and statistical syntax audit support",
          "Priority email response within 24 business hours",
          "Full access to premium proposal and defense templates",
        ],
      },
      {
        id: "plan-intensive",
        slug: "doctoral-completion",
        name: "Doctoral Completion",
        description: "For scholars within 6 months of defense requiring weekly revision audits.",
        price_monthly_minor: 11000000,
        price_annual_minor: 110000000,
        currency: "NGN",
        features: [
          "Weekly written review cycles (up to 15,000 words monthly)",
          "4 live 45-minute advisory consultations per month",
          "Pre-submission structural and referencing compliance checks",
          "Dedicated Viva voce simulation panel",
          "Priority emergency review turnaround (48 hours)",
        ],
      },
    ];
  }

  const membershipFaqs = [
    {
      q: "Can I cancel my membership at any time?",
      a: "Yes. You may cancel your renewal with a single click inside your student dashboard. You retain active mentor support and feedback privileges until the conclusion of your current billing period.",
    },
    {
      q: "What is the difference between monthly and annual billing?",
      a: "Annual plans include a discount equivalent to approximately two months free. Monthly billing offers maximum flexibility if your submission date is within 2 to 4 months.",
    },
    {
      q: "Can I upgrade or downgrade my tier?",
      a: "Yes. If your writing pacing increases or you finish a demanding chapter, you can adjust your tier anytime. Upgrades take effect immediately with pro-rated billing.",
    },
    {
      q: "What happens to my assigned mentor if I pause or cancel?",
      a: "If you cancel, your dedicated mentor is released to the mentoring pool. Upon resubscribing, we attempt to reassign the same advisor if their schedule permits, or match an equivalent specialist in your discipline.",
    },
  ];

  return (
    <>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Membership" }]} />

      <PageHero
        sectionNumber={1}
        sectionLabel="Continuous Mentorship"
        headline="Ongoing mentoring without booking one session at a time."
        standfirst="Our membership plans give you regular access to feedback, coaching and support. Structured monthly written cycles and direct consultations. Cancel anytime."
        cta={{ label: "Choose a membership tier", href: "/membership/join" }}
        secondaryCta={{ label: "View one-off services", href: "/services" }}
        image={{
          src: "/images/membership/header.jpg",
          alt: "Postgraduate workspace with laptop, academic journals, and research notes",
          aspectRatio: "21:9",
          caption: "Ongoing monthly advisory and continuous editorial review for researchers.",
        }}
      />

      <div className="site-container py-12 md:py-16 space-y-16 max-w-4xl">
        {/* Comparison Table / Column Grid */}
        <section className="space-y-6">
          <SectionLabel number={1} label="Available Tiers" />
          <h2 className="type-h2 text-tone-heading">Compare membership plans</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {plans.map((p, idx) => (
              <div
                key={p.slug}
                className={`bg-white border p-6 flex flex-col justify-between rounded-[2px] ${
                  idx === 1 ? "border-gold ring-1 ring-gold shadow-sm" : "border-tone-rule"
                }`}
              >
                <div className="space-y-4">
                  {idx === 1 && (
                    <span className="type-micro text-gold block font-semibold">
                      Most Selected
                    </span>
                  )}
                  <h3 className="font-serif text-xl text-tone-heading font-semibold">
                    {p.name}
                  </h3>
                  <div>
                    <span className="font-mono text-2xl text-tone-heading font-medium">
                      {formatCurrency(p.price_monthly_minor, p.currency)}
                    </span>
                    <span className="text-xs text-tone-muted"> / month</span>
                  </div>
                  <p className="text-xs text-tone-muted leading-relaxed border-b border-tone-rule pb-3">
                    {p.description}
                  </p>

                  <ul className="space-y-2.5">
                    {p.features.map((f, i) => (
                      <li key={i} className="text-xs text-tone-muted flex items-start gap-2 leading-relaxed">
                        <span className="text-gold font-bold">&check;</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <Button
                    variant={idx === 1 ? "accent" : "primary"}
                    size="md"
                    className="w-full"
                    href={`/membership/join?plan=${p.slug}`}
                  >
                    Select {p.name}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What membership includes */}
        <section className="space-y-6 pt-8 border-t border-tone-rule">
          <SectionLabel number={2} label="Membership Standards" />
          <h2 className="type-h2 text-tone-heading">What every membership tier guarantees</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-paper border border-tone-rule rounded-[2px] space-y-1">
              <h4 className="font-serif text-base text-tone-heading font-medium">
                Written chapter annotations
              </h4>
              <p className="text-xs text-tone-muted leading-relaxed">
                Methodological, structural, and syntactic annotations on submitted text.
              </p>
            </div>
            <div className="p-4 bg-paper border border-tone-rule rounded-[2px] space-y-1">
              <h4 className="font-serif text-base text-tone-heading font-medium">
                Milestone tracking dashboard
              </h4>
              <p className="text-xs text-tone-muted leading-relaxed">
                Private project hub with audit trails, milestone pacing, and revision archives.
              </p>
            </div>
            <div className="p-4 bg-paper border border-tone-rule rounded-[2px] space-y-1">
              <h4 className="font-serif text-base text-tone-heading font-medium">
                No long-term commitments
              </h4>
              <p className="text-xs text-tone-muted leading-relaxed">
                Cancel, pause, or switch plans anytime. Transparent subscription management.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-6 pt-8 border-t border-tone-rule">
          <SectionLabel number={3} label="Subscription Questions" />
          <h2 className="type-h2 text-tone-heading">Frequently asked questions</h2>
          <Accordion>
            {membershipFaqs.map((faq, i) => (
              <AccordionItem key={i} title={faq.q} defaultOpen={i === 0}>
                <div className="prose prose-sm text-tone-muted leading-relaxed">
                  {faq.a}
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>

      <MentorTeamBlock />

      <CtaStrip
        headline="Uncertain which membership matches your timeline?"
        subtext="Schedule a brief introductory consultation. We will recommend the plan suited to your remaining dissertation deliverables."
        ctaLabel="Book a free consultation"
        ctaHref="/book"
      />
    </>
  );
}

