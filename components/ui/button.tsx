"use client";

import React, { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "secondary" | "link";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  href?: string;
  icon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      href,
      icon,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors duration-150 btn-focus rounded-[2px] cursor-pointer disabled:pointer-events-none select-none";

    const variantStyles = {
      primary:
        "btn-primary shadow-none",
      accent:
        "btn-accent shadow-none font-semibold",
      secondary:
        "btn-secondary shadow-none",
      link:
        "bg-transparent p-0 border-none rounded-none link-editorial inline-block",
    };

    const sizeStyles = {
      sm: variant === "link" ? "text-xs" : "text-xs px-3 py-1.5 gap-1.5",
      md: variant === "link" ? "text-sm" : "text-sm px-4 py-2.5 gap-2",
      lg: variant === "link" ? "text-base" : "text-base px-6 py-3 gap-2.5",
    };

    const content = (
      <>
        {isLoading && (
          <svg
            className="animate-spin -ml-0.5 mr-2 h-3.5 w-3.5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

