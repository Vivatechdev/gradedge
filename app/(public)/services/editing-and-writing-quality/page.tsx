import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ServiceCategoryView } from "@/components/marketing/service-category-view";
import { getServicesByCategory } from "@/lib/data/services-content";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Academic Editing & Writing Quality Services — GradEdge",
  description:
    "Substantive developmental editing, referencing style compliance, and similarity report coaching for graduate researchers and academic authors.",
  path: "/services/editing-and-writing-quality",
});

export default function EditingAndWritingQualityCategoryPage() {
  const services = getServicesByCategory("editing-and-writing-quality");

  const faqs = [
    {
      question: "How does developmental editing differ from basic proofreading?",
      answer:
        "Basic proofreading only corrects spelling and commas. Developmental academic editing refines sentence rhythm, strengthens transitions between paragraphs, eliminates scholarly ambiguity, and ensures appropriate disciplinary tone while preserving your authentic authorial voice.",
    },
    {
      question: "Do you verify citation concordance between text and bibliography?",
      answer:
        "Yes. Our Referencing & Style Compliance service cross-checks every in-text citation against your bibliography, flags orphan entries, verifies DOIs, and formats citations according to APA 7, Harvard, Chicago, or Vancouver.",
    },
    {
      question: "Can you help me lower a high similarity report percentage?",
      answer:
        "Yes, through legitimate scholarly coaching. We examine flagged strings to distinguish between benign boilerplate and problematic overlap, then teach you multi-source conceptual paraphrasing without using deceptive AI rewriters.",
    },
  ];

  return (
    <ServiceCategoryView
      categorySlug="editing-and-writing-quality"
      categoryName="Editing & Writing Quality"
      headerImage="/images/services/stage-writing.jpg"
      headerImageAlt="Academic thesis draft with line-level editorial marks, style manual, and citation reference lists"
      headline="Clarity, precision, and scholarly authority in every paragraph."
      intro="Substantive academic editing, citation concordance verification, and ethical paraphrasing coaching. We ensure your dissertation meets university press standards while protecting your intellectual voice."
      services={services}
      faqs={faqs}
    />
  );
}
