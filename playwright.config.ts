import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import { ConfigManager } from "./src/utils/ConfigManager";

dotenv.config();

const config = ConfigManager.getInstance();

export default defineConfig({
  webServer: {
    command: 'node mock-app/server.js',
    url: 'http://localhost:3000',
    timeout: 120 * 1000,
    // Locally, reuse a mock server you already have running; on CI always start
    // a fresh one so runs are hermetic.
    reuseExistingServer: !process.env.CI,
  },
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  timeout: config.getTimeout(),

  expect: {
    timeout: config.getExpectTimeout(),
    toHaveScreenshot: {
      // Small tolerance to absorb sub-pixel antialiasing differences. Baselines
      // are platform-suffixed by Playwright (…-win32.png / …-linux.png) so local
      // (Windows) and CI (Linux) baselines coexist without clashing.
      maxDiffPixelRatio: 0.02,
      animations: "disabled",
    },
  },

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: config.getRetries(),
  workers: process.env.CI ? 4 : 2,

  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
    ["json", { outputFile: "test-results/results.json" }],
    ["allure-playwright", { resultsDir: "allure-results" }],
  ],

  use: {
    baseURL: process.env.BASE_URL || config.getBaseUrl(),
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
    viewport: { width: 1920, height: 1080 },
    actionTimeout: config.getActionTimeout(),
    navigationTimeout: config.getNavigationTimeout(),
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],

      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
      },
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
      },
    },
    // Mobile viewport projects are configured and opt-in. Uncomment to enable
    // them locally or in the optional cross-browser job.
    // {
    //   name: "mobile-chrome",
    //   use: {
    //     ...devices["Pixel 7"],
    //   },
    // },
    // {
    //   name: "mobile-safari",
    //   use: {
    //     ...devices["iPhone 14"],
    //   },
    // },
  ],
});