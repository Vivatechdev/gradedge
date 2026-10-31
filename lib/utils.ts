/**
 * Combines class names conditionally.
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Format currency amounts in minor units (e.g. cents/kobo) to formatted display strings.
 */
export function formatCurrency(amountMinor: number, currency: string = "USD"): string {
  const amount = amountMinor / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

