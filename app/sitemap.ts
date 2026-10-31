import type { MetadataRoute } from "next";
import { ALL_STATIC_ROUTES } from "@/lib/nav";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 86400; // 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gradedge.com";

  // Base static routes
  const routes: MetadataRoute.Sitemap = ALL_STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date("2026-10-28"),
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1.0 : route.startsWith("/services") ? 0.9 : 0.7,
  }));

  // Fetch dynamic slugs if database configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createClient();
      const [servicesRes, subjectsRes, postsRes] = await Promise.all([
        supabase.from("services").select("slug").eq("is_active", true),
        supabase.from("subjects").select("slug"),
        supabase.from("blog_posts").select("slug, published_at").eq("status", "published"),
      ]);

      if (servicesRes.data) {
        servicesRes.data.forEach((s) => {
          routes.push({
            url: `${siteUrl}/services/${s.slug}`,
            lastModified: new Date("2026-10-28"),
            changeFrequency: "weekly",
            priority: 0.8,
          });
        });
      }

      if (subjectsRes.data) {
        subjectsRes.data.forEach((sub) => {
          routes.push({
            url: `${siteUrl}/subjects/${sub.slug}`,
            lastModified: new Date("2026-10-28"),
            changeFrequency: "monthly",
            priority: 0.7,
          });
        });
      }

      if (postsRes.data) {
        postsRes.data.forEach((p) => {
          routes.push({
            url: `${siteUrl}/blog/${p.slug}`,
            lastModified: p.published_at ? new Date(p.published_at) : new Date("2026-10-28"),
            changeFrequency: "monthly",
            priority: 0.6,
          });
        });
      }
    } catch {
      // Continue with base routes
    }
  }

  return routes;
}

