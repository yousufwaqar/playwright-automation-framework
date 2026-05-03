import { Page, Locator } from "@playwright/test";
import { BasePage } from "../../BasePage";

/**
 * SauceCartPage - Page Object for SauceDemo cart page
 *
 * @author Yousuf Waqar
 */
export class SauceCartPage extends BasePage {
  private readonly cartItems: Locator;
  private readonly checkoutButton: Locator;
  private readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator(".cart_item");
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator(
      '[data-test="continue-shopping"]'
    );
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async checkout(): Promise<void> {
    await this.click(this.checkoutButton);
  }

  async continueShopping(): Promise<void> {
    await this.click(this.continueShoppingButton);
  }

  async assertCartLoaded(): Promise<void> {
    await this.assertUrlContains("/cart.html");
  }
}
