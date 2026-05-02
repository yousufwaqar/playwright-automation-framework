import { test, expect } from "../src/fixtures/base.fixture";
import { TestDataManager } from "../src/utils/TestDataManager";
<<<<<<< HEAD
import type { LoginPage } from "../src/pages/LoginPage";
import type { Logger } from "../src/utils/Logger";
=======
>>>>>>> e78c24ec695b43146e56984be943791800ec77d2

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

<<<<<<< HEAD
  test.beforeEach(async ({ loginPage }: { loginPage: LoginPage }) => {
=======
  test.beforeEach(async ({ loginPage }) => {
>>>>>>> e78c24ec695b43146e56984be943791800ec77d2
    await loginPage.goto();
  });

  test(
    "should login successfully with valid credentials @smoke @regression",
<<<<<<< HEAD
    async ({ loginPage, logger }: { loginPage: LoginPage; logger: Logger }) => {
=======
    async ({ loginPage, logger }) => {
>>>>>>> e78c24ec695b43146e56984be943791800ec77d2
      logger.step(1, "Get valid user credentials");
      const user = testData.getValidUser();

      logger.step(2, "Enter credentials and click login");
      await loginPage.login(user.username, user.password);

      logger.step(3, "Verify successful login redirect");
      await loginPage.assertLoginSuccess();

      logger.info("Login test completed successfully");
    }
  );

  test(
    "should show error message for invalid credentials @regression",
<<<<<<< HEAD
    async ({ loginPage, logger }: { loginPage: LoginPage; logger: Logger }) => {
=======
    async ({ loginPage, logger }) => {
>>>>>>> e78c24ec695b43146e56984be943791800ec77d2
      logger.step(1, "Get invalid user credentials");
      const user = testData.getInvalidUser();

      logger.step(2, "Attempt login with invalid credentials");
      await loginPage.login(user.username, user.password);

      logger.step(3, "Verify error message is displayed");
      await loginPage.assertLoginError(
        "Invalid email or password. Please try again."
      );

      logger.info("Invalid login test completed successfully");
    }
  );

  test(
    "should disable login button when fields are empty @regression",
<<<<<<< HEAD
    async ({ loginPage, logger }: { loginPage: LoginPage; logger: Logger }) => {
=======
    async ({ loginPage, logger }) => {
>>>>>>> e78c24ec695b43146e56984be943791800ec77d2
      logger.step(1, "Verify login button is disabled on page load");
      const isEnabled = await loginPage.isLoginButtonEnabled();

      logger.step(2, "Assert login button is disabled");
      expect(isEnabled).toBe(false);

      logger.info("Empty field validation test completed");
    }
  );

  test(
    "should verify login page is loaded correctly @smoke",
<<<<<<< HEAD
    async ({ loginPage, logger }: { loginPage: LoginPage; logger: Logger }) => {
=======
    async ({ loginPage, logger }) => {
>>>>>>> e78c24ec695b43146e56984be943791800ec77d2
      logger.step(1, "Verify login page elements are visible");
      const isLoaded = await loginPage.isPageLoaded();

      logger.step(2, "Assert page is loaded");
      expect(isLoaded).toBe(true);

      logger.info("Page load verification completed");
    }
  );
});
