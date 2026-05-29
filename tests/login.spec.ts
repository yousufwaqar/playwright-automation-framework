import { test, expect } from "../src/fixtures/base.fixture";
import { TestDataManager } from "../src/utils/TestDataManager";
import type { LoginPage } from "../src/pages/LoginPage";
import type { Logger } from "../src/utils/Logger";

/**
 * Login Feature Tests
 *
 * Covers:
 * - Successful login with valid credentials
 * - Login failure with invalid credentials
 * - Empty field validation
 * - Remember Me functionality
 * - UI element verification
 *
 * @author Yousuf Waqar
 */

test.describe("Login Feature Tests", () => {
  const testData = TestDataManager.getInstance();

  test.beforeEach(async ({ loginPage }: { loginPage: LoginPage }) => {
    await loginPage.goto();
  });

  test("should login successfully with valid credentials @smoke @regression", async ({
    loginPage,
    logger,
  }: {
    loginPage: LoginPage;
    logger: Logger;
  }) => {
    logger.step(1, "Get valid user credentials");
    const user = testData.getValidUser();

    logger.step(2, "Enter credentials and click login");
    await loginPage.login(user.username, user.password);

    logger.step(3, "Verify successful login redirect");
    await loginPage.assertLoginSuccess();

    logger.info("Login test completed successfully");
  });

  test("should show error message for invalid credentials @regression", async ({
    loginPage,
    logger,
  }: {
    loginPage: LoginPage;
    logger: Logger;
  }) => {
    logger.step(1, "Get invalid user credentials");
    const user = testData.getInvalidUser();

    logger.step(2, "Attempt login with invalid credentials");
    await loginPage.login(user.username, user.password);

    logger.step(3, "Verify error message is displayed");
    await loginPage.assertLoginError("Invalid email or password. Please try again.");

    logger.info("Invalid login test completed successfully");
  });

  test("should disable login button when fields are empty @regression", async ({
    loginPage,
    logger,
  }: {
    loginPage: LoginPage;
    logger: Logger;
  }) => {
    logger.step(1, "Verify login button is disabled on page load");
    const isEnabled = await loginPage.isLoginButtonEnabled();

    logger.step(2, "Assert login button is disabled");
    expect(isEnabled).toBe(false);

    logger.info("Empty field validation test completed");
  });

  test("should verify login page is loaded correctly @smoke", async ({
    loginPage,
    logger,
  }: {
    loginPage: LoginPage;
    logger: Logger;
  }) => {
    logger.step(1, "Verify login page elements are visible");
    const isLoaded = await loginPage.isPageLoaded();

    logger.step(2, "Assert page is loaded");
    expect(isLoaded).toBe(true);

    logger.info("Page load verification completed");
  });
});
