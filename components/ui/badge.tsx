import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "navy" | "gold" | "outline";
  size?: "sm" | "md";
}

export function Badge({
  variant = "default",
  size = "sm",
  className,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-paper text-tone-body border-tone-rule",
    navy: "badge-navy bg-navy/10 text-navy border-navy/20",
    gold: "badge-gold bg-gold/15 text-[#744F10] border-gold/30",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-[#F39C12]/10 text-[#B7791F] border-[#F39C12]/20",
    error: "bg-error/10 text-error border-error/20",
    outline: "badge-outline bg-transparent text-tone-body border-tone-rule",
  };

  const sizeStyles = {
    sm: "text-[10px] px-1.5 py-0.5 tracking-wider",
    md: "text-xs px-2.5 py-1 tracking-widest",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center uppercase font-semibold border rounded-[2px] select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export const StatusTag = Badge;

