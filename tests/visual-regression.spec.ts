import { test, expect } from "../src/fixtures/base.fixture";

/**
 * Visual Regression Tests
 *
 * Demonstrates Playwright's visual comparison capabilities.
 */
test.describe("Visual Regression Tests", () => {
  test("should match login page snapshot @visual", async ({ loginPage }) => {
    await loginPage.goto();
    // Use toHaveScreenshot to compare the current page with a baseline snapshot
    await expect(loginPage.page).toHaveScreenshot("login-page.png", {
      fullPage: true,
      mask: [loginPage.page.getByTestId("loading-spinner")], // Mask dynamic elements
    });
  });

  test("should match dashboard layout snapshot @visual", async ({ loginPage, dashboardPage }) => {
    const user = { username: "admin@example.com", password: "AdminPassword123!" };
    await loginPage.goto();
    await loginPage.login(user.username, user.password);
    await dashboardPage.assertDashboardLoaded();

    // Visual comparison of the dashboard
    await expect(dashboardPage.page).toHaveScreenshot("dashboard-layout.png", {
      fullPage: true,
      mask: [dashboardPage.page.getByTestId("welcome-message")],
    });
  });
});
