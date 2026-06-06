import { test, expect } from "@playwright/test";
import { PerformanceHelper } from "../../src/utils/PerformanceHelper";

/**
 * Unit tests for PerformanceHelper.percentile (pure, deterministic logic).
 *
 * @author Yousuf Waqar
 */

test.describe("PerformanceHelper.percentile @unit", () => {
  test("returns 0 for an empty sample", () => {
    expect(PerformanceHelper.percentile([], 95)).toBe(0);
  });

  test("returns the only value for a single-element sample", () => {
    expect(PerformanceHelper.percentile([42], 0)).toBe(42);
    expect(PerformanceHelper.percentile([42], 50)).toBe(42);
    expect(PerformanceHelper.percentile([42], 100)).toBe(42);
  });

  test("computes nearest-rank percentiles independent of input order", () => {
    const values = [5, 1, 4, 2, 3];
    expect(PerformanceHelper.percentile(values, 0)).toBe(1);
    expect(PerformanceHelper.percentile(values, 50)).toBe(3);
    expect(PerformanceHelper.percentile(values, 100)).toBe(5);
  });

  test("does not mutate the caller's array", () => {
    const values = [3, 1, 2];
    PerformanceHelper.percentile(values, 50);
    expect(values).toEqual([3, 1, 2]);
  });
});
