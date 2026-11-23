"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ColumnDef<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface PaginatedTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  emptyMessage?: string;
  caption?: string;
  className?: string;
}

export function PaginatedTable<T extends Record<string, any>>({
  data,
  columns,
  pageSizeOptions = [10, 25, 50, 100],
  defaultPageSize = 10,
  searchPlaceholder = "Search records...",
  searchKeys,
  emptyMessage = "No matching records found.",
  caption,
  className = "",
}: PaginatedTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // 1. Search filter
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const query = searchQuery.toLowerCase().trim();

    return data.filter((item) => {
      if (searchKeys && searchKeys.length > 0) {
        return searchKeys.some((k) => {
          const val = item[k];
          return val != null && String(val).toLowerCase().includes(query);
        });
      }
      return Object.values(item).some(
        (val) => val != null && String(val).toLowerCase().includes(query)
      );
    });
  }, [data, searchQuery, searchKeys]);

  // 2. Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sortDirection === "asc" ? -1 : 1;
      if (bVal == null) return sortDirection === "asc" ? 1 : -1;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      const strA = String(aVal).toLowerCase();
      const strB = String(bVal).toLowerCase();
      if (strA < strB) return sortDirection === "asc" ? -1 : 1;
      if (strA > strB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortDirection]);

  // 3. Pagination math
  const totalItems = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedRows = useMemo(() => {
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, startIndex, endIndex]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortKey(null);
        setSortDirection("asc");
      }
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  return (
    <div
      role="region"
      aria-label={caption || "Data table"}
      className={`space-y-3.5 ${className}`}
    >
      {/* Controls Bar: Search and Page Size */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-tone-muted" aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-tone-rule rounded-[2px] text-tone-heading placeholder:text-tone-muted focus:outline-none focus:border-gold focus-visible:ring-1 focus-visible:ring-gold"
          />
        </div>

        <div className="flex items-center gap-2 text-tone-muted self-end sm:self-center">
          <label htmlFor="table-page-size" className="text-[11px] whitespace-nowrap">
            Rows per page:
          </label>
          <select
            id="table-page-size"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="h-8 px-2 text-xs bg-white border border-tone-rule rounded-[2px] text-tone-heading focus:outline-none focus:border-gold"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto border border-tone-rule rounded-[2px] bg-white">
        <table className="w-full text-left text-xs border-collapse">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className="bg-paper border-b border-tone-rule text-[11px] uppercase tracking-wider text-tone-muted font-semibold">
            <tr>
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={
                      col.sortable
                        ? isSorted
                          ? sortDirection === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                        : undefined
                    }
                    className={`p-3.5 ${col.className || ""}`}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(col.key)}
                        className="inline-flex items-center gap-1.5 font-semibold text-tone-heading hover:text-gold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
                      >
                        <span>{col.header}</span>
                        <ArrowUpDown className="h-3 w-3 text-tone-muted" aria-hidden="true" />
                      </button>
                    ) : (
                      <span>{col.header}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-tone-rule/60 text-tone-body">
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-tone-muted">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className="hover:bg-paper/40 transition-colors focus-within:bg-paper/60"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`p-3.5 align-middle ${col.className || ""}`}>
                      {col.render ? col.render(row) : row[col.key] != null ? String(row[col.key]) : "—"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div
        className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-tone-muted pt-1"
        aria-live="polite"
      >
        <div>
          {totalItems > 0 ? (
            <span>
              Showing <strong className="text-tone-heading">{startIndex + 1}</strong> to{" "}
              <strong className="text-tone-heading">{endIndex}</strong> of{" "}
              <strong className="text-tone-heading">{totalItems.toLocaleString()}</strong> records
            </span>
          ) : (
            <span>0 records</span>
          )}
        </div>

        {totalPages > 1 && (
          <nav aria-label="Table pagination navigation" className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              disabled={safeCurrentPage === 1}
              aria-label="Go to first page"
              className="p-1.5 rounded-[2px] border border-tone-rule text-tone-muted hover:text-tone-heading disabled:opacity-40 disabled:cursor-not-allowed hover:bg-paper focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
            >
              <ChevronsLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage === 1}
              aria-label="Go to previous page"
              className="p-1.5 rounded-[2px] border border-tone-rule text-tone-muted hover:text-tone-heading disabled:opacity-40 disabled:cursor-not-allowed hover:bg-paper focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            <span className="px-3 text-[11px] font-medium text-tone-heading">
              Page {safeCurrentPage} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage === totalPages}
              aria-label="Go to next page"
              className="p-1.5 rounded-[2px] border border-tone-rule text-tone-muted hover:text-tone-heading disabled:opacity-40 disabled:cursor-not-allowed hover:bg-paper focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(totalPages)}
              disabled={safeCurrentPage === totalPages}
              aria-label="Go to last page"
              className="p-1.5 rounded-[2px] border border-tone-rule text-tone-muted hover:text-tone-heading disabled:opacity-40 disabled:cursor-not-allowed hover:bg-paper focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
            >
              <ChevronsRight className="h-3.5 w-3.5" />
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}

