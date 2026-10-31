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

export const revalidate = 600;
export const dynamicParams = true;

interface PostItem {
  id: string;
  slug: string;
  title: string;
  standfirst: string | null;
  reading_time_minutes: number | null;
}

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("blog_categories").select("slug");
    return (data ?? []).map((c) => ({ category: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const name = category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return buildMetadata({
    title: `${name} — Research Articles`,
    description: `Articles and guidance on ${name.toLowerCase()} from the GradEdge academic team.`,
    path: `/blog/category/${category}`,
  });
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  let categoryName = category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  let posts: PostItem[] = [];

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createClient();
      const { data: catData } = await supabase
        .from("blog_categories")
        .select("id, name")
        .eq("slug", category)
        .single();

      if (catData) {
        categoryName = catData.name;
        const { data: pData } = await supabase
          .from("blog_posts")
          .select("id, slug, title, standfirst, reading_time_minutes")
          .eq("category_id", catData.id)
          .eq("status", "published")
          .order("published_at", { ascending: false });
        posts = (pData ?? []) as PostItem[];
      }
    } catch {
      posts = [];
    }
  }

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: categoryName },
        ]}
      />

      <PageHero
        sectionNumber={1}
        sectionLabel="Category Archive"
        headline={`${categoryName} Articles`}
        standfirst={`Explore our methodological insights, structural critiques, and academic advice categorized under ${categoryName.toLowerCase()}.`}
      />

      <div className="site-container py-12 md:py-16 max-w-4xl space-y-12">
        {posts.length > 0 ? (
          <ul className="divide-y divide-tone-rule border-y border-tone-rule">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="py-6 px-2 -mx-2 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 group hover:bg-cream/40 transition-colors"
                >
                  <div className="space-y-1.5 max-w-xl">
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
            ))}
          </ul>
        ) : (
          <PublicEmptyState
            heading={`No articles currently in ${categoryName}`}
            body="We are authoring new articles for this category. Check back soon or browse our full blog archive."
            cta={{ label: "View all articles", href: "/blog" }}
          />
        )}
      </div>
    </>
  );
}

