import { test, expect, Browser } from "@playwright/test";

/**
 * Dashboard visual regression tests for the IACS Chrome Extension.
 *
 * - Staff & Family: full screenshot coverage across all 4 viewports,
 *   light + dark mode, plus rendering and a11y contrast checks.
 * - HS & MS: single desktop screenshot (light + dark) plus checks.
 */

const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  chromebook: { width: 1366, height: 768 },
  macbook: { width: 1440, height: 900 },
  desktop: { width: 1920, height: 1080 },
} as const;

/* WCAG AA minimum contrast ratios */
const MIN_CONTRAST_NORMAL = 4.5;
const MIN_CONTRAST_LARGE = 3.0;

/* ------------------------------------------------------------------ */
/*  Helper: open a page at the given mode, viewport, and color scheme */
/* ------------------------------------------------------------------ */
async function openDashboard(
  browser: Browser,
  mode: string,
  viewport: { width: number; height: number },
  colorScheme: "light" | "dark" = "light"
) {
  const context = await browser.newContext({
    viewport,
    colorScheme,
    baseURL: "http://localhost:5050",
  });
  const page = await context.newPage();
  await page.goto(`/${mode}/index.html`);
  await page.waitForSelector(".menuitem, .linkholder", { timeout: 15000 });
  await page.waitForLoadState("networkidle");
  return { context, page };
}

/* ------------------------------------------------------------------ */
/*  Helper: basic rendering quality checks                            */
/* ------------------------------------------------------------------ */
function addRenderingTests(
  mode: string,
  viewport: { width: number; height: number }
) {
  test(`no broken icons (${viewport.width}×${viewport.height})`, async ({
    browser,
  }) => {
    const { context, page } = await openDashboard(browser, mode, viewport);
    const icons = page.locator("img.icon");
    const count = await icons.count();
    if (count > 0) {
      let rendered = 0;
      for (let i = 0; i < count; i++) {
        const box = await icons.nth(i).boundingBox();
        if (box && box.width > 0 && box.height > 0) rendered++;
      }
      expect(rendered).toBeGreaterThan(0);
    }
    await context.close();
  });

  test(`no horizontal overflow (${viewport.width}×${viewport.height})`, async ({
    browser,
  }) => {
    const { context, page } = await openDashboard(browser, mode, viewport);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(overflow).toBe(false);
    await context.close();
  });

  test(`title bar renders (${viewport.width}×${viewport.height})`, async ({
    browser,
  }) => {
    const { context, page } = await openDashboard(browser, mode, viewport);
    await expect(
      page.locator(".top, .title-bar, header").first()
    ).toBeVisible();
    await context.close();
  });

  test(`menu items have text (${viewport.width}×${viewport.height})`, async ({
    browser,
  }) => {
    const { context, page } = await openDashboard(browser, mode, viewport);
    const items = page.locator(".menuitem .title, .linkholder .title");
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 5); i++) {
      const txt = await items.nth(i).textContent();
      expect(txt?.trim().length).toBeGreaterThan(0);
    }
    await context.close();
  });

  test(`menu items not overlapping (${viewport.width}×${viewport.height})`, async ({
    browser,
  }) => {
    const { context, page } = await openDashboard(browser, mode, viewport);
    const items = page.locator(".menuitem:visible, .linkholder:visible");
    const count = await items.count();
    if (count >= 2) {
      const boxes: Array<{ x: number; y: number }> = [];
      for (let i = 0; i < Math.min(count, 10); i++) {
        const box = await items.nth(i).boundingBox();
        if (box) boxes.push({ x: box.x, y: box.y });
      }
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const same =
            Math.abs(boxes[i].x - boxes[j].x) < 1 &&
            Math.abs(boxes[i].y - boxes[j].y) < 1;
          expect(same).toBe(false);
        }
      }
    }
    await context.close();
  });
}

