"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageBreadcrumb, PageHero } from "@/components/marketing/page-components";

interface SearchResults {
  services: { slug: string; title: string; summary: string }[];
  subjects: { slug: string; title: string; summary: string }[];
  posts: { slug: string; title: string; standfirst: string | null }[];
  faqs: { question: string; answer: string }[];
}

const EMPTY_RESULTS: SearchResults = {
  services: [],
  subjects: [],
  posts: [],
  faqs: [],
};

function SiteSearchContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState<SearchResults>(EMPTY_RESULTS);
  const [loading, setLoading] = useState(false);

  const isQueryValid = query.trim().length >= 2;

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch {
        setResults(EMPTY_RESULTS);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const activeResults = isQueryValid ? results : EMPTY_RESULTS;

  const totalResults =
    activeResults.services.length +
    activeResults.subjects.length +
    activeResults.posts.length +
    activeResults.faqs.length;

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <label htmlFor="site-search-input" className="type-micro text-tone-muted mb-2 block">
          Search GradEdge
        </label>
        <input
          id="site-search-input"
          type="search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search services, disciplines, articles, and FAQs..."
          className="w-full border border-tone-rule bg-white px-4 py-3 text-base text-tone-body rounded-[2px] focus:outline-2 focus:outline-navy"
        />
      </div>

      {loading && (
        <div className="text-sm text-tone-muted py-4">Searching platform index...</div>
      )}

      {!loading && query.trim().length >= 2 && totalResults === 0 && (
        <div className="p-8 text-center border border-tone-rule bg-white rounded-[2px] space-y-2">
          <p className="type-body text-tone-heading font-medium">
            No matching results found for &ldquo;{query}&rdquo;.
          </p>
          <p className="type-small text-tone-muted">
            Try searching for broader terms like &ldquo;proposal&rdquo;, &ldquo;data analysis&rdquo;, &ldquo;dissertation&rdquo;, or &ldquo;pricing&rdquo;.
          </p>
        </div>
      )}

      {totalResults > 0 && (
        <div className="space-y-12">
          {/* Services */}
          {activeResults.services.length > 0 && (
            <div className="space-y-3">
              <h3 className="type-micro text-gold">Services ({activeResults.services.length})</h3>
              <div className="divide-y divide-tone-rule border-y border-tone-rule bg-white">
                {activeResults.services.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="p-4 block group hover:bg-cream/30 transition-colors"
                  >
                    <h4 className="font-serif text-base font-semibold text-tone-heading group-hover:text-navy">
                      {s.title}
                    </h4>
                    <p className="text-xs text-tone-muted line-clamp-2 mt-0.5">{s.summary}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Subjects */}
          {activeResults.subjects.length > 0 && (
            <div className="space-y-3">
              <h3 className="type-micro text-gold">Disciplines ({activeResults.subjects.length})</h3>
              <div className="divide-y divide-tone-rule border-y border-tone-rule bg-white">
                {activeResults.subjects.map((sub) => (
                  <Link
                    key={sub.slug}
                    href={`/subjects/${sub.slug}`}
                    className="p-4 block group hover:bg-cream/30 transition-colors"
                  >
                    <h4 className="font-serif text-base font-semibold text-tone-heading group-hover:text-navy">
                      {sub.title}
                    </h4>
                    <p className="text-xs text-tone-muted line-clamp-2 mt-0.5">{sub.summary}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Posts */}
          {activeResults.posts.length > 0 && (
            <div className="space-y-3">
              <h3 className="type-micro text-gold">Articles ({activeResults.posts.length})</h3>
              <div className="divide-y divide-tone-rule border-y border-tone-rule bg-white">
                {activeResults.posts.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="p-4 block group hover:bg-cream/30 transition-colors"
                  >
                    <h4 className="font-serif text-base font-semibold text-tone-heading group-hover:text-navy">
                      {p.title}
                    </h4>
                    {p.standfirst && (
                      <p className="text-xs text-tone-muted line-clamp-2 mt-0.5">{p.standfirst}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* FAQs */}
          {activeResults.faqs.length > 0 && (
            <div className="space-y-3">
              <h3 className="type-micro text-gold">FAQ Answers ({activeResults.faqs.length})</h3>
              <div className="divide-y divide-tone-rule border-y border-tone-rule bg-white">
                {activeResults.faqs.map((f, i) => (
                  <div key={i} className="p-4 space-y-1">
                    <h4 className="font-serif text-base font-semibold text-tone-heading">
                      {f.question}
                    </h4>
                    <p className="text-xs text-tone-muted leading-relaxed">{f.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SiteSearchPage() {
  return (
    <>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Search" }]} />

      <PageHero
        sectionNumber={1}
        sectionLabel="Platform Directory"
        headline="Search GradEdge"
        standfirst="Search across our full catalog of research services, discipline hubs, methodology articles, and FAQs."
      />

      <div className="site-container py-12 md:py-16">
        <Suspense fallback={<div className="p-8 text-tone-muted">Loading search portal...</div>}>
          <SiteSearchContent />
        </Suspense>
      </div>
    </>
  );
}

