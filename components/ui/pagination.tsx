import React from "react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className={cn("flex items-center justify-between border-t border-tone-rule pt-4 text-xs", className)}
    >
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1.5 border border-tone-rule text-tone-body hover:bg-cream disabled:opacity-40 disabled:pointer-events-none rounded-[2px] transition-colors"
      >
        &larr; Previous
      </button>

      <span className="text-tone-muted">
        Page <span className="font-semibold text-tone-body">{currentPage}</span> of{" "}
        <span className="font-semibold text-tone-body">{totalPages}</span>
      </span>

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1.5 border border-tone-rule text-tone-body hover:bg-cream disabled:opacity-40 disabled:pointer-events-none rounded-[2px] transition-colors"
      >
        Next &rarr;
      </button>
    </nav>
  );
}

