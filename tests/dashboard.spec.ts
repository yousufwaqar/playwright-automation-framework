import { test, expect } from "../src/fixtures/authenticated.fixture";
import type { Page } from "@playwright/test";
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
 * Authenticated via storageState (see authenticated.fixture.ts), so each test
 * opens the dashboard directly instead of driving the login UI.
 *
 * @author Yousuf Waqar
 */

test.describe("Dashboard Feature Tests", () => {
  test.beforeEach(async ({ dashboardPage, logger }: { dashboardPage: DashboardPage; logger: Logger }) => {
    logger.info("Pre-condition: open the dashboard (authenticated via storageState)");
    await dashboardPage.goto();
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

      logger.step(2, "Verify only the matching report tile remains visible");
      await dashboardPage.assertOnlyVisibleReport("Sales Report");

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
    "should open the notifications panel @smoke @regression",
    async ({ dashboardPage, logger }: { dashboardPage: DashboardPage; logger: Logger }) => {
      logger.step(1, "Open the notifications panel");
      await dashboardPage.openNotifications();

      logger.step(2, "Verify the notifications panel is in its open state");
      await dashboardPage.assertNotificationsOpen();

      logger.info("Notifications panel test completed");
    }
  );

  test(
    "should logout successfully @smoke @regression",
    async ({ dashboardPage, loginPage, logger }: { dashboardPage: DashboardPage; loginPage: LoginPage; logger: Logger }) => {
      logger.step(1, "Click logout");
      await dashboardPage.logout();

      logger.step(2, "Verify redirect to login page");
      await loginPage.assertLoaded();

      logger.info("Logout test completed successfully");
    }
  );
});
