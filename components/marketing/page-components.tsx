import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SectionLabel } from "@/components/ui/editorial";
import { Button } from "@/components/ui/button";
import { Section, type SectionTone } from "@/components/ui/section";
import { Photo, type PhotoAspectRatio } from "@/components/ui/photo";

// ─── PAGE HERO ───────────────────────────────────────────────────────────────
// Reusable interior page hero. Used by about, services, accelerator, etc.

export interface PageHeroProps {
  sectionNumber?: number | string;
  sectionLabel?: string;
  headline: string;
  standfirst?: string;
  /** One primary CTA rendered as accent Button */
  cta?: { label: string; href: string };
  /** Optional secondary quiet link */
  secondaryCta?: { label: string; href: string };
  /** Optional editorial header photo */
  image?: {
    src: string;
    alt: string;
    aspectRatio?: PhotoAspectRatio;
    caption?: string;
  };
  /** Hero presentation style: split (asymmetrical 2-column) or banner (stacked wide) */
  layout?: "split" | "banner";
  /** paper (default) | cream | white | navy | navy-deep */
  background?: SectionTone;
  className?: string;
  children?: React.ReactNode;
}

export function PageHero({
  sectionNumber,
  sectionLabel,
  headline,
  standfirst,
  cta,
  secondaryCta,
  image,
  layout = "split",
  background = "paper",
  className,
  children,
}: PageHeroProps) {
  const isSplit = Boolean(image && layout === "split");

  return (
    <Section
      tone={background}
      className={cn("border-b border-tone-rule", className)}
    >
      <div className="site-container py-12 md:py-16">
        {isSplit ? (
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="md:col-span-7">
              {(sectionNumber !== undefined || sectionLabel) && (
                <SectionLabel
                  number={sectionNumber}
                  label={sectionLabel ?? ""}
                />
              )}
              <h1 className="type-h1 mt-2 max-w-2xl">{headline}</h1>
              {standfirst && (
                <p className="type-lead mt-4 max-w-xl">
                  {standfirst}
                </p>
              )}
              {(cta || secondaryCta) && (
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  {cta && (
                    <Button variant="accent" size="lg" href={cta.href}>
                      {cta.label}
                    </Button>
                  )}
                  {secondaryCta && (
                    <Link
                      href={secondaryCta.href}
                      className="type-small link-editorial pb-0.5"
                    >
                      {secondaryCta.label}
                    </Link>
                  )}
                </div>
              )}
              {children}
            </div>

            {image && (
              <div className="md:col-span-5">
                <Photo
                  src={image.src}
                  alt={image.alt}
                  aspectRatio={image.aspectRatio || "4:3"}
                  caption={image.caption}
                  navyWash={true}
                  priority={true}
                />
              </div>
            )}
          </div>
        ) : (
          <div>
            {(sectionNumber !== undefined || sectionLabel) && (
              <SectionLabel
                number={sectionNumber}
                label={sectionLabel ?? ""}
              />
            )}
            <h1 className="type-h1 mt-2 max-w-2xl">{headline}</h1>
            {standfirst && (
              <p className="type-lead mt-4 max-w-xl">
                {standfirst}
              </p>
            )}
            {(cta || secondaryCta) && (
              <div className="mt-7 flex flex-wrap items-center gap-4">
                {cta && (
                  <Button variant="accent" size="lg" href={cta.href}>
                    {cta.label}
                  </Button>
                )}
                {secondaryCta && (
                  <Link
                    href={secondaryCta.href}
                    className="type-small link-editorial pb-0.5"
                  >
                    {secondaryCta.label}
                  </Link>
                )}
              </div>
            )}
            {children}

            {image && (
              <div className="mt-8 md:mt-10">
                <Photo
                  src={image.src}
                  alt={image.alt}
                  aspectRatio={image.aspectRatio || "21:9"}
                  caption={image.caption}
                  navyWash={true}
                  priority={false}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </Section>
  );
}

// ─── INLINE BREADCRUMB ────────────────────────────────────────────────────────
// Lightweight breadcrumb with JSON-LD for interior pages.

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function PageBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href
        ? {
            item:
              (process.env.NEXT_PUBLIC_SITE_URL ?? "https://gradedge.com") +
              item.href,
          }
        : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="border-b border-tone-rule bg-white">
        <div className="site-container py-2.5">
          <ol className="flex flex-wrap items-center gap-1.5 type-small text-tone-muted">
            {items.map((item, i) => (
              <li key={i} className="flex items-center gap-1.5">
                {i > 0 && (
                  <span aria-hidden="true" className="text-rule select-none">
                    /
                  </span>
                )}
                {item.href && i < items.length - 1 ? (
                  <Link
                    href={item.href}
                    className="hover:text-tone-heading transition-colors duration-150"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current={i === items.length - 1 ? "page" : undefined}
                    className="text-tone-body font-medium"
                  >
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  );
}

// ─── INTEGRITY CALLOUT ────────────────────────────────────────────────────────
// Reusable academic integrity block for service pages.

export function IntegrityCallout({ serviceName }: { serviceName?: string }) {
  return (
    <div data-tone="cream" className="tone-cream border border-tone-rule p-6 md:p-8 rounded-[2px] bg-tone text-tone-body">
      <p className="type-micro text-tone-muted mb-3">What we will not do</p>
      <p className="type-body text-tone-body leading-relaxed">
        {serviceName
          ? `Our ${serviceName} service is feedback and coaching. `
          : "This service is feedback and coaching. "}
        We do not write your work for you, produce a draft you submit as your
        own, or guarantee a particular grade or similarity score. Every piece of
        writing you submit must be yours.
      </p>
      <Link
        href="/about/academic-integrity"
        className="mt-3 inline-flex items-center gap-1.5 type-small link-editorial pb-0.5 font-medium"
      >
        <span>Read our Academic Integrity Policy</span>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}

// ─── MENTOR TEAM BLOCK ────────────────────────────────────────────────────────
// Anonymous mentor statement — the only public-facing team content.

export function MentorTeamBlock() {
  return (
    <Section tone="paper" className="border-y border-tone-rule py-10 md:py-14">
      <div className="site-container">
        <p className="type-micro text-gold mb-4 font-semibold">Our mentors</p>
        <ul className="divide-y divide-tone-rule border-y border-tone-rule max-w-2xl">
          {[
            "Every mentor holds an earned postgraduate degree in their discipline.",
            "We match you by subject, methodology and the software you use.",
            "You meet your mentor inside your dashboard after you book or subscribe.",
          ].map((line, i) => (
            <li key={i} className="py-4 flex items-baseline gap-5">
              <span className="font-serif text-xl text-gold shrink-0" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="type-body text-tone-body">{line}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

// ─── CLOSING CTA STRIP ────────────────────────────────────────────────────────

export interface CtaStripProps {
  headline?: string;
  subtext?: string;
  standfirst?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  tone?: "paper" | "cream" | "white" | "navy" | "navy-deep";
  sectionNumber?: number;
  sectionLabel?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  image?: {
    src: string;
    alt: string;
    aspectRatio?: "1:1" | "4:5" | "4:3" | "3:2" | "16:9" | "21:9";
    caption?: string;
  };
}

export function CtaStrip({
  headline = "Book a call. Tell us where you are. We'll take it from there.",
  subtext,
  standfirst,
  ctaLabel,
  ctaHref,
  secondaryLabel,
  secondaryHref,
  tone = "navy",
  primaryCta,
  secondaryCta,
  image,
}: CtaStripProps) {
  const resolvedSubtext =
    standfirst ||
    subtext ||
    "A free twenty-minute call is enough for us to understand your project and tell you honestly whether we can help.";
  const resolvedPrimaryLabel = primaryCta?.label || ctaLabel || "Book a free 20-minute call";
  const resolvedPrimaryHref = primaryCta?.href || ctaHref || "/book";
  const resolvedSecondaryLabel = secondaryCta?.label || secondaryLabel || "Send us a message instead";
  const resolvedSecondaryHref = secondaryCta?.href || secondaryHref || "/contact";

  return (
    <Section tone={tone} aria-label="Book a consultation">
      <div className="site-container py-14 md:py-20">
        <div className={cn(image ? "grid grid-cols-1 lg:grid-cols-12 gap-10 items-center" : "max-w-xl space-y-5")}>
          <div className={cn(image ? "lg:col-span-7 space-y-5" : "space-y-5")}>
            <h2 className="type-h2 text-tone-heading">{headline}</h2>
            {resolvedSubtext && <p className="type-body text-tone-body">{resolvedSubtext}</p>}
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="accent" size="lg" href={resolvedPrimaryHref}>
                {resolvedPrimaryLabel}
              </Button>
              {resolvedSecondaryLabel && resolvedSecondaryHref && (
                <Link
                  href={resolvedSecondaryHref}
                  className="type-small link-editorial pb-0.5"
                >
                  {resolvedSecondaryLabel}
                </Link>
              )}
            </div>
          </div>
          {image && (
            <div className="lg:col-span-5">
              <Photo
                src={image.src}
                alt={image.alt}
                aspectRatio={image.aspectRatio || "16:9"}
                caption={image.caption}
                navyWash={true}
              />
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

// ─── DRAFT LEGAL BANNER ──────────────────────────────────────────────────────

export function DraftLegalBanner() {
  return (
    <div
      role="alert"
      className="bg-gold/10 border-b-2 border-b-gold px-4 py-3 text-center"
    >
      <p className="type-small text-tone-body font-medium">
        <strong>Draft document</strong> — to be reviewed by a qualified legal
        professional before launch. Not legally binding in its current form.
      </p>
    </div>
  );
}

// ─── EMPTY STATE (public-facing) ─────────────────────────────────────────────

export function PublicEmptyState({
  heading,
  body,
  cta,
}: {
  heading: string;
  body: string;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="py-20 text-center">
      <h2 className="type-h3 text-tone-heading">{heading}</h2>
      <p className="type-body text-tone-muted mt-3 max-w-sm mx-auto">{body}</p>
      {cta && (
        <div className="mt-6">
          <Button variant="primary" href={cta.href}>
            {cta.label}
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── ARROW ICON (shared inline) ──────────────────────────────────────────────

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={cn("inline-block shrink-0", className)}
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

