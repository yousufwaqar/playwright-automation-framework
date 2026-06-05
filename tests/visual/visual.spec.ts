import { test, expect } from "@playwright/test";

/**
 * Visual Regression Tests
 *
 * Pixel-comparison snapshots of the app's key pages using Playwright's built-in
 * screenshot assertion (no third-party visual service). Animations are disabled
 * and a small per-pixel tolerance is configured (see playwright.config.ts) for
 * stability.
 *
 * Baselines are platform-specific: Playwright stores them as
 * `*-chromium-win32.png` (local dev) and `*-chromium-linux.png` (CI/Docker).
 * Generate/refresh with `npm run test:visual:update`. On CI, Linux baselines
 * are produced by the `visual-baseline` workflow.
 *
 * Tagged @visual and excluded from the default `npm test`; run via
 * `npm run test:visual`.
 *
 * @author Yousuf Waqar
 */

test.describe("Visual Regression @visual", () => {
  test("login page matches visual baseline @visual @smoke", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "load" });
    await expect(page).toHaveScreenshot("login-page.png", { fullPage: true });
  });
});
