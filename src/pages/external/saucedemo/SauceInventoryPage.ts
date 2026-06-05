import { Page, Locator } from "@playwright/test";
import { BasePage } from "../../BasePage";

/**
 * SauceInventoryPage - Page Object for SauceDemo inventory/products page
 *
 * @author Yousuf Waqar
 */
export class SauceInventoryPage extends BasePage {
  private readonly inventoryItems: Locator;
  private readonly itemPrices: Locator;
  private readonly cartIcon: Locator;
  private readonly cartBadge: Locator;
  private readonly sortDropdown: Locator;
  private readonly menuButton: Locator;
  private readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryItems = page.locator(".inventory_item");
    this.itemPrices = page.locator(".inventory_item_price");
    this.cartIcon = page.locator(".shopping_cart_link");
    this.cartBadge = page.locator(".shopping_cart_badge");
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.menuButton = page.locator("#react-burger-menu-btn");
    this.logoutLink = page.locator("#logout_sidebar_link");
  }

  async getProductCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  /**
   * Read the rendered product prices in DOM order as numbers (e.g. "$29.99" ->
   * 29.99), so a test can assert the active sort actually reordered the list.
   */
  async getProductPrices(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((t) => parseFloat(t.replace(/[^0-9.]/g, "")));
  }

  async addProductToCart(productName: string): Promise<void> {
    const button = this.page.locator(
      `[data-test="add-to-cart-${productName.toLowerCase().replace(/\s+/g, "-")}"]`
    );
    await this.click(button);
  }

  async getCartCount(): Promise<number> {
    if (!(await this.isVisible(this.cartBadge))) return 0;
    return parseInt((await this.getText(this.cartBadge)) || "0", 10);
  }

  async openCart(): Promise<void> {
    await this.click(this.cartIcon);
  }

  async sortBy(option: "az" | "za" | "lohi" | "hilo"): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async logout(): Promise<void> {
    await this.click(this.menuButton);
    await this.click(this.logoutLink);
  }

  async assertInventoryLoaded(): Promise<void> {
    await this.assertUrlContains("/inventory.html");
  }
}
