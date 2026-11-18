import { formatPrice } from "@/lib/currency/format";
export { formatPrice };

/**
 * Combines class names conditionally.
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Format currency amounts in minor units (e.g. cents/kobo) to formatted display strings.
 */
export function formatCurrency(amountMinor: number, currency: string = "USD", locale?: string): string {
  return formatPrice(amountMinor, currency, locale);
}

