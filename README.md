<div align="center">

# Playwright Automation Framework

### Enterprise-grade Playwright + TypeScript test automation framework for UI, API, and CI/CD validation

[![Playwright Tests](https://github.com/yousufwaqar/playwright-automation-framework/actions/workflows/playwright-ci.yml/Badge.svg)](https://github.com/yousufwaqar/playwright-automation-framework/actions/workflows/playwright-ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-Latest-45ba4b?logo=playwright&logoColor=white)](https://playwright.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Tests](https://img.shields.io/badge/UI%20%2B%20API-Covered-success)](#test-coverage)

<p>
  <a href="#why-this-framework">Why this framework?</a> |
  <a href="#quick-start">Quick start</a> |
  <a href="#test-coverage">Test coverage</a> |
  <a href="#project-architecture">Architecture</a> |
  <a href="#cicd">CI/CD</a> |
  <a href="#roadmap">Roadmap</a>
</p>

Built by <strong><a href="https://github.com/yousufwaqar">Yousuf Waqar</a></strong><br/>
SDET & QA Automation Lead | 11+ years of experience

</div>

---

## Why this framework?

This repository is a production-style Playwright automation framework built to demonstrate the patterns used in scalable enterprise test automation: clean page objects, reusable fixtures, environment-driven configuration, UI + API coverage, CI-ready execution, and rich debugging artifacts.

It is designed to be easy to clone, easy to understand, and easy to extend for real-world web applications.

| What it solves             | How it helps                                                                             |
| ---                        | ---                                                                                      |
| Maintainable UI automation | Page Object Model keeps selectors and page actions isolated from tests                   |
| Fast feedback              | Parallel execution across Chromium, Firefox, and WebKit                                  |
| Reliable CI runs           | A lightweight mock app allows GitHub Actions to run without external system dependencies |
| API confidence             | Contract tests validate health, auth behavior, schema, and response time                 |
| Environment flexibility    | Centralized JSON config supports CI, dev, staging, and production targets                |
| Debuggability              | HTML reports, screenshots, traces, videos, and structured logs                           |

---

## Highlights

- **Playwright + TypeScript** foundation for modern E2E automation
- **Page Object Model** for clean separation between test intent and UI implementation
- **Custom fixtures** for shared page objects and logging
- **Data-driven test data** through JSON files
- **Cross-browser execution** for Chromium, Firefox, and WebKit
- **API contract validation** alongside UI coverage
- **Mock application included** for repeatable CI demonstration
- **GitHub Actions workflow** with matrix execution and artifact upload
- **HTML, JSON, screenshot, trace, and video reporting**
- **Tag-based execution** with `@smoke`, `@regression`, and `@api`

---

## Tech stack

| Tool                                          | Purpose                                        |
| ---                                           | ---                                            |
| [Playwright](https://playwright.dev/)         | Browser automation and API testing             |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe test development                     |
| [Node.js](https://nodejs.org/)                | Runtime environment                            |
| GitHub Actions                                | CI pipeline and cross-browser matrix execution |
| Playwright HTML Reporter                      | Interactive report for debugging test runs     |
| JSON test data                                | Environment and user data management           |

---

## Quick start

### Prerequisites

```bash
node --version
npm --version
```

Required:

- Node.js 18 or higher
- npm 8 or higher

### Install

```bash
git clone https://github.com/yousufwaqar/playwright-automation-framework.git
cd playwright-automation-framework
npm install
npx playwright install
```

### Run the full test suite

```bash
npm run test
```

### Run against a specific browser

```bash
npm run test:chrome
npm run test:firefox
npm run test:webkit
```

### Run focused suites

```bash
npm run test:smoke
npm run test:regression
npm run test:api
```

### Run in headed mode

```bash
npm run test:headed
```

### Open the HTML report

```bash
npm run report
```

---

## Run with the included mock app

The repository includes a small local mock application under `mock-app/`. This makes the framework demo-friendly because CI does not need credentials for a real external application.

Start the mock app:

```bash
node mock-app/server.js
```

In a second terminal, run the tests against the local app:

```bash
BASE_URL=http://localhost:3000 TEST_ENV=ci API_TOKEN=mock-jwt-token-12345 npm run test
```

On Windows PowerShell:

```powershell
$env:BASE_URL="http://localhost:3000"; $env:TEST_ENV="ci"; $env:API_TOKEN="mock-jwt-token-12345"; npm run test
```

Mock app routes:

| Route             | Purpose                                     |
| ---               | ---                                         |
| `/login`          | Login page used by UI tests                 |
| `/dashboard`      | Dashboard page used by UI tests             |
| `/api/v1/health`  | Health endpoint used by API smoke tests     |
| `/api/v1/reports` | Reports endpoint used by API contract tests |
| `/api/login`      | Login endpoint used by the mock UI          |

---

## Test coverage

| Area          | Coverage                                                                        |
| ---           | ---                                                                             |
| Login UI      | Valid login, invalid login, empty field validation, page-load verification      |
| Dashboard UI  | Dashboard load, welcome message, report search, report tile interaction, logout |
| API contracts | Health check, unauthorized access, schema validation, response-time threshold   |
| Cross-browser | Chromium, Firefox, WebKit                                                       |
| Tags          | `@smoke`, `@regression`, `@api`                                                 |

---

## Project architecture

```text
playwright-automation-framework/
├── .github/
│   └── workflows/
│       └── playwright-ci.yml          # GitHub Actions pipeline
├── mock-app/
│   ├── server.js                      # Local mock server for CI/demo runs
│   └── pages/
│       ├── login.html                 # Mock login page
│       └── dashboard.html             # Mock dashboard page
├── src/
│   ├── fixtures/
│   │   └── base.fixture.ts            # Custom Playwright fixtures
│   ├── pages/
│   │   ├── BasePage.ts                # Shared page actions and assertions
│   │   ├── LoginPage.ts               # Login page object
│   │   └── DashboardPage.ts           # Dashboard page object
│   └── utils/
│       ├── ConfigManager.ts           # Environment config loader
│       ├── Logger.ts                  # Structured logging utility
│       └── TestDataManager.ts         # Test data accessor
├── tests/
│   ├── api/
│   │   └── api-contract.spec.ts       # API contract tests
│   ├── test-data/
│   │   ├── environments.json          # CI/dev/staging/prod config
│   │   └── users.json                 # Test users
│   ├── dashboard.spec.ts              # Dashboard UI tests
│   └── login.spec.ts                  # Login UI tests
├── playwright.config.ts               # Playwright configuration
├── package.json                       # Scripts and dependencies
├── tsconfig.json                      # TypeScript configuration
└── README.md
```

---

## Design patterns

### Page Object Model

Page classes own page-specific locators, interactions, and assertions. Tests call clear business-level actions instead of repeating selector logic.

```typescript
await loginPage.goto();
await loginPage.login(user.username, user.password);
await loginPage.assertLoginSuccess();
```

### Custom fixtures

The framework extends Playwright fixtures to provide ready-to-use page objects and logging in every test.

```typescript
test("should login successfully", async ({ loginPage, logger }) => {
  logger.step(1, "Navigate and login");
  await loginPage.goto();
});
```

### Configuration management

`ConfigManager` loads environment-specific settings from:

```text
tests/test-data/environments.json
```

This supports clean switching between `ci`, `dev`, `staging`, and `production` through:

```bash
TEST_ENV=ci
```

---

## Reporting and debugging

The framework is configured to generate:

| Artifact     | Purpose                      |
| ---          | ---                          |
| HTML report  | Interactive test report      |
| JSON results | Machine-readable test output |
| Screenshots  | Captured on failure          |
| Traces       | Captured on first retry      |
| Videos       | Captured on first retry      |
| Logs         | Step-level execution details |

Open the report after a run:

```bash
npm run report
```

---

## CI/CD

GitHub Actions runs the suite automatically on:

- Push to `main` or `develop`
- Pull requests targeting `main`
- Daily scheduled regression run

The workflow uses a browser matrix:

```yaml
matrix:
  project: [chromium, firefox, webkit]
```

CI also starts the mock app before running tests:

```yaml
- name: Start mock application
  run: |
    node mock-app/server.js &
    sleep 2
    curl -f http://localhost:3000/api/v1/health || exit 1
```

This keeps the public demo pipeline deterministic and independent of private environments.

---

## Available scripts

| Command                   | Description                    |
| ---                       | ---                            |
| `npm run test`            | Run all Playwright tests       |
| `npm run test:headed`     | Run tests with visible browser |
| `npm run test:chrome`     | Run Chromium project           |
| `npm run test:firefox`    | Run Firefox project            |
| `npm run test:webkit`     | Run WebKit project             |
| `npm run test:api`        | Run API contract tests         |
| `npm run test:smoke`      | Run smoke tests                |
| `npm run test:regression` | Run regression tests           |
| `npm run report`          | Open Playwright HTML report    |

---

## Roadmap

- Add Allure reporting integration
- Publish Playwright HTML reports to GitHub Pages
- Add Docker support for consistent local execution
- Add visual regression testing
- Add accessibility testing with axe-core
- Add reusable GitHub Actions workflow templates
- Add example pull request quality gates
- Add contribution guidelines

---

## Recommended repository topics

Add these topics in GitHub so the project is easier to discover:

```text
playwright
typescript
test-automation
e2e-testing
api-testing
page-object-model
github-actions
qa-automation
ci-cd
sdet
```

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push your branch
5. Open a pull request

Recommended branch naming:

```bash
git checkout -b feat/add-new-test-suite
```

Recommended commit style:

```bash
git commit -m "feat: add dashboard filter tests"
```

---

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

---

<div align="center">

### If this framework helps you, consider giving it a star.

Built with Playwright, TypeScript, and a quality-first automation mindset.

</div>
