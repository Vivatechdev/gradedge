import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type LogoVariant = "full" | "symbol" | "full-white" | "mono";

export interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  href?: string;
}

/**
 * GradEdge Brand Logo Component
 * Note: When final SVGs are placed in /public/brand/ (logo-symbol.svg, logo-full.svg, logo-full-white.svg, logo-mono.svg),
 * update USE_SVG_ASSETS to true.
 */
const USE_SVG_ASSETS = false;

export function Logo({ variant = "full", className, href = "/" }: LogoProps) {
  const content = USE_SVG_ASSETS ? (
    <div className={cn("inline-flex items-center select-none", className)}>
      {variant === "symbol" && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src="/brand/logo-symbol.svg"
          alt="GradEdge Symbol"
          className="h-7 w-7 object-contain"
        />
      )}
      {variant === "full" && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src="/brand/logo-full.svg"
          alt="GradEdge Academic Solutions"
          className="h-8 min-w-[96px] object-contain"
        />
      )}
      {variant === "full-white" && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src="/brand/logo-full-white.svg"
          alt="GradEdge Academic Solutions"
          className="h-8 min-w-[96px] object-contain"
        />
      )}
      {variant === "mono" && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src="/brand/logo-mono.svg"
          alt="GradEdge"
          className="h-8 min-w-[96px] object-contain"
        />
      )}
    </div>
  ) : (
    // Temporary text wordmark in Fraunces with small gold square mark, clearly isolated.
    // Minimum clear space equal to height of letter E and minimum width 96px.
    <div
      className={cn(
        "inline-flex items-baseline select-none min-w-[96px] tracking-tight group",
        className
      )}
    >
      {variant === "symbol" ? (
        <span className="font-serif text-2xl font-semibold text-white tracking-tight flex items-baseline">
          G<span className="inline-block h-1.5 w-1.5 bg-gold ml-0.5 rounded-[1px]" />
        </span>
      ) : variant === "full-white" ? (
        <span className="font-serif text-2xl font-semibold text-white tracking-tight flex items-baseline">
          GradEdge
          <span className="inline-block h-1.5 w-1.5 bg-gold ml-0.5 rounded-[1px]" />
        </span>
      ) : variant === "mono" ? (
        <span className="font-serif text-2xl font-semibold text-current tracking-tight flex items-baseline">
          GradEdge
          <span className="inline-block h-1.5 w-1.5 bg-current ml-0.5 rounded-[1px]" />
        </span>
      ) : (
        <span className="font-serif text-2xl font-semibold text-tone-heading tracking-tight flex items-baseline">
          GradEdge
          <span className="inline-block h-1.5 w-1.5 bg-gold ml-0.5 rounded-[1px]" />
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label="GradEdge Home" className="inline-flex focus-visible:outline-2 focus-visible:outline-[var(--tone-focus-ring)]">
        {content}
      </Link>
    );
  }

  return content;
}

