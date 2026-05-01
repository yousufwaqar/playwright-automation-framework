# Playwright Automation Framework

Enterprise-grade end-to-end test automation framework built with **Playwright** and **TypeScript**, following industry best practices for scalability, maintainability, and CI/CD integration.

Built by [Yousuf Waqar](https://github.com/yousufwaqar) — SDET & QA Automation Lead with 11+ years of experience.

---

## Framework Highlights

- **Page Object Model (POM)** design pattern for maximum reusability
- **Data-driven testing** with JSON-based test data management
- **Parallel execution** with configurable worker threads
- **Cross-browser support** (Chromium, Firefox, WebKit)
- **API testing** with contract validation
- **CI/CD ready** with GitHub Actions and Azure Pipelines examples
- **Comprehensive reporting** with Playwright HTML Reporter
- **Environment-agnostic** configuration management
- **Custom logging** for debugging and traceability
- **Retry logic** for handling flaky tests

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Playwright | End-to-end testing framework |
| TypeScript | Type-safe test scripting |
| Node.js | Runtime environment |
| GitHub Actions | CI/CD pipeline |
| Azure DevOps | Enterprise CI/CD (YAML templates) |
| HTML Reporter | Test result visualization |

---

## Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/playwright-automation-framework.git

# Navigate to the project
cd playwright-automation-framework

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
# Run all tests
npm run test

# Run tests in headed mode (see browser)
npm run test:headed

# Run specific test file
npm run test -- tests/login.spec.ts

# Run tests in specific browser
npm run test:chrome
npm run test:firefox

# Run API tests only
npm run test:api

# Generate HTML report
npm run report

playwright-automation-framework/
├── README.md                          # Project documentation
├── package.json                       # Dependencies and scripts
├── tsconfig.json                      # TypeScript configuration
├── playwright.config.ts               # Playwright configuration
├── .github/workflows/                 # CI/CD pipeline definitions
│   └── playwright-ci.yml             # GitHub Actions workflow
├── src/
│   ├── pages/                         # Page Object Models
│   │   ├── BasePage.ts               # Base page with common methods
│   │   ├── LoginPage.ts             # Login page object
│   │   └── DashboardPage.ts         # Dashboard page object
│   ├── utils/                         # Utility classes
│   │   ├── ConfigManager.ts          # Environment configuration
│   │   ├── Logger.ts                 # Custom logging utility
│   │   └── TestDataManager.ts        # Test data management
│   └── fixtures/                      # Custom test fixtures
│       └── base.fixture.ts           # Extended test fixtures
├── tests/                             # Test specifications
│   ├── login.spec.ts                 # Login feature tests
│   ├── dashboard.spec.ts            # Dashboard feature tests
│   └── api/                          # API test specifications
│       └── api-contract.spec.ts      # API contract validation
├── test-data/                         # Test data files
│   ├── users.json                    # User credentials
│   └── environments.json            # Environment configs
└── reports/                           # Generated test reports

Design Patterns
Page Object Model (POM)
Every page in the application has a corresponding Page Object class that encapsulates:

Element locators
Page-specific actions
Assertions and validations
TypeScript

// Example: LoginPage.ts
export class LoginPage extends BasePage {
    async login(username: string, password: string): Promise<void> {
        await this.fill(this.usernameInput, username);
        await this.fill(this.passwordInput, password);
        await this.click(this.loginButton);
    }
}
Data-Driven Testing
Test data is externalized into JSON files, allowing the same test to run with multiple data sets without code changes.

Environment Configuration
Environment-specific settings (URLs, credentials, timeouts) are managed through a centralized ConfigManager, enabling seamless switching between dev, staging, and production.

CI/CD Integration
GitHub Actions
Tests run automatically on every push and pull request. See .github/workflows/playwright-ci.yml.

Azure DevOps (YAML)
The framework includes Azure Pipelines YAML templates for enterprise CI/CD integration with quality gates.

Reporting
After test execution, generate an interactive HTML report:

Bash

npm run report
Reports include:

Test pass/fail summary
Execution time per test
Screenshots on failure
Video recordings (configurable)
Trace viewer for debugging
Configuration
All framework settings are centralized in playwright.config.ts:
