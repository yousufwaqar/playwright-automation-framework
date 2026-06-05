<div align="center">

# 🎭 Playwright Automation Framework

### Enterprise-grade end-to-end test automation built for scale

[![Quality Gate](https://github.com/yousufwaqar/playwright-automation-framework/actions/workflows/quality-gate.yml/badge.svg)](https://github.com/yousufwaqar/playwright-automation-framework/actions/workflows/quality-gate.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.60+-45ba4b?logo=playwright&logoColor=white)](https://playwright.dev/)
 [![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
 [![License](https://img.shields.io/github/license/yousufwaqar/playwright-automation-framework?color=yellow)](./LICENSE)
 [![Tests](https://img.shields.io/badge/UI%20%2B%20API-Covered-success)](#test-coverage)
 [![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg)](./CONTRIBUTING.md)
 [![Last Commit](https://img.shields.io/github/last-commit/yousufwaqar/playwright-automation-framework?color=blue)](https://github.com/yousufwaqar/playwright-automation-framework/commits/main)

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
 <br/><br/>

 👋 <strong>Hiring or evaluating my work?</strong> See <a href="./SKILLS.md"><strong>SKILLS.md</strong></a>: a guided tour of the
engineering skills this repo demonstrates and how to reach me.

 </div>

</div>

---

## Preview

<div align="center">

The framework drives, screenshots, and visually diffs a bundled mock BI app on every run, so the suite is fully self-contained and the visual baselines live in version control.

<img src="tests/visual/dashboard.visual.spec.ts-snapshots/dashboard-page-chromium-win32.png" alt="Mock BI dashboard exercised by the framework" width="720"/>

<sub><em>Committed visual-regression baseline (dashboard). A matching login baseline sits alongside it; the `visual` CI job reports any unintended pixel drift (advisory / non-blocking until promoted, see CI section).</em></sub>

</div>

---

## Why this framework?

This repository is a production-style Playwright automation framework built to demonstrate the patterns used in scalable enterprise test automation: clean page objects, reusable fixtures, environment-driven configuration, UI + API coverage, CI-ready execution, and rich debugging artifacts.

It is designed to be easy to clone, easy to understand, and easy to extend for real-world web applications. It also ships with a **bundled mock app** so the full suite runs out-of-the-box with zero external dependencies, plus a **public demo-site test pack** (SauceDemo, The Internet, RESTful Booker) that shows the framework in action against well-known practice sites.

| What it solves             | How it helps                                                                 |
| ---                        | ---                                                                          |
| Maintainable UI automation | Page Object Model keeps selectors and page actions isolated from tests       |
| Fast feedback              | Parallel execution on Chromium as the blocking CI gate, with Firefox and WebKit runnable locally and in an optional CI job |
| Reliable CI runs           | A lightweight bundled mock app removes external system dependencies          |
| API confidence             | Contract tests validate health, auth behavior, schema, and response time     |
| Environment flexibility    | Centralized JSON config drives per-environment timeout and retry profiles (local + ci)    |
| Debuggability              | HTML reports, screenshots, traces, videos, and structured logs               |
| Real-world examples        | Optional external suites against SauceDemo, The Internet, and RESTful Booker |

---

## Highlights

- **Playwright + TypeScript** foundation for modern E2E automation
- **Page Object Model** with shared `BasePage` for clean separation of concerns
- **AI agent toolkit**: committed `AGENTS.md`, path-scoped instructions, and prompt recipes so GitHub Copilot agents can write and fix tests, verified by the Quality Gate
- **Custom fixtures** for shared page objects and structured logging
- **Data-driven testing** through JSON test data files
- **Cross-browser**: Chromium is the blocking CI gate; Firefox and WebKit are enabled projects you run via `npm run test:firefox` / `test:webkit` / `test:cross-browser` (and an optional non-blocking CI job)
- **Mobile viewport projects** (Pixel 7, iPhone 14) ready to enable
- **API contract validation** alongside UI coverage
- **Bundled mock application** for fully self-contained CI runs
- **Accessibility testing** with axe-core (WCAG 2.0/2.1 A & AA)
- **API & HTTP security suite**: authz, CSP & hardening headers, non-wildcard CORS, safe input handling
- **Performance smoke tests**: Navigation Timing budgets + API latency/throughput
- **Visual regression** via Playwright screenshots with platform-aware baselines
- **Docker + Docker Compose** for reproducible one-command runs
- **Composite Quality Gate CI**: every quality dimension is its own status check
- **ESLint** (typescript-eslint + eslint-plugin-playwright) enforced in CI alongside type-checking
- **External demo-site suites** (SauceDemo / The Internet / RESTful Booker) gated behind tags
- **GitHub Actions workflows** with Chromium runs, artifact upload, and a separate nightly external job
- **HTML, JSON, screenshot, trace, and video reporting**
- **Tag-based execution** with `@smoke`, `@regression`, `@api`, `@a11y`, `@security`, `@visual`, `@performance`, `@external`

---

## Tech stack

| Tool                                          | Purpose                                        |
| ---                                           | ---                                            |
| [Playwright](https://playwright.dev/)         | Browser automation and API testing             |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe test development                     |
| [Node.js](https://nodejs.org/)                | Runtime environment (20.19+)                   |
| [tsx](https://github.com/privatenumber/tsx)   | Native TypeScript loader for fixtures          |
| [ESLint](https://eslint.org/) + [typescript-eslint](https://typescript-eslint.io/) | Linting with `eslint-plugin-playwright` rules |
| GitHub Actions                                | CI pipeline (Chromium) and scheduled external runs |
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

- Node.js 20.19 or higher (see `.nvmrc`)
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

### Run against a specific browser

```bash
npm run test:chrome
npm run test:firefox
npm run test:webkit
npm run test:cross-browser   # Chromium + Firefox + WebKit
```

> **Note:** Chromium is the blocking CI gate for fast, deterministic feedback. Firefox and WebKit are configured projects; run them locally (after `npx playwright install` pulls the engines) or via the optional non-blocking cross-browser CI job, which uses the official Playwright container where all engines are preinstalled.

### Run focused suites

```bash
npm run test:smoke
npm run test:regression
npm run test:api
```

### Run individual quality modules

```bash
npm run test:a11y          # accessibility (axe-core, WCAG 2.0/2.1 A & AA)
npm run test:security      # API & HTTP security assertions
npm run test:performance   # performance smoke (Navigation Timing budgets)
npm run test:visual        # visual regression (uses committed baselines)
npm run test:visual:update # refresh visual baselines for the current platform
npm run perf:k6            # k6 API load script (requires k6 installed)
```

### Run with Docker (no local Node/Playwright needed)

```bash
docker compose up --build --exit-code-from e2e
```

This builds the pinned Playwright image, starts the mock app inside the
container, and runs the deterministic suite. See [docs/architecture.md](./docs/architecture.md).


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

### Open the HTML report

```bash
npm run report
```

---

## Run with the included mock app

The repository includes a small local mock application under `mock-app/`. This makes the framework demo-friendly because CI does not need credentials for a real external application.

The mock app is **automatically started** by Playwright using the `webServer` configuration. You don't need to start it manually. Just run:

```bash
npm run test
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

| Area                          | Coverage                                                                        |
| ---                           | ---                                                                             |
| Login UI (mock)               | Valid login, invalid login, empty field validation, page-load verification      |
| Dashboard UI (mock)           | Dashboard load, welcome message, report search, report tile interaction, logout |
| API contracts (mock)          | Health check, unauthorized access, schema validation, response-time threshold   |
| Accessibility (mock)          | axe-core WCAG 2.0/2.1 A & AA audits on login and dashboard                       |
| Security (mock API/HTTP)      | Authz enforcement, CSP & hardening headers, non-wildcard CORS, malformed-input handling, info-leak checks |
| Performance (mock)            | Navigation Timing budgets, API latency percentiles & throughput                 |
| Visual regression (mock)      | Screenshot baselines for login and dashboard (platform-aware)                   |
| SauceDemo (external)          | Login, inventory, add-to-cart, full checkout flow                               |
| The Internet (external)       | Checkboxes, dropdowns, dynamic loading, alerts                                  |
| RESTful Booker API (external) | Auth token, create / read / update / delete booking, schema validation          |
| Cross-browser                 | Chromium (blocking CI + local), Firefox & WebKit (local + optional non-blocking CI)                 |
| Mobile viewports              | Pixel 7, iPhone 14 (configured, opt-in)                                         |
| Tags                          | `@smoke`, `@regression`, `@api`, `@a11y`, `@security`, `@visual`, `@performance`, `@external`, `@saucedemo`, `@theinternet` |

---

## Project architecture

```text
playwright-automation-framework/
├── .github/
│   ├── workflows/
│   │   ├── quality-gate.yml           # Authoritative CI: composite quality gate
│   │   ├── copilot-setup-steps.yml    # Copilot coding agent environment setup
│   │   ├── visual-baseline.yml        # Manual: generate Linux visual baselines
│   │   ├── external-ci.yml            # Nightly external demo-site suite
│   │   ├── playwright-update.yml      # Automated Playwright version bumps
│   │   ├── cspell.yml                 # Spell-check workflow
│   │   ├── link-check.yml             # Markdown link checker
│   │   ├── release-drafter.yml        # Drafts release notes from merged PRs
│   │   └── stale.yml                  # Marks stale issues and PRs
│   ├── instructions/                  # Path-scoped agent rules
│   │   ├── pages.instructions.md      # Rules for src/pages/**
│   │   └── tests.instructions.md      # Rules for tests/**
│   ├── prompts/                       # Reusable Copilot task recipes
│   │   ├── new-page-object.prompt.md
│   │   ├── write-test.prompt.md
│   │   ├── fix-failing-test.prompt.md
│   │   ├── add-a11y.prompt.md
│   │   ├── add-security-check.prompt.md
│   │   └── review-before-pr.prompt.md
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   ├── copilot-instructions.md        # Repo ruleset for the Copilot agent
│   ├── dependabot.yml
│   └── release-drafter.yml            # Release Drafter config
├── docs/
│   ├── test-strategy.md               # Layers, tagging, principles
│   ├── architecture.md                # Framework structure & design decisions
│   └── quality-gates.md               # CI topology, blocking vs non-blocking
├── mock-app/
│   ├── server.js                      # Hardened mock server (headers, CORS, JSON)
│   ├── pages/
│   │   ├── login.html                 # Mock login page (no inline scripts)
│   │   └── dashboard.html             # Mock dashboard page (no inline scripts)
│   └── public/
│       ├── login.js                   # Externalised JS (strict-CSP friendly)
│       └── dashboard.js
├── performance/
│   └── k6/
│       └── api-load.js                # k6 API load script
├── src/
│   ├── fixtures/
│   │   ├── base.fixture.ts            # Page objects + logger (logged-out)
│   │   ├── authenticated.fixture.ts   # storageState-seeded login (protected pages)
│   │   └── saucedemo.fixture.ts       # Fixtures for SauceDemo external suite
│   ├── pages/
│   │   ├── BasePage.ts                # Shared page actions and assertions
│   │   ├── LoginPage.ts               # Mock login page object
│   │   ├── DashboardPage.ts           # Mock dashboard page object
│   │   └── external/
│   │       └── saucedemo/
│   │           ├── SauceLoginPage.ts
│   │           ├── SauceInventoryPage.ts
│   │           ├── SauceCartPage.ts
│   │           └── SauceCheckoutPage.ts
│   ├── utils/
│   │   ├── ConfigManager.ts           # Environment config loader
│   │   ├── Logger.ts                  # Structured logging utility
│   │   ├── TestDataManager.ts         # Test data accessor
│   │   ├── AccessibilityHelper.ts     # axe-core audit wrapper
│   │   └── PerformanceHelper.ts       # Navigation Timing + percentiles
│   └── global.d.ts                    # Ambient type declarations
├── tests/
│   ├── api/
│   │   └── api-contract.spec.ts       # Mock API contract tests
│   ├── a11y/
│   │   ├── accessibility.spec.ts      # Login-page accessibility audit
│   │   └── dashboard.a11y.spec.ts     # Dashboard audit (authenticated)
│   ├── security/
│   │   └── api-security.spec.ts       # API & HTTP security assertions
│   ├── performance/
│   │   ├── perf-smoke.spec.ts         # Login + API performance smoke
│   │   └── dashboard.perf.spec.ts     # Dashboard load budget (authenticated)
│   ├── visual/
│   │   ├── visual.spec.ts             # Login-page visual regression
│   │   ├── visual.spec.ts-snapshots/  # Committed login baseline
│   │   ├── dashboard.visual.spec.ts   # Dashboard visual regression (authenticated)
│   │   └── dashboard.visual.spec.ts-snapshots/  # Committed dashboard baseline
│   ├── external/
│   │   ├── saucedemo/
│   │   │   ├── login.spec.ts
│   │   │   └── checkout.spec.ts
│   │   ├── the-internet/
│   │   │   └── ui-elements.spec.ts
│   │   └── api/
│   │       └── restful-booker.spec.ts
│   ├── test-data/
│   │   ├── environments.json          # local + ci timeout/retry profiles
│   │   ├── users.json                 # Test users
│   │   └── external-sites.json        # Credentials/URLs for demo sites
│   ├── dashboard.spec.ts              # Dashboard UI tests
│   └── login.spec.ts                  # Login UI tests
├── reports/                           # Generated reports (kept via .gitkeep)
├── .vscode/
│   └── tasks.json                     # Editor task shortcuts
├── AGENTS.md                          # Operating manual for AI coding agents
├── SKILLS.md                          # Guided tour of the skills this repo shows
├── CONTRIBUTING.md
├── CODEOWNERS                         # Review ownership
├── pull_request_template.md
├── LICENSE
├── Dockerfile                         # Pinned Playwright image
├── docker-compose.yml                 # One-command containerised run
├── .dockerignore
├── .gitignore
├── .nvmrc                             # Pinned Node version (22)
├── .mergify.yml                       # Mergify merge automation
├── eslint.config.mjs                  # ESLint flat config (ts + playwright rules)
├── playwright.config.ts               # Playwright configuration
├── package.json                       # Scripts and dependencies
├── package-lock.json
├── tsconfig.json                      # TypeScript configuration
├── cspell.json                        # Spell-check dictionary/config
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

This supports clean switching between the `local` and `ci` timeout/retry profiles through:

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

CI is a **composite Quality Gate**: every quality dimension runs as its own job
and produces an independent status check. Full details in
[docs/quality-gates.md](./docs/quality-gates.md).

### `quality-gate.yml` - authoritative workflow

Runs on push to `main`/`develop`, pull requests targeting `main`, and a daily
schedule. Test jobs run inside `mcr.microsoft.com/playwright:v1.60.0-jammy`, so
browsers are preinstalled.

**Blocking** (gate the merge): `lint-typecheck` (ESLint + `tsc`), `functional`,
`accessibility`, `security`. These are aggregated by a final `quality-gate` job
via `needs`.

**Non-blocking** (`continue-on-error: true`, informational): `performance`,
`visual`, `k6-load`, `cross-browser` (Firefox/WebKit). A red non-blocking run
stays visible without blocking a merge.

> Branch protection should require the **Quality Gate** status check (the older
> "Playwright Tests" check was removed with `playwright-ci.yml`).

### `visual-baseline.yml` - Linux baselines

Playwright screenshot baselines are platform-specific. Windows baselines are
committed for local dev; run this `workflow_dispatch` once to generate and commit
the Linux baselines so the CI `visual` job goes green.

### `external-ci.yml` - nightly external workflow

Runs the SauceDemo, The Internet, and RESTful Booker suites on a nightly schedule
and on manual dispatch only. Failures here do not affect the main badge.

### `copilot-setup-steps.yml` - Copilot coding agent environment

Pre-installs Node and the Playwright browsers so the GitHub Copilot coding agent
can install dependencies and run the suite (and the Quality Gate) to verify its
own changes before opening a pull request.

---

## AI agent toolkit

This repository is set up so AI coding agents (the GitHub Copilot CLI and the
Copilot coding agent) can extend and maintain it safely. The conventions live in
version control and load automatically, so an agent can scaffold a page object,
write a test, or fix a failing one, and the Quality Gate verifies the result.

| File | Role |
| --- | --- |
| [`AGENTS.md`](AGENTS.md) | Operating manual: POM conventions, tag taxonomy, mock contract, commands, and a Definition of Done. Loaded automatically by Copilot. |
| [`.github/copilot-instructions.md`](.github/copilot-instructions.md) | Short ruleset for the Copilot coding agent and github.com. |
| [`.github/instructions/`](.github/instructions/) | Path-scoped rules applied automatically when editing `src/**` or `tests/**`. |
| [`.github/prompts/`](.github/prompts/) | Reusable task recipes: `new-page-object`, `write-test`, `fix-failing-test`, `add-a11y`, `add-security-check`, `review-before-pr`. |
| [`.github/workflows/copilot-setup-steps.yml`](.github/workflows/copilot-setup-steps.yml) | Pre-installs Node and Playwright browsers so the agent can run and verify the suite. |

**Guardrails the toolkit enforces:** `data-testid` locators, every test asserts
an observable outcome, never weaken assertions to go green, no flaky
`networkidle` / `waitForTimeout`, honest cross-browser claims, and
`lint` + `typecheck` + `test:functional` as the Definition of Done.

The framework's own Quality Gate is the agent's verification harness: file an
issue (or use `/delegate`), the agent opens a pull request, and it must pass the
same blocking checks as any human contributor.

---

## Available scripts

| Command                     | Description                           |
| ---                         | ---                                   |
| `npm run test`              | Run deterministic suite (excludes external, visual, performance) |
| `npm run test:functional`   | Functional + API only (excludes a11y/security/visual/perf) |
| `npm run test:quality`      | Run all non-external tests (every quality module) |
| `npm run test:headed`       | Run tests with visible browser        |
| `npm run test:chrome`       | Run Chromium project                  |
| `npm run test:firefox`      | Run Firefox project                   |
| `npm run test:webkit`       | Run WebKit project                    |
| `npm run test:cross-browser`| Run Chromium + Firefox + WebKit       |
| `npm run test:api`          | Run mock API contract tests           |
| `npm run test:smoke`        | Run smoke tests                       |
| `npm run test:regression`   | Run regression tests                  |
| `npm run test:a11y`         | Run accessibility audits              |
| `npm run test:security`     | Run API & HTTP security tests         |
| `npm run test:performance`  | Run performance smoke tests           |
| `npm run test:visual`       | Run visual regression tests           |
| `npm run test:visual:update`| Refresh visual baselines (current platform) |
| `npm run perf:k6`           | Run k6 API load script (requires k6)  |
| `npm run typecheck`         | Type-check without emitting           |
| `npm run lint`              | Lint with ESLint (typescript-eslint + playwright rules) |
| `npm run test:external`     | Run all external demo-site suites     |
| `npm run test:saucedemo`    | Run SauceDemo external suite          |
| `npm run test:theinternet`  | Run The Internet external suite       |
| `npm run test:api:external` | Run RESTful Booker external API suite |
| `npm run report`            | Open Playwright HTML report           |

---

## Roadmap

Recently delivered:

- ✅ Accessibility testing with axe-core
- ✅ API & HTTP security suite
- ✅ Performance smoke tests + k6 load script
- ✅ Visual regression testing
- ✅ Docker support for consistent local execution
- ✅ Composite Quality Gate CI with per-module status checks
- ✅ ESLint (typescript-eslint + eslint-plugin-playwright) in CI
- ✅ Repo-committed AI agent toolkit (AGENTS.md, prompt recipes, Copilot setup steps)

Planned:

- Add Allure reporting integration
- Publish Playwright HTML reports to GitHub Pages
- Promote the visual job to blocking once Linux baselines are seeded
- Add reusable GitHub Actions workflow templates

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
github-copilot
ai-agents
```

---

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide.

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

