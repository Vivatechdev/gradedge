import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import { PageBreadcrumb, CtaStrip } from "@/components/marketing/page-components";
import { ServiceDetailView } from "@/components/marketing/service-detail-view";
import {
  getAllServices,
  getServiceBySlug,
  getRelatedServices,
} from "@/lib/data/services-content";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const services = getAllServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return buildMetadata({
      title: "Service Not Found",
      description: "Academic service details.",
      path: `/services/${slug}`,
    });
  }

  return buildMetadata({
    title: service.seo.meta_title,
    description: service.seo.meta_description,
    path: `/services/${slug}`,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const relatedServices = getRelatedServices(slug, 3);

  // Relevant blog posts
  const relatedPosts = [
    {
      slug: "navigating-supervisor-feedback",
      title: "How to Decode and Address Ambiguous Supervisor Feedback",
      standfirst: "A pragmatic framework for translating contradictory committee comments into clear revision milestones.",
      reading_time_minutes: 6,
    },
    {
      slug: "avoiding-methodological-drift",
      title: "Avoiding Methodological Drift Between Proposal and Defense",
      standfirst: "Why research questions and analytical tests fall out of alignment, and how to maintain strict conceptual concordance.",
      reading_time_minutes: 8,
    },
    {
      slug: "how-to-structure-dissertation-chapters",
      title: "Chapter-by-Chapter Architecture for Empirical Theses",
      standfirst: "The essential connective tissue linking introduction, literature, methodology, findings, and discussion.",
      reading_time_minutes: 7,
    },
  ];

  // Service structured data (JSON-LD) with NO address or country as specified
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.hero_summary,
    "provider": {
      "@type": "Organization",
      "name": "GradEdge Academic Solutions",
      "url": "https://gradedge.org",
    },
    "serviceType": service.category_name,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": service.starting_price_usd,
      "availability": "https://schema.org/InStock",
      "url": `https://gradedge.org/services/${service.slug}`,
    },
  };

  // FAQ structured data (JSON-LD)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": service.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.category_name, href: `/services/${service.category}` },
          { label: service.title },
        ]}
      />

      {/* Main Service Detail Interactive View */}
      <ServiceDetailView
        service={service}
        relatedServices={relatedServices}
        relatedPosts={relatedPosts}
      />

      {/* Closing CTA Band on Navy Tone */}
      <CtaStrip
        tone="navy"
        sectionNumber={10}
        sectionLabel="Next Step"
        headline="Ready to advance your research milestone?"
        standfirst="Book a free 20-minute consultation with our academic advisory team. We review where you are in your research and agree on the right feedback schedule."
        primaryCta={{ label: "Book a free 20-minute call", href: `/book?service=${service.slug}` }}
        secondaryCta={{ label: "Request support quote", href: `/contact?subject=Service Inquiry: ${service.title}` }}
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
