import { test, expect } from "@playwright/test";
import * as path from "path";

/**
 * Screenshot generation — produces reference images stored in screenshots/.
 *
 * - Staff & Family: all 4 viewports in light + dark mode  (16 images)
 * - HS & MS: one desktop screenshot each in light + dark   (4 images)
 * Total: 20 reference screenshots.
 *
 * Run with:  npx playwright test tests/generate-screenshots.spec.ts
 */

const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  chromebook: { width: 1366, height: 768 },
  macbook: { width: 1440, height: 900 },
  desktop: { width: 1920, height: 1080 },
} as const;

const SCREENSHOT_DIR = path.join(__dirname, "..", "screenshots");

/* Staff & Family — full viewport matrix, light + dark */
for (const mode of ["Staff", "Family"] as const) {
  for (const [deviceName, viewport] of Object.entries(VIEWPORTS)) {
    for (const scheme of ["light", "dark"] as const) {
      const label = scheme === "dark" ? `-dark` : "";
      test(`capture ${mode}${label} on ${deviceName} (${viewport.width}×${viewport.height})`, async ({
        browser,
      }) => {
        const context = await browser.newContext({
          viewport,
          colorScheme: scheme,
          baseURL: "http://localhost:5050",
        });
        const page = await context.newPage();
        await page.goto(`/${mode}/index.html`);
        await page.waitForSelector(".menuitem, .linkholder", {
          timeout: 10000,
        });
        await page.waitForLoadState("networkidle");

        const filename = `${mode}${label}-${deviceName}-${viewport.width}x${viewport.height}.png`;
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, filename),
          fullPage: true,
        });
        await context.close();
      });
    }
  }
}

/* HS & MS — single desktop screenshot, light + dark */
for (const mode of ["HS", "MS"] as const) {
  for (const scheme of ["light", "dark"] as const) {
    const label = scheme === "dark" ? `-dark` : "";
    const viewport = VIEWPORTS.desktop;
    test(`capture ${mode}${label} on desktop (${viewport.width}×${viewport.height})`, async ({
      browser,
    }) => {
      const context = await browser.newContext({
        viewport,
        colorScheme: scheme,
        baseURL: "http://localhost:5050",
      });
      const page = await context.newPage();
      await page.goto(`/${mode}/index.html`);
      await page.waitForSelector(".menuitem, .linkholder", { timeout: 10000 });
      await page.waitForLoadState("networkidle");

      const filename = `${mode}${label}-desktop-${viewport.width}x${viewport.height}.png`;
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, filename),
        fullPage: true,
      });
      await context.close();
    });
  }
}
