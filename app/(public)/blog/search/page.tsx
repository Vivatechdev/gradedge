"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageBreadcrumb, PageHero, ArrowRight } from "@/components/marketing/page-components";

interface SearchResult {
  slug: string;
  title: string;
  standfirst: string | null;
  reading_time_minutes: number | null;
}

function BlogSearchContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const isQueryValid = query.trim().length >= 2;

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/blog/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(Array.isArray(data) ? data : []);
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const displayResults = isQueryValid ? results : [];

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <label htmlFor="blog-search-input" className="type-micro text-tone-muted mb-2 block">
          Article search keywords
        </label>
        <input
          id="blog-search-input"
          type="search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by topic, method, software (e.g. SPSS, literature review, ethics)..."
          className="w-full border border-tone-rule bg-white px-4 py-3 text-base text-tone-body rounded-[2px] focus:outline-2 focus:outline-navy"
        />
      </div>

      {loading && (
        <div className="text-sm text-tone-muted py-4">Searching published articles...</div>
      )}

      {!loading && isQueryValid && displayResults.length === 0 && (
        <div className="p-8 text-center border border-tone-rule bg-white rounded-[2px] space-y-2">
          <p className="type-body text-tone-heading font-medium">
            No articles match &ldquo;{query}&rdquo;.
          </p>
          <p className="type-small text-tone-muted">
            Try searching for broader keywords like &ldquo;methodology&rdquo;, &ldquo;analysis&rdquo;, or &ldquo;thesis&rdquo;.
          </p>
        </div>
      )}

      {displayResults.length > 0 && (
        <div className="space-y-4">
          <p className="type-micro text-tone-muted">
            {displayResults.length} article{displayResults.length === 1 ? "" : "s"} found
          </p>
          <ul className="divide-y divide-tone-rule border-y border-tone-rule bg-white">
            {displayResults.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/blog/${r.slug}`}
                  className="py-4 px-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 group hover:bg-cream/30 transition-colors"
                >
                  <div className="space-y-1">
                    <h3 className="font-serif text-lg text-tone-heading font-semibold group-hover:text-navy transition-colors">
                      {r.title}
                    </h3>
                    {r.standfirst && (
                      <p className="text-xs text-tone-muted line-clamp-2 leading-relaxed">
                        {r.standfirst}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-xs text-tone-muted">
                    <span>{r.reading_time_minutes ?? 4} min</span>
                    <span className="text-rule group-hover:text-gold transition-colors">
                      <ArrowRight />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function BlogSearchPage() {
  return (
    <>
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: "Search" },
        ]}
      />

      <PageHero
        sectionNumber={1}
        sectionLabel="Article Index"
        headline="Search the GradEdge Blog"
        standfirst="Search through all published articles, statistical guides, and academic writing advice."
      />

      <div className="site-container py-12 md:py-16">
        <Suspense fallback={<div className="p-8 text-tone-muted">Loading search...</div>}>
          <BlogSearchContent />
        </Suspense>
      </div>
    </>
  );
}

