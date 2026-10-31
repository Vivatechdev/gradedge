import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export type SectionTone = "paper" | "cream" | "white" | "navy" | "navy-deep";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Required tone driving CSS variables for all child components */
  tone: SectionTone;
  /** HTML semantic element to render, default is "section" */
  as?: "section" | "div" | "article" | "aside" | "header" | "footer" | "main";
  /** If true, wraps children in a standard .site-container (max-w 1180px) */
  container?: boolean;
}

export const TONE_STYLES: Record<
  SectionTone,
  {
    bg: string;
    heading: string;
    body: string;
    muted: string;
    link: string;
    linkUnderline: string;
    rule: string;
    focusRing: string;
    inputBg: string;
    inputText: string;
    inputBorder: string;
    inputPlaceholder: string;
  }
> = {
  paper: {
    bg: "#FAF8F4",
    heading: "#14263F",
    body: "#2B2B2B",
    muted: "#555555",
    link: "#1F3A5F",
    linkUnderline: "#C8963E",
    rule: "#E4DFD5",
    focusRing: "#C8963E",
    inputBg: "#FFFFFF",
    inputText: "#2B2B2B",
    inputBorder: "#8C827A",
    inputPlaceholder: "#555555",
  },
  cream: {
    bg: "#FBF5E9",
    heading: "#14263F",
    body: "#2B2B2B",
    muted: "#555555",
    link: "#1F3A5F",
    linkUnderline: "#C8963E",
    rule: "#E4DFD5",
    focusRing: "#C8963E",
    inputBg: "#FFFFFF",
    inputText: "#2B2B2B",
    inputBorder: "#8C827A",
    inputPlaceholder: "#555555",
  },
  white: {
    bg: "#FFFFFF",
    heading: "#14263F",
    body: "#2B2B2B",
    muted: "#555555",
    link: "#1F3A5F",
    linkUnderline: "#C8963E",
    rule: "#E4DFD5",
    focusRing: "#C8963E",
    inputBg: "#FAF8F4",
    inputText: "#2B2B2B",
    inputBorder: "#8C827A",
    inputPlaceholder: "#555555",
  },
  navy: {
    bg: "#1F3A5F",
    heading: "#FFFFFF",
    body: "#E6ECF4",
    muted: "#B9C6D8",
    link: "#E0B563",
    linkUnderline: "#E0B563",
    rule: "rgba(255, 255, 255, 0.2)",
    focusRing: "#E0B563",
    inputBg: "#FFFFFF",
    inputText: "#14263F",
    inputBorder: "rgba(255, 255, 255, 0.6)",
    inputPlaceholder: "#555555",
  },
  "navy-deep": {
    bg: "#14263F",
    heading: "#FFFFFF",
    body: "#E6ECF4",
    muted: "#B9C6D8",
    link: "#E0B563",
    linkUnderline: "#E0B563",
    rule: "rgba(255, 255, 255, 0.2)",
    focusRing: "#E0B563",
    inputBg: "#FFFFFF",
    inputText: "#14263F",
    inputBorder: "rgba(255, 255, 255, 0.6)",
    inputPlaceholder: "#555555",
  },
};

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ tone, as = "section", container = false, className, style, children, ...props }, ref) => {
    const Component = as as React.ElementType;
    const toneData = TONE_STYLES[tone];

    // Inline CSS variable bindings ensure cascade regardless of class precedence
    const toneVars = {
      "--tone-bg": toneData.bg,
      "--tone-heading": toneData.heading,
      "--tone-body": toneData.body,
      "--tone-muted": toneData.muted,
      "--tone-link": toneData.link,
      "--tone-link-underline": toneData.linkUnderline,
      "--tone-rule": toneData.rule,
      "--tone-focus-ring": toneData.focusRing,
      "--tone-input-bg": toneData.inputBg,
      "--tone-input-text": toneData.inputText,
      "--tone-input-border": toneData.inputBorder,
      "--tone-input-placeholder": toneData.inputPlaceholder,
      backgroundColor: "var(--tone-bg)",
      color: "var(--tone-body)",
      ...style,
    } as React.CSSProperties;

    return (
      <Component
        ref={ref}
        data-tone={tone}
        className={cn("tone-section", `tone-${tone}`, className)}
        style={toneVars}
        {...props}
      >
        {container ? <div className="site-container">{children}</div> : children}
      </Component>
    );
  }
);

Section.displayName = "Section";

