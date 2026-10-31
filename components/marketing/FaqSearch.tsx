"use client";

import React, { useState } from "react";
import { AccordionItem, Accordion } from "@/components/ui/accordion";

export interface FaqItemType {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export function FaqSearch({ faqs }: { faqs: FaqItemType[] }) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? faqs.filter(
        (f) =>
          f.question.toLowerCase().includes(query.toLowerCase()) ||
          f.answer.toLowerCase().includes(query.toLowerCase()) ||
          f.category.toLowerCase().includes(query.toLowerCase())
      )
    : faqs;

  // Group by category
  const categories = Array.from(new Set(filtered.map((f) => f.category)));

  return (
    <div className="space-y-8">
      <div className="max-w-md">
        <label htmlFor="faq-search" className="type-micro text-tone-muted mb-2 block">
          Filter questions
        </label>
        <input
          id="faq-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type keywords (e.g. refund, ethics, mentor, data)..."
          className="w-full border border-tone-rule bg-white px-3.5 py-2 text-sm text-tone-body rounded-[2px] focus:outline-2 focus:outline-navy"
        />
      </div>

      {categories.length === 0 ? (
        <div className="py-12 text-center border-y border-tone-rule">
          <p className="type-body text-tone-muted">
            No questions matched &ldquo;{query}&rdquo;.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {categories.map((cat) => {
            const items = filtered.filter((f) => f.category === cat);
            return (
              <div key={cat} className="space-y-4">
                <h3 className="type-h3 text-tone-heading capitalize border-b border-tone-rule pb-2">
                  {cat.replace(/-/g, " ")}
                </h3>
                <Accordion>
                  {items.map((item) => (
                    <AccordionItem key={item.id} title={item.question}>
                      <div className="prose prose-sm text-tone-muted leading-relaxed">
                        {item.answer}
                      </div>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

