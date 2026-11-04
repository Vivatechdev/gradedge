import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { AccordionItem } from "@/components/ui/accordion";
import { Photo, PhotoFrame } from "@/components/ui/photo";
import {
  SectionLabel,
  StepList,
} from "@/components/ui/editorial";
import { HomeServicesTabs } from "@/components/marketing/home-services-tabs";

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title:
    "GradEdge Academic Solutions | Dissertation Mentoring & Research Coaching",
  description:
    "GradEdge coaches undergraduate, Masters and PhD students and academic researchers through every stage of research. Dissertation mentoring, proposal development, data analysis, academic editing and more. You write. We guide.",
  openGraph: {
    type: "website",
    title: "GradEdge Academic Solutions | Dissertation Mentoring & Research Coaching",
    description:
      "Expert mentoring for dissertation and thesis students worldwide. Research design, data analysis, academic editing and presentation coaching. Your work. Your words.",
    siteName: "GradEdge Academic Solutions",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://gradedge.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "GradEdge Academic Solutions | Dissertation Mentoring & Research Coaching",
    description:
      "Expert mentoring for dissertation and thesis students worldwide. Research design, data analysis, academic editing and presentation coaching.",
  },
  alternates: {
    canonical: "/",
  },
};

// ─── JSON-LD ─────────────────────────────────────────────────────────────────

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "GradEdge Academic Solutions",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://gradedge.com",
  description:
    "GradEdge coaches undergraduate, Masters and PhD students and academic researchers through every stage of the research cycle. Services include dissertation and thesis mentoring, research design, data analysis, academic editing and presentation coaching.",
  sameAs: [] as string[],
};

// ─── Types ───────────────────────────────────────────────────────────────────

interface Testimonial {
  id: string;
  headline: string | null;
  summary: string | null;
  student_display_name: string | null;
  study_level: string | null;
}

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  standfirst: string | null;
  published_at: string | null;
  reading_time_minutes: number | null;
  category?: { name: string }[] | null;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

// ─── Data fetching ───────────────────────────────────────────────────────────

