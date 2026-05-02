<div align="center">

# 🎭 Playwright Automation Framework

### Enterprise-grade end-to-end test automation built for scale

[![Playwright Tests](https://github.com/yousufwaqar/playwright-automation-framework/actions/workflows/playwright-ci.yml/badge.svg)](https://github.com/yousufwaqar/playwright-automation-framework/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-Latest-45ba4b?logo=playwright&logoColor=white)](https://playwright.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

<p>
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-framework-highlights">Highlights</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-design-patterns">Patterns</a> •
  <a href="#-cicd-integration">CI/CD</a> •
  <a href="#-reporting">Reporting</a>
</p>

---

Built by **[Yousuf Waqar](https://github.com/yousufwaqar)**
*SDET & QA Automation Lead · 11+ years of experience*

</div>

---

## 🌟 Framework Highlights

| Feature | Details |
|---|---|
| 🏗️ **Page Object Model** | Encapsulated, reusable page interactions |
| 📊 **Data-Driven Testing** | JSON-based test data — no hardcoded values |
| ⚡ **Parallel Execution** | Configurable worker threads for fast feedback |
| 🌐 **Cross-Browser** | Chromium · Firefox · WebKit out of the box |
| 🔌 **API Testing** | Contract validation alongside UI tests |
| 🔄 **CI/CD Ready** | GitHub Actions + Azure Pipelines templates |
| 📈 **Rich Reporting** | HTML reports with screenshots, video & traces |
| 🔧 **Env-Agnostic Config** | Seamless dev / staging / production switching |
| 📝 **Custom Logging** | Structured logs for debugging & traceability |
| 🔁 **Retry Logic** | Built-in flaky test resilience |

---

## 🛠️ Tech Stack

<div align="center">

| Technology | Version | Purpose |
|---|---|---|
| [Playwright](https://playwright.dev/) | Latest | E2E testing engine |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type-safe scripting |
| [Node.js](https://nodejs.org/) | 18+ | Runtime environment |
| [GitHub Actions](https://github.com/features/actions) | — | Cloud CI/CD pipeline |
| [Azure DevOps](https://azure.microsoft.com/en-us/products/devops/) | — | Enterprise CI/CD |
| HTML Reporter | Built-in | Test result visualization |

</div>

---

## 🚀 Quick Start

### Prerequisites

```bash
node --version   # v18.0.0 or higher required
npm --version    # 8.0.0 or higher recommended
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yousufwaqar/playwright-automation-framework.git
cd playwright-automation-framework

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install

# 4. Copy environment config and set your values
cp test-data/environments.example.json test-data/environments.json
```

### Running Tests

```bash
# Run the full test suite
npm run test

# Run in headed mode (watch the browser)
npm run test:headed

# Run a specific test file
npm run test -- tests/login.spec.ts

# Run tests by tag
npm run test -- --grep @smoke

# Run against a specific browser
npm run test:chrome
npm run test:firefox
npm run test:webkit

# Run API contract tests only
npm run test:api

# Open the interactive HTML report
npm run report
```

> **Tip:** Prefix any command with `DEBUG=pw:api` to enable verbose Playwright logging.

---

## 📁 Project Structure

```
playwright-automation-framework/
│
├── 📄 playwright.config.ts          # Central Playwright configuration
├── 📄 tsconfig.json                 # TypeScript compiler options
├── 📄 package.json                  # Scripts & dependencies
│
├── 📂 .github/
│   └── 📂 workflows/
│       └── playwright-ci.yml        # GitHub Actions pipeline
│
├── 📂 src/
│   ├── 📂 pages/                    # Page Object Models (POM)
│   │   ├── BasePage.ts              # Shared methods & element helpers
│   │   ├── LoginPage.ts             # Login page interactions
│   │   └── DashboardPage.ts         # Dashboard page interactions
│   │
│   ├── 📂 utils/                    # Reusable utilities
│   │   ├── ConfigManager.ts         # Environment & config loader
│   │   ├── Logger.ts                # Structured logging utility
│   │   └── TestDataManager.ts       # JSON test data accessor
│   │
│   └── 📂 fixtures/                 # Custom Playwright fixtures
│       └── base.fixture.ts          # Extended test context setup
│
├── 📂 tests/                        # Test specifications
│   ├── login.spec.ts                # Authentication test suite
│   ├── dashboard.spec.ts            # Dashboard feature tests
│   └── 📂 api/
│       └── api-contract.spec.ts     # API contract validation
│
├── 📂 test-data/                    # Externalized test data
│   ├── users.json                   # User credentials & roles
│   └── environments.json           # Per-environment URLs & settings
│
└── 📂 reports/                      # Auto-generated test artifacts
    ├── html/                        # Interactive HTML report
    ├── screenshots/                 # Captured on failure
    └── traces/                      # Playwright trace files
```

---

## 🎨 Design Patterns

### Page Object Model (POM)

Every application page has a dedicated class that owns its locators, actions, and assertions. Tests remain clean and readable — changes to the UI only require updates in one place.

```typescript
// src/pages/LoginPage.ts

import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // --- Locators ---
  private readonly usernameInput = this.page.getByLabel('Username');
  private readonly passwordInput = this.page.getByLabel('Password');
  private readonly loginButton   = this.page.getByRole('button', { name: 'Sign in' });
  private readonly errorBanner   = this.page.getByRole('alert');

  // --- Actions ---
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  // --- Assertions ---
  async expectErrorMessage(message: string): Promise<void> {
    await expect(this.errorBanner).toContainText(message);
  }
}
```

### Data-Driven Testing

Test data lives in version-controlled JSON files. The same spec can cover dozens of scenarios without touching test logic.

```typescript
// tests/login.spec.ts

import users from '../test-data/users.json';

for (const { role, username, password, expectedLanding } of users.validUsers) {
  test(`${role} can log in successfully`, async ({ loginPage, dashboardPage }) => {
    await loginPage.login(username, password);
    await dashboardPage.expectPageTitle(expectedLanding);
  });
}
```

### Custom Fixtures

Base fixtures pre-wire page objects and shared state so every test starts from a clean, consistent context.

```typescript
// src/fixtures/base.fixture.ts

import { test as base } from '@playwright/test';
import { LoginPage }     from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

export const test = base.extend<{
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
}>({
  loginPage:     async ({ page }, use) => { await use(new LoginPage(page)); },
  dashboardPage: async ({ page }, use) => { await use(new DashboardPage(page)); },
});
```

---

## 🔄 CI/CD Integration

### GitHub Actions

Tests run automatically on every **push** and **pull request**. Artifacts (reports, screenshots, traces) are uploaded for post-run inspection.

```yaml
# .github/workflows/playwright-ci.yml  (simplified view)
name: Playwright Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '18' }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: reports/
```

### Azure DevOps

Enterprise YAML pipeline templates are included under `.azure/` with:
- Multi-stage pipelines (build → test → report)
- Quality gates based on pass-rate thresholds
- Test result publishing to Azure Test Plans

---

## 📊 Reporting

Generate and open the full interactive HTML report after any test run:

```bash
npm run report
```

Each report includes:

| Artifact | Description |
|---|---|
| 📋 **Summary** | Pass / fail / skip counts with duration |
| 📸 **Screenshots** | Auto-captured on test failure |
| 🎥 **Video** | Full test recording (configurable) |
| 🔍 **Trace Viewer** | Step-by-step DOM & network snapshot |
| ⏱️ **Timings** | Per-test and per-step execution times |

---

## ⚙️ Configuration

All framework settings live in a single file:

```typescript
// playwright.config.ts

import { defineConfig, devices } from '@playwright/test';
import { ConfigManager }         from './src/utils/ConfigManager';

const env = ConfigManager.getEnvironment();

export default defineConfig({
  testDir:   './tests',
  timeout:    30_000,
  retries:    process.env.CI ? 2 : 0,
  workers:    process.env.CI ? 4 : undefined,
  reporter:  [['html', { outputFolder: 'reports/html' }], ['list']],

  use: {
    baseURL:           env.baseUrl,
    screenshot:        'only-on-failure',
    video:             'retain-on-failure',
    trace:             'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome']  } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari']  } },
  ],
});
```

---

## 🤝 Contributing

Contributions are welcome and appreciated!

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

Please follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

Made with ❤️ by **[Yousuf Waqar](https://github.com/yousufwaqar)**

*If this framework helped you, consider giving it a ⭐ on GitHub!*

</div>
