import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:3000";
const OUTPUT_DIR = path.resolve("post-implementation-screenshots");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function run() {
  console.log("Launching Edge/Chromium browser...");
  const browser = await chromium.launch({
    channel: "msedge",
    headless: true,
  });

  const consoleErrors = [];

  // 1. Desktop Test (1440x900)
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const desktopPage = await desktopContext.newPage();
  desktopPage.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(`[Desktop Console Error] ${msg.text()}`);
    }
  });

  console.log("Testing Desktop Pages...");

  // Test 1: Home
  await desktopPage.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  await desktopPage.screenshot({ path: path.join(OUTPUT_DIR, "01-home-desktop.png"), fullPage: false });
  console.log("Captured 01-home-desktop.png");

  // Test 2: Services Index (testing milestone jump and split hero)
  await desktopPage.goto(`${BASE_URL}/services`, { waitUntil: "networkidle" });
  await desktopPage.screenshot({ path: path.join(OUTPUT_DIR, "02-services-desktop.png"), fullPage: false });
  console.log("Captured 02-services-desktop.png");

  // Test 3: Service Detail
  await desktopPage.goto(`${BASE_URL}/services/dissertation-thesis-mentoring`, { waitUntil: "networkidle" });
  await desktopPage.screenshot({ path: path.join(OUTPUT_DIR, "03-service-detail-desktop.png"), fullPage: false });
  console.log("Captured 03-service-detail-desktop.png");

  // Test 4: About Page (testing split hero)
  await desktopPage.goto(`${BASE_URL}/about`, { waitUntil: "networkidle" });
  await desktopPage.screenshot({ path: path.join(OUTPUT_DIR, "04-about-desktop.png"), fullPage: false });
  console.log("Captured 04-about-desktop.png");

  // Test 5: Student Portal
  await desktopPage.goto(`${BASE_URL}/student`, { waitUntil: "networkidle" });
  await desktopPage.screenshot({ path: path.join(OUTPUT_DIR, "05-student-desktop.png"), fullPage: false });
  console.log("Captured 05-student-desktop.png");

  // Test 6: Admin Portal
  await desktopPage.goto(`${BASE_URL}/admin`, { waitUntil: "networkidle" });
  await desktopPage.screenshot({ path: path.join(OUTPUT_DIR, "06-admin-desktop.png"), fullPage: false });
  console.log("Captured 06-admin-desktop.png");

  // 2. Mobile Test (390x844 - iPhone 14 / modern smartphone)
  console.log("Testing Mobile Pages & Navigation...");
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobileContext.newPage();
  mobilePage.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(`[Mobile Console Error] ${msg.text()}`);
    }
  });

  // Mobile Home
  await mobilePage.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  await mobilePage.screenshot({ path: path.join(OUTPUT_DIR, "07-home-mobile.png"), fullPage: false });
  console.log("Captured 07-home-mobile.png");

  // Mobile Services
  await mobilePage.goto(`${BASE_URL}/services`, { waitUntil: "networkidle" });
  await mobilePage.screenshot({ path: path.join(OUTPUT_DIR, "08-services-mobile.png"), fullPage: false });
  console.log("Captured 08-services-mobile.png");

  // Mobile Service Detail (Testing sticky subnav mask)
  await mobilePage.goto(`${BASE_URL}/services/dissertation-thesis-mentoring`, { waitUntil: "networkidle" });
  await mobilePage.screenshot({ path: path.join(OUTPUT_DIR, "09-service-detail-mobile.png"), fullPage: false });
  console.log("Captured 09-service-detail-mobile.png");

  // Mobile Student Dashboard (Testing bottom nav)
  await mobilePage.goto(`${BASE_URL}/student`, { waitUntil: "networkidle" });
  await mobilePage.screenshot({ path: path.join(OUTPUT_DIR, "10-student-mobile.png"), fullPage: false });
  console.log("Captured 10-student-mobile.png");

  // Mobile Student Dashboard - Click "More" to test drawer opening
  console.log("Testing Mobile 'More' Drawer click...");
  const moreButton = await mobilePage.getByRole("button", { name: /more/i });
  if (await moreButton.isVisible()) {
    await moreButton.click();
    await mobilePage.waitForTimeout(300);
    await mobilePage.screenshot({ path: path.join(OUTPUT_DIR, "11-student-mobile-more-open.png"), fullPage: false });
    console.log("Captured 11-student-mobile-more-open.png");
  } else {
    console.warn("More button not found!");
  }

  await browser.close();

  console.log("--- Test Summary ---");
  console.log(`Console Errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.log(consoleErrors.join("\n"));
  } else {
    console.log("All pages rendered with ZERO console errors!");
  }
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

