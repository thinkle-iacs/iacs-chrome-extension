import { test, expect } from "@playwright/test";
import * as path from "path";

/**
 * Screenshot generation test — produces reference images of every
 * dashboard mode × viewport size combination and saves them to the
 * screenshots/ directory at the repo root for easy visual review.
 *
 * Run with:  npx playwright test tests/generate-screenshots.spec.ts
 */

const MODES = ["Staff", "HS", "MS", "Family"] as const;

const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  chromebook: { width: 1366, height: 768 },
  macbook: { width: 1440, height: 900 },
  desktop: { width: 1920, height: 1080 },
} as const;

const SCREENSHOT_DIR = path.join(__dirname, "..", "screenshots");

for (const mode of MODES) {
  for (const [deviceName, viewport] of Object.entries(VIEWPORTS)) {
    test(`capture ${mode} on ${deviceName} (${viewport.width}×${viewport.height})`, async ({
      browser,
    }) => {
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();

      await page.goto(`/${mode}/index.html`);
      await page.waitForSelector(".menuitem, .linkholder", { timeout: 10000 });
      /* Wait for fonts & icons to finish loading */
      await page.waitForLoadState("networkidle");

      const filename = `${mode}-${deviceName}-${viewport.width}x${viewport.height}.png`;
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, filename),
        fullPage: true,
      });

      await context.close();
    });
  }
}
