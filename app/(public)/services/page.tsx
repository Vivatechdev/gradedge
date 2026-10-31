import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import {
  PageHero,
  PageBreadcrumb,
  MentorTeamBlock,
  CtaStrip,
  ArrowRight,
} from "@/components/marketing/page-components";
import { SectionLabel } from "@/components/ui/editorial";
import { Button } from "@/components/ui/button";
import { ServiceSelector } from "@/components/marketing/service-selector";
import {
  getAllServices,
  CATEGORY_METADATA,
  type ServiceContentItem,
} from "@/lib/data/services-content";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "All Research Mentoring & Coaching Services — GradEdge",
  description:
    "Expert academic mentoring and coaching across every stage of graduate research. Explore our 20 services spanning dissertation support, data analysis, editing, publishing, and defense coaching.",
  path: "/services",
});

export default function ServicesIndexPage() {
  const allServices = getAllServices();
  const categoryKeys = Object.keys(CATEGORY_METADATA) as Array<ServiceContentItem["category"]>;

  return (
    <>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Services" }]} />

      <PageHero
        sectionNumber={1}
        sectionLabel="Service Catalog"
        headline="Academic support matched to where you are in your research."
        standfirst="We mentor Master's and doctoral scholars across every phase of inquiry — from initial research questions and proposal formulation through statistical modeling, line-level editing, and oral defense."
        cta={{ label: "Find your service (3 questions)", href: "#service-selector" }}
        secondaryCta={{ label: "Book a free 20-min call", href: "/book" }}
        image={{
          src: "/images/services/stage-start.jpg",
          alt: "Annotated thesis proposal drafts, reference style manuals, and research notes",
          aspectRatio: "21:9",
          caption: "Structured developmental feedback cycles across every stage of the research lifecycle.",
        }}
      />

      <div className="site-container py-12 md:py-16 space-y-20 max-w-5xl">
        {/* ── 3-QUESTION SERVICE SELECTOR TOOL ─────────────────────────────────── */}
        <section aria-labelledby="selector-heading" className="space-y-4">
          <div className="space-y-1">
            <span className="type-micro text-gold">Recommendation Tool</span>
            <h2 id="selector-heading" className="font-serif text-2xl sm:text-3xl font-medium text-tone-heading">
              Find your ideal service in three quick questions
            </h2>
            <p className="text-xs sm:text-sm text-tone-muted max-w-2xl">
              Answer three brief questions about your research stage, primary bottleneck, and deadline to receive a tailored recommendation with exact rationales.
            </p>
          </div>

          <ServiceSelector />
        </section>

        {/* ── 5 CATEGORY SERVICE GROUPS ────────────────────────────────────────── */}
        <div className="space-y-16">
          {/* Milestone Quick Jump Strip */}
          <div className="border border-tone-rule bg-cream/50 p-4 rounded-[2px] space-y-2">
            <span className="type-micro text-tone-muted block">Browse by Research Milestone</span>
            <div className="flex flex-wrap items-center gap-2">
              {categoryKeys.map((catKey) => (
                <a
                  key={catKey}
                  href={`#category-${catKey}`}
                  className="px-3 py-1.5 rounded-[2px] text-xs font-medium border border-tone-rule bg-white hover:bg-cream transition-colors text-tone-body hover:text-navy"
                >
                  {CATEGORY_METADATA[catKey].name}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-20">
            {categoryKeys.map((catKey, index) => {
              const catMeta = CATEGORY_METADATA[catKey];
              const catServices = allServices.filter((s) => s.category === catKey);

              return (
                <section key={catKey} id={`category-${catKey}`} className="scroll-mt-24 space-y-6">
                {/* Category Header */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-tone-rule pb-3 gap-2">
                  <div className="space-y-1">
                    <SectionLabel number={index + 1} label={catMeta.name} />
                    <p className="text-xs text-tone-muted max-w-xl">{catMeta.description}</p>
                  </div>
                  <Link
                    href={`/services/${catKey}`}
                    className="type-small text-navy hover:text-gold transition-colors font-medium flex items-center gap-1.5 shrink-0"
                  >
                    <span>Explore category page</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Services in Category */}
                <div className="divide-y divide-tone-rule border-b border-tone-rule">
                  {catServices.map((svc) => (
                    <div
                      key={svc.slug}
                      className="py-5 px-3 -mx-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 group hover:bg-cream/40 transition-colors rounded-[2px]"
                    >
                      <div className="space-y-1.5 max-w-2xl">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-mono tracking-wider text-tone-muted">
                            {svc.format_text}
                          </span>
                        </div>
                        <h3 className="font-serif text-lg sm:text-xl text-tone-heading font-medium group-hover:text-navy transition-colors">
                          <Link href={`/services/${svc.slug}`}>{svc.title}</Link>
                        </h3>
                        <p className="text-xs text-tone-muted leading-relaxed line-clamp-2">
                          {svc.two_sentence_promise}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 sm:text-right pt-2 sm:pt-0">
                        <div>
                          <span className="text-[10px] text-tone-muted block uppercase tracking-wider">From</span>
                          <span className="font-serif font-semibold text-tone-heading text-sm sm:text-base">
                            ₦{svc.starting_price_ngn.toLocaleString()}{" "}
                            <span className="text-tone-muted font-normal text-xs">/ ${svc.starting_price_usd}</span>
                          </span>
                        </div>
                        <Link
                          href={`/services/${svc.slug}`}
                          className="w-8 h-8 rounded-full border border-tone-rule flex items-center justify-center text-tone-muted group-hover:border-navy group-hover:text-navy group-hover:bg-white transition-colors shrink-0"
                          aria-label={`View syllabus for ${svc.title}`}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* ── FLAGSHIP ACCELERATOR BLOCK ───────────────────────────────────────── */}
        <div
          data-tone="navy-deep"
          className="tone-navy-deep bg-navy-deep border-t-2 border-t-gold p-8 md:p-12 text-tone-body rounded-[2px] space-y-6"
        >
          <div className="space-y-2">
            <span className="type-micro text-gold">Cohort Mentorship</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-tone-heading font-medium">
              The 9-Month Dissertation Accelerator Program
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-tone-body max-w-2xl leading-relaxed">
            Our comprehensive cohort program for doctoral scholars. Combines structured bi-weekly 1-on-1 milestone mentoring, methodological audits on every chapter draft, and defense simulations within a 9-month completion trajectory.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button variant="accent" size="lg" href="/accelerator">
              Explore the Accelerator Program
            </Button>
            <Button variant="secondary" size="md" href="/accelerator/apply">
              Apply for Next Cohort
            </Button>
          </div>
        </div>
      </div>

      <MentorTeamBlock />

      <CtaStrip
        tone="navy"
        sectionNumber={6}
        sectionLabel="Next Step"
        headline="Still uncertain which service addresses your bottleneck?"
        standfirst="Schedule an introductory call. We will review your thesis requirements, timeline, and current drafts to advise on the most effective support structure."
        primaryCta={{ label: "Book a free 20-min call", href: "/book" }}
        secondaryCta={{ label: "Contact our team", href: "/contact" }}
        image={{
          src: "/images/home/cta.jpg",
          alt: "Academic research books, open thesis draft, and stationery on a university study desk",
          aspectRatio: "16:9",
          caption: "Confidential academic mentoring tailored to your research discipline.",
        }}
      />
    </>
  );
}
