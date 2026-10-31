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

const TARGET_PAGES = [
  {
    name: "service-data-analysis",
    url: "http://localhost:3000/services/quantitative-data-analysis",
    type: "service",
    expectedVisualizer: "DataLabModelVisualizer",
  },
  {
    name: "service-dissertation",
    url: "http://localhost:3000/services/dissertation-thesis-mentoring",
    type: "service",
    expectedVisualizer: "ThesisArchitectureVisualizer",
  },
  {
    name: "service-editing",
    url: "http://localhost:3000/services/academic-editing-proofreading",
    type: "service",
    expectedVisualizer: "RedlineDiffVisualizer",
  },
  {
    name: "service-publishing",
    url: "http://localhost:3000/services/journal-article-conversion",
    type: "service",
    expectedVisualizer: "JournalSubmissionVisualizer",
  },
  {
    name: "service-coaching",
    url: "http://localhost:3000/services/defense-presentation-coaching",
    type: "service",
    expectedVisualizer: "VivaDefenseVisualizer",
  },
  {
    name: "category-data-analysis",
    url: "http://localhost:3000/services/data-analysis",
    type: "category",
  },
  {
    name: "category-dissertation",
    url: "http://localhost:3000/services/dissertation-support",
    type: "category",
  },
];

async function runServicesAudit() {
  const outputDir = path.join(process.cwd(), "comprehensive-audit-screenshots", "services");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch({ channel: "msedge" });
  const auditResults = [];

  console.log("Starting multi-viewport services visual QA audit...\n");

  for (const pageInfo of TARGET_PAGES) {
    console.log(`\n========================================`);
    console.log(`Testing: ${pageInfo.name} (${pageInfo.url})`);
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
        const response = await page.goto(pageInfo.url, { waitUntil: "networkidle", timeout: 30000 });
        const status = response ? response.status() : 0;

        // Check horizontal overflow
        const overflow = await page.evaluate(() => {
          const scrollWidth = document.documentElement.scrollWidth;
          const innerWidth = window.innerWidth;
          return {
            hasOverflow: scrollWidth > innerWidth + 1, // 1px threshold for subpixel rounding
            scrollWidth,
            innerWidth,
          };
        });

        // Test interactive elements if desktop
        if (vp.width === 1440) {
          if (pageInfo.name === "service-data-analysis") {
            // Click Python tab
            const pythonBtn = await page.$("button:has-text('Python')");
            if (pythonBtn) await pythonBtn.click();
            await page.waitForTimeout(300);
          } else if (pageInfo.name === "service-editing") {
            // Click Side-by-Side Diff tab
            const sideBySideBtn = await page.$("button:has-text('Side-by-Side Diff')");
            if (sideBySideBtn) await sideBySideBtn.click();
            await page.waitForTimeout(300);
          } else if (pageInfo.name === "service-dissertation") {
            // Click Chapter 3 card
            const ch3Btn = await page.$("button:has-text('Chapter 3')");
            if (ch3Btn) await ch3Btn.click();
            await page.waitForTimeout(300);
          } else if (pageInfo.name === "service-publishing") {
            // Click Reviewer 2 tab
            const rev2Btn = await page.$("button:has-text('Reviewer 2')");
            if (rev2Btn) await rev2Btn.click();
            await page.waitForTimeout(300);
          } else if (pageInfo.name === "service-coaching") {
            // Click Internal Examiner scenario
            const internalBtn = await page.$("button:has-text('Internal Examiner')");
            if (internalBtn) await internalBtn.click();
            await page.waitForTimeout(300);
          }
        }

        const screenshotFileName = `${pageInfo.name}-${vp.name}.png`;
        const screenshotPath = path.join(outputDir, screenshotFileName);
        await page.screenshot({ path: screenshotPath, fullPage: false });

        const result = {
          page: pageInfo.name,
          url: pageInfo.url,
          viewport: vp.name,
          dimensions: `${vp.width}x${vp.height}`,
          status,
          hasOverflow: overflow.hasOverflow,
          scrollWidth: overflow.scrollWidth,
          innerWidth: overflow.innerWidth,
          consoleErrorsCount: consoleErrors.length,
          consoleErrors,
          screenshot: screenshotFileName,
        };

        auditResults.push(result);

        const statusIcon = status === 200 && !overflow.hasOverflow && consoleErrors.length === 0 ? "✓" : "✗";
        console.log(
          `  ${statusIcon} [${vp.name.padEnd(18)}] HTTP ${status} | Overflow: ${overflow.hasOverflow ? `YES (${overflow.scrollWidth}px)` : "No"} | Errors: ${consoleErrors.length}`
        );
      } catch (err) {
        console.error(`  ✗ [${vp.name}] Failed: ${err.message}`);
        auditResults.push({
          page: pageInfo.name,
          url: pageInfo.url,
          viewport: vp.name,
          error: err.message,
        });
      } finally {
        await page.close();
      }
    }
  }

  await browser.close();

  const reportPath = path.join(outputDir, "services-audit-summary.json");
  fs.writeFileSync(reportPath, JSON.stringify(auditResults, null, 2));
  console.log(`\nAudit completed! Summary written to: ${reportPath}`);
}

runServicesAudit().catch(console.error);
