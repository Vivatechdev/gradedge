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

const PAGES_TO_TEST = [
  { name: "home", url: "http://localhost:3000/" },
  { name: "about", url: "http://localhost:3000/about" },
  { name: "pricing", url: "http://localhost:3000/pricing" },
  { name: "book", url: "http://localhost:3000/book" },
  { name: "contact", url: "http://localhost:3000/contact" },
  { name: "blog", url: "http://localhost:3000/blog" },
  { name: "subjects", url: "http://localhost:3000/subjects" },
  { name: "resources", url: "http://localhost:3000/resources" },
  { name: "login", url: "http://localhost:3000/login" },
  { name: "register", url: "http://localhost:3000/register" },
  { name: "student-portal", url: "http://localhost:3000/student" },
  { name: "admin-portal", url: "http://localhost:3000/admin" },
];

async function runSiteWideAudit() {
  const outputDir = path.join(process.cwd(), "comprehensive-audit-screenshots", "site-wide");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch({ channel: "msedge" });
  const results = [];

  console.log("Starting Comprehensive Site-Wide Visual QA Audit across 6 viewports...\n");

  for (const pageItem of PAGES_TO_TEST) {
    console.log(`\n========================================`);
    console.log(`Testing: ${pageItem.name} (${pageItem.url})`);
    console.log(`========================================`);

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
        const response = await page.goto(pageItem.url, { waitUntil: "networkidle", timeout: 20000 });
        const status = response ? response.status() : 0;

        // Check horizontal overflow
        const overflow = await page.evaluate(() => {
          const scrollWidth = document.documentElement.scrollWidth;
          const innerWidth = window.innerWidth;
          return {
            hasOverflow: scrollWidth > innerWidth + 1,
            scrollWidth,
            innerWidth,
          };
        });

        const screenshotFileName = `${pageItem.name}-${vp.name}.png`;
        const screenshotPath = path.join(outputDir, screenshotFileName);
        await page.screenshot({ path: screenshotPath, fullPage: false });

        const testRecord = {
          page: pageItem.name,
          url: pageItem.url,
          viewport: vp.name,
          dimensions: `${vp.width}x${vp.height}`,
          status,
          hasOverflow: overflow.hasOverflow,
          scrollWidth: overflow.scrollWidth,
          innerWidth: overflow.innerWidth,
          consoleErrorsCount: consoleErrors.length,
          consoleErrors,
        };

        results.push(testRecord);

        const icon = status === 200 && !overflow.hasOverflow && consoleErrors.length === 0 ? "✓" : "✗";
        console.log(
          `  ${icon} [${vp.name.padEnd(18)}] HTTP ${status} | Overflow: ${
            overflow.hasOverflow ? `YES (${overflow.scrollWidth}px)` : "No"
          } | Errors: ${consoleErrors.length}`
        );
      } catch (err) {
        console.error(`  ✗ [${vp.name}] Failed: ${err.message}`);
        results.push({
          page: pageItem.name,
          url: pageItem.url,
          viewport: vp.name,
          error: err.message,
        });
      } finally {
        await page.close();
      }
    }
  }

  await browser.close();

  const reportPath = path.join(outputDir, "site-wide-audit-results.json");
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\nAudit completed! Summary written to: ${reportPath}`);
}

runSiteWideAudit().catch(console.error);
