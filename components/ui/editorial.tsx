import React from "react";
import { cn } from "@/lib/utils";

// --- SECTION LABEL ---
// Small numbered label such as "01 / Services" with micro-label uppercase letter-spacing
export interface SectionLabelProps {
  number?: string | number;
  label: string;
  className?: string;
}

export function SectionLabel({ number, label, className }: SectionLabelProps) {
  const formattedNumber =
    number !== undefined
      ? typeof number === "number"
        ? String(number).padStart(2, "0")
        : number
      : null;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-tone-muted select-none mb-3",
        className
      )}
    >
      {formattedNumber && (
        <>
          <span className="text-gold font-serif font-medium">{formattedNumber}</span>
          <span className="opacity-40" style={{ color: "var(--tone-muted)" }}>/</span>
        </>
      )}
      <span>{label}</span>
    </div>
  );
}

// --- PULL QUOTE ---
// University press editorial pull quote with left rule and Fraunces typography
export interface PullQuoteProps {
  quote: string;
  attribution?: string;
  role?: string;
  className?: string;
}

export function PullQuote({ quote, attribution, role, className }: PullQuoteProps) {
  return (
    <figure
      className={cn(
        "my-8 pl-6 border-l-2 border-l-gold py-2 bg-cream/20",
        className
      )}
    >
      <blockquote className="font-serif text-xl sm:text-2xl text-tone-heading leading-relaxed font-normal">
        &ldquo;{quote}&rdquo;
      </blockquote>
      {attribution && (
        <figcaption className="mt-3 text-xs uppercase tracking-wider text-tone-muted">
          <strong className="text-tone-heading font-semibold">{attribution}</strong>
          {role && <span className="ml-1 opacity-80">&mdash; {role}</span>}
        </figcaption>
      )}
    </figure>
  );
}

// --- MARGIN NOTE ---
// Editorial side note / marginalia for research notes and commentary
export interface MarginNoteProps {
  calloutNumber?: string | number;
  children: React.ReactNode;
  className?: string;
}

export function MarginNote({ calloutNumber, children, className }: MarginNoteProps) {
  return (
    <aside
      className={cn(
        "text-xs text-tone-muted border-l border-tone-rule pl-3 py-1 my-3 bg-paper/40 leading-relaxed",
        className
      )}
    >
      {calloutNumber && (
        <span className="font-serif font-medium text-gold mr-1.5">
          [{calloutNumber}]
        </span>
      )}
      <span className="italic">{children}</span>
    </aside>
  );
}

// --- STEP LIST ---
// List with large serif numerals (01, 02, 03...)
export interface StepItem {
  number?: string | number;
  title: string;
  description: string;
}

export interface StepListProps {
  steps: StepItem[];
  className?: string;
}

export function StepList({ steps, className }: StepListProps) {
  return (
    <ol className={cn("divide-y divide-tone-rule border-y border-tone-rule", className)}>
      {steps.map((step, index) => {
        const stepNum = step.number ?? String(index + 1).padStart(2, "0");
        return (
          <li key={index} className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline">
            <div className="md:col-span-2 font-serif text-3xl sm:text-4xl text-gold font-normal">
              {stepNum}
            </div>
            <div className="md:col-span-10 space-y-1.5">
              <h4 className="font-serif text-lg sm:text-xl text-tone-heading font-medium">
                {step.title}
              </h4>
              <p className="text-sm text-tone-muted leading-relaxed max-w-2xl">
                {step.description}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

