import { test, expect } from "../src/fixtures/base.fixture";
import { TestDataManager } from "../src/utils/TestDataManager";
<<<<<<< HEAD
import type { LoginPage } from "../src/pages/LoginPage";
import type { DashboardPage } from "../src/pages/DashboardPage.ts";
import type { Logger } from "../src/utils/Logger";
=======
>>>>>>> e78c24ec695b43146e56984be943791800ec77d2

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

<<<<<<< HEAD
  test.beforeEach(async ({ loginPage, dashboardPage, logger }: { loginPage: LoginPage; dashboardPage: DashboardPage; logger: Logger }) => {
=======
  test.beforeEach(async ({ loginPage, dashboardPage, logger }) => {
>>>>>>> e78c24ec695b43146e56984be943791800ec77d2
    logger.info("Pre-condition: Login and navigate to dashboard");
    const user = testData.getValidUser();
    await loginPage.goto();
    await loginPage.login(user.username, user.password);
    await dashboardPage.assertDashboardLoaded();
  });

  test(
    "should display dashboard with welcome message @smoke @regression",
<<<<<<< HEAD
    async ({ dashboardPage, logger }: { dashboardPage: DashboardPage; logger: Logger }) => {
=======
    async ({ dashboardPage, logger }) => {
>>>>>>> e78c24ec695b43146e56984be943791800ec77d2
      logger.step(1, "Verify welcome message is displayed");
      const welcomeMessage = await dashboardPage.getWelcomeMessage();

      logger.step(2, "Assert welcome message contains expected text");
      expect(welcomeMessage).toContain("Welcome");

      logger.info("Welcome message verification completed");
    }
  );

  test(
    "should search for a specific report @regression",
<<<<<<< HEAD
    async ({ dashboardPage, logger }: { dashboardPage: DashboardPage; logger: Logger }) => {
=======
    async ({ dashboardPage, logger }) => {
>>>>>>> e78c24ec695b43146e56984be943791800ec77d2
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
<<<<<<< HEAD
    async ({ dashboardPage, logger }: { dashboardPage: DashboardPage; logger: Logger }) => {
=======
    async ({ dashboardPage, logger }) => {
>>>>>>> e78c24ec695b43146e56984be943791800ec77d2
      logger.step(1, "Click on the first report tile");
      await dashboardPage.openReport(0);

      logger.step(2, "Verify report page is loaded");
      // Report-specific assertions would go here

      logger.info("Report open test completed");
    }
  );

  test(
    "should logout successfully @smoke @regression",
<<<<<<< HEAD
    async ({ dashboardPage, loginPage, logger }: { dashboardPage: DashboardPage; loginPage: LoginPage; logger: Logger }) => {
=======
    async ({ dashboardPage, loginPage, logger }) => {
>>>>>>> e78c24ec695b43146e56984be943791800ec77d2
      logger.step(1, "Click logout");
      await dashboardPage.logout();

      logger.step(2, "Verify redirect to login page");
      const isLoginPageLoaded = await loginPage.isPageLoaded();
      expect(isLoginPageLoaded).toBe(true);

      logger.info("Logout test completed successfully");
    }
  );
});
