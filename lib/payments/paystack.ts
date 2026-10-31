import { PaymentProvider, InitializePaymentParams, InitializePaymentResult, VerifyPaymentResult } from "./types";

export class PaystackProvider implements PaymentProvider {
  name = "paystack";
  private secretKey: string;

  constructor(secretKey?: string) {
    this.secretKey = secretKey || process.env.PAYSTACK_SECRET_KEY || "";
  }

  async initializePayment(params: InitializePaymentParams): Promise<InitializePaymentResult> {
    if (!this.secretKey) {
      throw new Error("Paystack secret key is missing");
    }

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: params.email,
        amount: params.amountMinor,
        currency: params.currency,
        reference: params.reference,
        callback_url: params.callbackUrl,
        metadata: params.metadata,
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.status) {
      throw new Error(data.message || "Failed to initialize Paystack transaction");
    }

    return {
      authorizationUrl: data.data.authorization_url,
      accessCode: data.data.access_code,
      reference: data.data.reference,
    };
  }

  async verifyPayment(reference: string): Promise<VerifyPaymentResult> {
    if (!this.secretKey) {
      throw new Error("Paystack secret key is missing");
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
      },
    });

    const data = await response.json();
    if (!response.ok || !data.status) {
      return {
        success: false,
        reference,
        amountMinor: 0,
        currency: "USD",
        rawPayload: data,
      };
    }

    const isSuccess = data.data.status === "success";

    return {
      success: isSuccess,
      reference: data.data.reference,
      amountMinor: data.data.amount,
      currency: data.data.currency,
      paidAt: data.data.paid_at,
      rawPayload: data.data,
    };
  }
}

export const paystack = new PaystackProvider();

