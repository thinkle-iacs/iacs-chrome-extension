import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for IACS Chrome Extension dashboard testing.
 *
 * Tests run against pre-built dashboard modes (Staff, HS, MS, Family)
 * across multiple viewport sizes to ensure consistent rendering.
 */

/* Viewport definitions for target devices */
const viewports = {
  mobile: { width: 375, height: 667 },
  chromebook: { width: 1366, height: 768 },
  macbook: { width: 1440, height: 900 },
  desktop: { width: 1920, height: 1080 },
};

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: "html",

  /* Shared settings for all projects */
  use: {
    baseURL: "http://localhost:5050",
    trace: "on-first-retry",
    /* Wait for network idle so icons/fonts load */
    actionTimeout: 10000,
  },

  /* Test projects — one per viewport size */
  projects: [
    {
      name: "mobile",
      use: { viewport: viewports.mobile },
    },
    {
      name: "chromebook",
      use: { viewport: viewports.chromebook },
    },
    {
      name: "macbook",
      use: { viewport: viewports.macbook },
    },
    {
      name: "desktop",
      use: { viewport: viewports.desktop },
    },
  ],

  /* Local dev server for test builds */
  webServer: {
    command: "npx sirv test-builds --port 5050 --no-clear",
    port: 5050,
    reuseExistingServer: !process.env.CI,
  },
});
