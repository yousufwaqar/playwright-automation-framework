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
  private readonly forgotPasswordLink: Locator;
  private readonly errorMessage: Locator;
  private readonly rememberMeCheckbox: Locator;
  private readonly ssoButton: Locator;
  private readonly loadingSpinner: Locator;

  constructor(page: Page) {
    super(page);

    this.emailInput = page.getByTestId("email-input");
    this.passwordInput = page.getByTestId("password-input");
    this.loginButton = page.getByTestId("login-button");
    this.forgotPasswordLink = page.getByTestId("forgot-password-link");
    this.errorMessage = page.getByTestId("error-message");
    this.rememberMeCheckbox = page.getByTestId("remember-me-checkbox");
    this.ssoButton = page.getByTestId("sso-button");
    this.loadingSpinner = page.getByTestId("loading-spinner");
  }

  // ==========================================
  // Page Actions
  // ==========================================

  /**
   * Navigate to the login page
   */
  async goto(): Promise<void> {
    await this.navigateTo("/login");
    await this.waitForPageLoad();
  }

  /**
   * Perform login with email and password
   */
  async login(email: string, password: string): Promise<void> {
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
    await this.waitForPageLoad();
  }

  /**
   * Perform login with "Remember Me" checked
   */
  async loginWithRememberMe(email: string, password: string): Promise<void> {
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    await this.click(this.rememberMeCheckbox);
    await this.click(this.loginButton);
    await this.waitForPageLoad();
  }

  /**
   * Click "Forgot Password" link
   */
  async clickForgotPassword(): Promise<void> {
    await this.click(this.forgotPasswordLink);
  }

  /**
   * Click SSO login button
   */
  async clickSSOLogin(): Promise<void> {
    await this.click(this.ssoButton);
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
   * Verify login page is fully loaded
   */
  async isPageLoaded(): Promise<boolean> {
    return this.isVisible(this.emailInput);
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
