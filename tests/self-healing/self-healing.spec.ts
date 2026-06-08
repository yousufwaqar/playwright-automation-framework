import { test, expect } from "../../src/fixtures/base.fixture";
import { SelfHealingHelper } from "../../src/utils/SelfHealingHelper";
import type { Logger } from "../../src/utils/Logger";
import type { Page } from "@playwright/test";

/**
 * Self-Healing Locator Tests
 *
 * Exercises the SelfHealingHelper recovery path end-to-end against the mock app:
 * a deliberately drifted primary selector should fail, then heal via a structural
 * fallback so the action still completes. This keeps the self-healing engine wired
 * to a real test (preventing it from rotting) while NOT masking critical-path
 * regressions, because the fallback is explicit and the assertion still verifies
 * the real outcome.
 *
 * @author Yousuf Waqar & AI SDET Agent
 */

test.describe("Self-Healing Locators @selfheal @regression", () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto("/login");
  });

  test("fillWithHealing recovers when the primary selector has drifted", async ({
    page,
    logger,
  }: {
    page: Page;
    logger: Logger;
  }) => {
    const driftedSelector = '[data-testid="email-input-DRIFTED"]';
    const driftedLocator = page.locator(driftedSelector);

    await SelfHealingHelper.fillWithHealing(
      page,
      driftedLocator,
      driftedSelector,
      ['[data-testid="email-input"]'],
      "healed@example.com",
      logger,
      1500
    );

    await expect(page.locator('[data-testid="email-input"]')).toHaveValue(
      "healed@example.com"
    );
  });

  test("clickWithHealing recovers when the primary selector has drifted", async ({
    page,
    logger,
  }: {
    page: Page;
    logger: Logger;
  }) => {
    await page.locator('[data-testid="email-input"]').fill("testuser@example.com");
    await page
      .locator('[data-testid="password-input"]')
      .fill("SecurePassword123!");

    const driftedSelector = '[data-testid="login-button-DRIFTED"]';
    const driftedLocator = page.locator(driftedSelector);

    await SelfHealingHelper.clickWithHealing(
      page,
      driftedLocator,
      driftedSelector,
      ['[data-testid="login-button"]'],
      logger,
      1500
    );

    await expect(page).toHaveURL(/\/dashboard/);
  });
});
