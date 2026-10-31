import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gradedge.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/student/",
        "/api/",
        "/checkout/",
        "/booking/manage/",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

