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
  title: {
    absolute: "GradEdge | Thesis mentoring and research coaching",
    default: "GradEdge | Thesis mentoring and research coaching",
  },
  description:
    "Expert thesis mentoring for graduate students. Get written feedback, data analysis help and defense coaching from a mentor in your field.",
  openGraph: {
    type: "website",
    title: "GradEdge | Thesis mentoring and research coaching",
    description:
      "Expert thesis mentoring for graduate students. Get written feedback, data analysis help and defense coaching from a mentor in your field.",
    siteName: "GradEdge Academic Solutions",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://gradedge.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "GradEdge | Thesis mentoring and research coaching",
    description:
      "Expert thesis mentoring for graduate students. Get written feedback, data analysis help and defense coaching from a mentor in your field.",
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
          <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-12 lg:gap-14 items-center">
            {/* Left Column */}
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[44px] xl:text-[50px] text-tone-heading font-semibold leading-[1.1] tracking-tight">
                Thesis mentoring from{" "}
                <u className="underline decoration-gold decoration-[0.08em] underline-offset-[0.12em]">
                  proposal to defense.
                </u>
              </h1>

              <p className="type-lead text-tone-muted my-6 sm:my-8 leading-relaxed max-w-[62ch]">
                GradEdge pairs you with an expert in your field for written feedback, data analysis and defense coaching. You write it. We help you get it right.
              </p>

              <div className="flex items-center gap-5 flex-wrap">
                <Button variant="accent" size="lg" href="/book">
                  Book a free 20-minute call
                </Button>
                <Link
                  href="#services"
                  className="type-body text-tone-heading hover:text-navy transition-colors font-medium"
                >
                  Explore services
                </Link>
              </div>

              {/* Plain scope row separated by hairlines */}
              <div className="mt-8 pt-6 border-t border-tone-rule max-w-[560px]">
                <div className="flex flex-wrap items-center text-sm text-tone-body font-medium">
                  <span className="pr-3">Proposal</span>
                  <span className="h-3 w-px bg-tone-rule" aria-hidden="true" />
                  <span className="px-3">Analysis</span>
                  <span className="h-3 w-px bg-tone-rule" aria-hidden="true" />
                  <span className="px-3">Writing</span>
                  <span className="h-3 w-px bg-tone-rule" aria-hidden="true" />
                  <span className="px-3">Publishing</span>
                  <span className="h-3 w-px bg-tone-rule" aria-hidden="true" />
                  <span className="pl-3">Defense</span>
                </div>
                <p className="mt-3 text-xs sm:text-sm text-tone-muted">
                  For undergraduate, Masters and doctoral researchers, worldwide.
                </p>
              </div>
            </div>

            {/* Right Column: Three-image mosaic with floating cards */}
            <div
              className="relative h-[480px] lg:h-[600px] w-full"
              aria-label="Overview of thesis mentoring and research coaching in practice"
            >
              {/* Mosaic grid: 14px gaps, 4px corners */}
              <div className="grid grid-cols-2 grid-rows-2 gap-[14px] h-full w-full">
                {/* Tall left image */}
                <div className="row-span-2 h-full w-full rounded-[4px] overflow-hidden">
                  <Photo
                    src="/images/home/hero.jpg"
                    alt="Graduate researcher working through thesis revisions with mentor feedback"
                    aspectRatio="full"
                    priority={true}
                    sizes="(max-width: 1024px) 50vw, 320px"
                    className="h-full w-full"
                  />
                </div>

                {/* Top right image */}
                <div className="h-full w-full rounded-[4px] overflow-hidden">
                  <Photo
                    src="/images/home/how-we-work.jpg"
                    alt="Academic mentor conducting in-depth research methodology consultation"
                    aspectRatio="full"
                    sizes="(max-width: 1024px) 50vw, 320px"
                    className="h-full w-full"
                  />
                </div>

                {/* Bottom right image */}
                <div className="h-full w-full rounded-[4px] overflow-hidden">
                  <Photo
                    src="/images/home/integrity.jpg"
                    alt="Scholarly library research and academic writing references"
                    aspectRatio="full"
                    sizes="(max-width: 1024px) 50vw, 320px"
                    className="h-full w-full"
                  />
                </div>
              </div>

              {/* Floating Card 1: Mentor-review card */}
              <div className="absolute top-3 sm:top-6 left-2 sm:left-4 lg:-left-6 z-20 w-[calc(100%-16px)] max-w-[270px] sm:max-w-[300px] bg-white border border-tone-rule rounded-[4px] p-3 sm:p-4 shadow-[0_10px_30px_rgba(20,38,63,0.12)]">
                <div className="text-[0.72rem] sm:text-[0.78rem] text-tone-muted font-semibold border-b border-tone-rule pb-1.5 mb-2">
                  Chapter 3 · Methodology Review
                </div>
                <p className="line-through text-tone-muted decoration-[#C0392B] text-xs sm:text-[0.84rem] leading-relaxed mb-1.5">
                  The survey sample was correlated using standard linear regression models.
                </p>
                <p className="border-l-[3px] border-gold pl-2.5 py-0.5 text-xs sm:text-[0.84rem] text-tone-heading font-medium leading-relaxed">
                  Instruments were validated via exploratory factor analysis, followed by hierarchical regression.
                </p>
                <div className="mt-2.5 p-2 bg-cream border border-tone-rule rounded-[3px] text-[0.75rem] sm:text-[0.8rem] text-tone-muted">
                  <strong className="block text-tone-heading font-semibold mb-0.5">Mentor comment</strong>
                  Check normality assumptions before running the coefficient tests.
                </div>
              </div>

              {/* Floating Card 2: Milestone card with three progress bars */}
              <div className="absolute bottom-3 sm:bottom-6 right-2 sm:right-4 lg:-right-6 z-20 w-[calc(100%-16px)] max-w-[210px] sm:max-w-[230px] bg-white border border-tone-rule rounded-[4px] p-3.5 sm:p-4 shadow-[0_10px_30px_rgba(20,38,63,0.12)]">
                <strong className="block text-tone-heading font-semibold text-xs sm:text-sm mb-2.5">
                  Research milestones
                </strong>

                <div className="mb-2">
                  <div className="flex justify-between text-[0.75rem] text-tone-body font-medium mb-1">
                    <span>Proposal approved</span>
                    <span className="text-tone-muted">100%</span>
                  </div>
                  <div className="h-1.5 bg-tone-rule rounded-[3px] overflow-hidden">
                    <span className="block h-full bg-gold rounded-[3px] w-full" />
                  </div>
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-[0.75rem] text-tone-body font-medium mb-1">
                    <span>Methodology draft</span>
                    <span className="text-tone-muted">60%</span>
                  </div>
                  <div className="h-1.5 bg-tone-rule rounded-[3px] overflow-hidden">
                    <span className="block h-full bg-gold rounded-[3px] w-[60%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[0.75rem] text-tone-body font-medium mb-1">
                    <span>Analysis chapter</span>
                    <span className="text-tone-muted">25%</span>
                  </div>
                  <div className="h-1.5 bg-tone-rule rounded-[3px] overflow-hidden">
                    <span className="block h-full bg-gold rounded-[3px] w-[25%]" />
                  </div>
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
          <div className="mb-10 max-w-3xl rounded-[3px] overflow-hidden shadow-[0_4px_20px_rgba(20,38,63,0.06)] border border-tone-rule">
            <Photo
              src="/images/home/stuck.jpg"
              alt="Empirical survey data sheets and Chapter 4 statistical analysis draft on an academic research desk"
              aspectRatio="16:9"
              navyWash={false}
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
                are the skills you carry into your defense, your next paper, and
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
