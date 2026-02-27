import { defineConfig } from "@playwright/test";

/**
 * Playwright configuration for IACS Chrome Extension dashboard testing.
 *
 * Tests manage their own viewports explicitly so that Staff & Family
 * are tested across all 4 sizes while HS & MS use a single size.
 */

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["github"], ["html"]] : "html",

  use: {
    baseURL: "http://localhost:5050",
    trace: "on-first-retry",
    actionTimeout: 10000,
  },

  /* 30s per test — each test creates its own context */
  timeout: 30000,

  webServer: {
    command: "npx sirv test-builds --port 5050 --no-clear",
    port: 5050,
    reuseExistingServer: !process.env.CI,
  },
});
