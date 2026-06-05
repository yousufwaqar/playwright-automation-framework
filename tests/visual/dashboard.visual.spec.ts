import { test, expect } from "../../src/fixtures/authenticated.fixture";

/**
 * Visual Regression Tests - dashboard
 *
 * Authenticated via storageState (see authenticated.fixture.ts) so the dashboard
 * renders past its client-side auth guard. Pixel-comparison snapshot of the
 * dashboard using Playwright's built-in screenshot assertion.
 *
 * Baselines are platform-specific: `dashboard-page-chromium-win32.png` (local
 * dev) and `dashboard-page-chromium-linux.png` (CI/Docker). Refresh with
 * `npm run test:visual:update`.
 *
 * Tagged @visual and excluded from the default `npm test`; run via
 * `npm run test:visual`.
 *
 * @author Yousuf Waqar
 */

test.describe("Visual Regression - dashboard @visual", () => {
  test("dashboard page matches visual baseline @visual @regression", async ({
    page,
  }) => {
    await page.goto("/dashboard", { waitUntil: "load" });
    await expect(page).toHaveScreenshot("dashboard-page.png", {
      fullPage: true,
    });
  });
});
