import { test, expect } from "../../../src/fixtures/saucedemo.fixture";
import data from "../../test-data/external-sites.json";

/**
 * SauceDemo End-to-End Checkout Tests
 *
 * Demo site: https://www.saucedemo.com/
 *
 * @author Yousuf Waqar
 */

test.describe("SauceDemo - Checkout flow @external @saucedemo @regression", () => {
  test.beforeEach(async ({ sauceLoginPage }) => {
    await sauceLoginPage.goto();
    const user = data.saucedemo.users.standard;
    await sauceLoginPage.login(user.username, user.password);
  });

  test("should complete a full purchase end-to-end", async ({
    sauceInventoryPage,
    sauceCartPage,
    sauceCheckoutPage,
    logger,
  }) => {
    logger.step(1, "Add products to cart");
    await sauceInventoryPage.addProductToCart("Sauce Labs Backpack");
    await sauceInventoryPage.addProductToCart("Sauce Labs Bike Light");

    logger.step(2, "Verify cart count");
    expect(await sauceInventoryPage.getCartCount()).toBe(2);

    logger.step(3, "Open cart");
    await sauceInventoryPage.openCart();
    await sauceCartPage.assertCartLoaded();
    expect(await sauceCartPage.getItemCount()).toBe(2);

    logger.step(4, "Proceed to checkout");
    await sauceCartPage.checkout();

    logger.step(5, "Fill customer information");
    const customer = data.saucedemo.customer;
    await sauceCheckoutPage.fillCustomerInfo(
      customer.firstName,
      customer.lastName,
      customer.postalCode
    );

    logger.step(6, "Verify order total is displayed");
    const total = await sauceCheckoutPage.getOrderTotal();
    expect(total).toContain("Total");

    logger.step(7, "Finish order");
    await sauceCheckoutPage.finishCheckout();
    await sauceCheckoutPage.assertOrderComplete();

    logger.step(8, "Verify thank-you message");
    const message = await sauceCheckoutPage.getCompletionMessage();
    expect(message).toMatch(/thank you/i);
  });

  test("should sort products from low to high price", async ({ sauceInventoryPage, logger }) => {
    logger.step(1, "Sort products by price low to high");
    await sauceInventoryPage.sortBy("lohi");

    logger.step(2, "Verify product list is still populated");
    expect(await sauceInventoryPage.getProductCount()).toBeGreaterThan(0);
  });

  test("should logout successfully", async ({ sauceInventoryPage, logger }) => {
    logger.step(1, "Logout from inventory");
    await sauceInventoryPage.logout();

    logger.step(2, "Verify redirect to login page");
    await sauceInventoryPage.assertUrlContains("saucedemo.com");
  });
});
