import { defineConfig } from "@playwright/test";

/**
 * Dedicated configuration for pure-logic unit tests.
 *
 * Unit tests exercise framework utilities (no browser, no application) so this
 * config deliberately omits the `webServer` and any browser project. That keeps
 * them fast and hermetic, and the main `playwright.config.ts` excludes
 * `tests/unit/**` (via `testIgnore`) so they never run across browser projects
 * or boot the mock app. Run with `npm run test:unit`.
 *
 * @author Yousuf Waqar
 */

export default defineConfig({
  testDir: "./tests/unit",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: [["list"]],
  projects: [{ name: "unit" }],
});
