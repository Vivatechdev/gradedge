import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";
import { PageBreadcrumb, CtaStrip } from "@/components/marketing/page-components";
import { PullQuote, SectionLabel } from "@/components/ui/editorial";

export const revalidate = 600;
export const dynamicParams = true;

interface StoryFull {
  id: string;
  slug: string;
  headline: string | null;
  summary: string | null;
  student_display_name: string | null;
  study_level: string | null;
  field_of_study: string | null;
  institution_display: string | null;
}

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("student_stories")
      .select("slug")
      .eq("is_published", true)
      .eq("consent_confirmed", true);
    return (data ?? []).map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return buildMetadata({
    title: "Student Research Outcome",
    description: "Verified graduate research outcome from GradEdge Academic Solutions.",
    path: `/stories/${slug}`,
  });
}

export default async function StoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let story: StoryFull | null = null;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("student_stories")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .eq("consent_confirmed", true)
        .single();
      if (data) {
        story = data as StoryFull;
      }
    } catch {
      story = null;
    }
  }

  if (!story) {
    notFound();
  }

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Student Stories", href: "/stories" },
          { label: story.student_display_name ?? "Scholar Outcome" },
        ]}
      />

      <article className="site-container py-12 md:py-20 max-w-3xl space-y-8">
        <header className="space-y-4 pb-8 border-b border-tone-rule">
          <SectionLabel number={1} label="Verified Outcome" />
          <div className="flex items-center gap-2 text-xs text-tone-muted">
            <span className="font-semibold text-tone-heading">
              {story.student_display_name ?? "GradEdge Scholar"}
            </span>
            <span>&bull;</span>
            <span className="uppercase">{story.study_level ?? "Postgraduate"}</span>
            {story.field_of_study && (
              <>
                <span>&bull;</span>
                <span>{story.field_of_study}</span>
              </>
            )}
          </div>
          {story.headline && (
            <h1 className="type-h1 text-tone-heading leading-tight">
              &ldquo;{story.headline}&rdquo;
            </h1>
          )}
        </header>

        {story.summary && (
          <PullQuote
            quote={story.summary}
            attribution={story.student_display_name ?? "GradEdge Candidate"}
            role={story.field_of_study ?? "Postgraduate Researcher"}
          />
        )}

        <div className="pt-8 border-t border-tone-rule">
          <CtaStrip
            headline="Start your own research milestone."
            subtext="Book a confidential consultation with an academic advisor in your discipline."
            ctaLabel="Book a free consultation"
            ctaHref="/book"
          />
        </div>
      </article>
    </>
  );
}

