import { test, expect } from "../../src/fixtures/base.fixture";
import { AccessibilityHelper } from "../../src/utils/AccessibilityHelper";
import type { Page } from "@playwright/test";
import type { LoginPage } from "../../src/pages/LoginPage";
import type { Logger } from "../../src/utils/Logger";

/**
 * Accessibility (a11y) Tests - login page
 *
 * Automated WCAG 2.0/2.1 A & AA smoke coverage using axe-core (open source).
 * The unauthenticated login page is audited here; the authenticated dashboard
 * audit lives in dashboard.a11y.spec.ts. Smoke-level checks, not a full manual
 * accessibility certification.
 *
 * @author Yousuf Waqar
 */

test.describe("Accessibility Audit @a11y", () => {
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
});
