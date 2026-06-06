import { test, expect } from "@playwright/test";
import { ConfigManager } from "../../src/utils/ConfigManager";

/**
 * Unit tests for ConfigManager. Assertions are environment-agnostic so they hold
 * for any valid TEST_ENV (e.g. local or ci).
 *
 * @author Yousuf Waqar
 */

test.describe("ConfigManager @unit", () => {
  const config = ConfigManager.getInstance();

  test("is a singleton", () => {
    expect(ConfigManager.getInstance()).toBe(config);
  });

  test("exposes usable HTTP base URLs", () => {
    expect(config.getBaseUrl()).toMatch(/^https?:\/\//);
    expect(config.getApiBaseUrl()).toMatch(/^https?:\/\//);
  });

  test("exposes positive timeouts and non-negative retries", () => {
    expect(config.getTimeout()).toBeGreaterThan(0);
    expect(config.getActionTimeout()).toBeGreaterThan(0);
    expect(config.getNavigationTimeout()).toBeGreaterThan(0);
    expect(config.getExpectTimeout()).toBeGreaterThan(0);
    expect(config.getRetries()).toBeGreaterThanOrEqual(0);
  });

  test("reports a non-empty active environment name", () => {
    expect(config.getEnvironmentName().length).toBeGreaterThan(0);
  });
});
