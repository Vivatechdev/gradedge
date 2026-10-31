import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ServiceCategoryView } from "@/components/marketing/service-category-view";
import { getServicesByCategory } from "@/lib/data/services-content";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Data Analysis Services — Quantitative, Qualitative & SEM",
  description:
    "Expert academic data analysis mentoring in SPSS, R, Stata, Python, NVivo, and SmartPLS. We audit assumptions, guide syntax execution, and teach output interpretation.",
  path: "/services/data-analysis",
});

export default function DataAnalysisCategoryPage() {
  const services = getServicesByCategory("data-analysis");

  const faqs = [
    {
      question: "Do you manipulate data or guarantee statistically significant results?",
      answer:
        "No. Data fabrication and p-hacking violate basic scientific integrity. We teach you how to clean data transparently, audit parametric assumptions, execute valid tests, and report null or unexpected findings with scholarly authority.",
    },
    {
      question: "Which statistical software programs do your mentors support?",
      answer:
        "We support R / RStudio, IBM SPSS Statistics, Stata, Python (pandas, statsmodels), SmartPLS 4, AMOS, and JASP/Jamovi.",
    },
    {
      question: "Can you help me build qualitative codebooks in NVivo or ATLAS.ti?",
      answer:
        "Yes. We guide you in setting up case classifications, organizing hierarchical parent-child nodes, maintaining audit trails, and executing matrix queries.",
    },
  ];

  return (
    <ServiceCategoryView
      categorySlug="data-analysis"
      categoryName="Data Analysis"
      headerImage="/images/services/stage-research.jpg"
      headerImageAlt="Open statistical software syntax scripts, regression output tables, and econometric data notebooks"
      headline="Methodological rigor for quantitative, qualitative, and mixed data."
      intro="Statistical syntax auditing, assumption diagnostics, qualitative coding hierarchy reviews, and APA-compliant results presentation. We teach you to interpret your data with complete confidence."
      services={services}
      faqs={faqs}
    />
  );
}
