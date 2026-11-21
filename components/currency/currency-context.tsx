"use client";

import React, { createContext, useContext, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  SupportedCurrency,
  SUPPORTED_CURRENCIES,
  DEFAULT_CURRENCY,
  CURRENCY_COOKIE_NAME,
  CURRENCY_METADATA,
  isSupportedCurrency,
} from "@/lib/currency/config";
import { formatPrice } from "@/lib/currency/format";

interface CurrencyContextType {
  currency: SupportedCurrency;
  setCurrency: (c: SupportedCurrency) => void;
  format: (amountMinor: number, customCurrency?: SupportedCurrency) => string;
  isLoaded: boolean;
  supportedCurrencies: SupportedCurrency[];
  paystackDirectSupported: boolean;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: DEFAULT_CURRENCY,
  setCurrency: () => {},
  format: (amountMinor) => formatPrice(amountMinor, DEFAULT_CURRENCY),
  isLoaded: false,
  supportedCurrencies: SUPPORTED_CURRENCIES,
  paystackDirectSupported: true,
});

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^|; )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days: number = 365) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

/**
 * Automatically infers local currency using browser timezone & locale
 * when IP headers are not available (e.g. localhost, client-first mount).
 */
function inferCurrencyFromClient(): SupportedCurrency | null {
  if (typeof window === "undefined") return null;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz.includes("Lagos") || tz.includes("Nigeria")) return "NGN";
    if (tz.includes("London") || tz.includes("Belfast")) return "GBP";
    if (tz.includes("Nairobi")) return "KES";
    if (tz.includes("Accra")) return "GHS";
    if (tz.includes("Johannesburg")) return "ZAR";
    if (
      tz.includes("Paris") ||
      tz.includes("Berlin") ||
      tz.includes("Dublin") ||
      tz.includes("Amsterdam") ||
      tz.includes("Madrid") ||
      tz.includes("Rome") ||
      tz.includes("Brussels") ||
      tz.includes("Vienna") ||
      tz.includes("Lisbon") ||
      tz.includes("Helsinki") ||
      tz.includes("Athens")
    ) {
      return "EUR";
    }

    const lang = (navigator.language || "").toLowerCase();
    if (lang.endsWith("-ng")) return "NGN";
    if (lang.endsWith("-gb")) return "GBP";
    if (lang.endsWith("-ke")) return "KES";
    if (lang.endsWith("-gh")) return "GHS";
    if (lang.endsWith("-za")) return "ZAR";
    if (
      lang.startsWith("fr") ||
      lang.startsWith("de") ||
      lang.startsWith("es") ||
      lang.startsWith("it") ||
      lang.startsWith("nl") ||
      lang.endsWith("-ie")
    ) {
      return "EUR";
    }
  } catch {
    // Graceful fallback
  }
  return null;
}

export function CurrencyProvider({
  initialCurrency,
  children,
}: {
  initialCurrency?: SupportedCurrency;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [currency, setCurrencyState] = useState<SupportedCurrency>(initialCurrency || DEFAULT_CURRENCY);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. Read existing cookie if user previously set or received one
    const saved = getCookie(CURRENCY_COOKIE_NAME);
    if (saved && isSupportedCurrency(saved)) {
      setCurrencyState(saved.toUpperCase() as SupportedCurrency);
    } else {
      // 2. Automatically detect based on user's device timezone and browser locale
      const autoInferred = inferCurrencyFromClient();
      if (autoInferred) {
        setCurrencyState(autoInferred);
        setCookie(CURRENCY_COOKIE_NAME, autoInferred);
      }
    }
    setIsLoaded(true);
  }, []);

  const setCurrency = (newCurrency: SupportedCurrency) => {
    if (!isSupportedCurrency(newCurrency)) return;
    setCurrencyState(newCurrency);
    setCookie(CURRENCY_COOKIE_NAME, newCurrency);
    
    // Refresh server components to re-render in new currency
    startTransition(() => {
      router.refresh();
    });
  };

  const format = (amountMinor: number, customCurrency?: SupportedCurrency) => {
    return formatPrice(amountMinor, customCurrency || currency);
  };

  const paystackDirectSupported = CURRENCY_METADATA[currency]?.paystackDirectSupported ?? true;

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        format,
        isLoaded,
        supportedCurrencies: SUPPORTED_CURRENCIES,
        paystackDirectSupported,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

