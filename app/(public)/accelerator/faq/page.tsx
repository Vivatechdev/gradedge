import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";
import {
  PageHero,
  PageBreadcrumb,
  CtaStrip,
} from "@/components/marketing/page-components";
import { AccordionItem, Accordion } from "@/components/ui/accordion";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Dissertation Accelerator FAQ — Questions & Admissions Criteria",
  description:
    "Frequently asked questions about the nine-month Dissertation Accelerator program: eligibility, pacing, mentor matching, and refund policies.",
  path: "/accelerator/faq",
});

export default async function AcceleratorFaqPage() {
  const defaultFaqs = [
    {
      q: "Is this for Masters students as well as PhD students?",
      a: "The program is primarily calibrated for doctoral candidates who need sustained, chapter-by-chapter guidance. However, Masters scholars undertaking an extended thesis (over 20,000 words) with complex empirical methodology are welcome to apply and will be evaluated individually.",
    },
    {
      q: "What happens if I fall behind on the monthly milestones?",
      a: "Life and academic duties create unforeseen delays. We build in scheduled pause windows. If personal or professional events necessitate pausing for a month, your cohort place can be held without forfeiture.",
    },
    {
      q: "Can I apply if I am already mid-way through my dissertation?",
      a: "Yes. Many scholars enter after completing their proposal or when struggling with an extensive data analysis chapter. We evaluate your existing drafts and align the nine-month milestones directly with your remaining chapters.",
    },
    {
      q: "Do I get to choose my mentor?",
      a: "To ensure rigorous quality control and methodological compatibility, our academic directors perform mentor matching based on discipline, epistemological paradigm, and data analysis software. Once matched, your advisor's credentials appear in your student portal.",
    },
    {
      q: "What is the tuition and withdrawal policy?",
      a: "If accepted and tuition is remitted, you may withdraw prior to your initial onboarding milestone for a full refund. Once mentor onboarding commences, refunds follow our formal pro-rated policy outlined in our Terms of Service.",
    },
    {
      q: "How does this differ from booking individual mentoring sessions?",
      a: "Individual sessions address tactical, immediate questions. The Accelerator establishes a sustained nine-month developmental partnership with a single discipline specialist who develops deep familiarity with your entire argument, data, and committee feedback.",
    },
  ];

  let faqs = defaultFaqs;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("faqs")
        .select("question, answer")
        .eq("is_published", true)
        .ilike("category", "%accelerator%")
        .order("sort_order");
      if (data && data.length > 0) {
        faqs = data.map((f) => ({ q: f.question, a: f.answer }));
      }
    } catch {
      // Use fallback
    }
  }

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Dissertation Accelerator", href: "/accelerator" },
          { label: "FAQ" },
        ]}
      />

      <PageHero
        sectionNumber={1}
        sectionLabel="Admissions FAQ"
        headline="Accelerator programme: common questions."
        standfirst="Review criteria, cohort logistics, mentor matching mechanics, and academic expectations before applying."
        cta={{ label: "Apply for the next cohort", href: "/accelerator/apply" }}
        secondaryCta={{ label: "View curriculum overview", href: "/accelerator" }}
      />

      <div className="site-container py-12 md:py-16 max-w-3xl space-y-8">
        <Accordion>
          {faqs.map((item, idx) => (
            <AccordionItem key={idx} title={item.q} defaultOpen={idx === 0}>
              <div className="prose prose-sm text-tone-muted leading-relaxed">
                {item.a}
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <CtaStrip
        headline="Ready to submit your application?"
        subtext="Complete the 15-minute admissions application to be evaluated for our upcoming cohort."
        ctaLabel="Apply for the Accelerator"
        ctaHref="/accelerator/apply"
      />
    </>
  );
}

