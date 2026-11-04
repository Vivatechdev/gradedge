export type Currency = "USD" | "NGN";

export type PaymentPurpose = "booking" | "package" | "program" | "membership";

export type PaymentStatus = "initiated" | "succeeded" | "failed" | "refunded";

export interface InitializePaymentParams {
  email: string;
  amountMinor: number;
  currency: Currency;
  reference: string;
  callbackUrl: string;
  planCode?: string;
  metadata?: Record<string, unknown>;
}

export interface InitializePaymentResult {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

export interface VerifyPaymentResult {
  success: boolean;
  reference: string;
  amountMinor: number;
  currency: Currency;
  paidAt?: string;
  customerEmail?: string;
  customerName?: string;
  planCode?: string;
  subscriptionCode?: string;
  status: "success" | "failed" | "abandoned" | "pending";
  rawPayload: Record<string, unknown>;
}

export interface CreatePlanParams {
  name: string;
  amountMinor: number;
  interval: "hourly" | "daily" | "weekly" | "monthly" | "biannually" | "annually";
  currency: Currency;
  description?: string;
}

export interface CreatePlanResult {
  planCode: string;
  name: string;
  amountMinor: number;
  interval: string;
  currency: Currency;
  rawPayload: Record<string, unknown>;
}

export interface SubscribeParams {
  email: string;
  planCode: string;
  startDateTime?: string;
  metadata?: Record<string, unknown>;
}

export interface CancelSubscriptionParams {
  subscriptionCode: string;
  token?: string;
}

export interface RefundParams {
  transactionReference: string;
  amountMinor?: number;
  reason: string;
}

export interface RefundResult {
  success: boolean;
  refundId?: string;
  amountMinor: number;
  status: string;
  rawPayload: Record<string, unknown>;
}

export interface WebhookEvent {
  event: string;
  data: Record<string, unknown>;
}

export interface PaymentProvider {
  name: string;
  initializePayment(params: InitializePaymentParams): Promise<InitializePaymentResult>;
  verifyPayment(reference: string): Promise<VerifyPaymentResult>;
  handleWebhook(rawBody: string, signature: string): Promise<{ isValid: boolean; event?: WebhookEvent }>;
  createPlan(params: CreatePlanParams): Promise<CreatePlanResult>;
  subscribe(params: SubscribeParams): Promise<{ authorizationUrl?: string; subscriptionCode?: string }>;
  cancelSubscription(params: CancelSubscriptionParams): Promise<{ success: boolean }>;
  refund(params: RefundParams): Promise<RefundResult>;
}

/**
 * Currency and Integer Money Utilities
 * Rule: Store all amounts in minor units (kobo / cents).
 * Never use floating point math for money.
 */
export function toMinorUnits(amountMajor: number): number {
  return Math.round(amountMajor * 100);
}

export function fromMinorUnits(amountMinor: number): number {
  return Math.floor(amountMinor) / 100;
}

export function formatMoney(amountMinor: number, currency: Currency): string {
  const major = fromMinorUnits(amountMinor);
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: major % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(major);
  } else {
    // NGN formatting with ₦ symbol
    return `₦${new Intl.NumberFormat("en-NG", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(major)}`;
  }
}

/**
 * Split a minor unit total into N equal parts with exact integer accounting
 * The remainder is assigned to the first installment so that:
 * sum(parts) === totalMinor exactly.
 */
export function splitInstallments(totalMinor: number, parts: number): number[] {
  if (parts <= 1) return [totalMinor];
  const base = Math.floor(totalMinor / parts);
  const remainder = totalMinor - base * parts;

  const result: number[] = [];
  for (let i = 0; i < parts; i++) {
    result.push(i === 0 ? base + remainder : base);
  }
  return result;
}
