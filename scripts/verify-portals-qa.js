const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const VIEWPORTS = [
  { name: "1440-desktop-lg", width: 1440, height: 900 },
  { name: "1280-desktop-std", width: 1280, height: 800 },
  { name: "1024-tablet-land", width: 1024, height: 768 },
  { name: "768-tablet-port", width: 768, height: 1024 },
  { name: "390-mobile-std", width: 390, height: 844 },
  { name: "375-mobile-compact", width: 375, height: 667 },
];

const PAGES = [
  { name: "student-portal", url: "http://localhost:3000/student" },
  { name: "admin-portal", url: "http://localhost:3000/admin" },
];

async function runPortalsAudit() {
  const outputDir = path.join(process.cwd(), "comprehensive-audit-screenshots", "portals");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch({ channel: "msedge" });
  console.log("Starting portal QA inspection across 6 viewports...\n");

  for (const p of PAGES) {
    console.log(`Testing: ${p.name} (${p.url})`);
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height },
      });

      const consoleErrors = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
      });

      try {
        const response = await page.goto(p.url, { waitUntil: "networkidle", timeout: 15000 });
        const status = response ? response.status() : 0;

        const overflow = await page.evaluate(() => {
          const scrollWidth = document.documentElement.scrollWidth;
          const innerWidth = window.innerWidth;
          return {
            hasOverflow: scrollWidth > innerWidth + 1,
            scrollWidth,
            innerWidth,
          };
        });

        // Test interactive tab if student on desktop
        if (p.name === "student-portal" && vp.width === 1440) {
          const delTab = await page.$("button:has-text('Recent Deliverables')");
          if (delTab) await delTab.click();
          await page.waitForTimeout(200);
        }

        const screenshotPath = path.join(outputDir, `${p.name}-${vp.name}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: false });

        const icon = status === 200 && !overflow.hasOverflow && consoleErrors.length === 0 ? "✓" : "✗";
        console.log(`  ${icon} [${vp.name.padEnd(18)}] HTTP ${status} | Overflow: ${overflow.hasOverflow ? `YES (${overflow.scrollWidth}px)` : "No"} | Errors: ${consoleErrors.length}`);
      } catch (err) {
        console.error(`  ✗ [${vp.name}] Failed: ${err.message}`);
      } finally {
        await page.close();
      }
    }
  }

  await browser.close();
  console.log("\nPortal QA audit complete!");
}

runPortalsAudit().catch(console.error);
