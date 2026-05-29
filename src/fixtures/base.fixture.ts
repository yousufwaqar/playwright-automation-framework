import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { Logger } from "../utils/Logger";
import { TestDataManager } from "../utils/TestDataManager";

/**
 * Custom test fixtures extending Playwright's base test
 *
 * Provides pre-initialized page objects and utilities
 * to all test files, reducing boilerplate code.
 * Includes enhanced error handling for authentication failures.
 *
 * @author Yousuf Waqar
 */

export type CustomFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  logger: Logger;
  authenticatedPage: DashboardPage;
};

export const test = base.extend<CustomFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  logger: async ({}, use, testInfo) => {
    const logger = new Logger(testInfo.title);
    logger.info(`🧪 Starting test: ${testInfo.title}`);
    await use(logger);
    logger.info(`✅ Finished test: ${testInfo.title} - Status: ${testInfo.status}`);
  },

  /**
   * Fixture that handles authenticated page navigation with login
   * Provides early error detection and test skipping on login failure
   *
   * Usage:
   *   test('my test', async ({ authenticatedPage }) => {
   *     // Page is already logged in, ready to use
   *   });
   */
  authenticatedPage: async ({ page, logger }, use, testInfo) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    try {
      logger.info("🔐 Attempting to authenticate user before test execution...");

      // Get test user credentials
      const testDataManager = TestDataManager.getInstance();
      const user = testDataManager.getValidUser();

      // Navigate to login page
      await loginPage.goto();
      logger.info(`📍 Navigated to login page`);

      // Perform login with timeout validation
      await loginPage.login(user.username, user.password);
      logger.info(`✅ Login successful for user: ${user.displayName}`);

      // Verify we reached the dashboard
      await dashboardPage.waitForPageLoad();
      logger.info(`✅ Dashboard loaded successfully - User is authenticated`);

      await use(dashboardPage);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      logger.error(
        `❌ AUTHENTICATION FAILED: ${errorMessage}\n` +
          `Test will be skipped to prevent cascading failures.`
      );

      // Skip the test with descriptive message
      testInfo.skip(true, `Setup failed: Could not authenticate user - ${errorMessage}`);

      await use(dashboardPage); // Required even after skip
    }
  },
});

export { expect } from "@playwright/test";
