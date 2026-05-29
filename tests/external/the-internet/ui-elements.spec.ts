import { test, expect } from "@playwright/test";
import data from "../../test-data/external-sites.json";

/**
 * The Internet (Heroku) - UI element coverage tests
 *
 * Demo site: https://the-internet.herokuapp.com/
 *
 * Demonstrates handling of common UI patterns that show up in real apps:
 * - Form login
 * - Checkboxes
 * - Dropdowns
 * - JavaScript alerts
 * - Dynamic content / waits
 *
 * @author Yousuf Waqar
 */

const baseUrl = data.theInternet.baseUrl;

test.describe("The Internet - UI patterns @external @theinternet", () => {
  test("should login with valid credentials @smoke", async ({ page }) => {
    await page.goto(`${baseUrl}/login`);
    await page.locator("#username").fill(data.theInternet.credentials.valid.username);
    await page.locator("#password").fill(data.theInternet.credentials.valid.password);
    await page.locator('button[type="submit"]').click();

    await expect(page.locator(".flash.success")).toContainText("You logged into a secure area");
  });

  test("should reject invalid credentials @regression", async ({ page }) => {
    await page.goto(`${baseUrl}/login`);
    await page.locator("#username").fill(data.theInternet.credentials.invalid.username);
    await page.locator("#password").fill(data.theInternet.credentials.invalid.password);
    await page.locator('button[type="submit"]').click();

    await expect(page.locator(".flash.error")).toContainText("Your username is invalid");
  });

  test("should toggle checkboxes @regression", async ({ page }) => {
    await page.goto(`${baseUrl}/checkboxes`);
    const checkboxes = page.locator("#checkboxes input[type='checkbox']");

    await checkboxes.nth(0).check();
    await expect(checkboxes.nth(0)).toBeChecked();

    await checkboxes.nth(1).uncheck();
    await expect(checkboxes.nth(1)).not.toBeChecked();
  });

  test("should select an option from a dropdown @regression", async ({ page }) => {
    await page.goto(`${baseUrl}/dropdown`);
    await page.locator("#dropdown").selectOption("2");
    await expect(page.locator("#dropdown")).toHaveValue("2");
  });

  test("should accept a JavaScript alert @regression", async ({ page }) => {
    await page.goto(`${baseUrl}/javascript_alerts`);
    page.once("dialog", (dialog) => dialog.accept());
    await page.locator("button:has-text('Click for JS Alert')").click();

    await expect(page.locator("#result")).toContainText("You successfully clicked an alert");
  });

  test("should wait for dynamically loaded element @regression", async ({ page }) => {
    await page.goto(`${baseUrl}/dynamic_loading/2`);
    await page.locator("#start button").click();

    await expect(page.locator("#finish")).toContainText("Hello World!", {
      timeout: 15000,
    });
  });
});
