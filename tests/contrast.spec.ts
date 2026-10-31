import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/about/how-it-works",
  "/about/academic-integrity",
  "/services",
  "/services/dissertation-support",
  "/services/data-analysis",
  "/services/editing-and-writing-quality",
  "/services/publishing-and-career",
  "/services/coaching-and-training",
  "/services/dissertation-thesis-mentoring",
  "/services/quantitative-data-analysis",
  "/accelerator",
  "/accelerator/apply",
  "/accelerator/faq",
  "/membership",
  "/pricing",
  "/subjects",
  "/subjects/health-sciences",
  "/blog",
  "/faq",
  "/contact",
  "/institutions",
  "/legal/terms",
  "/legal/privacy",
  "/legal/academic-integrity",
  "/accessibility",
  "/resources",
];

for (const route of PUBLIC_ROUTES) {
  test(`Color contrast audit on ${route}`, async ({ page }) => {
    // Navigate to page
    await page.goto(route, { waitUntil: "domcontentloaded" });

    // Run Axe with color-contrast rule
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["color-contrast"])
      .analyze();

    const violations = accessibilityScanResults.violations;

    if (violations.length > 0) {
      console.error(
        `Contrast violations on ${route}:`,
        JSON.stringify(
          violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            nodes: v.nodes.map((n) => ({
              target: n.target,
              failureSummary: n.failureSummary,
            })),
          })),
          null,
          2
        )
      );
    }

    expect(violations).toEqual([]);
  });
}

