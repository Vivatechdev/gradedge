import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import {
  PageHero,
  PageBreadcrumb,
  MentorTeamBlock,
  CtaStrip,
  ArrowRight,
} from "@/components/marketing/page-components";
import { SectionLabel } from "@/components/ui/editorial";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Transparent Pricing — Services, Packages & Membership Plans",
  description:
    "Transparent pricing for every GradEdge service. Sessions, project packages and monthly membership plans. Pay securely in NGN or USD.",
  path: "/pricing",
});

interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  price_from_minor: number;
  currency: string;
  delivery_mode: string;
}

interface PlanItem {
  slug: string;
  name: string;
  price_monthly_minor: number;
  price_annual_minor: number;
  currency: string;
}

export default async function PricingPage() {
  let services: ServiceItem[] = [];
  let plans: PlanItem[] = [];

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createClient();
      const [svcRes, planRes] = await Promise.all([
        supabase
          .from("services")
          .select("id, slug, title, category, price_from_minor, currency, delivery_mode")
          .eq("is_active", true)
          .order("sort_order"),
        supabase
          .from("membership_plans")
          .select("slug, name, price_monthly_minor, price_annual_minor, currency")
          .eq("is_active", true)
          .order("price_monthly_minor"),
      ]);
      services = (svcRes.data ?? []) as ServiceItem[];
      plans = (planRes.data ?? []) as PlanItem[];
    } catch {
      // Keep fallback
    }
  }

  // Fallbacks
  if (services.length === 0) {
    services = [
      { id: "1", slug: "dissertation-thesis-mentoring", title: "Dissertation & Thesis Mentoring", category: "Dissertation Support", price_from_minor: 4500000, currency: "NGN", delivery_mode: "project" },
      { id: "2", slug: "topic-proposal-development", title: "Topic & Proposal Development", category: "Dissertation Support", price_from_minor: 3000000, currency: "NGN", delivery_mode: "project" },
      { id: "3", slug: "literature-review-support", title: "Literature Review Support", category: "Dissertation Support", price_from_minor: 3500000, currency: "NGN", delivery_mode: "project" },
      { id: "4", slug: "research-design-ethics", title: "Research Design & Ethics Support", category: "Dissertation Support", price_from_minor: 3000000, currency: "NGN", delivery_mode: "project" },
      { id: "5", slug: "quantitative-data-analysis", title: "Quantitative Data Analysis", category: "Data Analysis", price_from_minor: 5000000, currency: "NGN", delivery_mode: "project" },
      { id: "6", slug: "qualitative-data-analysis", title: "Qualitative Data Analysis", category: "Data Analysis", price_from_minor: 4500000, currency: "NGN", delivery_mode: "project" },
      { id: "7", slug: "academic-editing-proofreading", title: "Academic Editing & Proofreading", category: "Editing & Writing Quality", price_from_minor: 2500000, currency: "NGN", delivery_mode: "session" },
      { id: "8", slug: "referencing-formatting-compliance", title: "Referencing & Formatting Compliance", category: "Editing & Writing Quality", price_from_minor: 1500000, currency: "NGN", delivery_mode: "session" },
      { id: "9", slug: "journal-article-conversion", title: "Journal Article Conversion", category: "Publishing & Career", price_from_minor: 6000000, currency: "NGN", delivery_mode: "project" },
      { id: "10", slug: "defense-presentation-coaching", title: "Defense & Presentation Coaching", category: "Coaching & Training", price_from_minor: 3500000, currency: "NGN", delivery_mode: "session" },
    ];
  }

  if (plans.length === 0) {
    plans = [
      { slug: "foundation", name: "Research Foundation", price_monthly_minor: 3500000, price_annual_minor: 35000000, currency: "NGN" },
      { slug: "advanced-scholar", name: "Advanced Scholar", price_monthly_minor: 6500000, price_annual_minor: 65000000, currency: "NGN" },
      { slug: "doctoral-completion", name: "Doctoral Completion", price_monthly_minor: 11000000, price_annual_minor: 110000000, currency: "NGN" },
    ];
  }

  return (
    <>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Pricing" }]} />

      <PageHero
        sectionLabel="Transparent Investment"
        headline="Transparent pricing for every stage of research."
        standfirst="Every service lists its starting price. The final price depends on your academic level, your timeline and the scope of support you need. Book a free call and we will give you a clear figure before you commit."
        cta={{ label: "Book a consultation", href: "/book" }}
        secondaryCta={{ label: "Explore membership plans", href: "/membership" }}
        image={{
          src: "/images/pricing/header.jpg",
          alt: "Transparent academic consulting fee schedules and scholarly project specifications",
          aspectRatio: "4:3",
          caption: "Transparent milestone pricing with no hidden charges or ghostwriting surcharges.",
        }}
      />

      <div className="site-container py-12 md:py-16 space-y-16 max-w-4xl ui-interface">
        {/* Services pricing table */}
        <section className="space-y-4">
          <SectionLabel label="Starting Investment by Service" />
          <h2 className="type-h2 text-tone-heading">Services & starting rates</h2>

          <div className="border border-tone-rule bg-white rounded-[2px] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm divide-y divide-tone-rule">
                <thead className="bg-paper font-serif text-tone-heading">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Service</th>
                    <th className="py-3 px-4 font-semibold">Delivery Mode</th>
                    <th className="py-3 px-4 font-semibold">From</th>
                    <th className="py-3 px-4 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-tone-rule">
                  {services.map((svc) => (
                    <tr key={svc.slug} className="hover:bg-cream/30 transition-colors">
                      <td className="py-3 px-4">
                        <Link
                          href={`/services/${svc.slug}`}
                          className="font-medium text-tone-heading hover:text-navy transition-colors"
                        >
                          {svc.title}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 bg-paper border border-tone-rule text-xs uppercase tracking-wider font-mono text-tone-muted rounded-[2px]">
                          {svc.delivery_mode}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-tone-body">
                        {formatCurrency(svc.price_from_minor, svc.currency)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/book?service=${svc.slug}`}
                          className="type-small font-semibold text-gold hover:text-navy transition-colors inline-flex items-center gap-1"
                        >
                          <span>Inquire</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Membership pricing */}
        <section className="space-y-4 pt-8 border-t border-tone-rule">
          <SectionLabel label="Monthly & Annual Membership Tiers" />
          <h2 className="type-h2 text-tone-heading">Ongoing membership tiers</h2>

          <div className="border border-tone-rule bg-white rounded-[2px] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm divide-y divide-tone-rule">
                <thead className="bg-paper font-serif text-tone-heading">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Membership Tier</th>
                    <th className="py-3 px-4 font-semibold">Monthly Rate</th>
                    <th className="py-3 px-4 font-semibold">Annual Rate</th>
                    <th className="py-3 px-4 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-tone-rule">
                  {plans.map((p) => (
                    <tr key={p.slug} className="hover:bg-cream/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-tone-heading">
                        {p.name}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-tone-body">
                        {formatCurrency(p.price_monthly_minor, p.currency)}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-tone-body">
                        {formatCurrency(p.price_annual_minor, p.currency)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/membership/join?plan=${p.slug}`}
                          className="type-small font-semibold text-gold hover:text-navy transition-colors inline-flex items-center gap-1"
                        >
                          <span>Select</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Pricing variables & mechanics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-tone-rule">
          <section className="space-y-3">
            <SectionLabel label="Pricing Factors & Scoping" />
            <h3 className="type-h3 text-tone-heading">What affects the final price</h3>
            <ul className="space-y-2 text-sm text-tone-muted">
              <li className="flex items-start gap-2">
                <span className="text-gold font-bold">&bull;</span>
                <span><strong>Academic degree level:</strong> Undergraduate, Masters thesis, or Doctoral dissertation.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold font-bold">&bull;</span>
                <span><strong>Methodological complexity:</strong> Standard regressions vs. longitudinal SEM, qualitative meta-synthesis.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold font-bold">&bull;</span>
                <span><strong>Draft volume:</strong> Individual chapter review vs. complete multi-chapter thesis audit.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold font-bold">&bull;</span>
                <span><strong>Pacing & Turnaround:</strong> Standard 5-day feedback cycles vs. expedited committee review requirements.</span>
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <SectionLabel label="Payment Security & Currency" />
            <h3 className="type-h3 text-tone-heading">Currencies & Payment Mechanics</h3>
            <div className="type-body text-tone-body space-y-3 leading-relaxed text-sm text-tone-muted">
              <p>
                Our default billing currency is Nigerian Naira (NGN). We process payments securely via Paystack, supporting international Mastercard, Visa, and direct bank transfers.
              </p>
              <p>
                International researchers may remit equivalent fees in US Dollars (USD). Contact our team if you require an authorized USD invoice.
              </p>
              <p>
                All completed transactions generate downloadable PDF invoices accessible directly inside your student dashboard.
              </p>
            </div>
          </section>
        </div>

        {/* Refunds & cancellation */}
        <section className="p-6 bg-paper border border-tone-rule rounded-[2px] space-y-2">
          <SectionLabel label="Institutional Refund Guarantee" />
          <h3 className="font-serif text-base text-tone-heading font-semibold">
            Refunds and cancellation policy summary
          </h3>
          <p className="text-sm text-tone-muted leading-relaxed">
            One-on-one sessions cancelled with more than 24 hours notice receive a 100% refund. Multi-milestone project packages include pro-rated refunds on uninitiated chapters. Memberships can be cancelled anytime with zero penalty fees. Read our full policy at{" "}
            <Link href="/legal/refunds" className="text-navy font-medium underline">
              GradEdge Refund Policy
            </Link>
            .
          </p>
        </section>
      </div>

      <MentorTeamBlock />

      <CtaStrip
        headline="Need a formal quotation for your thesis?"
        subtext="Schedule an introductory call. We will review your chapters and issue a fixed, transparent fee proposal."
        ctaLabel="Book a free consultation"
        ctaHref="/book"
      />
    </>
  );
}

