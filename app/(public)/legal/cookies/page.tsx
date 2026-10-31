import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import {
  PageHero,
  PageBreadcrumb,
  DraftLegalBanner,
} from "@/components/marketing/page-components";

export const metadata: Metadata = buildMetadata({
  title: "Cookie Policy",
  description: "Information regarding cookie usage and session management on GradEdge.",
  path: "/legal/cookies",
});

export default function CookiesPage() {
  return (
    <>
      <DraftLegalBanner />
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Cookie Policy" }]} />

      <PageHero
        sectionNumber={1}
        sectionLabel="Digital Privacy"
        headline="Cookie Policy"
        standfirst="How we use essential technical cookies to manage authenticated student sessions."
      />

      <div className="site-container py-12 md:py-16 max-w-3xl prose prose-sm text-tone-body leading-relaxed space-y-8">
        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">1. Essential Technical Cookies Only</h2>
          <p>
            GradEdge Academic Solutions uses only strictly essential session cookies required for platform security and authentication. When you log in to your student portal, encrypted HTTP-only session tokens are generated via Supabase to authenticate your requests and prevent unauthorized portal access.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">2. No Third-Party Tracking Cookies</h2>
          <p>
            We do not deploy cross-site tracking cookies, behavioral advertising beacons, or third-party marketing pixels. We do not monetize your browsing data. Because we only use strictly necessary operational cookies, explicit cookie consent banners are not legally required under standard electronic privacy regulations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="type-h3 text-tone-heading">3. Browser Cookie Controls</h2>
          <p>
            You can configure your browser to block or alert you about session cookies. However, disabling essential cookies will prevent authentication and disable student dashboard functionality.
          </p>
        </section>
      </div>
    </>
  );
}

