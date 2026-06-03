import type { Page } from "@playwright/test";

/**
 * PerformanceHelper
 *
 * Collects browser Navigation Timing metrics and provides small statistics
 * helpers for lightweight, deterministic performance smoke checks. Uses only
 * the standard W3C Navigation Timing Level 2 API (no third-party tooling).
 *
 * @author Yousuf Waqar
 */

export type NavigationTiming = {
  /** Time to DOMContentLoaded, in ms from navigation start. */
  domContentLoaded: number;
  /** Time to the load event, in ms from navigation start. */
  load: number;
  /** Server response time (responseEnd - requestStart), in ms. */
  responseTime: number;
  /** Encoded transfer size of the document in bytes (0 if not exposed). */
  transferSize: number;
};

export class PerformanceHelper {
  /**
   * Read Navigation Timing metrics for the currently loaded page.
   * The page should already be navigated with `waitUntil: "load"`.
   */
  static async getNavigationTiming(page: Page): Promise<NavigationTiming> {
    return page.evaluate(() => {
      const entries = performance.getEntriesByType("navigation");
      const nav = entries[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: Math.max(
          0,
          nav.domContentLoadedEventEnd - nav.startTime
        ),
        load: Math.max(0, nav.loadEventEnd - nav.startTime),
        responseTime: Math.max(0, nav.responseEnd - nav.requestStart),
        transferSize: nav.transferSize,
      };
    });
  }

  /**
   * Compute the p-th percentile (0–100) of a numeric sample using
   * nearest-rank. Returns 0 for an empty sample.
   */
  static percentile(values: number[], p: number): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const rank = Math.ceil((p / 100) * sorted.length);
    const index = Math.min(sorted.length - 1, Math.max(0, rank - 1));
    return sorted[index];
  }
}
