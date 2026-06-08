import { test, expect } from "../../src/fixtures/authenticated.fixture";

/**
 * Visual Regression Tests - dashboard
 *
 * Authenticated via storageState (see authenticated.fixture.ts) so the dashboard
 * renders past its client-side auth guard. Pixel-comparison snapshot of the
 * dashboard using Playwright's built-in screenshot assertion.
 *
 * Determinism: the dashboard re-renders its report tiles client-side from
 * `GET /api/v1/reports` after load. To avoid a race between that async render
 * and the screenshot (and to keep the snapshot independent of the host's clock
 * and locale), we (1) stub the reports API with fixed data, (2) pin the browser
 * locale/timezone so `toLocaleDateString()` is stable, and (3) wait for the
 * rendered tiles before snapshotting the final, user-facing UI.
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

// Pin locale/timezone so the client-side `toLocaleDateString()` on report tiles
// renders identical dates on every machine and in CI.
test.use({ locale: "en-US", timezoneId: "UTC" });

const REPORTS_FIXTURE = {
  data: [
    { id: "1", name: "Sales Report", createdAt: "2026-01-15T10:00:00Z", status: "active" },
    { id: "2", name: "Marketing Dashboard", createdAt: "2026-02-20T14:30:00Z", status: "active" },
    { id: "3", name: "Finance Overview", createdAt: "2026-03-10T09:15:00Z", status: "draft" },
  ],
  total: 3,
};

test.describe("Visual Regression - dashboard @visual", () => {
  test("dashboard page matches visual baseline @visual @regression", async ({
    page,
  }) => {
    await page.route("**/api/v1/reports", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(REPORTS_FIXTURE),
      })
    );

    await page.goto("/dashboard", { waitUntil: "load" });

    // Wait for the client-side render to settle so the snapshot captures the
    // final dashboard rather than the pre-fetch placeholder markup.
    await expect(page.getByTestId("delete-report-btn")).toHaveCount(3);

    await expect(page).toHaveScreenshot("dashboard-page.png", {
      fullPage: true,
    });
  });
});
