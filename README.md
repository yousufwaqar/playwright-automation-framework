<div align="center">

# 🚀 Playwright Automation Framework: Enterprise-Grade E2E Testing

### Built for scale, reliability, and developer experience

[![Build Status](https://github.com/yousufwaqar/playwright-automation-framework/actions/workflows/playwright-ci.yml/badge.svg)](https://github.com/yousufwaqar/playwright-automation-framework/actions/workflows/playwright-ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.45+-45ba4b?logo=playwright&logoColor=white)](https://playwright.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/github/license/yousufwaqar/playwright-automation-framework?color=yellow)](./LICENSE)
[![Tests](https://img.shields.io/badge/UI%20%2B%20API%20%2B%20Visual-Covered-success)](#test-coverage)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![Last Commit](https://img.shields.io/github/last-commit/yousufwaqar/playwright-automation-framework?color=blue)](https://github.com/yousufwaqar/playwright-automation-framework/commits/main)

<p>
  <a href="#why-this-framework">Why this framework?</a> |
  <a href="#quick-start">Quick start</a> |
  <a href="#features">Features</a> |
  <a href="#architecture">Architecture</a> |
  <a href="#test-coverage">Test coverage</a> |
  <a href="#cicd">CI/CD</a> |
  <a href="#roadmap">Roadmap</a>
</p>
 Built by <strong><a href="https://github.com/yousufwaqar">Yousuf Waqar</a></strong><br/>
 SDET & QA Automation Lead | 11+ years of experience
 <br/><br/>

👋 <strong>Hiring or evaluating my work?</strong> See <a href="./SKILLS.md"><strong>SKILLS.md</strong></a> — a guided tour of the
engineering skills this repo demonstrates and how to reach me.

 </div>

</div>

---

## Why this framework?

This repository presents a production-ready Playwright automation framework, meticulously engineered to showcase best practices in scalable enterprise test automation. It integrates cutting-edge tools and design patterns to deliver a robust, maintainable, and efficient solution for end-to-end, API, and visual regression testing.

Designed for clarity and ease of use, this framework is ideal for demonstrating advanced test automation concepts. It includes a **bundled mock application** for immediate, zero-dependency execution and **public demo-site test packs** (SauceDemo, The Internet, RESTful Booker) to illustrate real-world application.

| What it solves             | How it helps                                                                    |
| -------------------------- | ------------------------------------------------------------------------------- |
| Maintainable UI automation | Page Object Model keeps selectors and page actions isolated from tests          |
| Fast feedback              | Parallel execution on Chromium in CI, with Firefox and WebKit available locally |
| Reliable CI runs           | A lightweight bundled mock app removes external system dependencies             |
| API confidence             | Contract tests validate health, auth behavior, schema, and response time        |
| Environment flexibility    | Centralized JSON config supports CI, dev, staging, and production targets       |
| Debuggability              | HTML reports, screenshots, traces, videos, and structured logs                  |
| Real-world examples        | Optional external suites against SauceDemo, The Internet, and RESTful Booker    |

---

## ✨ Features

- **Playwright + TypeScript** foundation for modern E2E automation, enforced by **ESLint** and **Prettier** for code quality and consistency.
- **Page Object Model** with shared `BasePage` for clean separation of concerns and enhanced with **modern locator strategies** (`getByTestId`, `getByRole`).
- **Custom fixtures** for shared page objects and structured logging, reducing boilerplate.
- **Data-driven testing** through JSON test data files and **dynamic data generation** using [Faker.js](https://fakerjs.dev/) for realistic and varied test scenarios.
- **API contract validation** alongside UI coverage, with robust **JSON schema validation** using [Zod](https://zod.dev/).
- **Visual Regression Testing** using Playwright's built-in capabilities to catch unintended UI changes.
- **Cross-browser ready** — Chromium runs in CI; Firefox and WebKit are configured and run locally.
- **Mobile viewport projects** (Pixel 7, iPhone 14) ready to enable.
- **Bundled mock application** for fully self-contained CI runs.
- **External demo-site suites** (SauceDemo / The Internet / RESTful Booker) gated behind tags.
- **GitHub Actions workflows** with Chromium runs, artifact upload, and a separate nightly external job.
- **HTML, JSON, screenshot, trace, video, and Allure reporting** for comprehensive test results and advanced analytics.
- **Tag-based execution** with `@smoke`, `@regression`, `@api`, `@external`, `@visual`.
- **Husky** and **lint-staged** for pre-commit hooks, ensuring code quality before commits.

---

## 🛠️ Tech stack

| Tool                                          | Purpose                                            |
| --------------------------------------------- | -------------------------------------------------- |
| [Playwright](https://playwright.dev/)         | Browser automation, API testing, Visual Regression |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe test development                         |
| [Node.js](https://nodejs.org/)                | Runtime environment (18+)                          |
| [tsx](https://github.com/privatenumber/tsx)   | Native TypeScript loader for fixtures              |
| [ESLint](https://eslint.org/)                 | Code linting and quality enforcement               |
| [Prettier](https://prettier.io/)              | Code formatting for consistency                    |
| [Husky](https://typicode.github.io/husky/)    | Git hooks for pre-commit checks                    |
| [Faker.js](https://fakerjs.dev/)              | Dynamic and realistic test data generation         |
| [Zod](https://zod.dev/)                       | TypeScript-first schema declaration and validation |
| [Allure Report](https://allurereport.org/)    | Advanced, interactive test reporting               |
| GitHub Actions                                | CI pipeline (Chromium) and scheduled external runs |
| Playwright HTML Reporter                      | Interactive report for debugging test runs         |
| JSON test data                                | Environment and user data management               |

---

## 🚀 Quick start

### Prerequisites

```bash
node --version
npm --version
```

Required:

- Node.js 18 or higher (see `.nvmrc`)
- npm 8 or higher

### Install

```bash
git clone https://github.com/yousufwaqar/playwright-automation-framework.git
cd playwright-automation-framework
npm install
npx playwright install
```

### Run the full test suite (against bundled mock app)

```bash
npm run test
```

### Generate Allure Report

```bash
npm run allure:generate
npm run allure:open
```

### Run Visual Regression Tests

```bash
npx playwright test tests/visual-regression.spec.ts
```

### Run focused suites

```bash
npm run test:smoke
npm run test:regression
npm run test:api
```

### Run external demo-site suites (optional)

> External tests hit public practice sites (SauceDemo, The Internet, RESTful Booker). They are excluded from the default CI to keep the badge stable.

```bash
npm run test:external          # all external suites
npm run test:saucedemo         # SauceDemo only
npm run test:theinternet       # The Internet only
npm run test:api:external      # RESTful Booker API only
```

### Run in headed mode

```bash
npm run test:headed
```

### Open the Playwright HTML report

```bash
npm run report
```

---

## 💡 Run with the included mock app

The repository includes a small local mock application under `mock-app/`. This makes the framework demo-friendly because CI does not need credentials for a real external application.

The mock app is **automatically started** by Playwright using the `webServer` configuration. You don't need to start it manually. Just run:

```bash
npm run test
```

Mock app routes:

| Route             | Purpose                                     |
| ----------------- | ------------------------------------------- |
| `/login`          | Login page used by UI tests                 |
| `/dashboard`      | Dashboard page used by UI tests             |
| `/api/v1/health`  | Health endpoint used by API smoke tests     |
| `/api/v1/reports` | Reports endpoint used by API contract tests |
| `/api/login`      | Login endpoint used by the mock UI          |

---

## 📊 Test coverage

| Area                          | Coverage                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------- |
| Login UI (mock)               | Valid login, invalid login, empty field validation, page-load verification            |
| Dashboard UI (mock)           | Dashboard load, welcome message, report search, report tile interaction, logout       |
| API contracts (mock)          | Health check, unauthorized access, schema validation, response-time threshold         |
| Visual Regression             | Login page, Dashboard page snapshots                                                  |
| SauceDemo (external)          | Login, inventory, add-to-cart, full checkout flow                                     |
| The Internet (external)       | Checkboxes, dropdowns, dynamic loading, alerts                                        |
| RESTful Booker API (external) | Auth token, create / read / update / delete booking, schema validation                |
| Cross-browser                 | Chromium (CI + local), Firefox & WebKit (local)                                       |
| Mobile viewports              | Pixel 7, iPhone 14 (configured, opt-in)                                               |
| Tags                          | `@smoke`, `@regression`, `@api`, `@external`, `@saucedemo`, `@theinternet`, `@visual` |

---

## 🏛️ Architecture

For a detailed breakdown of the framework's design principles, directory structure, and key components, please refer to the [Architecture Documentation](./docs/architecture.md).

---

## ⚙️ CI/CD

Two separate GitHub Actions workflows keep the public demo signal clean:

### `playwright-ci.yml` — default workflow

The primary CI pipeline is optimized for speed and reliability:

- **Test Sharding**: Automatically splits the test suite across multiple parallel runners to minimize execution time.
- **Caching**: Caches Node.js dependencies and Playwright browsers to accelerate subsequent runs.
- **Environment-Driven**: Uses dedicated environment variables for the bundled mock application.

### `report.yml` — reporting workflow

Triggered after the main test suite completes, this workflow:

- **Merges Results**: Consolidates test results from all shards.
- **Generates Allure Report**: Creates a comprehensive, interactive Allure report.
- **Artifact Preservation**: Uploads the final report for easy access and historical analysis.

### `external-ci.yml` — nightly external workflow

Runs the SauceDemo, The Internet, and RESTful Booker suites on a nightly schedule and on manual dispatch only. Failures here do not affect the main badge.

---

## 📜 Available scripts

| Command                     | Description                             |
| --------------------------- | --------------------------------------- |
| `npm run test`              | Run all non-external tests              |
| `npm run test:headed`       | Run tests with visible browser          |
| `npm run test:chrome`       | Run Chromium project                    |
| `npm run test:firefox`      | Run Firefox project (local only)        |
| `npm run test:webkit`       | Run WebKit project (local only)         |
| `npm run test:api`          | Run mock API tests                      |
| `npm run test:smoke`        | Run tests tagged with `@smoke`          |
| `npm run test:regression`   | Run tests tagged with `@regression`     |
| `npm run test:external`     | Run all external demo-site suites       |
| `npm run test:saucedemo`    | Run SauceDemo external suite            |
| `npm run test:theinternet`  | Run The Internet external suite         |
| `npm run test:api:external` | Run RESTful Booker API external suite   |
| `npm run report`            | Open the Playwright HTML report         |
| `npm run allure:generate`   | Generate Allure report from results     |
| `npm run allure:open`       | Open the generated Allure report        |
| `npm run allure:serve`      | Serve the Allure report locally         |
| `npm run typecheck`         | Run TypeScript type checking            |
| `npm run lint`              | Run ESLint for code quality             |
| `npm run lint:fix`          | Run ESLint and automatically fix issues |
| `npm run format`            | Format code with Prettier               |
| `npm run clean`             | Clean up test results and reports       |

---

## 🗺️ Roadmap

- **Advanced Reporting**: Integrate with ReportPortal for even richer analytics and defect management.
- **Performance Testing**: Add basic performance checks for critical user flows.
- **Accessibility Testing**: Integrate Playwright with accessibility testing tools (e.g., Axe-core).
- **Dockerization**: Provide Docker support for consistent test execution environments.
- **More External Examples**: Expand coverage to more popular demo sites.

---

## 🤝 Contributing

Contributions are welcome! Please see `CONTRIBUTING.md` for guidelines.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
