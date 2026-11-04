const { chromium } = require("playwright");
const path = require("path");

const ARTIFACT_DIR = path.resolve(
  "C:/Users/user/.gemini/antigravity/brain/6374ae35-4be6-4566-bea6-3cb08775c0dd"
);

const ROUTES = [
  { url: "http://localhost:3000/login", name: "auth-login" },
  { url: "http://localhost:3000/register", name: "auth-register" },
  { url: "http://localhost:3000/forgot-password", name: "auth-forgot-password" },
  { url: "http://localhost:3000/reset-password", name: "auth-reset-password" },
  { url: "http://localhost:3000/verify-email", name: "auth-verify-email" },
  { url: "http://localhost:3000/complete-profile", name: "auth-complete-profile", cookie: { name: "mock_user_role", value: "student" } },
  { url: "http://localhost:3000/mentor", name: "auth-mentor-placeholder" },
];

async function verifyAuthPages() {
  console.log("=== GRADEDGE AUTH PAGES PLAYWRIGHT VERIFICATION ===");
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });

  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  for (const item of ROUTES) {
    console.log(`\nTesting ${item.url}...`);
    if (item.cookie) {
      await context.addCookies([{ ...item.cookie, domain: "localhost", path: "/" }]);
    } else {
      await context.clearCookies();
    }
    const res = await page.goto(item.url, { waitUntil: "networkidle" });
    console.log(`  HTTP status: ${res.status()}`);

    // Check for calm left panel honest line
    const asideText = await page.locator("aside blockquote").count();
    if (asideText > 0) {
      const quote = await page.locator("aside blockquote").innerText();
      console.log(`  Honest Line: "${quote.replace(/\s+/g, ' ').trim()}" -> PASS`);
    }

    // Check screenshot
    const shotPath = path.join(ARTIFACT_DIR, `${item.name}.png`);
    await page.screenshot({ path: shotPath, fullPage: true });
    console.log(`  Saved screenshot: ${item.name}.png`);
  }

  // Also test mobile 360px on /register to verify responsive layout
  console.log("\nTesting /register on mobile (360x800)...");
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("http://localhost:3000/register", { waitUntil: "networkidle" });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  console.log(`  Mobile 360px horizontal overflow: ${overflow ? "FAIL" : "PASS (none)"}`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "auth-register-mobile-360.png") });

  await browser.close();
  console.log("\n=== ALL AUTH PAGE VISUAL AUDITS COMPLETE ===");
}

verifyAuthPages().catch((e) => {
  console.error("Auth page visual audit failed:", e);
  process.exit(1);
});

