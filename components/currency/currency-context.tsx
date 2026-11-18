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
    // Read cookie on client mount
    const saved = getCookie(CURRENCY_COOKIE_NAME);
    if (saved && isSupportedCurrency(saved)) {
      setCurrencyState(saved.toUpperCase() as SupportedCurrency);
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

