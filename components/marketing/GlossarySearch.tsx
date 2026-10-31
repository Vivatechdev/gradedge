"use client";

import React, { useState } from "react";

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export function GlossarySearch({ terms }: { terms: GlossaryTerm[] }) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? terms.filter(
        (t) =>
          t.term.toLowerCase().includes(query.toLowerCase()) ||
          t.definition.toLowerCase().includes(query.toLowerCase())
      )
    : terms;

  // Group by first letter
  const alphabet = Array.from(
    new Set(filtered.map((t) => t.term[0].toUpperCase()))
  ).sort();

  return (
    <div className="space-y-8">
      <div className="max-w-md">
        <label htmlFor="glossary-search" className="type-micro text-tone-muted mb-2 block">
          Search terminology
        </label>
        <input
          id="glossary-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter research terms (e.g. validity, epistemology)..."
          className="w-full border border-tone-rule bg-white px-3.5 py-2 text-sm text-tone-body rounded-[2px] focus:outline-2 focus:outline-navy"
        />
      </div>

      {/* Alphabet shortcut list */}
      <nav aria-label="Alphabetical index" className="flex flex-wrap gap-2 py-3 border-y border-tone-rule">
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => {
          const hasLetter = alphabet.includes(letter);
          return (
            <a
              key={letter}
              href={hasLetter ? `#letter-${letter}` : undefined}
              className={`w-7 h-7 flex items-center justify-center text-xs font-semibold rounded-[2px] ${
                hasLetter
                  ? "bg-cream text-navy hover:bg-gold hover:text-white"
                  : "text-rule opacity-40 pointer-events-none"
              }`}
            >
              {letter}
            </a>
          );
        })}
      </nav>

      {filtered.length === 0 ? (
        <div className="py-12 text-center border-b border-tone-rule">
          <p className="type-body text-tone-muted">
            No terms matched &ldquo;{query}&rdquo;.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {alphabet.map((letter) => {
            const letterTerms = filtered.filter(
              (t) => t.term[0].toUpperCase() === letter
            );
            return (
              <section key={letter} id={`letter-${letter}`} className="scroll-mt-24 space-y-4">
                <h3 className="font-serif text-2xl text-gold font-medium border-b border-tone-rule pb-2">
                  {letter}
                </h3>
                <dl className="divide-y divide-tone-rule border-b border-tone-rule">
                  {letterTerms.map((t) => (
                    <div key={t.term} className="py-4 grid grid-cols-1 md:grid-cols-12 gap-2">
                      <dt className="md:col-span-4 font-serif text-base text-tone-heading font-semibold">
                        {t.term}
                      </dt>
                      <dd className="md:col-span-8 type-body text-tone-muted leading-relaxed">
                        {t.definition}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

