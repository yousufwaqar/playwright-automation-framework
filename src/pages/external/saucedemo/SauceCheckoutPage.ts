import { Page, Locator } from "@playwright/test";
import { BasePage } from "../../BasePage";

/**
 * SauceCheckoutPage - Page Object for SauceDemo checkout flow
 *
 * @author Yousuf Waqar
 */
export class SauceCheckoutPage extends BasePage {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly finishButton: Locator;
  private readonly completeHeader: Locator;
  private readonly summaryTotal: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.summaryTotal = page.locator(".summary_total_label");
  }

  async fillCustomerInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fill(this.firstNameInput, firstName);
    await this.fill(this.lastNameInput, lastName);
    await this.fill(this.postalCodeInput, postalCode);
    await this.click(this.continueButton);
  }

  async getOrderTotal(): Promise<string> {
    return this.getText(this.summaryTotal);
  }

  async finishCheckout(): Promise<void> {
    await this.click(this.finishButton);
  }

  async getCompletionMessage(): Promise<string> {
    await this.waitForVisible(this.completeHeader);
    return this.getText(this.completeHeader);
  }

  async assertOrderComplete(): Promise<void> {
    await this.assertUrlContains("/checkout-complete.html");
  }
}
