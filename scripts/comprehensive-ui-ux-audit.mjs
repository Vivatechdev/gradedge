import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:3000";
const AUDIT_DIR = path.resolve("comprehensive-audit-screenshots");

if (!fs.existsSync(AUDIT_DIR)) {
  fs.mkdirSync(AUDIT_DIR, { recursive: true });
}

// 5 Standard Viewports from visual-qa-and-ui-audit skill
const VIEWPORTS = [
  { name: "375-mobile-sm", width: 375, height: 667, isMobile: true, hasTouch: true },
  { name: "390-mobile-std", width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: "768-tablet", width: 768, height: 1024, isMobile: false, hasTouch: true },
  { name: "1280-desktop-std", width: 1280, height: 800, isMobile: false, hasTouch: false },
  { name: "1440-desktop-lg", width: 1440, height: 900, isMobile: false, hasTouch: false },
];

const PAGES_TO_AUDIT = [
  { slug: "/", name: "home" },
  { slug: "/services", name: "services-catalog" },
  { slug: "/services/dissertation-thesis-mentoring", name: "service-detail" },
  { slug: "/accelerator", name: "accelerator" },
  { slug: "/pricing", name: "pricing" },
  { slug: "/about", name: "about" },
  { slug: "/student", name: "student-portal" },
  { slug: "/admin", name: "admin-portal" },
];

async function runAudit() {
  console.log("Starting Comprehensive UI/UX Audit across 5 Standard Viewports...");
  const browser = await chromium.launch({ channel: "msedge", headless: true });

  const auditLog = [];

  for (const vp of VIEWPORTS) {
    console.log(`\n=== Auditing Viewport: ${vp.name} (${vp.width}x${vp.height}) ===`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      hasTouch: vp.hasTouch,
    });

    const page = await context.newPage();
    const pageErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") pageErrors.push(msg.text());
    });

    for (const p of PAGES_TO_AUDIT) {
      const url = `${BASE_URL}${p.slug}`;
      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });

        // Check for horizontal scroll / overflow defect (common mobile bug)
        const hasHorizontalScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });

        const filename = `${p.name}-${vp.name}.png`;
        await page.screenshot({ path: path.join(AUDIT_DIR, filename), fullPage: false });

        auditLog.push({
          page: p.name,
          url: p.slug,
          viewport: vp.name,
          width: vp.width,
          hasHorizontalScroll,
          errors: [...pageErrors],
          screenshot: filename,
        });

        console.log(`  [OK] ${p.name} | Horizontal Scroll: ${hasHorizontalScroll ? "OVERFLOW DEFECT!" : "Clean"}`);
      } catch (err) {
        console.error(`  [FAIL] ${p.name}: ${err.message}`);
      }
    }

    await context.close();
  }

  await browser.close();

  // Save audit log json
  fs.writeFileSync(path.join(AUDIT_DIR, "audit-results.json"), JSON.stringify(auditLog, null, 2));
  console.log("\nComprehensive Visual Audit completed. Results saved to audit-results.json.");
}

runAudit().catch((err) => {
  console.error("Audit script failed:", err);
  process.exit(1);
});

