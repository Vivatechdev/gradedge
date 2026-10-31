import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gradedge.com";
const SITE_NAME = "GradEdge Academic Solutions";

/**
 * Build consistent Metadata for any public page.
 * Always supplies metadataBase, siteName, and Twitter card.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const fullTitle = title.includes("GradEdge")
    ? title
    : `${title} | ${SITE_NAME}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: fullTitle,
    description,
    openGraph: {
      type: "website",
      title: fullTitle,
      description,
      siteName: SITE_NAME,
      url: `${SITE_URL}${path}`,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    alternates: {
      canonical: path,
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

/**
 * Organization JSON-LD — no address, no country, no founder details.
 * Paste into any page via <script type="application/ld+json">.
 */
export const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: SITE_NAME,
  url: SITE_URL,
  description:
    "GradEdge coaches undergraduate, Masters and PhD students and academic researchers through every stage of the research cycle.",
  sameAs: [] as string[],
};

