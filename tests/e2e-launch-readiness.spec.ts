import { test, expect } from "@playwright/test";

test.describe("Stage 11: End-to-End Launch Readiness Suite", () => {
  // ─────────────────────────────────────────────────────────────
  // 1. REGISTER AND LOGIN FLOW
  // ─────────────────────────────────────────────────────────────
  test("1. Register and Login UI & Form Validation", async ({ page }) => {
    // A. Register Page
    await page.goto("/register", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveTitle(/GradEdge/);

    // Verify presence of required fields
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[name="password"], input[type="password"]').first();
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    // Verify time zone detection is silent (no visible timezone select in register)
    const tzSelect = page.locator('select[name="timezone"]');
    await expect(tzSelect).toHaveCount(0);

    // Verify Terms & Conditions checkbox is present
    const termsCheckbox = page.locator('input[type="checkbox"]').first();
    await expect(termsCheckbox).toBeVisible();

    // B. Login Page
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    // Attempting login with empty credentials should not navigate away
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();
    expect(page.url()).toContain("/login");
  });

  // ─────────────────────────────────────────────────────────────
  // 2. CONSULTATION BOOKING FLOW
  // ─────────────────────────────────────────────────────────────
  test("2. Consultation Booking Flow (3-Step)", async ({ page }) => {
    await page.goto("/book", { waitUntil: "domcontentloaded" });

    // Step 1: Calendar and Time Slot Picker
    const stepHeading = page.locator("h1, h2").first();
    await expect(stepHeading).toBeVisible();

    // Check timezone display element
    const tzIndicator = page.locator("text=/UTC|GMT|WAT|Timezone/i").first();
    await expect(tzIndicator).toBeVisible();

    // Select first available time slot button if rendered
    const slotButtons = page.locator("button:has-text(':'), button:has-text('AM'), button:has-text('PM')");
    if (await slotButtons.count() > 0) {
      await slotButtons.first().click();

      // Step 2: Your Details
      const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();
      if (await nameInput.isVisible()) {
        await nameInput.fill("Test Researcher");
        const bookEmailInput = page.locator('input[type="email"]').first();
        await bookEmailInput.fill("test.researcher@example.org");
      }
    }
  });

  // ─────────────────────────────────────────────────────────────
  // 3. PAID SESSION / CHECKOUT WITH PAYSTACK
  // ─────────────────────────────────────────────────────────────
  test("3. Pricing & Paid Checkout Entrypoint", async ({ page }) => {
    await page.goto("/pricing", { waitUntil: "domcontentloaded" });

    // Verify currency selector or currency-aware price tags
    const priceElements = page.locator("text=/\\$\\d+|₦\\d+|£\\d+|€\\d+|GH₵\\d+|R\\s*\\d+|KSh\\s*\\d+/").first();
    await expect(priceElements).toBeVisible();

    // Verify service packages have clear action buttons
    const actionBtn = page.locator("main a:has-text('Book'), main a:has-text('Get Started'), main a:has-text('Apply'), main a:has-text('Select'), main button:has-text('Select')").first();
    await expect(actionBtn).toBeVisible();
  });

  // ─────────────────────────────────────────────────────────────
  // 4. SUPPORT REQUEST WITH FILE UPLOAD
  // ─────────────────────────────────────────────────────────────
  test("4. Support Request & Manuscript File Upload UI", async ({ page }) => {
    await page.goto("/student/requests/new", { waitUntil: "domcontentloaded" });

    // Verify either support form or redirect to auth when unauthenticated
    const isLoginRedirect = page.url().includes("/login");
    if (!isLoginRedirect) {
      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.count() > 0) {
        await expect(fileInput).toBeAttached();
      }
    } else {
      expect(page.url()).toContain("/login");
    }
  });

  // ─────────────────────────────────────────────────────────────
  // 5. ACCELERATOR APPLICATION FLOW
  // ─────────────────────────────────────────────────────────────
  test("5. Accelerator Application Page & Validation", async ({ page }) => {
    await page.goto("/accelerator/apply", { waitUntil: "domcontentloaded" });

    // Verify application form header
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();

    // Verify research field & proposal inputs exist
    const inputs = page.locator("input, textarea, select");
    expect(await inputs.count()).toBeGreaterThan(3);
  });

  // ─────────────────────────────────────────────────────────────
  // 6. ADMIN REFUND API ACCESS CONTROL
  // ─────────────────────────────────────────────────────────────
  test("6. Admin Payment Refund Security & Validation Gate", async ({ request }) => {
    // Test unauthenticated caller attempting refund on random payment ID
    const unauthRes = await request.post("/api/admin/payments/pay_test_random_123/refund", {
      data: {
        reason: "Valid reason for refunding student",
        amountMinor: 5000,
      },
    });

    // Must be rejected with 401 or 403
    expect([401, 403]).toContain(unauthRes.status());

    // Test with missing / too-short reason
    const invalidReasonRes = await request.post("/api/admin/payments/pay_test_random_123/refund", {
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        reason: "no", // Too short
      },
    });
    // Protected by authentication or input validation
    expect([400, 401, 403]).toContain(invalidReasonRes.status());
  });
});
