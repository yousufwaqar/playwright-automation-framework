import { test, expect } from "../../src/fixtures/base.fixture";
import { AccessibilityHelper } from "../../src/utils/AccessibilityHelper";
import { TestDataManager } from "../../src/utils/TestDataManager";
import type { Page } from "@playwright/test";
import type { LoginPage } from "../../src/pages/LoginPage";
import type { DashboardPage } from "../../src/pages/DashboardPage";
import type { Logger } from "../../src/utils/Logger";

/**
 * Accessibility (a11y) Tests
 *
 * Automated WCAG 2.0/2.1 A & AA smoke coverage using axe-core (open source).
 * These assert the application has zero WCAG-tagged violations in its key stable
 * states. Smoke-level checks — not a full manual accessibility certification.
 *
 * @author Yousuf Waqar
 */

test.describe("Accessibility Audit @a11y", () => {
  const testData = TestDataManager.getInstance();

  test(
    "login page should have no WCAG A/AA violations @a11y @smoke",
    async ({
      page,
      loginPage,
      logger,
    }: {
      page: Page;
      loginPage: LoginPage;
      logger: Logger;
    }) => {
      logger.step(1, "Navigate to login page");
      await loginPage.goto();

      logger.step(2, "Run axe-core WCAG audit");
      const result = await AccessibilityHelper.audit(page);

      logger.step(3, "Assert zero violations");
      expect(
        result.violations,
        AccessibilityHelper.formatViolations(result)
      ).toEqual([]);

      logger.info("Login page accessibility audit passed");
    }
  );

  test(
    "dashboard page should have no WCAG A/AA violations @a11y @regression",
    async ({
      page,
      loginPage,
      dashboardPage,
      logger,
    }: {
      page: Page;
      loginPage: LoginPage;
      dashboardPage: DashboardPage;
      logger: Logger;
    }) => {
      logger.step(1, "Authenticate and load dashboard");
      const user = testData.getValidUser();
      await loginPage.goto();
      await loginPage.login(user.username, user.password);
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
