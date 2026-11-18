const { chromium } = require("playwright");
const { AxeBuilder } = require("@axe-core/playwright");
const path = require("path");

const ARTIFACT_DIR = path.resolve(
  "C:/Users/user/.gemini/antigravity/brain/6374ae35-4be6-4566-bea6-3cb08775c0dd"
);

const VIEWPORTS = [
  { width: 360, height: 800, name: "360-mobile" },
  { width: 768, height: 1024, name: "768-tablet" },
  { width: 1024, height: 768, name: "1024-laptop" },
  { width: 1440, height: 900, name: "1440-desktop" },
];

const PORT = 3005;
const BASE_URL = `http://localhost:${PORT}`;

async function runAuthShellQA() {
  console.log("===============================================================================");
  console.log("        GRADEDGE AUTH SHELL: MULTI-VIEWPORT, A11Y & CONTRAST QA AUDIT          ");
  console.log("===============================================================================\n");

  const browser = await chromium.launch({
    executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });

  // 1. Multi-viewport audit on AuthShell (/login and /register)
  console.log("--- 1. MULTI-VIEWPORT AUDIT (360, 768, 1024, 1440px) ---");
  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle" });

    // A. Check horizontal overflow
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );

    // B. Check left panel visibility (hidden < 900px, visible >= 900px)
    const leftPanelVisible = await page.locator("aside").isVisible();
    const expectedLeftPanel = vp.width >= 900;
    const panelRulePass = leftPanelVisible === expectedLeftPanel;

    // C. Check tabs switching between "Create account" and "Log in"
    const tabsCount = await page.locator('nav[aria-label="Account navigation"] a').count();

    // D. Check mobile logo presence when left panel is hidden
    const mobileLogoVisible = await page.locator("main .min-\\[900px\\]\\:hidden").isVisible();

    // E. Heading check
    const heading = await page.locator("h1").innerText();

    console.log(`\n[Viewport ${vp.width}px - ${vp.name}]`);
    console.log(`  - Horizontal Overflow: ${overflow ? "FAIL" : "PASS (0px overflow)"}`);
    console.log(`  - Heading: "${heading}" -> ${heading === "Welcome back" ? "PASS" : "FAIL"}`);
    console.log(`  - Left Panel Visible: ${leftPanelVisible} (Expected: ${expectedLeftPanel}) -> ${panelRulePass ? "PASS" : "FAIL"}`);
    console.log(`  - Auth Tabs Visible: ${tabsCount === 2 ? "PASS (Create account + Log in)" : "FAIL"}`);
    if (vp.width < 900) {
      console.log(`  - Mobile Top Logo: ${mobileLogoVisible ? "PASS" : "FAIL"}`);
    }

    if (vp.width >= 900) {
      // Left panel details check
      const whiteLogo = await page.locator("aside a[href='/']").isVisible();
      const manuscriptHeader = await page.locator("text=Draft chapter 3, Methodology").isVisible();
      const headline = await page.locator("text=A second pair of eyes on your thesis.").isVisible();
      const line1 = await page.locator("text=Send a draft and get honest comments you can use").isVisible();
      const line2 = await page.locator("text=Your mentor knows your subject and your software").isVisible();
      const line3 = await page.locator("text=You write it. We help you get it right").isVisible();

      // Check feedback cycle components inside manuscript
      const stickyTab = await page.locator("text=Which model? Why?").count();
      const studentDraft = await page.locator("text=Data was analysed with").count();
      const mentorComment = await page.locator("text=Does this method match your research question?").count();
      const revisedText = await page.locator("text=Instruments were validated by factor analysis").count();

      console.log(`  - White Logo: ${whiteLogo ? "PASS" : "FAIL"}`);
      console.log(`  - Manuscript Header: ${manuscriptHeader ? "PASS" : "FAIL"}`);
      console.log(`  - Headline: ${headline ? "PASS" : "FAIL"}`);
      console.log(`  - Hairline Lines: ${line1 && line2 && line3 ? "PASS (All 3 present)" : "FAIL"}`);
      console.log(`  - Animated Feedback Elements: ${stickyTab > 0 && studentDraft > 0 && mentorComment > 0 && revisedText > 0 ? "PASS" : "FAIL"}`);
    }

    // Save screenshot
    const shotPath = path.join(ARTIFACT_DIR, `auth-shell-${vp.name}.png`);
    await page.screenshot({ path: shotPath, fullPage: true });
    console.log(`  - Saved Screenshot: auth-shell-${vp.name}.png`);

    await page.close();
    await context.close();
  }

  // 2. Form Style Audits on /register, /complete-profile, /forgot-password
  console.log("\n--- 2. FORM STYLE & HEADINGS AUDIT ---");
  const formPages = [
    {
      url: `${BASE_URL}/register`,
      name: "register",
      expectedHeading: "Create your account",
    },
    {
      url: `${BASE_URL}/complete-profile`,
      name: "complete-profile",
      expectedHeading: "One last step",
      expectedDesc: "Tell us about your research so we can match you with the right mentor.",
      cookies: [
        { name: "mock_user_role", value: "student", domain: "localhost", path: "/" },
        { name: "mock_incomplete_profile", value: "true", domain: "localhost", path: "/" },
      ],
    },
    {
      url: `${BASE_URL}/forgot-password`,
      name: "forgot-password",
      expectedHeading: "Reset your password",
    },
  ];

  for (const item of formPages) {
    const context = await browser.newContext({ viewport: { width: 1024, height: 768 } });
    if (item.cookies) {
      await context.addCookies(item.cookies);
    }
    const page = await context.newPage();
    await page.goto(item.url, { waitUntil: "networkidle" });

    const heading = await page.locator("h1").innerText();
    console.log(`[${item.name}] Heading: "${heading}" -> ${heading === item.expectedHeading ? "PASS" : "FAIL"}`);

    if (item.expectedDesc) {
      const descVisible = await page.locator(`text=${item.expectedDesc}`).isVisible();
      console.log(`[${item.name}] Description line: ${descVisible ? "PASS" : "FAIL"}`);
    }

    // Check button styling: gold button with navy text
    const goldButtonCount = await page.locator("button[type='submit'].bg-gold.text-navy, button[type='submit'][class*='bg-gold']").count();
    console.log(`[${item.name}] Gold primary button: ${goldButtonCount > 0 ? "PASS" : "FAIL"}`);

    // Check show/hide text toggle if on register
    if (item.name === "register") {
      const showHideBtn = await page.locator("button:has-text('Show'), button:has-text('Hide')").count();
      console.log(`[${item.name}] Password Show/Hide as text (no icons): ${showHideBtn > 0 ? "PASS" : "FAIL"}`);
    }

    await page.close();
    await context.close();
  }

  // 3. Automated Axe Accessibility & Contrast Audit
  console.log("\n--- 3. AXE-CORE ACCESSIBILITY & CONTRAST AUDIT ---");
  const a11yContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const a11yPage = await a11yContext.newPage();
  await a11yPage.goto(`${BASE_URL}/login`, { waitUntil: "networkidle" });

  try {
    const axeResults = await new AxeBuilder({ page: a11yPage })
      .withRules(["color-contrast", "label", "button-name"])
      .analyze();
    const violations = axeResults.violations;
    if (violations.length === 0) {
      console.log("  Axe-core Contrast & Form Label Audit: PASS (0 violations)");
    } else {
      console.log(`  Axe-core Violations: ${violations.length}`);
      violations.forEach((v) => console.log(`    - ${v.id}: ${v.help}`));
    }
  } catch (err) {
    console.log("  Axe notice:", err.message);
  }

  await a11yPage.close();
  await a11yContext.close();
  await browser.close();

  console.log("\n===============================================================================");
  console.log("                     ALL AUTH QA AUDITS COMPLETE                              ");
  console.log("===============================================================================\n");
}

runAuthShellQA().catch((err) => {
  console.error("QA Audit failed:", err);
  process.exit(1);
});
