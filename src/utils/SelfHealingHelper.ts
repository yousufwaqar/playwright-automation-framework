import { Page, Locator } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

/**
 * SelfHealingHelper - A state-of-the-art utility for AI-style self-healing test automation.
 *
 * When primary locators drift due to design or UI changes, this helper attempts to heal the locator
 * using structural fallback candidates (e.g., matching text, roles, labels, or secondary selectors).
 * Successful healings are saved to a dynamic report for review and remediation, preventing false
 * CI failures.
 *
 * @author Yousuf Waqar & AI SDET Agent
 */

export interface HealingCandidate {
  primarySelector: string;
  fallbackSelector: string;
  pageUrl: string;
  action: string;
  timestamp: string;
}

export interface SimpleLogger {
  info(msg: string): void;
  warn(msg: string): void;
  error(msg: string): void;
}

export class SelfHealingHelper {
  private static readonly reportPath = path.join(process.cwd(), "test-results", "healed_locators.json");

  /**
   * Safe Click with Self-Healing fallback.
   */
  static async clickWithHealing(
    page: Page,
    primaryLocator: Locator,
    primarySelectorString: string,
    fallbacks: string[],
    logger: SimpleLogger,
    timeoutMs: number = 3000
  ): Promise<void> {
    try {
      // Attempt to click the primary selector with a short timeout
      await primaryLocator.waitFor({ state: "visible", timeout: timeoutMs });
      await primaryLocator.click();
    } catch (primaryError) {
      logger.warn(`⚠️ Primary selector [${primarySelectorString}] failed. Initializing self-healing...`);

      for (const fallback of fallbacks) {
        try {
          logger.info(`🔍 Trying fallback selector: ${fallback}`);
          const fallbackLocator = page.locator(fallback);
          await fallbackLocator.waitFor({ state: "visible", timeout: 2000 });
          await fallbackLocator.click();

          // Log the successful healing action
          this.logHealing({
            primarySelector: primarySelectorString,
            fallbackSelector: fallback,
            pageUrl: page.url(),
            action: "click",
            timestamp: new Date().toISOString()
          });

          logger.info(`✨ Successfully healed! Element clicked using fallback: ${fallback}`);
          return; // Self-healed successfully!
        } catch {
          // Continue to next fallback
        }
      }

      // If all fallbacks fail, raise the original error to preserve test correctness
      throw primaryError;
    }
  }

  /**
   * Safe Fill with Self-Healing fallback.
   */
  static async fillWithHealing(
    page: Page,
    primaryLocator: Locator,
    primarySelectorString: string,
    fallbacks: string[],
    text: string,
    logger: SimpleLogger,
    timeoutMs: number = 3000
  ): Promise<void> {
    try {
      await primaryLocator.waitFor({ state: "visible", timeout: timeoutMs });
      await primaryLocator.clear();
      await primaryLocator.fill(text);
    } catch (primaryError) {
      logger.warn(`⚠️ Primary selector [${primarySelectorString}] failed. Initializing self-healing...`);

      for (const fallback of fallbacks) {
        try {
          logger.info(`🔍 Trying fallback selector: ${fallback}`);
          const fallbackLocator = page.locator(fallback);
          await fallbackLocator.waitFor({ state: "visible", timeout: 2000 });
          await fallbackLocator.clear();
          await fallbackLocator.fill(text);

          this.logHealing({
            primarySelector: primarySelectorString,
            fallbackSelector: fallback,
            pageUrl: page.url(),
            action: "fill",
            timestamp: new Date().toISOString()
          });

          logger.info(`✨ Successfully healed! Element filled using fallback: ${fallback}`);
          return;
        } catch {
          // Continue
        }
      }

      throw primaryError;
    }
  }

  /**
   * Persists the healing event to test-results/healed_locators.json
   */
  private static logHealing(candidate: HealingCandidate): void {
    try {
      const dir = path.dirname(this.reportPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      let data: HealingCandidate[] = [];
      if (fs.existsSync(this.reportPath)) {
        try {
          data = JSON.parse(fs.readFileSync(this.reportPath, "utf-8"));
        } catch {
          data = [];
        }
      }

      data.push(candidate);
      fs.writeFileSync(this.reportPath, JSON.stringify(data, null, 2), "utf-8");
    } catch {
      // Fail silently to prevent interrupting execution
    }
  }
}
