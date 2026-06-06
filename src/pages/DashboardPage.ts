import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * DashboardPage - Page Object for the main Dashboard
 *
 * Handles dashboard interactions including:
 * - Navigation menu
 * - Report/Dashboard tiles
 * - User profile actions
 * - Search functionality
 *
 * @author Yousuf Waqar
 */
export class DashboardPage extends BasePage {
  // ==========================================
  // Locators
  // ==========================================

  private readonly welcomeMessage: Locator;
  private readonly navigationMenu: Locator;
  private readonly searchInput: Locator;
  private readonly userProfileIcon: Locator;
  private readonly logoutButton: Locator;
  private readonly reportTiles: Locator;
  private readonly notificationBell: Locator;
  private readonly sidePanel: Locator;

  constructor(page: Page) {
    super(page);

    this.welcomeMessage = page.locator('[data-testid="welcome-message"]');
    this.navigationMenu = page.locator('[data-testid="nav-menu"]');
    this.searchInput = page.locator('[data-testid="search-input"]');
    this.userProfileIcon = page.locator('[data-testid="user-profile"]');
    this.logoutButton = page.locator('[data-testid="logout-button"]');
    this.reportTiles = page.locator('[data-testid="report-tile"]');
    this.notificationBell = page.locator('[data-testid="notification-bell"]');
    this.sidePanel = page.locator('[data-testid="side-panel"]');
  }

  // ==========================================
  // Page Actions
  // ==========================================

  /**
   * Navigate to dashboard
   */
  async goto(): Promise<void> {
    await this.navigateTo("/dashboard");
    await this.waitForVisible(this.welcomeMessage);
  }

  /**
   * Search for a report or dashboard
   */
  async searchReport(query: string): Promise<void> {
    await this.fill(this.searchInput, query);
    await this.page.keyboard.press("Enter");
  }

  /**
   * Click on a specific report tile by index
   */
  async openReport(index: number): Promise<void> {
    await this.click(this.reportTiles.nth(index));
  }

  /**
   * Logout from the application
   */
  async logout(): Promise<void> {
    await this.click(this.userProfileIcon);
    await this.click(this.logoutButton);
    await this.page.waitForURL(/\/login/);
  }

  /**
   * Open notification panel
   */
  async openNotifications(): Promise<void> {
    await this.click(this.notificationBell);
    await this.waitForVisible(this.sidePanel);
  }

  // ==========================================
  // Validations
  // ==========================================

  /**
   * Get welcome message text
   */
  async getWelcomeMessage(): Promise<string> {
    return this.getText(this.welcomeMessage);
  }

  /**
   * Assert the welcome message contains the expected text (web-first, auto-retries).
   */
  async assertWelcomeMessageContains(expectedText: string): Promise<void> {
    await expect(this.welcomeMessage).toContainText(expectedText);
  }

  /**
   * Get total number of report tiles displayed
   */
  async getReportCount(): Promise<number> {
    return this.reportTiles.count();
  }

  /**
   * Get the number of report tiles currently visible (the mock search hides
   * non-matching tiles via `display:none` rather than removing them, so a plain
   * count would not reflect a search). Uses the `:visible` engine.
   */
  async getVisibleReportCount(): Promise<number> {
    return this.page.locator('[data-testid="report-tile"]:visible').count();
  }

  /**
   * Verify dashboard is loaded
   */
  async isDashboardLoaded(): Promise<boolean> {
    return this.isVisible(this.welcomeMessage);
  }

  /**
   * Assert the notifications side panel is in its open state. The panel is always
   * present in the DOM and slides in via the `visible` class, so assert on that
   * class rather than mere visibility (which would pass even when closed).
   */
  async assertNotificationsOpen(): Promise<void> {
    await expect(this.sidePanel).toHaveClass(/visible/);
  }

  /**
   * Assert dashboard page loaded successfully
   */
  async assertDashboardLoaded(): Promise<void> {
    await this.assertVisible(this.welcomeMessage);
    await this.assertUrlContains("/dashboard");
  }

  /**
   * Assert specific number of report tiles are present in the DOM (web-first,
   * auto-retries). Counts all tiles including hidden ones; use
   * assertOnlyVisibleReport for the post-search visible set.
   */
  async assertReportCount(expectedCount: number): Promise<void> {
    await expect(this.reportTiles).toHaveCount(expectedCount);
  }

  /**
   * Assert that exactly one report tile is visible after a search and that it is
   * the expected report. The mock filters by toggling `display`, so this checks
   * the search actually narrowed the visible set rather than just leaving tiles
   * in the DOM.
   */
  async assertOnlyVisibleReport(reportName: string): Promise<void> {
    const visibleTiles = this.page.locator(
      '[data-testid="report-tile"]:visible'
    );
    await expect(visibleTiles).toHaveCount(1);
    await expect(visibleTiles).toContainText(reportName);
  }
}