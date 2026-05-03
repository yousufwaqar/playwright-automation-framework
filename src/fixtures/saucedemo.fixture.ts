import { test as base } from "@playwright/test";
import { SauceLoginPage } from "../pages/external/saucedemo/SauceLoginPage";
import { SauceInventoryPage } from "../pages/external/saucedemo/SauceInventoryPage";
import { SauceCartPage } from "../pages/external/saucedemo/SauceCartPage";
import { SauceCheckoutPage } from "../pages/external/saucedemo/SauceCheckoutPage";
import { Logger } from "../utils/Logger";

/**
 * Custom fixtures for SauceDemo external test suite
 *
 * @author Yousuf Waqar
 */

type SauceFixtures = {
  sauceLoginPage: SauceLoginPage;
  sauceInventoryPage: SauceInventoryPage;
  sauceCartPage: SauceCartPage;
  sauceCheckoutPage: SauceCheckoutPage;
  logger: Logger;
};

export const test = base.extend<SauceFixtures>({
  sauceLoginPage: async ({ page }, use) => {
    await use(new SauceLoginPage(page));
  },
  sauceInventoryPage: async ({ page }, use) => {
    await use(new SauceInventoryPage(page));
  },
  sauceCartPage: async ({ page }, use) => {
    await use(new SauceCartPage(page));
  },
  sauceCheckoutPage: async ({ page }, use) => {
    await use(new SauceCheckoutPage(page));
  },
  logger: async ({}, use, testInfo) => {
    const logger = new Logger(testInfo.title);
    logger.info(`Starting test: ${testInfo.title}`);
    await use(logger);
    logger.info(`Finished test: ${testInfo.title} - Status: ${testInfo.status}`);
  },
});

export { expect } from "@playwright/test";
