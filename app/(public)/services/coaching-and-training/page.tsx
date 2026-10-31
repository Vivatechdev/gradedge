import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ServiceCategoryView } from "@/components/marketing/service-category-view";
import { getServicesByCategory } from "@/lib/data/services-content";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Academic Coaching & Skills Training Services — GradEdge",
  description:
    "Simulated oral defense (viva) coaching, research productivity sprints, 1-on-1 software intensives, and academic career job market preparation.",
  path: "/services/coaching-and-training",
});

export default function CoachingAndTrainingCategoryPage() {
  const services = getServicesByCategory("coaching-and-training");

  const faqs = [
    {
      question: "What happens during a simulated mock oral defense (viva)?",
      answer:
        "We review your dissertation summary and defense slides, formulate 25 discipline-specific committee questions, and conduct a 90-minute live simulated examination with a detailed debrief on your verbal defense strategy.",
    },
    {
      question: "How does research productivity coaching work?",
      answer:
        "We analyze your daily writing habits, break overwhelming 80,000-word projects into 90-minute focus sprints, and provide bi-weekly 1-on-1 milestone accountability calls to maintain thesis momentum.",
    },
    {
      question: "Can we use my actual research dataset during software intensives?",
      answer:
        "Yes. In our 1-on-1 software intensives, you share an anonymized version of your research dataset and we write and debug syntax scripts together in real time.",
    },
  ];

  return (
    <ServiceCategoryView
      categorySlug="coaching-and-training"
      categoryName="Coaching & Training"
      headerImage="/images/services/stage-start.jpg"
      headerImageAlt="Doctoral defense presentation room, oral examination notes, and one-on-one academic coaching"
      headline="Practical skills, defense confidence, and research momentum."
      intro="Simulated mock viva examinations, slide deck audits, hands-on software intensives, and bi-weekly milestone accountability to help you finish your graduate degree on schedule."
      services={services}
      faqs={faqs}
    />
  );
}
