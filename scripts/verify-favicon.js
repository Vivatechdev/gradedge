const { chromium } = require("playwright");

async function testFavicon() {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });
  const page = await browser.newPage();

  // Test direct favicon endpoint
  const icoRes = await page.goto("http://localhost:3000/favicon.ico");
  console.log("/favicon.ico status:", icoRes.status(), "content-type:", icoRes.headers()["content-type"]);

  // Test direct icon.png endpoint
  const pngRes = await page.goto("http://localhost:3000/icon.png");
  console.log("/icon.png status:", pngRes.status(), "content-type:", pngRes.headers()["content-type"]);

  // Test direct apple-touch-icon.png endpoint
  const appleRes = await page.goto("http://localhost:3000/apple-touch-icon.png");
  console.log("/apple-touch-icon.png status:", appleRes.status(), "content-type:", appleRes.headers()["content-type"]);

  // Test home page head links
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  const iconLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('link[rel*="icon"]')).map((el) => ({
      rel: el.getAttribute("rel"),
      href: el.getAttribute("href"),
      sizes: el.getAttribute("sizes"),
      type: el.getAttribute("type"),
    }));
  });
  console.log("Icon links in HTML head:", iconLinks);

  await browser.close();
}

testFavicon().catch(console.error);

