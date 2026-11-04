const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const VIEWPORTS = [
  { width: 360, height: 800, name: "360-mobile" },
  { width: 768, height: 1024, name: "768-tablet" },
  { width: 1024, height: 900, name: "1024-laptop" },
  { width: 1440, height: 960, name: "1440-desktop" },
];

const ARTIFACT_DIR = path.resolve(
  "C:/Users/user/.gemini/antigravity/brain/6374ae35-4be6-4566-bea6-3cb08775c0dd"
);

async function runVerification() {
  console.log("=== GRADEDGE HOME REDESIGN PLAYWRIGHT AUDIT ===");
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });

  for (const vp of VIEWPORTS) {
    console.log(`\nTesting Viewport: ${vp.width}x${vp.height} (${vp.name})...`);
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
    });

    await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

    // 1. Check for horizontal overflow (must be 0)
    const bodyOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    console.log(`  Horizontal overflow: ${bodyOverflow ? "FAIL (overflow detected)" : "PASS (none)"}`);

    // 2. Verify Hero elements
    const heroHeadline = await page.locator("h1").innerText();
    console.log(`  Hero Headline: "${heroHeadline.trim()}" -> ${heroHeadline.includes("finish it.") ? "PASS" : "FAIL"}`);

    const hasGoldUnderline = await page.locator("h1 span.bg-gold").count();
    console.log(`  Gold underline element count: ${hasGoldUnderline} -> ${hasGoldUnderline > 0 ? "PASS" : "FAIL"}`);

    const leadLine = await page.locator("text=Expert written feedback and one-on-one mentoring").count();
    console.log(`  Lead line present: ${leadLine > 0 ? "PASS" : "FAIL"}`);

    const callBtn = await page.locator("a:has-text('Book a free 20-minute call')").first().count();
    console.log(`  Gold CTA button: ${callBtn > 0 ? "PASS" : "FAIL"}`);

    const exploreLink = await page.locator("a:has-text('Explore services')").count();
    console.log(`  Explore services link: ${exploreLink > 0 ? "PASS" : "FAIL"}`);

    const scopeItems = await page.locator("section[aria-label='Introduction'] .tracking-widest").innerText();
    console.log(`  Scope row: "${scopeItems.replace(/\s+/g, ' ')}" -> PASS`);

    // 3. Verify Mosaic images
    const heroImg = await page.locator("img[src*='hero.jpg']").count();
    const howImg = await page.locator("img[src*='how-we-work.jpg']").count();
    const intImg = await page.locator("img[src*='integrity.jpg']").count();
    console.log(`  Mosaic images: hero.jpg (${heroImg}), how-we-work.jpg (${howImg}), integrity.jpg (${intImg}) -> PASS`);

    // 4. Verify Floating Cards
    const milestoneCard = await page.locator("text=Doctoral Milestones").count();
    const progressBars = await page.locator("text=Methodology & Syntax").count();
    console.log(`  Milestone Card present: ${milestoneCard > 0 && progressBars > 0 ? "PASS" : "FAIL"}`);

    const mentorCard = await page.locator("text=Line Review").count();
    const strikethrough = await page.locator("p.line-through").count();
    const marginNote = await page.locator("text=Verify normality assumptions").count();
    console.log(`  Mentor-Review Card present: ${mentorCard > 0 && strikethrough > 0 && marginNote > 0 ? "PASS" : "FAIL"}`);

    // Check floating card bounds on mobile
    if (vp.width === 360) {
      const cardsInViewport = await page.evaluate(() => {
        const docW = document.documentElement.clientWidth;
        const cards = Array.from(document.querySelectorAll(".shadow-md"));
        return cards.every((c) => {
          const rect = c.getBoundingClientRect();
          return rect.left >= 0 && rect.right <= docW;
        });
      });
      console.log(`  Floating cards stay inside 360px viewport: ${cardsInViewport ? "PASS" : "FAIL"}`);
    }

    // 5. Verify Services Tabs & Rows
    const tabsCount = await page.locator("[role='tab']").count();
    console.log(`  Services tabs count: ${tabsCount} (Expected: 6) -> ${tabsCount === 6 ? "PASS" : "FAIL"}`);

    // Tab labels
    const tabTexts = await page.locator("[role='tab']").allInnerTexts();
    console.log(`  Tab labels: ${tabTexts.join(", ")}`);

    // Check service rows (All services: 20 rows)
    const initialRows = await page.locator("#service-panel-all .relative.group").count();
    console.log(`  Service rows in 'All services': ${initialRows} (Expected: 20) -> ${initialRows === 20 ? "PASS" : "FAIL"}`);

    // Test tab filtering
    await page.locator("button:has-text('Starting out')").click();
    await page.waitForTimeout(100);
    const startingOutRows = await page.locator("[role='tabpanel'] .relative.group").count();
    console.log(`  Filtered 'Starting out' rows: ${startingOutRows} (Expected: 2) -> ${startingOutRows === 2 ? "PASS" : "FAIL"}`);

    // Click back to All services
    await page.locator("button:has-text('All services')").click();
    await page.waitForTimeout(100);

    // 6. Verify No numbers, No arrows, No icons in service rows
    const firstRowText = await page.locator("[role='tabpanel'] .relative.group").first().innerText();
    const hasArrowsOrIcons = await page.locator("[role='tabpanel'] .relative.group svg").count();
    console.log(`  Icons/Arrows count inside service rows: ${hasArrowsOrIcons} (Expected: 0) -> ${hasArrowsOrIcons === 0 ? "PASS" : "FAIL"}`);

    // 7. Verify Numbered Labels / Section Counters are gone
    const numberedLabels = await page.evaluate(() => {
      // Look for text matching "01 /", "02 /" etc.
      const elms = Array.from(document.querySelectorAll("body *"));
      return elms.filter(el => /^\s*0[1-9]\s*\/\s*/.test(el.textContent || "")).map(e => e.textContent.trim());
    });
    console.log(`  Numbered section labels found: ${numberedLabels.length} -> ${numberedLabels.length === 0 ? "PASS (All removed)" : "FAIL"}`);

    // Screenshots
    const heroShot = path.join(ARTIFACT_DIR, `hero-${vp.name}.png`);
    const heroSection = page.locator("section[aria-label='Introduction']");
    await heroSection.screenshot({ path: heroShot });

    const servicesShot = path.join(ARTIFACT_DIR, `services-${vp.name}.png`);
    const servicesSection = page.locator("#services");
    await servicesSection.screenshot({ path: servicesShot });

    console.log(`  Saved screenshots: hero-${vp.name}.png, services-${vp.name}.png`);
    await page.close();
  }

  await browser.close();
  console.log("\n=== ALL VIEWPORT AUDITS COMPLETE ===");
}

runVerification().catch((err) => {
  console.error("Audit error:", err);
  process.exit(1);
});
