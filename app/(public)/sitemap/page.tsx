import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { PageBreadcrumb, PageHero } from "@/components/marketing/page-components";
import { FOOTER_COLUMNS, LEGAL_LINKS } from "@/lib/nav";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Sitemap — Complete Website Directory",
  description: "Comprehensive human-readable directory of all pages on the GradEdge platform.",
  path: "/sitemap",
});

export default function HumanSitemapPage() {
  return (
    <>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Sitemap" }]} />

      <PageHero
        sectionNumber={1}
        sectionLabel="Site Directory"
        headline="GradEdge Sitemap"
        standfirst="A complete, accessible directory of all static and dynamic pages across GradEdge Academic Solutions."
      />

      <div className="site-container py-12 md:py-16 max-w-4xl space-y-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading} className="space-y-3">
              <h3 className="font-serif text-lg text-tone-heading font-semibold border-b border-tone-rule pb-2">
                {col.heading}
              </h3>
              <ul className="space-y-2 text-sm">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-tone-muted hover:text-navy transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-tone-rule space-y-4">
          <h3 className="font-serif text-lg text-tone-heading font-semibold">
            Legal & Compliance Documents
          </h3>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-tone-muted">
            {LEGAL_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-navy transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 bg-paper border border-tone-rule rounded-[2px] text-xs text-tone-muted leading-relaxed">
          Note: In addition to these primary landing routes, GradEdge maintains dynamically generated directory pages for individual research services, subject disciplines, sub-fields, blog posts, and verified student case studies.
        </div>
      </div>
    </>
  );
}

