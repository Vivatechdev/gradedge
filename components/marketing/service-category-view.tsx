import React from "react";
import Link from "next/link";
import { PageHero, PageBreadcrumb, CtaStrip, ArrowRight } from "@/components/marketing/page-components";
import { Photo } from "@/components/ui/photo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ServiceContentItem } from "@/lib/data/services-content";

interface CategoryFaq {
  question: string;
  answer: string;
}

interface ServiceCategoryViewProps {
  categorySlug: string;
  categoryName: string;
  headerImage: string;
  headerImageAlt: string;
  headline: string;
  intro: string;
  services: ServiceContentItem[];
  faqs: CategoryFaq[];
}

export function ServiceCategoryView({
  categoryName,
  headerImage,
  headerImageAlt,
  headline,
  intro,
  services,
  faqs,
}: ServiceCategoryViewProps) {
  return (
    <>
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: categoryName },
        ]}
      />

      <PageHero
        sectionNumber={1}
        sectionLabel={categoryName}
        headline={headline}
        standfirst={intro}
        cta={{ label: "Book a free 20-min call", href: "/book" }}
        secondaryCta={{ label: "Explore all services", href: "/services" }}
        image={{
          src: headerImage,
          alt: headerImageAlt,
          aspectRatio: "21:9",
          caption: intro,
        }}
      />

      <div className="site-container py-12 md:py-16 space-y-16">
        {/* Editorial Index of Services */}
        <div className="space-y-6">
          <div className="border-b border-tone-rule pb-3 flex items-baseline justify-between">
            <span className="type-micro text-tone-muted">
              Services in {categoryName} ({services.length})
            </span>
            <span className="text-xs text-tone-muted">Click any service to view full syllabus & deliverables</span>
          </div>

          <div className="divide-y divide-tone-rule border-b border-tone-rule">
            {services.map((service, index) => (
              <div
                key={service.slug}
                className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center group hover:bg-cream/30 -mx-4 px-4 transition-colors"
              >
                {/* Thumbnail */}
                <div className="md:col-span-3">
                  <div className="border border-tone-rule rounded-[2px] overflow-hidden">
                    <Photo
                      src={service.hero_image}
                      alt={service.hero_image_alt}
                      aspectRatio="3:2"
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="md:col-span-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-gold">0{index + 1}</span>
                    <span className="text-[11px] text-tone-muted uppercase tracking-wider">
                      {service.format_text}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl text-tone-heading font-medium">
                    <Link
                      href={`/services/${service.slug}`}
                      className="group-hover:text-navy transition-colors"
                    >
                      {service.title}
                    </Link>
                  </h3>
                  <p className="text-xs sm:text-sm text-tone-muted leading-relaxed">
                    {service.two_sentence_promise}
                  </p>
                </div>

                {/* Price & Action */}
                <div className="md:col-span-3 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2">
                  <div className="text-left md:text-right">
                    <span className="text-[11px] text-tone-muted block">From</span>
                    <span className="font-serif text-lg font-semibold text-tone-heading block">
                      ₦{service.starting_price_ngn.toLocaleString()}{" "}
                      <span className="text-tone-muted text-xs font-normal">/ ${service.starting_price_usd}</span>
                    </span>
                  </div>
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-navy hover:text-gold transition-colors pt-1"
                    aria-label={`View syllabus for ${service.title}`}
                  >
                    <span>Full syllabus & pricing</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* "Not Sure Which Service You Need?" Panel */}
        <div className="p-8 sm:p-10 bg-cream border border-gold/40 rounded-[2px] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <Badge variant="gold">Interactive Service Finder</Badge>
            <h3 className="font-serif text-2xl text-tone-heading font-medium">
              Not sure which service matches your exact research bottleneck?
            </h3>
            <p className="text-xs sm:text-sm text-tone-body leading-relaxed">
              Use our quick 3-question selector. We analyze where you are in your research and your deadline to recommend the exact service or package you need.
            </p>
          </div>
          <Button variant="primary" size="md" href="/services#service-selector">
            Use the 3-Question Finder &rarr;
          </Button>
        </div>

        {/* Category FAQs */}
        {faqs.length > 0 && (
          <div className="space-y-6 pt-6 border-t border-tone-rule max-w-3xl">
            <div className="space-y-2">
              <span className="type-micro text-tone-muted">Category Questions</span>
              <h3 className="font-serif text-2xl text-tone-heading font-medium">
                Common questions about {categoryName.toLowerCase()}
              </h3>
            </div>

            <div className="divide-y divide-tone-rule border-y border-tone-rule">
              {faqs.map((faq, i) => (
                <details key={i} className="group py-4 cursor-pointer">
                  <summary className="flex items-center justify-between font-serif text-base sm:text-lg text-tone-heading font-medium hover:text-navy transition-colors list-none">
                    <span>{faq.question}</span>
                    <span className="text-gold text-lg transition-transform group-open:rotate-45 ml-4 shrink-0">
                      +
                    </span>
                  </summary>
                  <div className="pt-3 pr-8 text-xs sm:text-sm text-tone-body leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}
      </div>

      <CtaStrip
        tone="navy"
        sectionNumber={6}
        sectionLabel="Next Step"
        headline="Discuss your research with our academic advisory team"
        standfirst="Schedule a free 20-minute consultation. We review your current draft, institutional requirements, and advise on the most suitable service."
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

