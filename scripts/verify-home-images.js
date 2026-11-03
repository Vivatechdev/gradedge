const { chromium } = require('@playwright/test');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Scroll down progressively to trigger all lazy-loaded next/image components
  await page.evaluate(async () => {
    for (let i = 0; i < document.body.scrollHeight; i += 400) {
      window.scrollTo(0, i);
      await new Promise(r => setTimeout(r, 100));
    }
  });

  await page.waitForTimeout(1000);

  const images = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    return imgs.map(img => ({
      src: img.src,
      alt: img.alt,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      complete: img.complete,
    }));
  });

  const homeImgs = images.filter(i => i.src.includes('home'));
  console.log(JSON.stringify(homeImgs, null, 2));

  // Take screenshot of each section with an image
  await page.screenshot({ path: 'homepage-full-verified.png', fullPage: true });

  await browser.close();
})();
