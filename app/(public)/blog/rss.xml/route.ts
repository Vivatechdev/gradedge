import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 3600;

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gradedge.com";

  let items = [
    {
      title: "Structuring an Audit-Proof Methodology Chapter",
      slug: "structuring-audit-proof-methodology-chapter",
      description: "How to articulate research paradigms and defend sampling strategies during committee review.",
      published_at: "2026-10-20T10:00:00Z",
    },
    {
      title: "Common Pitfalls in Thematic Analysis",
      slug: "common-pitfalls-in-thematic-analysis",
      description: "Avoiding purely descriptive code structures and maintaining reflexive rigor.",
      published_at: "2026-10-15T10:00:00Z",
    },
    {
      title: "Navigating Conflicting Supervisor Feedback",
      slug: "navigating-conflicting-supervisor-feedback",
      description: "Techniques for managing diverging committee recommendations without destabilizing your thesis.",
      published_at: "2026-10-10T10:00:00Z",
    },
  ];

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("blog_posts")
        .select("title, slug, standfirst, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(25);
      if (data && data.length > 0) {
        items = data.map((d) => ({
          title: d.title,
          slug: d.slug,
          description: d.standfirst ?? d.title,
          published_at: d.published_at ?? new Date().toISOString(),
        }));
      }
    } catch {
      // Keep fallback
    }
  }

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>GradEdge Blog — Research Methods &amp; Dissertation Guidance</title>
    <link>${siteUrl}/blog</link>
    <description>Evidence-based coaching, statistical syntax, and thesis writing guidance for graduate researchers.</description>
    <language>en</language>
    <atom:link href="${siteUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
    ${items
      .map(
        (item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${siteUrl}/blog/${item.slug}</link>
      <guid>${siteUrl}/blog/${item.slug}</guid>
      <pubDate>${new Date(item.published_at).toUTCString()}</pubDate>
      <description><![CDATA[${item.description}]]></description>
      <author>GradEdge Team</author>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}

