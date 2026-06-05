import { test, expect } from "../../src/fixtures/authenticated.fixture";
import { AccessibilityHelper } from "../../src/utils/AccessibilityHelper";
import type { Page } from "@playwright/test";
import type { DashboardPage } from "../../src/pages/DashboardPage";
import type { Logger } from "../../src/utils/Logger";

/**
 * Dashboard Accessibility (a11y) Tests
 *
 * Authenticated via storageState (see authenticated.fixture.ts). Audits the
 * dashboard for WCAG 2.0/2.1 A & AA violations using axe-core.
 *
 * @author Yousuf Waqar
 */

test.describe("Dashboard Accessibility Audit @a11y", () => {
  test(
    "dashboard page should have no WCAG A/AA violations @a11y @regression",
    async ({
      page,
      dashboardPage,
      logger,
    }: {
      page: Page;
      dashboardPage: DashboardPage;
      logger: Logger;
    }) => {
      logger.step(1, "Open the dashboard (authenticated)");
      await dashboardPage.goto();
      await dashboardPage.assertDashboardLoaded();

      logger.step(2, "Run axe-core WCAG audit on dashboard");
      const result = await AccessibilityHelper.audit(page);

      logger.step(3, "Assert zero violations");
      expect(
        result.violations,
        AccessibilityHelper.formatViolations(result)
      ).toEqual([]);

      logger.info("Dashboard accessibility audit passed");
    }
  );
});
