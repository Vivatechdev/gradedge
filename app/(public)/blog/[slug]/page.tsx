import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";
import { PageBreadcrumb } from "@/components/marketing/page-components";
import { ShareLinks } from "@/components/marketing/ShareLinks";
import { Button } from "@/components/ui/button";

export const revalidate = 600;
export const dynamicParams = true;

interface PostFull {
  id: string;
  slug: string;
  title: string;
  standfirst: string | null;
  content: string;
  published_at: string | null;
  reading_time_minutes: number | null;
  category_id: string | null;
  category?: { name: string; slug: string }[] | null;
}

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("slug")
      .eq("status", "published");
    return (data ?? []).map((p) => ({ slug: p.slug }));
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
  let title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  let description = "Evidence-based research advice from GradEdge Academic Solutions.";

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("blog_posts")
        .select("title, standfirst")
        .eq("slug", slug)
        .eq("status", "published")
        .single();
      if (data) {
        title = data.title;
        description = data.standfirst ?? data.title;
      }
    } catch {
      // Keep fallback
    }
  }

  return buildMetadata({
    title,
    description,
    path: `/blog/${slug}`,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post: PostFull | null = null;
  let relatedPosts: { slug: string; title: string; standfirst: string | null }[] = [];

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createClient();
      const { data: pData } = await supabase
        .from("blog_posts")
        .select("*, category:blog_categories(name, slug)")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (pData) {
        post = pData as unknown as PostFull;
        if (pData.category_id) {
          const { data: rData } = await supabase
            .from("blog_posts")
            .select("slug, title, standfirst")
            .eq("status", "published")
            .eq("category_id", pData.category_id)
            .neq("slug", slug)
            .limit(3);
          relatedPosts = (rData ?? []) as typeof relatedPosts;
        }
      }
    } catch {
      post = null;
    }
  }

  // Fallback article if unseeded
  if (!post) {
    const formatted = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    post = {
      id: "fallback-post",
      slug,
      title: formatted,
      standfirst: "A critical methodological guide for graduate researchers structuring empirical investigations.",
      content: `Academic research requires constant navigation between theoretical propositions and empirical realities.\n\nWhen developing a dissertation chapter, scholars must clearly justify their epistemological assumptions before selecting data collection instruments. Supervisors frequently reject methodology drafts not because the data collection was flawed, but because the rationale for selecting that specific framework was omitted.\n\nBegin by defining the research problem with precision. Ensure that your research questions dictate your methodology, rather than choosing an analysis tool first and tailoring your question to fit it.\n\nFinally, maintain an audit trail of every design choice and assumption test. This documented defense will protect your thesis during committee review and oral examination.`,
      published_at: "2026-10-28T12:00:00Z",
      reading_time_minutes: 5,
      category_id: null,
      category: [{ name: "Research Methods", slug: "research-methods" }],
    };
  }

  const categoryName = post.category && post.category[0] ? post.category[0].name : "Research Methods";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.standfirst,
    author: {
      "@type": "Organization",
      name: "GradEdge Team",
    },
    publisher: {
      "@type": "Organization",
      name: "GradEdge Academic Solutions",
    },
    datePublished: post.published_at,
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://gradedge.com"}/blog/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: categoryName, href: `/blog/category/${post.category?.[0]?.slug ?? "methods"}` },
          { label: post.title.slice(0, 32) + "..." },
        ]}
      />

      <article className="site-container py-12 md:py-20 max-w-3xl">
        {/* Article header */}
        <header className="space-y-4 pb-8 border-b border-tone-rule">
          <span className="type-micro text-gold">{categoryName}</span>
          <h1 className="type-h1 text-tone-heading leading-tight">{post.title}</h1>

          {post.standfirst && (
            <p className="type-lead text-tone-muted leading-relaxed">
              {post.standfirst}
            </p>
          )}

          <div className="flex items-center gap-3 pt-2 text-xs text-tone-muted">
            <span className="font-semibold text-tone-heading">GradEdge Team</span>
            <span>&bull;</span>
            <span>{post.reading_time_minutes ?? 5} min read</span>
          </div>
        </header>

        {/* Share links */}
        <ShareLinks
          title={post.title}
          url={`${process.env.NEXT_PUBLIC_SITE_URL ?? "https://gradedge.com"}/blog/${post.slug}`}
        />

        {/* Body content */}
        <div className="py-8 prose prose-lg text-tone-body leading-relaxed space-y-6">
          {post.content.split("\n\n").map((paragraph, index) => (
            <p key={index} className="type-body text-tone-body leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Bottom CTA block */}
        <div className="mt-12 p-8 bg-paper border border-tone-rule rounded-[2px] space-y-3">
          <h3 className="font-serif text-xl text-tone-heading font-semibold">
            Working on your dissertation or empirical manuscript?
          </h3>
          <p className="type-body text-tone-muted leading-relaxed">
            GradEdge provides one-on-one developmental coaching and chapter reviews from discipline-matched mentors. Schedule a free 20-minute call to discuss your research bottlenecks.
          </p>
          <div className="pt-2">
            <Button variant="accent" size="md" href="/book">
              Book a free consultation
            </Button>
          </div>
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-tone-rule space-y-6">
            <h3 className="type-h3 text-tone-heading">Related reading</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="p-4 bg-white border border-tone-rule rounded-[2px] space-y-2 group hover:border-navy transition-colors"
                >
                  <p className="font-serif text-sm font-semibold text-tone-heading group-hover:text-navy">
                    {r.title}
                  </p>
                  {r.standfirst && (
                    <p className="text-xs text-tone-muted line-clamp-2 leading-relaxed">
                      {r.standfirst}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}

