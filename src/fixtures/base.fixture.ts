import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { Logger } from "../utils/Logger";

/**
 * Custom test fixtures extending Playwright's base test
 *
 * Provides pre-initialized page objects and utilities
 * to all test files, reducing boilerplate code.
 *
 * @author Yousuf Waqar
 */

<<<<<<< HEAD
export type CustomFixtures = {
=======
type CustomFixtures = {
>>>>>>> e78c24ec695b43146e56984be943791800ec77d2
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  logger: Logger;
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
    logger.info(`Starting test: ${testInfo.title}`);
    await use(logger);
    logger.info(
      `Finished test: ${testInfo.title} - Status: ${testInfo.status}`
    );
  },
});

export { expect } from "@playwright/test";
