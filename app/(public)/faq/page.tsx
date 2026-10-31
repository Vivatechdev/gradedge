import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";
import {
  PageHero,
  PageBreadcrumb,
  CtaStrip,
} from "@/components/marketing/page-components";
import { FaqSearch, type FaqItemType } from "@/components/marketing/FaqSearch";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Frequently Asked Questions — GradEdge Academic Solutions",
  description:
    "Comprehensive FAQ covering mentor matching, written feedback cycles, pricing, academic integrity, and confidentiality.",
  path: "/faq",
});

export default async function FullFaqPage() {
  const defaultFaqs: FaqItemType[] = [
    {
      id: "1",
      category: "Getting started",
      question: "Do I need to know what service I want before I book?",
      answer: "No. Book a free twenty-minute consultation and tell us where you are in your research. We will review your degree requirements, deadline, and bottlenecks, and suggest an appropriate service or package.",
    },
    {
      id: "2",
      category: "Getting started",
      question: "How long does it take to get matched with a mentor?",
      answer: "Most scholars are matched within two working days of their initial consultation or payment confirmation. For highly specialized methodologies, matching takes at most three to four working days.",
    },
    {
      id: "3",
      category: "How we work",
      question: "What does a feedback session look like?",
      answer: "Prior to consultation or review, you submit your draft or statistical syntax through your student dashboard. Your mentor conducts a line-level audit and provides detailed written feedback. During consultations, you review these notes and establish immediate revision priorities.",
    },
    {
      id: "4",
      category: "How we work",
      question: "How do I submit work for review?",
      answer: "Submissions occur through your secure student portal. You upload your chapter manuscript (Word or PDF), analysis dataset (SPSS, R script, CSV), or questionnaire. All feedback archives remain permanently accessible in your portal.",
    },
    {
      id: "5",
      category: "Pricing & payment",
      question: "How are your prices structured and what currencies are supported?",
      answer: "All services feature transparent, fixed milestone pricing listed in Nigerian Naira (NGN) and US Dollars (USD). The price quoted for your chapter or package is the exact total you pay, with zero hidden administrative fees, surprise surcharges, or billable hourly overruns.",
    },
    {
      id: "6",
      category: "Pricing & payment",
      question: "Can I get a refund if I need to cancel?",
      answer: "One-on-one sessions cancelled with more than 24 hours notice receive a full refund. Multi-milestone project packages include pro-rated refunds on uninitiated chapters. Memberships can be cancelled anytime with zero penalty fees.",
    },
    {
      id: "7",
      category: "Academic integrity",
      question: "Is using GradEdge considered academic misconduct?",
      answer: "No. Developmental mentoring and feedback are standard components of scholarly training worldwide. We adhere strictly to institutional ethics: mentors provide critique and methodological guidance, but all writing and rewriting is performed solely by the student.",
    },
    {
      id: "8",
      category: "Academic integrity",
      question: "Will my university know I used GradEdge?",
      answer: "We treat all engagements with strict confidentiality. We never disclose client identities, institutional affiliations, or research data to third parties or university departments without your explicit written request.",
    },
    {
      id: "9",
      category: "Mentor matching",
      question: "Why are mentor profiles not listed on the public website?",
      answer: "To prevent unsolicited solicitations and preserve academic privacy, our mentor roster is strictly private. Every mentor holds an advanced postgraduate degree (Masters or PhD) in their discipline. Once a mentor is matched to your project, you can view their credentials inside your dashboard.",
    },
  ];

  let faqs = defaultFaqs;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("faqs")
        .select("id, category, question, answer")
        .eq("is_published", true)
        .order("sort_order");
      if (data && data.length > 0) {
        faqs = data as FaqItemType[];
      }
    } catch {
      // Keep defaults
    }
  }

  return (
    <>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />

      <PageHero
        sectionNumber={1}
        sectionLabel="Knowledge Base"
        headline="Frequently asked questions."
        standfirst="Clear answers regarding our mentoring approach, academic integrity rules, pricing, and confidentiality. If your question is not addressed here, contact our advisory team directly."
        cta={{ label: "Book a consultation", href: "/book" }}
        secondaryCta={{ label: "Contact our team", href: "/contact" }}
        image={{
          src: "/images/faq/header.jpg",
          alt: "Annotated manuscript pages and methodology guidelines with handwritten academic margin notes",
          aspectRatio: "21:9",
          caption: "Honest, comprehensive answers about how we mentor, review, and collaborate with scholars.",
        }}
      />

      <div className="site-container py-12 md:py-16 max-w-3xl">
        <FaqSearch faqs={faqs} />
      </div>

      <CtaStrip
        headline="Still have questions about your thesis?"
        subtext="Schedule an introductory call. We will review your departmental guidelines and explain how our mentoring fits your schedule."
        ctaLabel="Book a free consultation"
        ctaHref="/book"
      />
    </>
  );
}

