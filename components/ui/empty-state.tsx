import React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "border border-tone-rule bg-cream/70 p-10 sm:p-12 text-center rounded-[2px]",
        className
      )}
    >
      {icon && <div className="mx-auto mb-3 text-tone-muted flex justify-center">{icon}</div>}
      <h3 className="font-serif text-lg font-medium text-tone-heading">{title}</h3>
      <p className="mt-2 text-xs sm:text-sm text-tone-muted max-w-md mx-auto leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}

