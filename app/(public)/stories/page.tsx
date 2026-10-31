import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";
import {
  PageHero,
  PageBreadcrumb,
  CtaStrip,
  ArrowRight,
} from "@/components/marketing/page-components";
import { SectionLabel } from "@/components/ui/editorial";

export const revalidate = 600;

export const metadata: Metadata = buildMetadata({
  title: "Student Stories & Scholarly Outcomes",
  description:
    "Real research journeys and thesis completion outcomes from postgraduate researchers mentored by GradEdge.",
  path: "/stories",
});

interface StoryItem {
  id: string;
  slug: string;
  headline: string | null;
  summary: string | null;
  student_display_name: string | null;
  study_level: string | null;
  field_of_study: string | null;
}

export default async function StudentStoriesIndexPage() {
  let stories: StoryItem[] = [];

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("student_stories")
        .select("id, slug, headline, summary, student_display_name, study_level, field_of_study")
        .eq("is_published", true)
        .eq("consent_confirmed", true)
        .order("created_at", { ascending: false });
      stories = (data ?? []) as StoryItem[];
    } catch {
      stories = [];
    }
  }

  // If no published stories with confirmed consent exist, show quiet note per specification
  if (stories.length === 0) {
    return (
      <>
        <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Student Stories" }]} />
        <div className="site-container py-24 max-w-2xl text-center space-y-4">
          <SectionLabel number={1} label="Student Outcomes" />
          <h1 className="type-h2 text-tone-heading">Student Stories</h1>
          <p className="type-body text-tone-muted leading-relaxed max-w-lg mx-auto">
            We publish student experiences only with explicit written consent to preserve academic confidentiality. We are currently compiling our first verified cohort outcomes.
          </p>
          <div className="pt-4">
            <Link
              href="/contact"
              className="type-small font-medium text-navy hover:text-tone-heading border-b border-navy/30 pb-0.5"
            >
              Contact our team to learn more
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Student Stories" }]} />

      <PageHero
        sectionNumber={1}
        sectionLabel="Verified Outcomes"
        headline="From students who did the work."
        standfirst="We publish student experiences only when they have given explicit written consent. These are real outcomes from doctoral and masters researchers."
      />

      <div className="site-container py-12 md:py-16 space-y-12 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stories.map((story) => (
            <article
              key={story.slug}
              className="p-8 bg-white border border-tone-rule rounded-[2px] flex flex-col justify-between space-y-4 hover:border-navy transition-colors"
            >
              <div className="space-y-3">
                <span className="type-micro text-gold">
                  {story.study_level ? `${story.study_level} &bull; ` : ""}
                  {story.field_of_study ?? "Research"}
                </span>
                {story.headline && (
                  <h3 className="font-serif text-xl text-tone-heading font-semibold">
                    &ldquo;{story.headline}&rdquo;
                  </h3>
                )}
                {story.summary && (
                  <p className="text-sm text-tone-muted leading-relaxed">
                    {story.summary}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-tone-rule flex items-center justify-between">
                <span className="text-xs font-semibold text-tone-heading">
                  {story.student_display_name ?? "GradEdge Scholar"}
                </span>
                <Link
                  href={`/stories/${story.slug}`}
                  className="text-xs font-medium text-gold hover:text-navy flex items-center gap-1"
                >
                  <span>Read case study</span>
                  <ArrowRight />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      <CtaStrip
        headline="Begin your own research milestone."
        subtext="Schedule an introductory call. We will review your project and discuss your expected timeline."
        ctaLabel="Book a free consultation"
        ctaHref="/book"
      />
    </>
  );
}