async function getHomeData(): Promise<{
  testimonials: Testimonial[];
  recentPosts: BlogPost[];
  faqItems: FaqItem[];
}> {
  const empty = { testimonials: [], recentPosts: [], faqItems: [] };

  // Guard: if env vars aren't set (local dev, no Supabase), return empty
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return empty;
  }

  try {
    const supabase = await createClient();

    const [testimonialsRes, postsRes, faqsRes] = await Promise.all([
      supabase
        .from("student_stories")
        .select("id, headline, summary, student_display_name, study_level")
        .eq("is_published", true)
        .eq("consent_confirmed", true)
        .limit(3),
      supabase
        .from("blog_posts")
        .select(
          "id, slug, title, standfirst, published_at, reading_time_minutes, category:blog_categories(name)"
        )
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(3),
      supabase
        .from("faqs")
        .select("id, question, answer")
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .limit(5),
    ]);

    return {
      testimonials: (testimonialsRes.data ?? []) as Testimonial[],
      recentPosts: (postsRes.data ?? []) as unknown as BlogPost[],
      faqItems: (faqsRes.data ?? []) as FaqItem[],
    };
  } catch {
    return empty;
  }
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const { testimonials, recentPosts, faqItems } = await getHomeData();

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <Section
        tone="paper"
        aria-label="Introduction"
        className="border-b border-tone-rule overflow-hidden"
      >
        <div className="site-container py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column — Equal Weight */}
            <div className="space-y-6 sm:space-y-8">
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[44px] xl:text-[50px] text-tone-heading leading-[1.14] tracking-tight">
                Your thesis is yours. We help you{" "}
                <span className="relative inline-block whitespace-nowrap">
                  finish it.
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gold"
                    aria-hidden="true"
                  />
                </span>
              </h1>

              <p className="type-lead text-tone-body max-w-xl">
                Expert written feedback and one-on-one mentoring from proposal to defense, in your discipline and your software.
              </p>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1">
                <Button variant="accent" size="lg" href="/booking">
                  Book a free 20-minute call
                </Button>
                <Link
                  href="#services"
                  className="type-body text-tone-heading hover:text-navy transition-colors underline underline-offset-4 decoration-tone-rule hover:decoration-gold font-medium"
                >
                  Explore services
                </Link>
              </div>

              {/* Plain scope row separated by hairlines */}
              <div className="pt-4 border-t border-tone-rule space-y-2">
                <div className="flex flex-wrap items-center text-xs uppercase tracking-widest text-tone-muted font-sans font-semibold">
                  <span className="pr-3 py-1">Proposal</span>
                  <span className="h-3 w-px bg-tone-rule" aria-hidden="true" />
                  <span className="px-3 py-1">Analysis</span>
                  <span className="h-3 w-px bg-tone-rule" aria-hidden="true" />
                  <span className="px-3 py-1">Writing</span>
                  <span className="h-3 w-px bg-tone-rule" aria-hidden="true" />
                  <span className="px-3 py-1">Publishing</span>
                  <span className="h-3 w-px bg-tone-rule" aria-hidden="true" />
                  <span className="pl-3 py-1">Defense</span>
                </div>
                <p className="type-small text-tone-muted">
                  For undergraduate, Masters and doctoral researchers, worldwide.
                </p>
              </div>
            </div>

            {/* Right Column — Three-Image Mosaic & Floating Cards */}
            <div className="relative w-full max-w-lg lg:max-w-none mx-auto pt-4 sm:pt-6 pb-6 sm:pb-8">
              {/* Floating Card: Milestone card with three progress bars at top-right */}
              <div className="absolute top-0 right-1 sm:-top-3 sm:-right-4 z-20 w-[210px] sm:w-[245px] max-w-[calc(100%-1rem)] bg-white border border-tone-rule rounded-[4px] p-3 sm:p-3.5 shadow-md space-y-2.5 text-xs font-sans">
                <div className="flex items-center justify-between border-b border-tone-rule/80 pb-1.5 text-[10px] uppercase tracking-wider text-tone-muted font-semibold">
                  <span className="text-tone-heading">Doctoral Milestones</span>
                  <span className="text-gold font-mono font-medium">Stage 3 / 5</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 font-medium text-tone-heading">
                      <span>Ch 1: Framing & Scope</span>
                      <span className="text-forest font-semibold">100%</span>
                    </div>
                    <div className="h-1.5 w-full bg-cream rounded-full overflow-hidden">
                      <div className="h-full bg-forest rounded-full w-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 font-medium text-tone-heading">
                      <span>Ch 2: Literature Synthesis</span>
                      <span className="text-forest font-semibold">100%</span>
                    </div>
                    <div className="h-1.5 w-full bg-cream rounded-full overflow-hidden">
                      <div className="h-full bg-forest rounded-full w-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 font-medium text-tone-heading">
                      <span>Ch 3: Methodology & Syntax</span>
                      <span className="text-gold font-semibold">68%</span>
                    </div>
                    <div className="h-1.5 w-full bg-cream rounded-full overflow-hidden">
                      <div className="h-full bg-gold rounded-full w-[68%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Three-Image Mosaic */}
              <div className="grid grid-cols-12 gap-[14px] h-[480px] lg:h-[600px] rounded-[4px] overflow-hidden">
                {/* Tall left image: hero.jpg */}
                <div className="col-span-7 h-full relative rounded-[4px] overflow-hidden">
                  <Photo
                    src="/images/home/hero.jpg"
                    alt="Focused doctoral researcher working at a wooden desk with annotated thesis manuscripts"
                    aspectRatio="full"
                    priority={true}
                    className="h-full w-full"
                  />
                  {/* Thin Inset White Hairline Frame */}
                  <div
                    className="absolute inset-[10px] sm:inset-[14px] border border-white/50 rounded-[2px] pointer-events-none z-10"
                    aria-hidden="true"
                  />
                </div>

                {/* Right Stack: how-we-work.jpg (top) & integrity.jpg (bottom) */}
                <div className="col-span-5 h-full flex flex-col gap-[14px]">
                  <div className="h-1/2 relative rounded-[4px] overflow-hidden">
                    <Photo
                      src="/images/home/how-we-work.jpg"
                      alt="Scholarly mentor reviewing draft chapter annotations"
                      aspectRatio="full"
                      priority={true}
                      className="h-full w-full"
                    />
                  </div>
                  <div className="h-1/2 relative rounded-[4px] overflow-hidden">
                    <Photo
                      src="/images/home/integrity.jpg"
                      alt="Thesis manuscript with mentor margin notes"
                      aspectRatio="full"
                      className="h-full w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Floating Card: Mentor-Review Card at bottom-left */}
              <div className="absolute bottom-0 left-1 sm:-bottom-4 sm:-left-4 z-20 w-[270px] sm:w-[310px] max-w-[calc(100%-1rem)] bg-white border border-tone-rule rounded-[4px] p-3 sm:p-3.5 shadow-md space-y-2 text-xs font-sans">
                <div className="flex items-center justify-between border-b border-tone-rule/80 pb-1.5 text-[10px] uppercase tracking-wider text-tone-muted font-semibold">
                  <span className="text-tone-heading">Chapter 3 &middot; Line Review</span>
                  <span className="text-gold font-mono font-medium">Mentor Margin Note</span>
                </div>
                {/* Strikethrough line */}
                <p className="line-through text-tone-muted/65 text-[11px] sm:text-xs leading-relaxed font-sans">
                  The survey data was correlated using standard regression models.
                </p>
                {/* Corrected line with gold left border */}
                <div className="p-2 sm:p-2.5 bg-cream/70 border-l-2 border-gold text-[11px] sm:text-xs text-tone-heading font-sans rounded-[1px] leading-snug">
                  Validated through exploratory factor analysis, followed by hierarchical regression{" "}
                  <span className="text-[10px] font-mono text-gold font-semibold">
                    (Field, 2018)
                  </span>.
                </div>
                {/* Short margin comment */}
                <div className="bg-paper border border-tone-rule/80 p-2 sm:p-2.5 rounded-[2px] text-[10px] sm:text-[11px] text-tone-body font-sans">
                  <span className="italic block text-tone-heading font-medium leading-normal">
                    &ldquo;Verify normality assumptions before estimating interaction coefficients.&rdquo;
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── SECTION 01: WHERE STUDENTS GET STUCK ──────────────────────────── */}
      <Section tone="white" aria-labelledby="stuck-heading" className="border-b border-tone-rule">
        <div className="site-container py-16 md:py-20">
          <SectionLabel label="Where researchers get stuck" />
          <h2
            id="stuck-heading"
            className="type-h2 text-tone-heading mt-2 mb-8 max-w-xl"
          >
            We know the moments that stall a dissertation.
          </h2>

          {/* Editorial Wide Image Band (16:9) */}
          <div className="mb-10 max-w-4xl">
            <Photo
              src="/images/home/stuck.jpg"
              alt="An open dissertation analysis chapter and methodology handbook on a quiet library desk"
              aspectRatio="16:9"
              navyWash={true}
              caption="The gap between raw data collection and a completed analysis chapter is where most projects stall."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-tone-rule">
            {stuckItems.map((item, i) => (
              <div
                key={i}
                className="border-b border-tone-rule md:odd:border-r py-5 md:pr-8 md:even:pl-8 flex items-start justify-between gap-4 group"
              >
                <p className="type-body text-tone-body leading-snug">{item.text}</p>
                <Link
                  href={item.href}
                  className="shrink-0 mt-0.5 text-gold hover:text-navy transition-colors duration-150"
                  aria-label={`Learn more: ${item.text}`}
                >
                  <ArrowIcon />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── SECTION 02: HOW WE WORK ───────────────────────────────────────── */}
      <Section
        tone="cream"
        aria-labelledby="how-heading"
        className="border-b border-tone-rule"
      >
        <div className="site-container py-16 md:py-20">
          <SectionLabel label="How we work" />
          <h2
            id="how-heading"
            className="type-h2 text-tone-heading mt-2 mb-10 max-w-lg"
          >
            Short cycles. Written feedback. Real progress.
          </h2>

          {/* Two-column layout: Sticky 3:2 image on left, scrolling steps on right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <PhotoFrame offset={8}>
                <Photo
                  src="/images/home/how-we-work.jpg"
                  alt="Scholarly mentor reviewing draft chapter annotations and methodological notes with pen in hand"
                  aspectRatio="3:2"
                  navyWash={true}
                  caption="Short feedback cycles: you write, we critique the argument, you revise."
                />
              </PhotoFrame>
            </div>
            <div className="lg:col-span-7">
              <StepList steps={howWeWorkSteps} />
            </div>
          </div>
        </div>
      </Section>

      {/* ── SECTION 03: SERVICES ──────────────────────────────────────────── */}
      <Section id="services" tone="white" aria-labelledby="services-heading" className="border-b border-tone-rule">
        <div className="site-container py-16 md:py-20">
          <SectionLabel label="What we do" />
          <h2
            id="services-heading"
            className="type-h2 text-tone-heading mt-2 mb-10 max-w-lg"
          >
            Support matched to where you are in your research.
          </h2>

          {/* Interactive Services Tabs (2-column list of rows, stage tags, hover indicators) */}
          <HomeServicesTabs />

          {/* Accelerator Program highlight block with 16:9 library photograph */}
          <div data-tone="navy-deep" className="tone-navy-deep mt-14 bg-navy-deep border-t-2 border-t-gold text-tone-body rounded-[2px] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 md:p-12">
              <div className="lg:col-span-7 space-y-4">
                <p className="type-micro text-gold font-semibold">Flagship programme</p>
                <h3 className="type-h2 text-tone-heading">
                  The Dissertation Accelerator
                </h3>
                <p className="type-body text-tone-body max-w-xl leading-relaxed">
                  A structured nine-month programme for doctoral candidates who
                  need more than one-off sessions. Monthly milestones, dedicated
                  mentor, and a clear path from proposal to submission.
                </p>
                <div className="pt-2">
                  <Button variant="accent" size="lg" href="/accelerator">
                    See the programme
                  </Button>
                </div>
              </div>
              <div className="lg:col-span-5">
                <Photo
                  src="/images/accelerator/library.jpg"
                  alt="Doctoral research library stacks with natural light and reading desks"
                  aspectRatio="16:9"
                  navyWash={true}
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── SECTION 04: INTEGRITY BLOCK ───────────────────────────────────── */}
      <Section
        tone="paper"
        aria-labelledby="integrity-heading"
        className="border-b border-tone-rule"
      >
        <div className="site-container py-16 md:py-20">
          <SectionLabel label="Academic integrity" />
          <h2
            id="integrity-heading"
            className="type-h2 text-tone-heading mt-2 max-w-xl"
          >
            Your work. Your words. Our expertise.
          </h2>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7 space-y-4">
              <p className="type-body text-tone-body">
                Every session, every review, every piece of feedback we give is
                designed to make you a better researcher. We read your drafts,
                ask questions, point to the gaps, and explain what strong
                academic writing looks like in your field. You then go away and
                rewrite it.
              </p>
              <p className="type-body text-tone-body">
                We do not write your work. We do not edit your sentences into a
                new draft and hand it back. We do not promise you a particular
                similarity score or grade. We are coaches, not ghostwriters.
              </p>
              <p className="type-body text-tone-body">
                This is not a restriction we reluctantly comply with. It is the
                whole point. The skills you build working with a GradEdge mentor
                are the skills you carry into your viva, your next paper, and
                your research career.
              </p>
              <div className="pt-2">
                <Link
                  href="/about/academic-integrity"
                  className="inline-flex items-center gap-2 type-small link-editorial pb-0.5 font-medium"
                >
                  <span>Read our Academic Integrity Policy</span>
                  <ArrowIcon />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <PhotoFrame offset={10}>
                <Photo
                  src="/images/home/integrity.jpg"
                  alt="Close-up of academic thesis manuscript with handwritten mentor margin annotations"
                  aspectRatio="4:3"
                  navyWash={true}
                  caption="Real mentor margin notes on a draft methodology chapter."
                />
              </PhotoFrame>
            </div>
          </div>
        </div>
      </Section>

      {/* ── SECTION 05: THE TEAM ──────────────────────────────────────────── */}
      <Section
        tone="cream"
        aria-labelledby="team-heading"
        className="border-b border-tone-rule"
      >
        <div className="site-container py-16 md:py-20">
          <SectionLabel label="Our mentors" />
          <h2
            id="team-heading"
            className="type-h2 text-tone-heading mt-2 mb-4 max-w-lg"
          >
            Matched by discipline, methodology and software.
          </h2>
          <p className="type-body text-tone-body max-w-xl mb-10">
            You meet your mentor after you book or subscribe. Until then, here
            is what every mentor on our team brings to your work.
          </p>

          <ul className="divide-y divide-tone-rule border-y border-tone-rule max-w-2xl">
            <li className="py-5 flex items-start gap-4">
              <span
                className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-2.5"
                aria-hidden="true"
              />
              <p className="type-body text-tone-body">
                Every mentor holds an earned postgraduate degree in their
                discipline. Some hold doctorates. All have supervised or
                assisted on research at university level.
              </p>
            </li>
            <li className="py-5 flex items-start gap-4">
              <span
                className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-2.5"
                aria-hidden="true"
              />
              <p className="type-body text-tone-body">
                We match you by subject area, by your research methodology
                (qualitative, quantitative, mixed), and by the analysis software
                you are using.
              </p>
            </li>
            <li className="py-5 flex items-start gap-4">
              <span
                className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-2.5"
                aria-hidden="true"
              />
              <p className="type-body text-tone-body">
                You see your mentor&apos;s name, background and brief bio inside
                your student dashboard, after a mentor has been assigned to you.
                We do not publish mentor profiles publicly.
              </p>
            </li>
          </ul>
        </div>
      </Section>

      {/* ── SECTION 06: TESTIMONIALS (conditional) ────────────────────────── */}
      {testimonials.length > 0 && (
        <Section
          tone="white"
          aria-labelledby="stories-heading"
          className="border-b border-tone-rule"
        >
          <div className="site-container py-16 md:py-20">
            <SectionLabel label="Student stories" />
            <h2
              id="stories-heading"
              className="type-h2 text-tone-heading mt-2 mb-10 max-w-lg"
            >
              From students who did the work.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rule">
              {testimonials.map((t) => (
                <article
                  key={t.id}
                  className="bg-white p-6 space-y-3"
                >
                  {t.headline && (
                    <p className="font-serif text-lg text-tone-heading leading-snug">
                      &ldquo;{t.headline}&rdquo;
                    </p>
                  )}
                  {t.summary && (
                    <p className="type-small text-tone-muted leading-relaxed">
                      {t.summary}
                    </p>
                  )}
                  <footer className="pt-2 border-t border-tone-rule">
                    <p className="type-micro text-tone-muted">
                      {t.student_display_name ?? "GradEdge student"}
                      {t.study_level && (
                        <span className="ml-2 capitalize">
                          &middot; {t.study_level}
                        </span>
                      )}
                    </p>
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* ── SECTION 07: BLOG PREVIEW (conditional) ────────────────────────── */}
      {recentPosts.length > 0 && (
        <Section
          tone="paper"
          aria-labelledby="blog-heading"
          className="border-b border-tone-rule"
        >
          <div className="site-container py-16 md:py-20">
            <SectionLabel label="From the blog" />
            <div className="flex items-end justify-between gap-4 mt-2 mb-10">
              <h2
                id="blog-heading"
                className="type-h2 text-tone-heading max-w-lg"
              >
                Writing on research, methodology and the craft of the thesis.
              </h2>
              <Link
                href="/blog"
                className="hidden md:inline-flex items-center gap-2 type-small link-editorial pb-0.5 font-medium shrink-0"
              >
                <span>Read all articles</span>
                <ArrowIcon />
              </Link>
            </div>

            <ul className="divide-y divide-tone-rule border-t border-tone-rule">
              {recentPosts.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 py-5 group hover:bg-cream/30 transition-colors duration-150 -mx-3 px-3"
                  >
                    <div className="w-full sm:w-44 shrink-0">
                      <Photo
                        src="/images/blog/header.jpg"
                        alt={post.title}
                        aspectRatio="3:2"
                        navyWash={true}
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      {post.category && post.category[0] && (
                        <p className="type-micro text-gold">
                          {post.category[0].name}
                        </p>
                      )}
                      <p className="font-serif text-base text-tone-heading font-medium group-hover:text-navy leading-snug">
                        {post.title}
                      </p>
                      {post.standfirst && (
                        <p className="type-small text-tone-muted line-clamp-2">
                          {post.standfirst}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0 text-tone-muted">
                      {post.reading_time_minutes && (
                        <span className="type-small">
                          {post.reading_time_minutes} min read
                        </span>
                      )}
                      <span
                        className="text-rule group-hover:text-gold transition-colors duration-150"
                        aria-hidden="true"
                      >
                        <ArrowIcon />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 md:hidden">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 type-small link-editorial pb-0.5 font-medium"
              >
                <span>Read all articles</span>
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </Section>
      )}

      {/* ── SECTION 08: FAQ PREVIEW (conditional) ─────────────────────────── */}
      {faqItems.length > 0 && (
        <Section
          tone="cream"
          aria-labelledby="faq-heading"
          className="border-b border-tone-rule"
        >
          <div className="site-container py-16 md:py-20">
            <SectionLabel label="Common questions" />
            <div className="flex items-end justify-between gap-4 mt-2 mb-10">
              <h2
                id="faq-heading"
                className="type-h2 text-tone-heading max-w-lg"
              >
                Questions students ask before they book.
              </h2>
              <Link
                href="/faq"
                className="hidden md:inline-flex items-center gap-2 type-small link-editorial pb-0.5 font-medium shrink-0"
              >
                <span>See all questions</span>
                <ArrowIcon />
              </Link>
            </div>

            <div className="max-w-3xl">
              {faqItems.map((item) => (
                <AccordionItem key={item.id} title={item.question}>
                  {item.answer}
                </AccordionItem>
              ))}
            </div>

            <div className="mt-8 md:hidden">
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 type-small link-editorial pb-0.5 font-medium"
              >
                <span>See all questions</span>
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </Section>
      )}

      {/* ── SECTION 09: CLOSING CTA ───────────────────────────────────────── */}
      <Section tone="navy" aria-label="Book a consultation">
        <div className="site-container py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h2 className="type-h1 text-tone-heading">
                Book a call. Tell us where you are. We&apos;ll take it from there.
              </h2>
              <p className="type-lead text-tone-body">
                A free twenty-minute call is enough for us to understand what
                you&apos;re working on and tell you honestly whether we can help.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button variant="accent" size="lg" href="/booking">
                  Book a free 20-minute call
                </Button>
                <Link
                  href="/contact"
                  className="type-small link-editorial pb-0.5"
                >
                  Prefer to write first? Send us a message.
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5">
              <Photo
                src="/images/home/cta.jpg"
                alt="Quiet academic library study room overlooking campus trees in afternoon light"
                aspectRatio="16:9"
                navyWash={true}
              />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

// ─── Inline data ─────────────────────────────────────────────────────────────

const stuckItems = [
  {
    text: "Your supervisor says \"tighten the argument\" and you don't know which argument they mean.",
    href: "/services/dissertation-thesis-mentoring",
  },
  {
    text: "Your data is collected. The analysis chapter is empty and the deadline is real.",
    href: "/services/quantitative-data-analysis",
  },
  {
    text: "You haven't written a sentence in three months. You're not sure why.",
    href: "/services/dissertation-thesis-mentoring",
  },
  {
    text: "Your literature review summarises papers instead of building an argument.",
    href: "/services/literature-review-support",
  },
  {
    text: "The ethics committee sent questions back that you didn't expect.",
    href: "/services/research-design-ethics",
  },
  {
    text: "Your committee liked the proposal. Now you have to do the actual study.",
    href: "/services",
  },
];

const howWeWorkSteps = [
  {
    title: "Tell us where you are",
    description:
      "Book a free call or fill in a brief. Tell us your level, your topic, your deadline and where you are stuck. No judgement, no paperwork.",
  },
  {
    title: "Get matched with a mentor in your field",
    description:
      "We assign a mentor with expertise in your discipline and your methodology. You see their background inside your dashboard once matched.",
  },
  {
    title: "Work in short cycles with written feedback",
    description:
      "Sessions and feedback cycles are kept short and focused: one chapter, one argument, one dataset at a time. You write. We respond. You rewrite.",
  },
  {
    title: "Submit work that is yours",
    description:
      "Everything in your final submission was written by you. Our job is to make you capable of writing it well, not to write it for you.",
  },
];

// ─── Arrow icon ───────────────────────────────────────────────────────────────

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="inline-block"
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
