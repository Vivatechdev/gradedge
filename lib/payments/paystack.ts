import crypto from "crypto";
import {
  PaymentProvider,
  InitializePaymentParams,
  InitializePaymentResult,
  VerifyPaymentResult,
  CreatePlanParams,
  CreatePlanResult,
  SubscribeParams,
  CancelSubscriptionParams,
  RefundParams,
  RefundResult,
  WebhookEvent,
} from "./types";

export class PaystackProvider implements PaymentProvider {
  name = "paystack";
  private secretKey: string;
  private isMock: boolean;

  constructor(secretKey?: string) {
    this.secretKey = secretKey || process.env.PAYSTACK_SECRET_KEY || "";
    this.isMock =
      process.env.PAYSTACK_MOCK === "true" ||
      this.secretKey.includes("mock") ||
      this.secretKey.startsWith("sk_test_gradedge_") ||
      (!this.secretKey && process.env.NODE_ENV !== "production");
  }

  async initializePayment(params: InitializePaymentParams): Promise<InitializePaymentResult> {
    if (this.isMock) {
      return {
        authorizationUrl: `https://checkout.paystack.com/mock_${params.reference}`,
        accessCode: `mock_code_${params.reference}`,
        reference: params.reference,
      };
    }

    if (!this.secretKey) {
      throw new Error("Paystack secret key is missing");
    }

    const payload: Record<string, unknown> = {
      email: params.email,
      amount: params.amountMinor,
      currency: params.currency,
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    };

    if (params.planCode) {
      payload.plan = params.planCode;
    }

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
    if (this.isMock) {
      const isFailed = reference.includes("fail") || reference.includes("declined");
      const isAbandoned = reference.includes("abandon");
      return {
        success: !isFailed && !isAbandoned,
        reference,
        amountMinor: 500000,
        currency: "USD",
        paidAt: isFailed || isAbandoned ? undefined : new Date().toISOString(),
        customerEmail: "student@example.com",
        customerName: "Research Candidate",
        status: isFailed ? "failed" : isAbandoned ? "abandoned" : "success",
        rawPayload: { status: isFailed ? "failed" : isAbandoned ? "abandoned" : "success", reference },
      };
    }

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
        status: "failed",
        rawPayload: data,
      };
    }

    const txStatus = data.data.status;
    const isSuccess = txStatus === "success";

    return {
      success: isSuccess,
      reference: data.data.reference,
      amountMinor: data.data.amount,
      currency: (data.data.currency as "USD" | "NGN") || "USD",
      paidAt: data.data.paid_at,
      customerEmail: data.data.customer?.email,
      customerName: data.data.customer ? `${data.data.customer.first_name || ""} ${data.data.customer.last_name || ""}`.trim() : undefined,
      planCode: data.data.plan,
      status: txStatus === "success" ? "success" : txStatus === "abandoned" ? "abandoned" : "failed",
      rawPayload: data.data,
    };
  }

  async handleWebhook(rawBody: string, signature: string): Promise<{ isValid: boolean; event?: WebhookEvent }> {
    const webhookSecret = process.env.PAYSTACK_WEBHOOK_SECRET || this.secretKey;
    if (!webhookSecret) {
      return { isValid: false };
    }

    if (!signature) {
      return { isValid: false };
    }

    const hash = crypto.createHmac("sha512", webhookSecret).update(rawBody).digest("hex");
    
    // Timing-safe comparison to prevent timing attacks
    const hashBuf = Buffer.from(hash, "utf-8");
    const sigBuf = Buffer.from(signature, "utf-8");

    if (hashBuf.length !== sigBuf.length) {
      return { isValid: false };
    }

    const isValid = crypto.timingSafeEqual(hashBuf, sigBuf);
    if (!isValid) {
      return { isValid: false };
    }

    try {
      const parsed = JSON.parse(rawBody);
      return {
        isValid: true,
        event: {
          event: parsed.event,
          data: parsed.data || {},
        },
      };
    } catch {
      return { isValid: false };
    }
  }

  async createPlan(params: CreatePlanParams): Promise<CreatePlanResult> {
    if (this.isMock) {
      return {
        planCode: `PLN_mock_${Date.now()}`,
        name: params.name,
        amountMinor: params.amountMinor,
        interval: params.interval,
        currency: params.currency,
        rawPayload: { mock: true },
      };
    }

    if (!this.secretKey) {
      throw new Error("Paystack secret key is missing");
    }

    const response = await fetch("https://api.paystack.co/plan", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: params.name,
        amount: params.amountMinor,
        interval: params.interval,
        currency: params.currency,
        description: params.description,
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.status) {
      throw new Error(data.message || "Failed to create Paystack plan");
    }

    return {
      planCode: data.data.plan_code,
      name: data.data.name,
      amountMinor: data.data.amount,
      interval: data.data.interval,
      currency: data.data.currency,
      rawPayload: data.data,
    };
  }

  async subscribe(params: SubscribeParams): Promise<{ authorizationUrl?: string; subscriptionCode?: string }> {
    if (this.isMock) {
      return {
        subscriptionCode: `SUB_mock_${Date.now()}`,
      };
    }

    if (!this.secretKey) {
      throw new Error("Paystack secret key is missing");
    }

    const response = await fetch("https://api.paystack.co/subscription", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: params.email,
        plan: params.planCode,
        start_date: params.startDateTime,
        metadata: params.metadata,
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.status) {
      throw new Error(data.message || "Failed to subscribe to Paystack plan");
    }

    return {
      subscriptionCode: data.data.subscription_code,
    };
  }

  async cancelSubscription(params: CancelSubscriptionParams): Promise<{ success: boolean }> {
    if (this.isMock) {
      return { success: true };
    }

    if (!this.secretKey) {
      throw new Error("Paystack secret key is missing");
    }

    const response = await fetch("https://api.paystack.co/subscription/disable", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: params.subscriptionCode,
        token: params.token || "",
      }),
    });

    const data = await response.json();
    return {
      success: response.ok && Boolean(data.status),
    };
  }

  async refund(params: RefundParams): Promise<RefundResult> {
    if (this.isMock) {
      return {
        success: true,
        refundId: `ref_mock_${Date.now()}`,
        amountMinor: params.amountMinor || 0,
        status: "processed",
        rawPayload: { mock: true, reason: params.reason },
      };
    }

    if (!this.secretKey) {
      throw new Error("Paystack secret key is missing");
    }

    const body: Record<string, unknown> = {
      transaction: params.transactionReference,
      merchant_note: params.reason,
    };

    if (params.amountMinor) {
      body.amount = params.amountMinor;
    }

    const response = await fetch("https://api.paystack.co/refund", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok || !data.status) {
      throw new Error(data.message || "Failed to process refund via Paystack");
    }

    return {
      success: true,
      refundId: data.data.id?.toString(),
      amountMinor: data.data.amount,
      status: data.data.status,
      rawPayload: data.data,
    };
  }
}

export const paystack = new PaystackProvider();
export const paymentProvider: PaymentProvider = paystack;
