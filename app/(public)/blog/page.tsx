import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";
import {
  PageHero,
  PageBreadcrumb,
  PublicEmptyState,
  ArrowRight,
} from "@/components/marketing/page-components";
import { SectionLabel } from "@/components/ui/editorial";
import { NewsletterForm } from "@/components/marketing/NewsletterForm";

export const revalidate = 600;

export const metadata: Metadata = buildMetadata({
  title: "Blog — Research Methods, Academic Writing & Thesis Guidance",
  description:
    "The GradEdge blog covers research methodology, academic writing, data analysis, literature reviews, publishing and postgraduate wellbeing. Written by our team.",
  path: "/blog",
});

interface PostItem {
  id: string;
  slug: string;
  title: string;
  standfirst: string | null;
  published_at: string | null;
  reading_time_minutes: number | null;
  category?: { name: string; slug: string }[] | null;
}

interface CategoryItem {
  slug: string;
  name: string;
}

export default async function BlogIndexPage() {
  let featuredPost: PostItem | null = null;
  let posts: PostItem[] = [];
  let categories: CategoryItem[] = [
    { slug: "dissertation-methodology", name: "Dissertation Methodology" },
    { slug: "statistical-analysis", name: "Statistical Analysis" },
    { slug: "literature-reviews", name: "Literature Reviews" },
    { slug: "academic-writing-editing", name: "Academic Writing & Editing" },
    { slug: "defense-preparation", name: "Defense Preparation" },
    { slug: "ethics-research-integrity", name: "Ethics & Research Integrity" },
    { slug: "publishing-peer-reviewed", name: "Publishing in Peer-Reviewed Journals" },
    { slug: "academic-productivity", name: "Academic Productivity" },
    { slug: "grant-writing-scholarships", name: "Grant Writing & Scholarships" },
  ];

  const FALLBACK_POSTS: PostItem[] = [
    {
      id: "fb-1",
      slug: "structural-equation-modeling-five-diagnostic-tests",
      title: "Structural Equation Modeling in R: Five Diagnostic Tests University Committees Expect",
      standfirst: "Why reporting CFI and RMSEA is only the beginning. How to audit multivariate normality, multicollinearity, and modification indices without p-hacking.",
      published_at: "2026-10-24T10:00:00Z",
      reading_time_minutes: 8,
      category: [{ name: "Statistical Analysis", slug: "statistical-analysis" }],
    },
    {
      id: "fb-2",
      slug: "how-to-rebut-reviewer-two-academic-diplomacy",
      title: "How to Rebut Reviewer 2: The Art of Academic Diplomacy in Peer-Reviewed Journal Revisions",
      standfirst: "A structured, point-by-point strategy for responding to aggressive referee reports while defending your core theoretical stance.",
      published_at: "2026-10-20T14:30:00Z",
      reading_time_minutes: 6,
      category: [{ name: "Publishing in Peer-Reviewed Journals", slug: "publishing-peer-reviewed" }],
    },
    {
      id: "fb-3",
      slug: "thematic-synthesis-without-drowning",
      title: "The Thematic Matrix: How to Synthesize 100+ Empirical Papers Without Drowning",
      standfirst: "Moving beyond descriptive paper summaries. How to organize literature reviews into conceptual battlegrounds that justify your doctoral inquiry.",
      published_at: "2026-10-15T09:15:00Z",
      reading_time_minutes: 7,
      category: [{ name: "Literature Reviews", slug: "literature-reviews" }],
    },
    {
      id: "fb-4",
      slug: "viva-voce-defense-methodological-traps",
      title: "The Viva Voce Defense: How External Examiners Frame Methodological Traps",
      standfirst: "The three standard lines of questioning external examiners use to probe doctoral rigor — and the 3-part response framework that satisfies committees.",
      published_at: "2026-10-10T11:00:00Z",
      reading_time_minutes: 9,
      category: [{ name: "Defense Preparation", slug: "defense-preparation" }],
    },
    {
      id: "fb-5",
      slug: "construct-validity-cronbach-alpha-limits",
      title: "Construct Validity and Scale Development: Why Cronbach's Alpha Is Rarely Sufficient",
      standfirst: "Examining composite reliability, average variance extracted (AVE), and the Fornell-Larcker criterion for postgraduate survey instruments.",
      published_at: "2026-10-05T16:20:00Z",
      reading_time_minutes: 6,
      category: [{ name: "Dissertation Methodology", slug: "dissertation-methodology" }],
    },
  ];

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createClient();
      const [fRes, pRes, cRes] = await Promise.all([
        supabase
          .from("blog_posts")
          .select("id, slug, title, standfirst, published_at, reading_time_minutes, category:blog_categories(name, slug)")
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(1),
        supabase
          .from("blog_posts")
          .select("id, slug, title, standfirst, published_at, reading_time_minutes, category:blog_categories(name, slug)")
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .range(1, 9),
        supabase.from("blog_categories").select("slug, name").order("name"),
      ]);

      if (fRes.data && fRes.data.length > 0) {
        featuredPost = fRes.data[0] as unknown as PostItem;
      }
      posts = (pRes.data ?? []) as unknown as PostItem[];
      if (cRes.data && cRes.data.length > 0) {
        categories = cRes.data as CategoryItem[];
      }
    } catch {
      // Keep defaults
    }
  }

  // Fallback to foundational scholarly articles if database is empty
  if (!featuredPost && posts.length === 0) {
    featuredPost = FALLBACK_POSTS[0];
    posts = FALLBACK_POSTS.slice(1);
  }

  return (
    <>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />

      <PageHero
        sectionNumber={1}
        sectionLabel="Academic Articles"
        headline="Writing on research, methodology and the craft of the thesis."
        standfirst="All posts are authored by the GradEdge team. We publish evidence-based guidance on research methods, academic writing, data analysis, publishing, and postgraduate wellbeing."
        image={{
          src: "/images/blog/header.jpg",
          alt: "Scholarly journal articles, notebooks, and reference texts on an academic reading desk",
          aspectRatio: "21:9",
          caption: "Essays and practical field guides authored by our multidisciplinary academic team.",
        }}
      />

      <div className="site-container py-12 md:py-16 space-y-16 max-w-4xl">
        {/* Category filters */}
        <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-tone-rule">
          <span className="type-micro text-tone-muted mr-2">Categories:</span>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/blog/category/${c.slug}`}
              className="text-xs px-2.5 py-1 bg-paper border border-tone-rule hover:border-navy text-tone-muted hover:text-navy transition-colors rounded-[2px]"
            >
              {c.name}
            </Link>
          ))}
          <Link
            href="/blog/search"
            className="text-xs px-2.5 py-1 bg-cream border border-tone-rule text-gold hover:text-navy transition-colors rounded-[2px] font-medium ml-auto"
          >
            Search articles &rarr;
          </Link>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="bg-navy-deep text-white p-8 md:p-12 rounded-[2px] space-y-4">
            <span className="type-micro text-gold">Featured Article</span>
            <h2 className="font-serif text-2xl md:text-3xl font-medium">
              <Link href={`/blog/${featuredPost.slug}`} className="hover:underline">
                {featuredPost.title}
              </Link>
            </h2>
            {featuredPost.standfirst && (
              <p className="type-body text-white/80 max-w-2xl leading-relaxed">
                {featuredPost.standfirst}
              </p>
            )}
            <div className="pt-2 flex items-center gap-4 text-xs text-white/60">
              <span>By GradEdge Team</span>
              <span>&bull;</span>
              <span>{featuredPost.reading_time_minutes ?? 5} min read</span>
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="text-gold font-medium hover:underline ml-auto flex items-center gap-1"
              >
                <span>Read article</span>
                <ArrowRight />
              </Link>
            </div>
          </div>
        )}

        {/* Posts list */}
        {posts.length > 0 ? (
          <section className="space-y-4">
            <SectionLabel number={2} label="Latest Articles" />
            <ul className="divide-y divide-tone-rule border-y border-tone-rule">
              {posts.map((post) => {
                const categoryName = post.category && post.category[0] ? post.category[0].name : "Research Methods";
                return (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="py-6 px-2 -mx-2 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 group hover:bg-cream/40 transition-colors"
                    >
                      <div className="space-y-1.5 max-w-xl">
                        <span className="type-micro text-gold">{categoryName}</span>
                        <h3 className="font-serif text-xl text-tone-heading font-medium group-hover:text-navy transition-colors">
                          {post.title}
                        </h3>
                        {post.standfirst && (
                          <p className="text-sm text-tone-muted line-clamp-2 leading-relaxed">
                            {post.standfirst}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4 shrink-0 text-xs text-tone-muted">
                        <span>By GradEdge Team</span>
                        <span>&bull;</span>
                        <span>{post.reading_time_minutes ?? 4} min read</span>
                        <span className="text-rule group-hover:text-gold transition-colors">
                          <ArrowRight />
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : (
          !featuredPost && (
            <PublicEmptyState
              heading="No published articles yet"
              body="We are finalizing our initial research guides and methodological articles. Subscribe below to receive new articles directly in your inbox."
            />
          )
        )}

        {/* Newsletter Signup */}
        <div className="bg-paper border border-tone-rule p-8 rounded-[2px] space-y-4">
          <SectionLabel number={3} label="The Research Briefing" />
          <h3 className="type-h3 text-tone-heading">Receive new articles in your inbox</h3>
          <p className="text-sm text-tone-muted max-w-lg leading-relaxed">
            Occasional dispatches on research methodology, statistical syntax, and thesis writing. No commercial promotions. Unsubscribe anytime.
          </p>
          <div className="max-w-md">
            <NewsletterForm />
          </div>
        </div>
      </div>
    </>
  );
}

