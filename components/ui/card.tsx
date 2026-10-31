import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  topRuleGold?: boolean;
  background?: "paper" | "cream" | "white";
}

export function Card({
  topRuleGold = false,
  background = "cream",
  className,
  children,
  ...props
}: CardProps) {
  const bgStyles = {
    paper: "bg-paper",
    cream: "bg-cream",
    white: "bg-white",
  };

  return (
    <div
      className={cn(
        "border border-tone-rule hover:border-gold/60 rounded-[2px] p-6 transition-all duration-150 relative shadow-2xs",
        bgStyles[background],
        topRuleGold && "border-t-[3px] border-t-gold hover:border-t-gold",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4 space-y-1", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-serif text-xl font-medium text-tone-heading tracking-tight", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-tone-muted leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("text-sm text-tone-body", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-6 pt-4 border-t border-tone-rule flex items-center justify-between text-xs text-tone-muted", className)}
      {...props}
    >
      {children}
    </div>
  );
}

