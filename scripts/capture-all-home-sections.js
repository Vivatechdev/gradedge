const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Progressive scroll to trigger Next.js lazy-loaded images
  await page.evaluate(async () => {
    for (let i = 0; i < document.body.scrollHeight; i += 300) {
      window.scrollTo(0, i);
      await new Promise(r => setTimeout(r, 60));
    }
  });
  await page.waitForTimeout(800);

  // Capture individual figures
  const figures = await page.locator('figure').all();
  console.log(`Found ${figures.length} figures on the homepage.`);

  // We can capture the specific section containers
  const heroSec = await page.locator('section').nth(0);
  await heroSec.screenshot({ path: 'section-hero.png' });

  const stuckSec = await page.locator('section[aria-labelledby="stuck-heading"]');
  if (await stuckSec.count() > 0) {
    await stuckSec.first().screenshot({ path: 'section-stuck.png' });
  }

  const howSec = await page.locator('section[aria-labelledby="how-it-works-heading"]');
  if (await howSec.count() > 0) {
    await howSec.first().screenshot({ path: 'section-how-we-work.png' });
  }

  const integritySec = await page.locator('section[aria-labelledby="integrity-heading"]');
  if (await integritySec.count() > 0) {
    await integritySec.first().screenshot({ path: 'section-integrity.png' });
  }

  console.log('All sections captured successfully');
  await browser.close();
})();