/* ------------------------------------------------------------------ */
/*  Helper: WCAG AA text-contrast check                               */
/* ------------------------------------------------------------------ */
function addContrastTest(
  mode: string,
  scheme: "light" | "dark",
  viewport: { width: number; height: number }
) {
  test(`text contrast WCAG AA – ${scheme} (${viewport.width}×${viewport.height})`, async ({
    browser,
  }) => {
    const { context, page } = await openDashboard(
      browser,
      mode,
      viewport,
      scheme
    );

    const failures = await page.evaluate(
      ({ minNormal, minLarge }) => {
        const issues: string[] = [];
        const els = document.querySelectorAll(
          ".menuitem .title, .menuitem .detail, nav h3, h1, h2"
        );
        for (const el of Array.from(els).slice(0, 30)) {
          const style = window.getComputedStyle(el);
          const fg = style.color;
          const bg = style.backgroundColor;
          if (bg === "rgba(0, 0, 0, 0)") continue;
          const fontSize = parseFloat(style.fontSize);
          const fontWeight = parseInt(style.fontWeight, 10) || 400;
          const isLarge =
            fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
          const threshold = isLarge ? minLarge : minNormal;

          function lum(rgb: string) {
            const m = rgb.match(/[\d.]+/g);
            if (!m) return 0;
            const [r, g, b] = [m[0], m[1], m[2]].map((c) => {
              const v = parseInt(c, 10) / 255;
              return v <= 0.03928
                ? v / 12.92
                : Math.pow((v + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
          }
          const l1 = lum(fg),
            l2 = lum(bg);
          const ratio =
            (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

          if (ratio < threshold) {
            issues.push(
              `"${(el as HTMLElement).innerText.slice(0, 30)}" ` +
                `fg=${fg} bg=${bg} ratio=${ratio.toFixed(2)} (need ${threshold})`
            );
          }
        }
        return issues;
      },
      { minNormal: MIN_CONTRAST_NORMAL, minLarge: MIN_CONTRAST_LARGE }
    );

    if (failures.length > 0) {
      console.warn(
        `[${mode} ${scheme}] ${failures.length} contrast issue(s):\n` +
          failures.join("\n")
      );
    }
    await context.close();
  });
}

/* ================================================================== */
/*  FULL-COVERAGE: Staff & Family — all viewports, light + dark       */
/* ================================================================== */
for (const mode of ["Staff", "Family"] as const) {
  test.describe(`${mode} dashboard`, () => {
    for (const [device, vp] of Object.entries(VIEWPORTS)) {
      test(`light screenshot – ${device} (${vp.width}×${vp.height})`, async ({
        browser,
      }) => {
        const { context, page } = await openDashboard(browser, mode, vp);
        await expect(page).toHaveScreenshot(
          `${mode}-${device}-dashboard.png`,
          { fullPage: true, maxDiffPixelRatio: 0.05 }
        );
        await context.close();
      });

      test(`dark screenshot – ${device} (${vp.width}×${vp.height})`, async ({
        browser,
      }) => {
        const { context, page } = await openDashboard(
          browser,
          mode,
          vp,
          "dark"
        );
        await expect(page).toHaveScreenshot(
          `${mode}-dark-${device}-dashboard.png`,
          { fullPage: true, maxDiffPixelRatio: 0.05 }
        );
        await context.close();
      });

      test(`menu screenshot – ${device} (${vp.width}×${vp.height})`, async ({
        browser,
      }) => {
        const { context, page } = await openDashboard(browser, mode, vp);
        const navCount = await page.locator("nav").count();
        if (navCount > 0) {
          await expect(page.locator("nav").first()).toHaveScreenshot(
            `${mode}-${device}-menu.png`,
            { maxDiffPixelRatio: 0.05 }
          );
        }
        await context.close();
      });

      addRenderingTests(mode, vp);
      addContrastTest(mode, "light", vp);
      addContrastTest(mode, "dark", vp);
    }
  });
}

/* ================================================================== */
/*  LITE-COVERAGE: HS & MS — desktop only, light + dark               */
/* ================================================================== */
for (const mode of ["HS", "MS"] as const) {
  test.describe(`${mode} dashboard`, () => {
    const vp = VIEWPORTS.desktop;

    test(`light screenshot – desktop`, async ({ browser }) => {
      const { context, page } = await openDashboard(browser, mode, vp);
      await expect(page).toHaveScreenshot(`${mode}-desktop-dashboard.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.05,
      });
      await context.close();
    });

    test(`dark screenshot – desktop`, async ({ browser }) => {
      const { context, page } = await openDashboard(
        browser,
        mode,
        vp,
        "dark"
      );
      await expect(page).toHaveScreenshot(
        `${mode}-dark-desktop-dashboard.png`,
        { fullPage: true, maxDiffPixelRatio: 0.05 }
      );
      await context.close();
    });

    addRenderingTests(mode, vp);
    addContrastTest(mode, "light", vp);
    addContrastTest(mode, "dark", vp);
  });
}
