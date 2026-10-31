"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T | ((row: T) => string);
  stickyHeader?: boolean;
  className?: string;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  keyField,
  stickyHeader = false,
  className,
  emptyMessage = "No data available in this table.",
  onRowClick,
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (aVal === bVal) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    return sortDirection === "asc" ? 1 : -1;
  });

  const getKey = (row: T, index: number): string => {
    if (typeof keyField === "function") return keyField(row);
    return String(row[keyField] ?? index);
  };

  return (
    <div className={cn("w-full border border-tone-rule bg-white rounded-[2px] overflow-hidden", className)}>
      {/* Desktop / Tablet view: Dense, hairline rows, sticky header, zebra off */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-sm text-tone-body border-collapse">
          <thead
            className={cn(
              "bg-cream border-b border-tone-rule text-xs font-semibold uppercase tracking-wider text-tone-heading",
              stickyHeader && "sticky top-0 z-10"
            )}
          >
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={cn(
                    "px-4 py-3 font-semibold select-none",
                    col.sortable && "cursor-pointer hover:opacity-80 transition-opacity",
                    col.className
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-[10px] text-tone-muted">
                        {sortKey === col.key
                          ? sortDirection === "asc"
                            ? "▲"
                            : "▼"
                          : "↕"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-tone-rule font-normal">
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-xs text-tone-muted italic"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((row, idx) => (
                <tr
                  key={getKey(row, idx)}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={cn(
                    "transition-colors duration-100 hover:bg-paper/80",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-4 py-2.5 text-sm align-middle", col.className)}>
                      {col.render ? col.render(row) : (row[col.key] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile view: Responsive collapse to stacked card rows */}
      <div className="sm:hidden divide-y divide-tone-rule">
        {sortedData.length === 0 ? (
          <div className="p-6 text-center text-xs text-tone-muted italic">{emptyMessage}</div>
        ) : (
          sortedData.map((row, idx) => (
            <div
              key={getKey(row, idx)}
              onClick={() => onRowClick && onRowClick(row)}
              className={cn("p-4 space-y-2 bg-white", onRowClick && "cursor-pointer active:bg-paper")}
            >
              {columns.map((col) => (
                <div key={col.key} className="flex justify-between items-baseline text-xs gap-4">
                  <span className="font-semibold text-tone-muted uppercase tracking-wider shrink-0">
                    {col.header}
                  </span>
                  <span className="text-tone-body text-right font-medium">
                    {col.render ? col.render(row) : (row[col.key] as React.ReactNode)}
                  </span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

