"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface AccordionItemProps {
  id?: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
  className,
}: AccordionItemProps) {
  return (
    <details
      open={defaultOpen}
      className={cn(
        "group border-b border-tone-rule py-4 transition-all duration-150 last:border-b-0",
        className
      )}
    >
      <summary className="flex cursor-pointer items-center justify-between text-left font-serif text-lg text-tone-heading font-medium list-none select-none hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-[var(--tone-focus-ring)]">
        <span>{title}</span>
        <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center text-tone-muted group-open:rotate-180 transition-transform duration-200">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </summary>
      <div className="mt-3 text-sm text-tone-body leading-relaxed pr-8 pt-1">
        {children}
      </div>
    </details>
  );
}

export function Accordion({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("divide-y divide-tone-rule border-y border-tone-rule", className)}>
      {children}
    </div>
  );
}

