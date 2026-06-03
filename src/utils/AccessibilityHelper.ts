import type { Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * AccessibilityHelper
 *
 * Thin wrapper around @axe-core/playwright (open source, MPL-2.0) that runs
 * WCAG 2.0/2.1 A & AA audits against a page and returns a structured result.
 *
 * Scoped to WCAG success-criteria tags only (not "best-practice") so failures
 * map to real, defensible accessibility violations rather than stylistic noise.
 *
 * @author Yousuf Waqar
 */

export type A11yViolation = {
  id: string;
  impact: string | null | undefined;
  help: string;
  helpUrl: string;
  nodes: number;
  targets: string[];
};

export type A11yResult = {
  url: string;
  violations: A11yViolation[];
};

const DEFAULT_WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

export class AccessibilityHelper {
  /**
   * Run an axe-core audit against the current page state.
   *
   * @param page    Playwright page (already navigated to target state)
   * @param options tags: override WCAG tag set; include: CSS selector to scope the scan
   */
  static async audit(
    page: Page,
    options: { tags?: string[]; include?: string } = {}
  ): Promise<A11yResult> {
    let builder = new AxeBuilder({ page }).withTags(
      options.tags ?? DEFAULT_WCAG_TAGS
    );

    if (options.include) {
      builder = builder.include(options.include);
    }

    const results = await builder.analyze();

    return {
      url: page.url(),
      violations: results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        helpUrl: v.helpUrl,
        nodes: v.nodes.length,
        targets: v.nodes.flatMap((n) => n.target.map((t) => String(t))),
      })),
    };
  }

  /**
   * Build a readable, multi-line summary of violations for test failure output.
   */
  static formatViolations(result: A11yResult): string {
    if (result.violations.length === 0) {
      return `No accessibility violations on ${result.url}`;
    }

    const lines = [
      `Found ${result.violations.length} accessibility violation(s) on ${result.url}:`,
    ];
    for (const v of result.violations) {
      lines.push(
        `  • [${v.impact ?? "n/a"}] ${v.id} — ${v.help} (${v.nodes} node(s))`
      );
      for (const target of v.targets) {
        lines.push(`      ↳ ${target}`);
      }
      lines.push(`      ${v.helpUrl}`);
    }
    return lines.join("\n");
  }
}
