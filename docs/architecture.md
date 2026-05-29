# Framework Architecture

This Playwright automation framework is designed with scalability, maintainability, and extensibility in mind. It follows established best practices and design patterns to ensure a robust and efficient testing solution.

## Core Principles

- **Page Object Model (POM)**: Separates UI elements and interactions from test logic, making tests more readable and maintainable.
- **Data-Driven Testing**: Enables tests to be executed with various sets of data, improving test coverage and reducing redundancy.
- **Environment Agnostic Configuration**: Allows easy switching between different testing environments (e.g., development, staging, production) without code changes.
- **Modular Design**: Organizes the framework into distinct, reusable components for better organization and easier updates.
- **Comprehensive Reporting**: Provides detailed insights into test execution, aiding in quick debugging and analysis.

## Directory Structure

```text
playwright-automation-framework/
├── .github/                         # GitHub Actions workflows and issue templates
├── mock-app/                        # Self-contained mock application for local/CI testing
├── src/                             # Source code for the test framework
│   ├── fixtures/                    # Custom Playwright fixtures for test setup
│   ├── pages/                       # Page Object Model implementations
│   ├── utils/                       # Utility functions (ConfigManager, Logger, TestDataManager, DataFactory, API Schemas)
│   └── global.d.ts                  # Global TypeScript type declarations
├── tests/                           # Test specifications
│   ├── api/                         # API contract tests
│   ├── external/                    # Tests against external demo sites
│   ├── test-data/                   # Static test data (environments, users)
│   ├── visual-regression.spec.ts    # Visual regression tests
│   └── ...                          # UI tests (login, dashboard)
├── docs/                            # Comprehensive documentation (this section)
├── playwright.config.ts             # Playwright configuration file
├── package.json                     # Project dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── .eslintrc.json                   # ESLint configuration for code quality
├── .prettierrc                      # Prettier configuration for code formatting
├── .husky/                          # Git hooks for pre-commit checks
└── README.md                        # Project overview and quick start guide
```

## Key Components

### Page Object Model (POM)

Located in `src/pages/`, each page object represents a unique web page or a significant section of a page. They encapsulate:

- **Locators**: Identifiers for UI elements (e.g., `emailInput`, `loginButton`). Modern Playwright locators like `getByTestId`, `getByRole`, and `getByText` are preferred for their resilience.
- **Page Actions**: Methods that perform interactions on the page (e.g., `login(username, password)`, `navigateTo(url)`).
- **Assertions**: Methods that verify the state of the page or its elements (e.g., `assertLoginSuccess()`, `isPageLoaded()`).

**Example (`src/pages/LoginPage.ts`):**

```typescript
import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByTestId("email-input");
    this.passwordInput = page.getByTestId("password-input");
    this.loginButton = page.getByTestId("login-button");
  }

  async login(email: string, password: string): Promise<void> {
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
    await this.waitForPageLoad();
  }
}
```

### Custom Fixtures

Defined in `src/fixtures/`, custom fixtures extend Playwright's `test` object to provide pre-configured page objects and utilities to every test. This reduces boilerplate and promotes reusability.

**Example (`src/fixtures/base.fixture.ts`):**

```typescript
import { test as baseTest } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { Logger } from "../utils/Logger";

type MyFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  logger: Logger;
};

export const test = baseTest.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  logger: async ({}, use) => {
    await use(new Logger("Test Logger"));
  },
});
```

### Utility Functions (`src/utils/`)

- **`ConfigManager.ts`**: Handles loading environment-specific configurations from `tests/test-data/environments.json`.
- **`Logger.ts`**: Provides structured logging for test steps and information, improving debuggability.
- **`TestDataManager.ts`**: Manages access to static test data from JSON files.
- **`DataFactory.ts`**: Utilizes `faker.js` to generate dynamic and realistic test data on the fly, preventing data staleness.
- **`api-schemas.ts`**: Defines API response schemas using `Zod` for robust contract validation.

### Test Data Management

Test data is managed in two ways:

1.  **Static Data (`tests/test-data/`)**: JSON files for environment configurations (`environments.json`), user credentials (`users.json`), and external site details (`external-sites.json`).
2.  **Dynamic Data (`src/utils/DataFactory.ts`)**: Generated at runtime using `faker.js` for scenarios requiring unique or varied data, such as user registration or report creation.

### API Testing

Located in `tests/api/`, API tests validate the backend services. They leverage Playwright's `request` context and `Zod` for schema validation.

**Example (`tests/api/api-contract.spec.ts`):**

```typescript
import { test, expect } from "@playwright/test";
import { HealthCheckSchema } from "../../src/utils/api-schemas";

test("should return 200 for health check endpoint", async ({ request }) => {
  const response = await request.get(`/api/v1/health`);
  expect(response.status()).toBe(200);
  const body = await response.json();
  const result = HealthCheckSchema.safeParse(body);
  expect(result.success).toBe(true);
  expect(body.status).toBe("healthy");
});
```

### Visual Regression Testing

Implemented using Playwright's built-in `toHaveScreenshot()` functionality. This helps catch unintended UI changes by comparing current screenshots against baseline images.

**Example (`tests/visual-regression.spec.ts`):**

```typescript
import { test, expect } from "../src/fixtures/base.fixture";

test("should match login page snapshot", async ({ loginPage }) => {
  await loginPage.goto();
  await expect(loginPage.page).toHaveScreenshot("login-page.png", {
    fullPage: true,
    mask: [loginPage.page.getByTestId("loading-spinner")],
  });
});
```

This architectural overview provides a foundational understanding of the framework's design and how its various components contribute to a robust and maintainable test automation solution.
