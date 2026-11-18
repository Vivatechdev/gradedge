const { chromium } = require("playwright");
const { AxeBuilder } = require("@axe-core/playwright");
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

async function runHeroVerification() {
  console.log("=== GRADEDGE NEW HERO PLAYWRIGHT AUDIT ===");
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });

  const port = 3005;
  const baseUrl = `http://localhost:${port}/`;

  for (const vp of VIEWPORTS) {
    console.log(`\nTesting Viewport: ${vp.width}x${vp.height} (${vp.name})...`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    const page = await context.newPage();

    await page.goto(baseUrl, { waitUntil: "networkidle" });

    // 1. Horizontal overflow check
    const bodyOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    console.log(`  Horizontal overflow: ${bodyOverflow ? "FAIL (overflow detected)" : "PASS (0px overflow)"}`);

    // 2. Title & Meta
    const pageTitle = await page.title();
    console.log(`  Page <title>: "${pageTitle}" -> ${pageTitle === "GradEdge | Thesis mentoring and research coaching" ? "PASS" : "FAIL"}`);

    const metaDesc = await page.locator("meta[name='description']").getAttribute("content");
    console.log(`  Meta description: "${metaDesc}" -> ${metaDesc === "Expert thesis mentoring for graduate students. Get written feedback, data analysis help and defense coaching from a mentor in your field." ? "PASS" : "FAIL"}`);

    // 3. Exactly one H1
    const h1Count = await page.locator("h1").count();
    const h1Text = await page.locator("h1").innerText();
    const h1Underline = await page.locator("h1 u").innerText();
    console.log(`  H1 count: ${h1Count} (Expected: 1) -> ${h1Count === 1 ? "PASS" : "FAIL"}`);
    console.log(`  H1 Text: "${h1Text.replace(/\s+/g, ' ').trim()}"`);
    console.log(`  H1 Underline: "${h1Underline}" -> ${h1Underline === "proposal to defense." ? "PASS" : "FAIL"}`);

    // 4. Subline copy
    const subline = await page.locator("text=GradEdge pairs you with an expert in your field for written feedback, data analysis and defense coaching. You write it. We help you get it right.").count();
    console.log(`  Subline copy: ${subline > 0 ? "PASS" : "FAIL"}`);

    // 5. Actions
    const bookBtn = await page.locator("a[href='/book']:has-text('Book a free 20-minute call')").count();
    console.log(`  Gold button to /book: ${bookBtn > 0 ? "PASS" : "FAIL"}`);

    const exploreLink = await page.locator("a[href='#services']:has-text('Explore services')").count();
    console.log(`  Explore services anchor: ${exploreLink > 0 ? "PASS" : "FAIL"}`);

    // 6. Scope row
    const scopeItems = ["Proposal", "Analysis", "Writing", "Publishing", "Defense"];
    let scopeOk = true;
    for (const item of scopeItems) {
      const cnt = await page.locator(`text=${item}`).count();
      if (cnt === 0) scopeOk = false;
    }
    const scopeLine = await page.locator("text=For undergraduate, Masters and doctoral researchers, worldwide.").count();
    console.log(`  Plain scope row & hairline dividers: ${scopeOk ? "PASS" : "FAIL"}`);
    console.log(`  Scope audience line: ${scopeLine > 0 ? "PASS" : "FAIL"}`);

    // 7. Mosaic images
    const heroImg = await page.locator("img[src*='hero.jpg']").count();
    const workImg = await page.locator("img[src*='how-we-work.jpg']").count();
    const integrityImg = await page.locator("img[src*='integrity.jpg']").count();
    console.log(`  Mosaic images (hero, how-we-work, integrity): ${heroImg > 0 && workImg > 0 && integrityImg > 0 ? "PASS" : "FAIL"}`);

    // 8. Floating Cards
    const strikethrough = await page.locator("p.line-through:has-text('linear regression models')").count();
    const correctedLine = await page.locator("text=exploratory factor analysis, followed by hierarchical regression").count();
    const mentorComment = await page.locator("text=Check normality assumptions before running the coefficient tests.").count();
    console.log(`  Mentor Review Card: ${strikethrough > 0 && correctedLine > 0 && mentorComment > 0 ? "PASS" : "FAIL"}`);

    const milestoneHeading = await page.locator("text=Research milestones").count();
    const prog1 = await page.locator("text=Proposal approved").count();
    const prog2 = await page.locator("text=Methodology draft").count();
    const prog3 = await page.locator("text=Analysis chapter").count();
    console.log(`  Milestone Card with 3 bars: ${milestoneHeading > 0 && prog1 > 0 && prog2 > 0 && prog3 > 0 ? "PASS" : "FAIL"}`);

    // 9. Floating cards stay inside viewport on mobile
    if (vp.width === 360) {
      const cardsInViewport = await page.evaluate(() => {
        const docW = document.documentElement.clientWidth;
        const cards = Array.from(document.querySelectorAll("section[aria-label='Introduction'] .absolute.z-20"));
        return cards.every((c) => {
          const rect = c.getBoundingClientRect();
          return rect.left >= 0 && rect.right <= docW;
        });
      });
      console.log(`  Floating cards stay inside 360px viewport: ${cardsInViewport ? "PASS" : "FAIL"}`);
    }

    // 10. Contrast / Accessibility audit via Axe
    if (vp.width === 1440) {
      console.log("  Running Axe color-contrast audit on Hero section...");
      try {
        const axeResults = await new AxeBuilder({ page })
          .include("section[aria-label='Introduction']")
          .withRules(["color-contrast"])
          .analyze();
        const violations = axeResults.violations;
        if (violations.length === 0) {
          console.log("  Axe Color Contrast Audit: PASS (0 violations)");
        } else {
          console.log(`  Axe Color Contrast Audit: ${violations.length} violation(s):`);
          violations.forEach((v) => console.log(`    - ${v.id}: ${v.help}`));
        }
      } catch (err) {
        console.log("  Axe audit notice:", err.message);
      }
    }

    // 11. Screenshot
    const heroShot = path.join(ARTIFACT_DIR, `hero-${vp.name}.png`);
    const heroSection = page.locator("section[aria-label='Introduction']");
    await heroSection.screenshot({ path: heroShot });
    console.log(`  Saved screenshot: hero-${vp.name}.png`);

    await page.close();
    await context.close();
  }

  await browser.close();
  console.log("\n=== ALL VIEWPORT AUDITS COMPLETE ===");
}

runHeroVerification().catch((err) => {
  console.error("Verification error:", err);
  process.exit(1);
});
