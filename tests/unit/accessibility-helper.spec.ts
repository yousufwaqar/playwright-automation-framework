import { test, expect } from "@playwright/test";
import {
  AccessibilityHelper,
  type A11yResult,
} from "../../src/utils/AccessibilityHelper";

/**
 * Unit tests for AccessibilityHelper.formatViolations (pure string formatting).
 * The audit() method drives a live browser through axe-core and is exercised by
 * the @a11y suite; only the deterministic formatter is unit-tested here.
 *
 * @author Yousuf Waqar
 */

test.describe("AccessibilityHelper.formatViolations @unit", () => {
  test("reports a clean page when there are no violations", () => {
    const result: A11yResult = {
      url: "https://example.test/dashboard",
      violations: [],
    };
    expect(AccessibilityHelper.formatViolations(result)).toBe(
      "No accessibility violations on https://example.test/dashboard"
    );
  });

  test("summarizes violations with impact, id, help, nodes, targets and helpUrl", () => {
    const result: A11yResult = {
      url: "https://example.test/login",
      violations: [
        {
          id: "color-contrast",
          impact: "serious",
          help: "Elements must meet minimum contrast",
          helpUrl: "https://dequeuniversity.com/rules/axe/color-contrast",
          nodes: 2,
          targets: ["#submit", ".hint"],
        },
      ],
    };
    const out = AccessibilityHelper.formatViolations(result);
    expect(out).toContain(
      "Found 1 accessibility violation(s) on https://example.test/login:"
    );
    expect(out).toContain(
      "[serious] color-contrast — Elements must meet minimum contrast (2 node(s))"
    );
    expect(out).toContain("↳ #submit");
    expect(out).toContain("↳ .hint");
    expect(out).toContain(
      "https://dequeuniversity.com/rules/axe/color-contrast"
    );
  });

  test("falls back to n/a when a violation has no impact", () => {
    const result: A11yResult = {
      url: "u",
      violations: [
        { id: "x", impact: null, help: "h", helpUrl: "url", nodes: 0, targets: [] },
      ],
    };
    expect(AccessibilityHelper.formatViolations(result)).toContain(
      "[n/a] x — h (0 node(s))"
    );
  });
});
