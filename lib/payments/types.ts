export interface InitializePaymentParams {
  email: string;
  amountMinor: number;
  currency: "USD" | "NGN";
  reference: string;
  callbackUrl: string;
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
  currency: string;
  paidAt?: string;
  rawPayload: Record<string, unknown>;
}

export interface PaymentProvider {
  name: string;
  initializePayment(params: InitializePaymentParams): Promise<InitializePaymentResult>;
  verifyPayment(reference: string): Promise<VerifyPaymentResult>;
}

