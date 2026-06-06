import { Page, Locator, expect } from "@playwright/test";
import { ConfigManager } from "../utils/ConfigManager";

/**
 * BasePage - Abstract base class for all Page Objects
 *
 * Provides common methods for page interactions, reducing code duplication
 * and ensuring consistent behavior across all page objects.
 *
 * @author Yousuf Waqar
 */
export class BasePage {
  protected page: Page;
  /** Wait budget for a single element interaction (visible-before-act). */
  protected readonly actionTimeout: number;
  /** Wait budget for explicit visible/hidden waits. */
  protected readonly waitTimeout: number;

  constructor(page: Page) {
    this.page = page;
    // Derive timeouts from the active environment so local and CI runs honour
    // their configured budgets instead of hardcoded magic numbers. expectTimeout
    // (not the full navigation/test timeout) keeps a missing element from
    // consuming the whole test budget and surfacing as a vague test timeout.
    const config = ConfigManager.getInstance();
    this.actionTimeout = config.getActionTimeout();
    this.waitTimeout = config.getExpectTimeout();
  }

  // ==========================================
  // Navigation
  // ==========================================

  /**
   * Navigate to a specific URL
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
  }

  /**
   * Get the current page URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Get the current page title
   */
  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  // ==========================================
  // Element Interactions
  // ==========================================

  /**
   * Click on an element with auto-wait
   */
  async click(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "visible", timeout: this.actionTimeout });
    await locator.click();
  }

  /**
   * Double-click on an element
   */
  async doubleClick(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "visible", timeout: this.actionTimeout });
    await locator.dblclick();
  }

  /**
   * Fill a text input field (clears existing text first)
   */
  async fill(locator: Locator, text: string): Promise<void> {
    await locator.waitFor({ state: "visible", timeout: this.actionTimeout });
    await locator.clear();
    await locator.fill(text);
  }

  /**
   * Type text character by character (for inputs that need keystrokes)
   */
  async typeText(locator: Locator, text: string): Promise<void> {
    await locator.waitFor({ state: "visible", timeout: this.actionTimeout });
    await locator.pressSequentially(text, { delay: 50 });
  }

  /**
   * Select an option from a dropdown by value
   */
  async selectByValue(locator: Locator, value: string): Promise<void> {
    await locator.selectOption({ value });
  }

  /**
   * Select an option from a dropdown by visible text
   */
  async selectByText(locator: Locator, text: string): Promise<void> {
    await locator.selectOption({ label: text });
  }

  /**
   * Hover over an element
   */
  async hover(locator: Locator): Promise<void> {
    await locator.hover();
  }

  // ==========================================
  // Element State Checks
  // ==========================================

  /**
   * Check if an element is visible
   */
  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  /**
   * Check if an element is enabled
   */
  async isEnabled(locator: Locator): Promise<boolean> {
    return locator.isEnabled();
  }

  /**
   * Get text content of an element
   */
  async getText(locator: Locator): Promise<string> {
    return (await locator.textContent()) || "";
  }

  /**
   * Get attribute value of an element
   */
  async getAttribute(
    locator: Locator,
    attribute: string
  ): Promise<string | null> {
    return locator.getAttribute(attribute);
  }

  // ==========================================
  // Wait Utilities
  // ==========================================

  /**
   * Wait for an element to be visible
   */
  async waitForVisible(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({
      state: "visible",
      timeout: timeout ?? this.waitTimeout,
    });
  }

  /**
   * Wait for an element to be hidden
   */
  async waitForHidden(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({
      state: "hidden",
      timeout: timeout ?? this.waitTimeout,
    });
  }

  // ==========================================
  // Assertions
  // ==========================================

  /**
   * Assert element is visible
   */
  async assertVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  /**
   * Assert element is disabled
   */
  async assertDisabled(locator: Locator): Promise<void> {
    await expect(locator).toBeDisabled();
  }

  /**
   * Assert element contains specific text
   */
  async assertText(locator: Locator, expectedText: string): Promise<void> {
    await expect(locator).toContainText(expectedText);
  }

  /**
   * Assert page URL contains specific path
   */
  async assertUrlContains(path: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(path));
  }

  /**
   * Assert page title
   */
  async assertTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  // ==========================================
  // Screenshots & Debugging
  // ==========================================

  /**
   * Take a screenshot with a descriptive name
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `test-results/screenshots/${name}.png`,
      fullPage: true,
    });
  }
}
