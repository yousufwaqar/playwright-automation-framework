import { test, expect } from "../../../src/fixtures/saucedemo.fixture";
import data from "../../test-data/external-sites.json";

/**
 * SauceDemo Login Tests
 *
 * Demo site: https://www.saucedemo.com/
 *
 * @author Yousuf Waqar
 */

test.describe("SauceDemo - Login @external @saucedemo", () => {
  test.beforeEach(async ({ sauceLoginPage }) => {
    await sauceLoginPage.goto();
  });

  test("should login successfully with standard user @smoke", async ({
    sauceLoginPage,
    sauceInventoryPage,
    logger,
  }) => {
    logger.step(1, "Login with standard user");
    const user = data.saucedemo.users.standard;
    await sauceLoginPage.login(user.username, user.password);

    logger.step(2, "Verify inventory page is loaded");
    await sauceInventoryPage.assertInventoryLoaded();

    logger.step(3, "Verify products are displayed");
    const productCount = await sauceInventoryPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
  });

  test("should reject locked-out user @regression", async ({ sauceLoginPage, logger }) => {
    logger.step(1, "Attempt login with locked-out user");
    const user = data.saucedemo.users.lockedOut;
    await sauceLoginPage.login(user.username, user.password);

    logger.step(2, "Verify error message");
    const errorText = await sauceLoginPage.getErrorMessage();
    expect(errorText).toContain("locked out");
  });

  test("should reject invalid credentials @regression", async ({ sauceLoginPage, logger }) => {
    logger.step(1, "Attempt login with invalid credentials");
    await sauceLoginPage.login("invalid_user", "wrong_password");

    logger.step(2, "Verify error message is displayed");
    const errorText = await sauceLoginPage.getErrorMessage();
    expect(errorText).toMatch(/Username and password do not match/i);
  });
});
