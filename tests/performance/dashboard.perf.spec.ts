import { test, expect } from "../../src/fixtures/authenticated.fixture";
import { PerformanceHelper } from "../../src/utils/PerformanceHelper";
import { Logger } from "../../src/utils/Logger";

/**
 * Performance Smoke Tests - dashboard
 *
 * Authenticated via storageState (see authenticated.fixture.ts) so the dashboard
 * renders past its client-side auth guard. Deterministic, lightweight load-time
 * guardrail with a generous budget; not a capacity/benchmark test.
 *
 * Tagged @performance and excluded from the default `npm test`; run via
 * `npm run test:performance`.
 *
 * @author Yousuf Waqar
 */

const PAGE_LOAD_BUDGET_MS = 6000;
const DOM_CONTENT_LOADED_BUDGET_MS = 4000;

test.describe("Performance Smoke - dashboard @performance", () => {
  test("dashboard page loads within performance budget @performance @regression", async ({
    page,
  }) => {
    const logger = new Logger("Perf: dashboard page");

    logger.step(1, "Navigate to dashboard (authenticated) and wait for load");
    await page.goto("/dashboard", { waitUntil: "load" });

    logger.step(2, "Read Navigation Timing metrics");
    const timing = await PerformanceHelper.getNavigationTiming(page);
    logger.info(
      `dashboard DCL=${timing.domContentLoaded.toFixed(0)}ms load=${timing.load.toFixed(0)}ms`
    );

    expect(timing.domContentLoaded).toBeLessThan(DOM_CONTENT_LOADED_BUDGET_MS);
    expect(timing.load).toBeLessThan(PAGE_LOAD_BUDGET_MS);
  });
});
