import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import { ConfigManager } from "./src/utils/ConfigManager";

dotenv.config();

const config = ConfigManager.getInstance();

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  timeout: config.getTimeout(),

  expect: {
    timeout: config.getExpectTimeout(),
  },

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 4 : 2,

  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
    ["json", { outputFile: "test-results/results.json" }],
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
        channel: "chrome",
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
    {
      name: "mobile-chrome",
      use: {
        ...devices["Pixel 7"],
      },
    },
    {
      name: "mobile-safari",
      use: {
        ...devices["iPhone 14"],
      },
    },
  ],
});
