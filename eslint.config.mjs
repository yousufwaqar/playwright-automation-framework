import js from "@eslint/js";
import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";

export default tseslint.config(
  {
    ignores: [
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      "allure-results/**",
      "allure-report/**",
      "mock-app/public/**",
    ],
  },
  {
    files: ["**/*.ts"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
  },
  {
    files: ["**/*.d.ts"],
    rules: {
      // Declaration-merging into Playwright's TestArgs needs an empty interface.
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
  {
    files: ["src/fixtures/**/*.ts"],
    rules: {
      // Playwright fixtures use an empty destructure `{}` to declare that they
      // depend on no other fixtures; that is the intended pattern.
      "no-empty-pattern": "off",
    },
  },
  {
    files: ["tests/**/*.ts"],
    extends: [playwright.configs["flat/recommended"]],
    rules: {
      // The framework intentionally uses testInfo.skip() inside an
      // authentication fixture, so do not flag conditional skips.
      "playwright/no-skipped-test": "off",
      "playwright/no-conditional-in-test": "off",
    },
  },
  {
    files: ["mock-app/server.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        require: "readonly",
        module: "writable",
        process: "readonly",
        __dirname: "readonly",
        console: "readonly",
        Buffer: "readonly",
        setTimeout: "readonly",
        URL: "readonly",
      },
    },
    extends: [js.configs.recommended],
  }
);
