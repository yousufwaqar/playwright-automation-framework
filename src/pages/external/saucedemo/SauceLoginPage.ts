import { Page, Locator } from "@playwright/test";
import { BasePage } from "../../BasePage";

/**
 * SauceLoginPage - Page Object for SauceDemo login page
 *
 * Demo site: https://www.saucedemo.com/
 *
 * @author Yousuf Waqar
 */
export class SauceLoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto(): Promise<void> {
    await this.navigateTo("https://www.saucedemo.com/");
  }

  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  async getErrorMessage(): Promise<string> {
    await this.waitForVisible(this.errorMessage);
    return this.getText(this.errorMessage);
  }

  async assertLoginSuccess(): Promise<void> {
    await this.assertUrlContains("/inventory.html");
  }
}
