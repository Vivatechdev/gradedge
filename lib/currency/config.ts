export type SupportedCurrency = "USD" | "NGN" | "GBP" | "EUR" | "GHS" | "ZAR" | "KES";

export const SUPPORTED_CURRENCIES: SupportedCurrency[] = [
  "USD",
  "NGN",
  "GBP",
  "EUR",
  "GHS",
  "ZAR",
  "KES",
];

export const DEFAULT_CURRENCY: SupportedCurrency = "USD";
export const CURRENCY_COOKIE_NAME = "gradedge_currency";

/**
 * Country to Currency Mapping
 * Maps 2-letter ISO 3166-1 alpha-2 country codes (from x-vercel-ip-country or cf-ipcountry)
 * to one of the 7 supported currencies.
 */
export const COUNTRY_TO_CURRENCY_MAP: Record<string, SupportedCurrency> = {
  // Nigeria -> NGN
  NG: "NGN",
  // Ghana -> GHS
  GH: "GHS",
  // Kenya -> KES
  KE: "KES",
  // South Africa -> ZAR
  ZA: "ZAR",
  // United Kingdom -> GBP
  GB: "GBP",
  // Eurozone countries -> EUR
  AT: "EUR", // Austria
  BE: "EUR", // Belgium
  CY: "EUR", // Cyprus
  EE: "EUR", // Estonia
  FI: "EUR", // Finland
  FR: "EUR", // France
  DE: "EUR", // Germany
  GR: "EUR", // Greece
  IE: "EUR", // Ireland
  IT: "EUR", // Italy
  LV: "EUR", // Latvia
  LT: "EUR", // Lithuania
  LU: "EUR", // Luxembourg
  MT: "EUR", // Malta
  NL: "EUR", // Netherlands
  PT: "EUR", // Portugal
  SK: "EUR", // Slovakia
  SI: "EUR", // Slovenia
  ES: "EUR", // Spain
  // United States & default -> USD
  US: "USD",
};

export interface CurrencyMetadata {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  locale: string;
  paystackDirectSupported: boolean; // Directly chargeable on Paystack account
  approximateExchangeFromUsd: number; // Benchmark rate for admin copy tool & approximation display
}

export const CURRENCY_METADATA: Record<SupportedCurrency, CurrencyMetadata> = {
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    locale: "en-US",
    paystackDirectSupported: true,
    approximateExchangeFromUsd: 1.0,
  },
  NGN: {
    code: "NGN",
    symbol: "₦",
    name: "Nigerian Naira",
    locale: "en-NG",
    paystackDirectSupported: true,
    approximateExchangeFromUsd: 1500,
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    locale: "en-GB",
    paystackDirectSupported: false, // Charged in USD on Paystack account; displayed as approx. only
    approximateExchangeFromUsd: 0.79,
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    locale: "en-IE",
    paystackDirectSupported: false, // Charged in USD on Paystack account; displayed as approx. only
    approximateExchangeFromUsd: 0.92,
  },
  GHS: {
    code: "GHS",
    symbol: "GH₵",
    name: "Ghanaian Cedi",
    locale: "en-GH",
    paystackDirectSupported: true, // Supported natively by Paystack in West Africa
    approximateExchangeFromUsd: 15.5,
  },
  ZAR: {
    code: "ZAR",
    symbol: "R",
    name: "South African Rand",
    locale: "en-ZA",
    paystackDirectSupported: true, // Supported natively by Paystack in South Africa
    approximateExchangeFromUsd: 18.2,
  },
  KES: {
    code: "KES",
    symbol: "KSh",
    name: "Kenyan Shilling",
    locale: "en-KE",
    paystackDirectSupported: true, // Supported natively by Paystack in East Africa
    approximateExchangeFromUsd: 130,
  },
};

/**
 * Resolve currency for a given country code string (with fallback to USD)
 */
export function resolveCurrencyFromCountry(countryCode?: string | null): SupportedCurrency {
  if (!countryCode) return DEFAULT_CURRENCY;
  const upper = countryCode.trim().toUpperCase();
  return COUNTRY_TO_CURRENCY_MAP[upper] || DEFAULT_CURRENCY;
}

/**
 * Validate whether a string is one of the supported currencies
 */
export function isSupportedCurrency(curr: string): curr is SupportedCurrency {
  return SUPPORTED_CURRENCIES.includes(curr.toUpperCase() as SupportedCurrency);
}

