import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ServiceCategoryView } from "@/components/marketing/service-category-view";
import { getServicesByCategory } from "@/lib/data/services-content";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Publishing & Academic Career Services — GradEdge",
  description:
    "Convert dissertation chapters into peer-reviewed journal articles, target indexed journals, respond to reviewers, and craft competitive research grant proposals.",
  path: "/services/publishing-and-career",
});

export default function PublishingAndCareerCategoryPage() {
  const services = getServicesByCategory("publishing-and-career");

  const faqs = [
    {
      question: "How do I turn a 50-page dissertation chapter into a 7,000-word journal article?",
      answer:
        "Dissertations prove breadth; journal articles argue a single tight contribution. We provide a structural condensation blueprint showing exactly which background sections to prune and how to position your empirical findings for journal audiences.",
    },
    {
      question: "How do you help us avoid predatory open-access publishers?",
      answer:
        "We verify genuine current indexing in Scopus and Web of Science, examine editorial board credentials, check inclusion in the DOAJ, and cross-reference journals against known predatory publishing lists.",
    },
    {
      question: "Can you help write responses to harsh peer reviewer comments?",
      answer:
        "Yes. We help you structure a diplomatic, point-by-point response letter that addresses every referee query with academic poise while maintaining your intellectual ground.",
    },
  ];

  return (
    <ServiceCategoryView
      categorySlug="publishing-and-career"
      categoryName="Publishing & Career"
      headerImage="/images/services/stage-publishing.jpg"
      headerImageAlt="Peer-reviewed scholarly journals, published proofs, and research grant funding applications"
      headline="From doctoral dissertation to peer-reviewed publication."
      intro="Condense thesis chapters into high-impact journal manuscripts, target indexed Scopus and Web of Science outlets, craft persuasive grant applications, and navigate peer review."
      services={services}
      faqs={faqs}
    />
  );
}
