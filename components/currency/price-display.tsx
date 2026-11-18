"use client";

import React, { useEffect, useState } from "react";
import { useCurrency } from "./currency-context";
import { formatPrice } from "@/lib/currency/format";
import { SupportedCurrency, CURRENCY_METADATA } from "@/lib/currency/config";
import { DEFAULT_CANONICAL_PRICES } from "@/lib/currency/service";

export interface PriceDisplayProps {
  amountMinor?: number;
  currency?: SupportedCurrency;
  itemId?: string;
  className?: string;
  showApproxLabel?: boolean;
}

export function PriceDisplay({
  amountMinor,
  currency: explicitCurrency,
  itemId,
  className,
  showApproxLabel = true,
}: PriceDisplayProps) {
  const { currency: contextCurrency, isLoaded } = useCurrency();
  const activeCurrency = explicitCurrency || (isLoaded ? contextCurrency : "USD");

  // If an itemId is provided, resolve from canonical prices for that currency
  let resolvedAmountMinor = amountMinor;
  if (itemId && DEFAULT_CANONICAL_PRICES[itemId]) {
    const itemPrices = DEFAULT_CANONICAL_PRICES[itemId];
    resolvedAmountMinor = itemPrices[activeCurrency] ?? itemPrices.USD;
  }

  if (resolvedAmountMinor === undefined) {
    resolvedAmountMinor = 0;
  }

  const formatted = formatPrice(resolvedAmountMinor, activeCurrency);
  const isDirect = CURRENCY_METADATA[activeCurrency]?.paystackDirectSupported ?? true;

  return (
    <span className={className}>
      <span>{formatted}</span>
      {showApproxLabel && !isDirect && (
        <span className="text-[10px] font-sans font-normal text-tone-muted ml-1 italic">
          (approx. only)
        </span>
      )}
    </span>
  );
}

