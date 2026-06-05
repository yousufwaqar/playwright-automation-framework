import { test, expect } from "../src/fixtures/base.fixture";
import type { Page } from "@playwright/test";
import { TestDataManager } from "../src/utils/TestDataManager";
import type { LoginPage } from "../src/pages/LoginPage";
import type { DashboardPage } from "../src/pages/DashboardPage";
import type { Logger } from "../src/utils/Logger";

/**
 * Dashboard Feature Tests
 *
 * Covers:
 * - Dashboard loading verification
 * - Report search functionality
 * - Report tile interactions
 * - Navigation menu validation
 * - Logout functionality
 *
 * @author Yousuf Waqar
 */

test.describe("Dashboard Feature Tests", () => {
  const testData = TestDataManager.getInstance();

  test.beforeEach(async ({ loginPage, dashboardPage, logger }: { loginPage: LoginPage; dashboardPage: DashboardPage; logger: Logger }) => {
    logger.info("Pre-condition: Login and navigate to dashboard");
    const user = testData.getValidUser();
    await loginPage.goto();
    await loginPage.login(user.username, user.password);
    await dashboardPage.assertDashboardLoaded();
  });

  test(
    "should display dashboard with welcome message @smoke @regression",
    async ({ dashboardPage, logger }: { dashboardPage: DashboardPage; logger: Logger }) => {
      logger.step(1, "Verify welcome message is displayed");
      const welcomeMessage = await dashboardPage.getWelcomeMessage();

      logger.step(2, "Assert welcome message contains expected text");
      expect(welcomeMessage).toContain("Welcome");

      logger.info("Welcome message verification completed");
    }
  );

  test(
    "should search for a specific report @regression",
    async ({ dashboardPage, logger }: { dashboardPage: DashboardPage; logger: Logger }) => {
      logger.step(1, "Search for a report");
      await dashboardPage.searchReport("Sales Report");

      logger.step(2, "Verify search results are displayed");
      const reportCount = await dashboardPage.getReportCount();
      expect(reportCount).toBeGreaterThan(0);

      logger.info("Report search test completed");
    }
  );

  test(
    "should open a report tile @regression",
    async ({ dashboardPage, page, logger }: { dashboardPage: DashboardPage; page: Page; logger: Logger }) => {
      logger.step(1, "Click on the first report tile");
      await dashboardPage.openReport(0);

      logger.step(2, "Verify the report view is activated");
      await expect(page).toHaveTitle(/Report 1/);

      logger.info("Report open test completed");
    }
  );

  test(
    "should logout successfully @smoke @regression",
    async ({ dashboardPage, loginPage, logger }: { dashboardPage: DashboardPage; loginPage: LoginPage; logger: Logger }) => {
      logger.step(1, "Click logout");
      await dashboardPage.logout();

      logger.step(2, "Verify redirect to login page");
      const isLoginPageLoaded = await loginPage.isPageLoaded();
      expect(isLoginPageLoaded).toBe(true);

      logger.info("Logout test completed successfully");
    }
  );
});
