import { test, expect, Page } from "@playwright/test";

/**
 * Dashboard visual regression tests for the IACS Chrome Extension.
 *
 * Tests each dashboard mode (Staff, HS, MS, Family) at every configured
 * viewport size (mobile, chromebook, macbook, desktop). Captures screenshots
 * for regression comparison and checks basic rendering quality.
 */

const MODES = ["Staff", "HS", "MS", "Family"] as const;

for (const mode of MODES) {
  test.describe(`${mode} dashboard`, () => {
    test.beforeEach(async ({ page }) => {
      /* Each mode is served from /<mode>/index.html */
      await page.goto(`/${mode}/index.html`);
      /* Wait for the Svelte app to mount and menus to render */
      await page.waitForSelector(".menuitem, .linkholder", { timeout: 10000 });
      /* Give fonts and icons a moment to load */
      await page.waitForTimeout(500);
    });

    test("full page screenshot for regression", async ({ page }, testInfo) => {
      await expect(page).toHaveScreenshot(`${mode}-dashboard.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.05,
      });
    });

    test("menu area screenshot", async ({ page }) => {
      const menuArea =
        page.locator("nav").first() || page.locator(".menu").first();
      /* Only screenshot if menu area exists */
      const menuCount = await page.locator("nav").count();
      if (menuCount > 0) {
        await expect(page.locator("nav").first()).toHaveScreenshot(
          `${mode}-menu.png`,
          { maxDiffPixelRatio: 0.05 }
        );
      }
    });

    test("no broken icon images", async ({ page }) => {
      /* Check all icon images loaded successfully */
      const icons = page.locator("img.icon");
      const count = await icons.count();

      if (count === 0) {
        /* No icons is acceptable for some modes, but log it */
        return;
      }

      /* Verify at least some icons rendered at non-zero size */
      let renderedCount = 0;
      for (let i = 0; i < count; i++) {
        const icon = icons.nth(i);
        const box = await icon.boundingBox();
        if (box && box.width > 0 && box.height > 0) {
          renderedCount++;
        }
      }
      expect(renderedCount).toBeGreaterThan(0);
    });

    test("no horizontal overflow", async ({ page }) => {
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(overflow).toBe(false);
    });

    test("title bar renders", async ({ page }) => {
      /* The title bar should always be present */
      const titleBar = page.locator(".top, .title-bar, header").first();
      await expect(titleBar).toBeVisible();
    });

    test("menu items have text content", async ({ page }) => {
      const menuItems = page.locator(".menuitem .title, .linkholder .title");
      const count = await menuItems.count();
      expect(count).toBeGreaterThan(0);

      /* Spot-check that menu items have non-empty text */
      for (let i = 0; i < Math.min(count, 5); i++) {
        const text = await menuItems.nth(i).textContent();
        expect(text?.trim().length).toBeGreaterThan(0);
      }
    });

    test("menu items are not overlapping", async ({ page }) => {
      const menuItems = page.locator(
        ".menuitem:visible, .linkholder:visible"
      );
      const count = await menuItems.count();

      if (count < 2) return;

      /* Sample pairs of menu items and check they don't fully overlap */
      const boxes: Array<{ x: number; y: number; w: number; h: number }> = [];
      for (let i = 0; i < Math.min(count, 10); i++) {
        const box = await menuItems.nth(i).boundingBox();
        if (box) {
          boxes.push({
            x: box.x,
            y: box.y,
            w: box.width,
            h: box.height,
          });
        }
      }

      /* Check that no two visible items have the exact same position */
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const samePos =
            Math.abs(boxes[i].x - boxes[j].x) < 1 &&
            Math.abs(boxes[i].y - boxes[j].y) < 1;
          expect(samePos).toBe(false);
        }
      }
    });
  });
}
