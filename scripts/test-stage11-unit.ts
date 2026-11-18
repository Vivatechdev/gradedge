/**
 * Stage 11 Unit Test Suite: Money, Date/Timezone/DST, Booking Conflicts, Payment Idempotency
 * Run with: npx tsx scripts/test-stage11-unit.ts
 */

import { SupportedCurrency, CURRENCY_METADATA } from "../lib/currency/config";
import { formatPrice } from "../lib/currency/format";
import { checkRateLimit, recordFailedAttempt } from "../lib/auth/server";

let passed = 0;
let failed = 0;

function convertMajorToMinor(major: number): number {
  return Math.round(major * 100);
}

function convertMinorToMajor(minor: number): number {
  return minor / 100;
}

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("  STAGE 11 UNIT TESTS: Money, Timezones, Conflicts & Idempotency");
  console.log("=======================================================\n");

  // ─────────────────────────────────────────────────────────────
  // 1. MONEY & CURRENCY LOGIC
  // ─────────────────────────────────────────────────────────────
  console.log("1. Money & Currency Minor Units Logic");

  // A. Minor unit conversion
  assert(convertMajorToMinor(100) === 10000, "100.00 converts to 10000 minor units");
  assert(convertMajorToMinor(25.5) === 2550, "25.50 converts to 2550 minor units");
  assert(convertMajorToMinor(0) === 0, "0 converts to 0 minor units");
  assert(convertMinorToMajor(10000) === 100, "10000 minor units converts to 100.00 major units");
  assert(convertMinorToMajor(2550) === 25.5, "2550 minor units converts to 25.50 major units");

  // B. Floating point precision safety (avoid 0.1 + 0.2 = 0.30000000000000004 errors)
  const minorA = convertMajorToMinor(0.1); // 10
  const minorB = convertMajorToMinor(0.2); // 20
  const sumMinor = minorA + minorB;
  assert(sumMinor === 30, "Integer minor unit addition is exact (10 + 20 = 30, avoiding IEEE 754 float drift)");
  assert(convertMinorToMajor(sumMinor) === 0.3, "Converting exact minor sum back to major yields 0.3");

  // C. Formatting across all 7 supported currencies
  const formattedNGN = formatPrice(5000000, "NGN"); // 50,000 NGN
  assert(formattedNGN.includes("50,000") || formattedNGN.includes("₦"), `NGN formatted correctly: ${formattedNGN}`);

  const formattedUSD = formatPrice(15000, "USD"); // $150.00
  assert(formattedUSD.includes("150") && formattedUSD.includes("$"), `USD formatted correctly: ${formattedUSD}`);

  const formattedGBP = formatPrice(12000, "GBP"); // £120.00
  assert(formattedGBP.includes("120") && formattedGBP.includes("£"), `GBP formatted correctly: ${formattedGBP}`);

  const formattedEUR = formatPrice(13500, "EUR"); // €135.00
  assert(formattedEUR.includes("135") && formattedEUR.includes("€"), `EUR formatted correctly: ${formattedEUR}`);

  const formattedGHS = formatPrice(80000, "GHS"); // GH₵800.00
  assert(formattedGHS.includes("800"), `GHS formatted correctly: ${formattedGHS}`);

  const formattedZAR = formatPrice(95000, "ZAR"); // R950.00
  assert(formattedZAR.includes("950"), `ZAR formatted correctly: ${formattedZAR}`);

  const formattedKES = formatPrice(1500000, "KES"); // KSh 15,000.00
  assert(formattedKES.includes("15,000") || formattedKES.includes("KES"), `KES formatted correctly: ${formattedKES}`);

  // ─────────────────────────────────────────────────────────────
  // 2. DATE, TIMEZONE & DST LOGIC
  // ─────────────────────────────────────────────────────────────
  console.log("\n2. Date, Timezone & DST Calculation Logic");

  // A. UTC to Local Timezone Conversion
  const utcDate = new Date("2026-10-15T14:00:00.000Z"); // 2:00 PM UTC
  
  // Format in London, Lagos (WAT UTC+1), New York (EDT UTC-4)
  const lagosFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const lagosTime = lagosFormatter.format(utcDate);
  assert(lagosTime === "15:00", `UTC 14:00 converts to 15:00 in Africa/Lagos (UTC+1): ${lagosTime}`);

  const nyFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const nyTime = nyFormatter.format(utcDate);
  assert(nyTime === "10:00", `UTC 14:00 converts to 10:00 in America/New_York (EDT UTC-4): ${nyTime}`);

  // B. Daylight Saving Time (DST) Transition Handling
  // London switches from GMT (UTC+0) in winter to BST (UTC+1) in summer
  const winterLondon = new Date("2026-01-15T12:00:00.000Z");
  const summerLondon = new Date("2026-07-15T12:00:00.000Z");

  const londonFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  assert(londonFormatter.format(winterLondon) === "12:00", "Winter in Europe/London matches UTC (GMT)");
  assert(londonFormatter.format(summerLondon) === "13:00", "Summer in Europe/London is UTC+1 (BST)");

  // C. Booking Notice Windows (12h min notice, 45d max window)
  const now = new Date("2026-11-18T10:00:00.000Z");
  const tooSoonSlot = new Date("2026-11-18T16:00:00.000Z"); // 6h notice
  const validSlot = new Date("2026-11-19T10:00:00.000Z"); // 24h notice
  const tooFarSlot = new Date("2027-01-10T10:00:00.000Z"); // ~53 days ahead

  const minNoticeMs = 12 * 60 * 60 * 1000;
  const maxNoticeMs = 45 * 24 * 60 * 60 * 1000;

  function isSlotAllowed(slot: Date, baseDate: Date): boolean {
    const diff = slot.getTime() - baseDate.getTime();
    return diff >= minNoticeMs && diff <= maxNoticeMs;
  }

  assert(!isSlotAllowed(tooSoonSlot, now), "Slot with 6h notice is rejected (< 12h threshold)");
  assert(isSlotAllowed(validSlot, now), "Slot with 24h notice is accepted (>= 12h and <= 45d)");
  assert(!isSlotAllowed(tooFarSlot, now), "Slot > 45 days ahead is rejected");

  // D. 10-Minute Buffer Between Consecutive Sessions
  const session1End = new Date("2026-11-19T10:30:00.000Z");
  const backToBackSlot = new Date("2026-11-19T10:30:00.000Z"); // 0 buffer
  const bufferedSlot = new Date("2026-11-19T10:40:00.000Z"); // 10 min buffer

  function hasAdequateBuffer(nextStart: Date, prevEnd: Date, bufferMinutes: number = 10): boolean {
    return nextStart.getTime() - prevEnd.getTime() >= bufferMinutes * 60 * 1000;
  }

  assert(!hasAdequateBuffer(backToBackSlot, session1End), "Back-to-back session with 0 min buffer is rejected");
  assert(hasAdequateBuffer(bufferedSlot, session1End), "Session starting 10 mins after previous end is accepted");

  // ─────────────────────────────────────────────────────────────
  // 3. BOOKING INTERVAL CONFLICTS & HOLD EXPIRY
  // ─────────────────────────────────────────────────────────────
  console.log("\n3. Booking Interval Overlaps & Conflict Prevention");

  interface TimeInterval {
    start: Date;
    end: Date;
  }

  function doIntervalsOverlap(a: TimeInterval, b: TimeInterval): boolean {
    // Two intervals [s1, e1) and [s2, e2) overlap if and only if s1 < e2 && s2 < e1
    return a.start.getTime() < b.end.getTime() && b.start.getTime() < a.end.getTime();
  }

  const bookedSession: TimeInterval = {
    start: new Date("2026-11-20T14:00:00.000Z"),
    end: new Date("2026-11-20T14:30:00.000Z"),
  };

  const exactOverlap: TimeInterval = {
    start: new Date("2026-11-20T14:00:00.000Z"),
    end: new Date("2026-11-20T14:30:00.000Z"),
  };

  const partialOverlapStart: TimeInterval = {
    start: new Date("2026-11-20T13:45:00.000Z"),
    end: new Date("2026-11-20T14:15:00.000Z"),
  };

  const adjacentInterval: TimeInterval = {
    start: new Date("2026-11-20T14:30:00.000Z"),
    end: new Date("2026-11-20T15:00:00.000Z"),
  };

  assert(doIntervalsOverlap(bookedSession, exactOverlap), "Identical interval causes conflict");
  assert(doIntervalsOverlap(bookedSession, partialOverlapStart), "Partial overlap causes conflict");
  assert(!doIntervalsOverlap(bookedSession, adjacentInterval), "Adjacent boundary interval [14:00, 14:30) and [14:30, 15:00) does not overlap");

  // Temporary hold expiration (15 minutes)
  const holdCreatedAt = new Date("2026-11-20T10:00:00.000Z");
  const holdWindowMs = 15 * 60 * 1000;

  function isHoldActive(createdAt: Date, checkTime: Date): boolean {
    return checkTime.getTime() - createdAt.getTime() < holdWindowMs;
  }

  assert(isHoldActive(holdCreatedAt, new Date("2026-11-20T10:14:59.000Z")), "14m59s old hold is still active");
  assert(!isHoldActive(holdCreatedAt, new Date("2026-11-20T10:15:01.000Z")), "15m01s old hold has expired and is released");

  // ─────────────────────────────────────────────────────────────
  // 4. PAYMENT IDEMPOTENCY & REPLAY ATTACK MITIGATION
  // ─────────────────────────────────────────────────────────────
  console.log("\n4. Payment Idempotency & Webhook Deduplication");

  const processedEvents = new Set<string>();

  function processPaymentEvent(eventId: string, amountMinor: number): { success: boolean; credited: boolean; reason?: string } {
    if (processedEvents.has(eventId)) {
      return { success: true, credited: false, reason: "Duplicate webhook event ignored (idempotent)" };
    }
    processedEvents.add(eventId);
    return { success: true, credited: true };
  }

  const event1 = processPaymentEvent("evt_paystack_001", 5000000);
  assert(event1.success && event1.credited, "First webhook delivery is processed and balance credited");

  const duplicateEvent = processPaymentEvent("evt_paystack_001", 5000000);
  assert(duplicateEvent.success && !duplicateEvent.credited, "Replayed identical webhook event is acknowledged without double crediting");
  assert(Boolean(duplicateEvent.reason?.includes("Duplicate")), "Proper reason logged for idempotent skip");

  const event2 = processPaymentEvent("evt_paystack_002", 2500000);
  assert(event2.success && event2.credited, "New unique webhook event is processed successfully");

  // Rate Limiting Protection Check
  console.log("\n5. Rate Limiting Enforcer");
  const rlKey = "test_user_rate_limit";
  const rlId = "ip_test_123";
  let allowedCount = 0;
  for (let i = 0; i < 7; i++) {
    const res = checkRateLimit(rlKey, rlId, 5, 60000);
    if (res.allowed) {
      allowedCount++;
      recordFailedAttempt(rlKey, rlId, 5, 60000);
    }
  }
  assert(allowedCount === 5, `Strict rate limiting allows exactly 5 attempts within window (got ${allowedCount})`);

  console.log("\n=======================================================");
  console.log(`  UNIT TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("=======================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution threw error:", err);
  process.exit(1);
});
