const { chromium } = require('@playwright/test');

const routes = [
  '/',
  '/about',
  '/services',
  '/subjects',
  '/blog',
  '/pricing',
  '/contact',
  '/faq',
  '/accelerator',
  '/membership'
];

(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  for (const r of routes) {
    await page.goto('http://localhost:3000' + r, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      for (let i = 0; i < document.body.scrollHeight; i += 400) {
        window.scrollTo(0, i);
        await new Promise(res => setTimeout(res, 50));
      }
    });
    await page.waitForTimeout(500);

    const stats = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img')).filter(img => 
        img.src.includes('images%2F') || img.src.includes('/images/')
      );
      const broken = imgs.filter(img => !img.complete || img.naturalWidth === 0);
      return {
        total: imgs.length,
        broken: broken.length,
        sample: imgs.map(i => ({ src: i.src, naturalWidth: i.naturalWidth, naturalHeight: i.naturalHeight }))
      };
    });

    console.log(`${r}: Total Images = ${stats.total}, Broken = ${stats.broken}`);
  }

  await browser.close();
  console.log('Site-wide verification complete.');
})();
