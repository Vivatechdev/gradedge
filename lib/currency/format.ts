import {
  SupportedCurrency,
  CURRENCY_METADATA,
  DEFAULT_CURRENCY,
  isSupportedCurrency,
} from "./config";

/**
 * Universal Price Formatter
 * Formats minor units (cents / kobo / pesewas) using Intl.NumberFormat
 *
 * @param amountMinor Integer amount in minor units (e.g. 7500 for $75.00)
 * @param currency ISO currency code (NGN, USD, GBP, EUR, GHS, ZAR, KES; defaults to USD)
 * @param locale Optional IETF BCP 47 language tag
 * @returns Formatted currency string with correct local symbol
 */
export function formatPrice(
  amountMinor: number,
  currency: string = DEFAULT_CURRENCY,
  locale?: string
): string {
  const upper = currency ? (currency.toUpperCase() as SupportedCurrency) : DEFAULT_CURRENCY;
  const curr: SupportedCurrency = isSupportedCurrency(upper) ? upper : DEFAULT_CURRENCY;
  const meta = CURRENCY_METADATA[curr] || CURRENCY_METADATA[DEFAULT_CURRENCY];
  const targetLocale = locale || meta.locale || "en-US";
  const amountMajor = Math.floor(amountMinor) / 100;

  // Determine whether to display fractional cents/kobo
  const hasDecimals = amountMajor % 1 !== 0;

  // Specific canonical symbol formatting where standard Intl.NumberFormat might omit
  // or abbreviate symbols in certain non-local environments
  if (curr === "NGN") {
    const formattedNum = new Intl.NumberFormat(targetLocale, {
      minimumFractionDigits: hasDecimals ? 2 : 0,
      maximumFractionDigits: 2,
    }).format(amountMajor);
    return `₦${formattedNum}`;
  }

  if (curr === "GHS") {
    const formattedNum = new Intl.NumberFormat(targetLocale, {
      minimumFractionDigits: hasDecimals ? 2 : 0,
      maximumFractionDigits: 2,
    }).format(amountMajor);
    return `GH₵${formattedNum}`;
  }

  if (curr === "KES") {
    const formattedNum = new Intl.NumberFormat(targetLocale, {
      minimumFractionDigits: hasDecimals ? 2 : 0,
      maximumFractionDigits: 2,
    }).format(amountMajor);
    return `KSh ${formattedNum}`;
  }

  if (curr === "ZAR") {
    const formattedNum = new Intl.NumberFormat(targetLocale, {
      minimumFractionDigits: hasDecimals ? 2 : 0,
      maximumFractionDigits: 2,
    }).format(amountMajor);
    return `R${formattedNum}`;
  }

  return new Intl.NumberFormat(targetLocale, {
    style: "currency",
    currency: curr,
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amountMajor);
}

