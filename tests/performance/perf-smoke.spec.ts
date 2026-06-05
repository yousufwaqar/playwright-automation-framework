import { test, expect } from "@playwright/test";
import { PerformanceHelper } from "../../src/utils/PerformanceHelper";
import { ConfigManager } from "../../src/utils/ConfigManager";
import { Logger } from "../../src/utils/Logger";

/**
 * Performance Smoke Tests
 *
 * Deterministic, lightweight performance guardrails — NOT capacity/benchmark
 * tests. Thresholds are intentionally generous so they catch egregious
 * regressions (e.g. a page that suddenly takes seconds to load, or an API that
 * starts returning errors under light concurrency) without flaking on a busy
 * shared CI runner. Heavier load testing lives in performance/k6/.
 *
 * Tagged @performance and excluded from the default `npm test`; run via
 * `npm run test:performance`.
 *
 * @author Yousuf Waqar
 */

// Generous budgets — these guard against gross regressions only.
const PAGE_LOAD_BUDGET_MS = 6000;
const DOM_CONTENT_LOADED_BUDGET_MS = 4000;
const API_P95_BUDGET_MS = 1500;

test.describe("Performance Smoke @performance", () => {
  const config = ConfigManager.getInstance();
  const apiBaseUrl = config.getApiBaseUrl();

  test("login page loads within performance budget @performance @smoke", async ({
    page,
  }) => {
    const logger = new Logger("Perf: login page");

    logger.step(1, "Navigate to login page and wait for load");
    await page.goto("/", { waitUntil: "load" });

    logger.step(2, "Read Navigation Timing metrics");
    const timing = await PerformanceHelper.getNavigationTiming(page);
    logger.info(
      `login DCL=${timing.domContentLoaded.toFixed(0)}ms load=${timing.load.toFixed(0)}ms`
    );

    logger.step(3, "Assert load metrics are within budget");
    expect(timing.domContentLoaded).toBeLessThan(DOM_CONTENT_LOADED_BUDGET_MS);
    expect(timing.load).toBeLessThan(PAGE_LOAD_BUDGET_MS);
  });

  test("health API stays healthy and fast under light concurrency @performance @regression", async ({
    request,
  }) => {
    const logger = new Logger("Perf: API latency");
    const REQUESTS = 50;

    logger.step(1, `Fire ${REQUESTS} concurrent health requests`);
    const durations: number[] = [];
    const statuses = await Promise.all(
      Array.from({ length: REQUESTS }, async () => {
        const start = Date.now();
        const res = await request.get(`${apiBaseUrl}/health`);
        durations.push(Date.now() - start);
        return res.status();
      })
    );

    logger.step(2, "Assert zero non-200 responses");
    const non200 = statuses.filter((s) => s !== 200);
    expect(non200, `non-200 responses: ${non200}`).toHaveLength(0);

    logger.step(3, "Assert p95 latency within budget");
    const p95 = PerformanceHelper.percentile(durations, 95);
    logger.info(`API p95 latency over ${REQUESTS} requests: ${p95}ms`);
    expect(p95).toBeLessThan(API_P95_BUDGET_MS);
  });
});
