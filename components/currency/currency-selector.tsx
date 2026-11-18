"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCurrency } from "./currency-context";
import { SUPPORTED_CURRENCIES, CURRENCY_METADATA, SupportedCurrency } from "@/lib/currency/config";
import { Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function CurrencySelector({
  className,
  variant = "compact",
}: {
  className?: string;
  variant?: "compact" | "full";
}) {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentMeta = CURRENCY_METADATA[currency] || CURRENCY_METADATA.USD;

  return (
    <div ref={containerRef} className={cn("relative inline-block text-left", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Select currency"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium text-tone-heading bg-white border border-tone-rule rounded-[2px] hover:border-navy transition-colors cursor-pointer"
      >
        <span className="text-gold font-semibold">{currentMeta.symbol}</span>
        <span>{currency}</span>
        <ChevronDown className="w-3 h-3 text-tone-muted" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-48 bg-white border border-tone-rule rounded-[2px] shadow-lg py-1 z-50 text-xs font-sans">
          <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider text-tone-muted border-b border-tone-rule">
            Select Currency
          </div>
          <div className="max-h-60 overflow-y-auto">
            {SUPPORTED_CURRENCIES.map((code) => {
              const meta = CURRENCY_METADATA[code];
              const isSelected = code === currency;

              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setCurrency(code);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 flex items-center justify-between hover:bg-paper transition-colors cursor-pointer",
                    isSelected && "bg-paper font-semibold text-navy"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-gold font-bold w-4 text-center">
                      {meta.symbol}
                    </span>
                    <span>{meta.name}</span>
                  </div>
                  <span className="font-mono text-[10px] text-tone-muted uppercase">
                    {code}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

