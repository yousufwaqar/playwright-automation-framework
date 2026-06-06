import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * LoginPage - Page Object for the Login/Authentication page
 *
 * Handles all login-related interactions including:
 * - Standard email/password login
 * - SSO authentication
 * - Error message validation
 *
 * @author Yousuf Waqar
 */
export class LoginPage extends BasePage {
  // ==========================================
  // Locators
  // ==========================================

  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly loadingSpinner: Locator;

  constructor(page: Page) {
    super(page);

    this.emailInput = page.locator('[data-testid="email-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.loginButton = page.locator('[data-testid="login-button"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
  }

  // ==========================================
  // Page Actions
  // ==========================================

  /**
   * Navigate to the login page
   */
  async goto(): Promise<void> {
    await this.navigateTo("/login");
    await this.waitForVisible(this.emailInput);
  }

  /**
   * Perform login with email and password
   */
  async login(email: string, password: string): Promise<void> {
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  // ==========================================
  // Validations
  // ==========================================

  /**
   * Get the error message text displayed on login failure
   */
  async getErrorMessage(): Promise<string> {
    await this.waitForVisible(this.errorMessage);
    return this.getText(this.errorMessage);
  }

  /**
   * Check if login button is enabled
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    return this.isEnabled(this.loginButton);
  }

  /**
   * Assert the login button is disabled (web-first, auto-retries). Used for the
   * empty-fields state where the form should block submission.
   */
  async assertLoginButtonDisabled(): Promise<void> {
    await this.assertDisabled(this.loginButton);
  }

  /**
   * Verify login page is fully loaded
   */
  async isPageLoaded(): Promise<boolean> {
    return this.isVisible(this.emailInput);
  }

  /**
   * Assert the login page is loaded (email field visible). Web-first assertion
   * so callers do not need their own retry.
   */
  async assertLoaded(): Promise<void> {
    await this.assertVisible(this.emailInput);
  }

  /**
   * Assert successful login by checking URL redirect
   */
  async assertLoginSuccess(): Promise<void> {
    await this.assertUrlContains("/dashboard");
  }

  /**
   * Assert login error message is displayed
   */
  async assertLoginError(expectedMessage: string): Promise<void> {
    await this.assertText(this.errorMessage, expectedMessage);
  }
}
