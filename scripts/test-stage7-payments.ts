import crypto from "crypto";
import {
  toMinorUnits,
  fromMinorUnits,
  formatMoney,
  splitInstallments,
} from "../lib/payments/types";
import { PaystackProvider, paymentProvider } from "../lib/payments/paystack";
import { lookupPrice } from "../lib/payments/service";
import { generateInvoicePdfBuffer } from "../lib/payments/invoice-pdf";
import { checkRateLimit, recordFailedAttempt } from "../lib/auth/server";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("STAGE 7: PAYSTACK PAYMENTS, INVOICING & CHECKOUT TESTS");
  console.log("=======================================================\n");

  // TEST 1: Minor Unit Money Utilities
  console.log("1. Minor Unit Arithmetic & Currency Formatting (No Floating Point):");
  assert(toMinorUnits(95.0) === 9500, "Converts $95.00 to 9500 minor units");
  assert(toMinorUnits(45000) === 4500000, "Converts ₦45,000 to 4500000 minor units");
  assert(fromMinorUnits(9500) === 95.0, "Converts 9500 minor units back to 95.00 major");
  assert(fromMinorUnits(4500000) === 45000, "Converts 4500000 minor units back to 45000 major");

  const formattedUsd = formatMoney(9500, "USD");
  assert(formattedUsd === "$95", `Formats USD correctly: ${formattedUsd}`);

  const formattedNgn = formatMoney(4500000, "NGN");
  assert(formattedNgn.includes("45,000") && formattedNgn.includes("₦"), `Formats NGN with ₦ symbol: ${formattedNgn}`);

  // TEST 2: Exact Installment Splitting (Zero Penny Loss)
  console.log("\n2. Installment Splitting Integer Invariant:");
  const testTotal = 100000; // $1,000.00
  const parts = splitInstallments(testTotal, 3);
  assert(parts.length === 3, "Splits into exactly 3 parts");
  const sumParts = parts.reduce((a, b) => a + b, 0);
  assert(sumParts === testTotal, `Sum of parts (${sumParts}) strictly matches original total (${testTotal})`);
  assert(parts[0] === 33334 && parts[1] === 33333 && parts[2] === 33333, "Remainder properly assigned to first installment");

  // TEST 3: Server-side Price Lookup
  console.log("\n3. Strict Server-side Price Lookup (Client price not trusted):");
  const bookingPriceUsd = await lookupPrice({ purpose: "booking", currency: "USD" });
  assert(bookingPriceUsd.amountMinor === 7500, "Paid session booking USD is strictly 7500 minor units ($75.00)");

  const bookingPriceNgn = await lookupPrice({ purpose: "booking", currency: "NGN" });
  assert(bookingPriceNgn.amountMinor === 3500000, "Paid session booking NGN is strictly 3500000 minor units (₦35,000)");

  const accelFull = await lookupPrice({ purpose: "program", currency: "USD", isInstallment: false });
  assert(accelFull.amountMinor === 120000, "Accelerator full tuition is strictly 120000 minor units ($1,200)");

  const accelPart1 = await lookupPrice({
    purpose: "program",
    currency: "USD",
    isInstallment: true,
    installmentNumber: 1,
    installmentTotal: 3,
  });
  assert(accelPart1.amountMinor === 40000, "Accelerator installment 1 of 3 is 40000 minor units ($400)");

  const membershipScholar = await lookupPrice({ purpose: "membership", currency: "USD", planId: "scholar" });
  assert(membershipScholar.amountMinor === 9500, "Scholar membership is $95/month (9500 minor units)");

  const membershipFellow = await lookupPrice({ purpose: "membership", currency: "USD", planId: "doctoral-fellow" });
  assert(membershipFellow.amountMinor === 18000, "Fellow membership is $180/month (18000 minor units)");

  let rejectedInvalidPurpose = false;
  try {
    await lookupPrice({ purpose: "invalid" as any, currency: "USD" });
  } catch {
    rejectedInvalidPurpose = true;
  }
  assert(rejectedInvalidPurpose, "Rejects unsupported payment purpose");

  // TEST 4: Paystack Provider Interface & Fallback Invariants
  console.log("\n4. Payment Provider Interface & Webhook Validation:");
  const testSecret = "sk_test_gradedge_secret_1234567890";
  process.env.PAYSTACK_WEBHOOK_SECRET = testSecret;
  const provider = new PaystackProvider(testSecret);

  // Initialize
  const initRes = await provider.initializePayment({
    email: "scholar@university.edu",
    amountMinor: 9500,
    currency: "USD",
    reference: "GE_PAY_TEST_INIT_1",
    callbackUrl: "https://gradedge.com/checkout/verify",
  });
  assert(Boolean(initRes.authorizationUrl), "Payment initialization generates authorizationUrl");
  assert(initRes.reference === "GE_PAY_TEST_INIT_1", "Preserves transaction reference");

  // Verify
  const verifyRes = await provider.verifyPayment("GE_PAY_TEST_INIT_1");
  assert(verifyRes.success === true, "Mock/Dev verification succeeds for clean reference");

  // Webhook Signature Verification with HMAC SHA512
  const rawWebhookBody = JSON.stringify({
    event: "charge.success",
    data: {
      reference: "GE_PAY_TEST_INIT_1",
      amount: 9500,
      currency: "USD",
      status: "success",
    },
  });

  const validSignature = crypto.createHmac("sha512", testSecret).update(rawWebhookBody).digest("hex");
  const webhookResult = await provider.handleWebhook(rawWebhookBody, validSignature);
  assert(webhookResult.isValid === true, "Valid HMAC SHA512 signature is approved");
  assert(webhookResult.event?.event === "charge.success", "Correctly extracts webhook event type");

  // Tampered payload
  const tamperedResult = await provider.handleWebhook(rawWebhookBody + " ", validSignature);
  assert(tamperedResult.isValid === false, "Tampered webhook payload is strictly rejected");

  // Forged signature
  const forgedResult = await provider.handleWebhook(rawWebhookBody, "bad_signature_00000000000000000000000000000000");
  assert(forgedResult.isValid === false, "Forged webhook signature is strictly rejected");

  // TEST 5: PDF Invoice Generation
  console.log("\n5. PDF Invoice Generation (Brand Styling & Business Details):");
  const invoicePdf = generateInvoicePdfBuffer({
    invoiceNumber: "GE-2026-0001",
    issuedAt: new Date("2026-11-04"),
    currency: "USD",
    amountMinor: 9500,
    customerName: "Dr. Candidate",
    customerEmail: "candidate@oxford.ac.uk",
    paymentReference: "GE_PAY_TEST_INIT_1",
    items: [
      {
        description: "Doctoral Dissertation Scope Review",
        quantity: 1,
        amountMinor: 9500,
      },
    ],
    businessDetails: {
      legalName: "GradEdge Academic Solutions Ltd",
      taxId: "TIN-GE-2026-9481",
    },
  });

  assert(Buffer.isBuffer(invoicePdf), "Outputs a standard Node.js Buffer");
  assert(invoicePdf.subarray(0, 5).toString() === "%PDF-", "Buffer contains valid %PDF- header");
  assert(invoicePdf.toString("utf-8").includes("GE-2026-0001"), "Embeds correct sequential invoice number");
  assert(invoicePdf.toString("utf-8").includes("GradEdge Academic Solutions Ltd"), "Embeds legal entity name from settings");

  // TEST 6: Rate Limiting Enforcement
  console.log("\n6. Checkout Rate Limiting Security:");
  const testIp = "192.168.1.50";
  // Attempt 10 times
  let lastCheck = null;
  for (let i = 0; i < 10; i++) {
    lastCheck = checkRateLimit("payment_init_test", testIp, 10, 600000);
    recordFailedAttempt("payment_init_test", testIp, 10, 600000);
  }
  assert(lastCheck?.allowed === true, "Allows up to 10 attempts within window");

  // 11th attempt must be rejected
  const blockedCheck = checkRateLimit("payment_init_test", testIp, 10, 600000);
  assert(blockedCheck.allowed === false, "Blocks 11th attempt when rate limit exceeded");

  // TEST 7: Refund Invariant
  console.log("\n7. Payment Provider Refund Handling:");
  const refundRes = await provider.refund({
    transactionReference: "GE_PAY_TEST_INIT_1",
    amountMinor: 9500,
    reason: "Student requested cancellation within policy window",
  });
  assert(refundRes.success === true, "Provider processes refund request");
  assert(refundRes.status === "processed", "Refund marked as processed");

  // Summary
  console.log("\n=======================================================");
  console.log(`TEST SUMMARY: ${passed} passed, ${failed} failed.`);
  console.log("=======================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
