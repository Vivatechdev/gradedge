import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    channel: "msedge",
  },
  projects: [
    {
      name: "Mobile 360px",
      use: {
        viewport: { width: 360, height: 800 },
      },
    },
    {
      name: "Tablet 768px",
      use: {
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: "Desktop 1440px",
      use: {
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
});
