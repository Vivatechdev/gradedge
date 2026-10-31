import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ServiceCategoryView } from "@/components/marketing/service-category-view";
import { getServicesByCategory } from "@/lib/data/services-content";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Dissertation Support Services — Doctoral & Master's Mentoring",
  description:
    "Comprehensive academic mentoring across all dissertation chapters: research questions, proposal development, literature review, methodology, and defense preparation.",
  path: "/services/dissertation-support",
});

export default function DissertationSupportCategoryPage() {
  const services = getServicesByCategory("dissertation-support");

  const faqs = [
    {
      question: "Do you write the dissertation for me?",
      answer:
        "No. GradEdge operates strictly under international academic integrity codes. We provide developmental annotations, structural critiques, and one-on-one strategy calls to train you to write and defend your own research with authority.",
    },
    {
      question: "Can I start mentoring if I only have a general topic in mind?",
      answer:
        "Yes. Our Topic & Proposal Development service is designed specifically for researchers who have not yet finalized their research questions or conceptual framework.",
    },
    {
      question: "How long does a typical chapter review take?",
      answer:
        "Standard chapter reviews take 5 to 7 working days. You receive an annotated Word manuscript with line-level Track Changes, an Executive Revision Brief, and a 60-minute video strategy consultation.",
    },
  ];

  return (
    <ServiceCategoryView
      categorySlug="dissertation-support"
      categoryName="Dissertation Support"
      headerImage="/images/services/stage-writing.jpg"
      headerImageAlt="Doctoral thesis manuscripts and research binders organized on a university library desk"
      headline="Mentoring across every chapter of your dissertation."
      intro="From bounded research questions and theoretical frameworks to complete chapter drafts. Structured written feedback cycles and milestone accountability for graduate scholars."
      services={services}
      faqs={faqs}
    />
  );
}
