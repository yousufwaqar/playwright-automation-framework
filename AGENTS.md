# AGENTS.md

Operating manual for AI coding agents (GitHub Copilot CLI, the Copilot coding
agent, and similar) working in this repository. Copilot loads this file
automatically at the start of a session. Read it before writing or changing code.

This repo is a portfolio-grade Playwright + TypeScript test automation framework.
The bar is **truthful, maintainable, deterministic** automation. Do not add
capabilities the docs claim but the code does not deliver, and never weaken an
assertion to make a test pass.

## What this project is

A Page Object Model (POM) framework that tests a bundled mock app and a set of
public demo sites. A Node mock app (`mock-app/server.js`) is started
automatically by Playwright's `webServer`, so the full suite runs with zero
external dependencies.

```
src/
  pages/        Page Objects (extend BasePage). External sites under pages/external/
  fixtures/     Custom Playwright fixtures (base: page objects + logger;
                authenticated: storageState-seeded login for protected pages)
  utils/        ConfigManager, Logger, TestDataManager, AccessibilityHelper, PerformanceHelper
  global.d.ts   Declaration merging for custom fixtures into PlaywrightTest.TestArgs
tests/
  *.spec.ts     UI specs against the mock app
  api/          Mock API contract tests
  a11y/         axe-core WCAG audits
  security/     API and HTTP security checks
  visual/       Screenshot baselines
  performance/  Navigation Timing budgets
  external/     SauceDemo, The Internet, RESTful Booker
  test-data/    environments.json, users, external-site data
mock-app/       Self-contained Node mock (server.js + pages/ + public/)
performance/    k6 load script
```

## Golden rules (non-negotiable)

1. **Locators: prefer `data-testid`.** Use `page.locator('[data-testid="..."]')`.
   Only fall back to role or text locators when a `data-testid` is genuinely
   unavailable. Never use brittle CSS or XPath chains.
2. **Every test must assert.** A spec with no `expect` (directly or via a
   BasePage `assert*` helper) is not a test. Assert an observable outcome.
3. **Never weaken an assertion to get green.** If a test fails, fix the root
   cause (locator, timing, data, or product behavior). Do not relax matchers,
   delete assertions, or add blanket `try/catch` to hide failures.
4. **No `waitForLoadState("networkidle")` and no hard `waitForTimeout`.**
   `networkidle` is flake-prone and discouraged by Playwright. Use web-first
   assertions (`expect(locator).toBeVisible()`), `waitForVisible()`, or
   `page.waitForURL()` instead.
5. **Keep cross-browser honest.** Chromium is the only blocking gate. Firefox and
   WebKit are real, enabled projects, runnable via `npm run test:firefox` /
   `test:webkit` / `test:cross-browser`. If you add or remove a browser project,
   update the `package.json` scripts, the README, and `SKILLS.md` in the same change.
6. **Tag every test.** See the tag taxonomy below; the npm scripts and CI jobs
   select tests by tag.
7. **Definition of Done** (run before proposing a change as complete):
   `npm run lint` (0 errors), `npm run typecheck` (clean),
   `npm run test:functional` (all pass). For security/api/a11y changes also run
   the matching `npm run test:security` / `test:api` / `test:a11y`.
8. **Do not commit secrets.** The mock token `mock-jwt-token-12345` is a public
   test fixture and is fine; real credentials are not.

## Page Object conventions

- A page object extends `BasePage` and lives in `src/pages/` (external sites in
  `src/pages/external/<site>/`).
- Declare locators as `private readonly` fields, assigned in the constructor from
  `data-testid` selectors.
- Page actions and validations are async methods. Reuse `BasePage` helpers
  (`click`, `fill`, `waitForVisible`, `assertVisible`, `assertUrlContains`,
  `assertTitle`, etc.) instead of calling raw Playwright APIs where a helper exists.
- Expose intent-revealing methods (`login()`, `openReport(index)`,
  `assertDashboardLoaded()`), not raw locators.

Minimal shape:

```ts
import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ExamplePage extends BasePage {
  private readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('[data-testid="heading"]');
  }

  async goto(): Promise<void> {
    await this.navigateTo("/example");
    await this.waitForVisible(this.heading);
  }

  async assertLoaded(): Promise<void> {
    await this.assertVisible(this.heading);
  }
}
```

## Test conventions

- Import `test` and `expect` from `../src/fixtures/base.fixture` (not from
  `@playwright/test` directly) so the custom fixtures are available.
- Consume page objects and `logger` through fixtures
  (`async ({ loginPage, dashboardPage, logger }) => { ... }`).
- Use `logger.step(n, "...")` to narrate steps and end with `logger.info(...)`.
- Name tests as a behavior and append tags, e.g.
  `"should reject an arbitrary token @security @regression"`.

## Tag taxonomy

| Tag | Meaning |
| --- | --- |
| `@smoke` | Fast critical-path checks |
| `@regression` | Broader functional coverage |
| `@api` | Mock API contract tests |
| `@a11y` | axe-core WCAG audits |
| `@security` | API and HTTP security checks |
| `@visual` | Screenshot baselines |
| `@performance` | Navigation Timing budgets |
| `@external` | Public demo sites (not part of the blocking gate) |
| `@saucedemo`, `@theinternet` | External site selectors |

## Commands

| Command | Use |
| --- | --- |
| `npm run lint` | ESLint (typescript-eslint + eslint-plugin-playwright) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test:functional` | Chromium functional + API (the local fast loop) |
| `npm run test:smoke` / `test:regression` | Tag-filtered suites |
| `npm run test:a11y` / `test:security` / `test:visual` / `test:performance` | Quality modules |
| `npm run test:firefox` / `test:webkit` / `test:cross-browser` | Other engines |
| `npm run test:external` | Public demo-site suites |
| `npm run report` | Open the HTML report |

All test scripts default to the `chromium` project for deterministic local runs.

## Mock app contract (`mock-app/server.js`)

- Pages: `GET /` and `/login` (login page), `/dashboard` (requires the UI login flow).
- `GET /api/v1/health` returns `{ status: "healthy" }`.
- `GET /api/v1/reports` requires `Authorization: Bearer ${API_TOKEN}` where
  `API_TOKEN` defaults to `mock-jwt-token-12345`. Any other value returns 401.
- `POST /api/login` validates a known user and returns `{ token: "mock-jwt-token-12345" }`.
- Valid mock users live in `VALID_USERS` in `server.js`; UI test users live in
  `tests/test-data/`.
- If you change an endpoint, update the matching specs in `tests/api/` and
  `tests/security/` in the same change.

## Configuration and environment

- `ConfigManager` (singleton) reads `tests/test-data/environments.json`, keyed by
  `TEST_ENV`. Timeouts come from config, not magic numbers in tests.
- Relevant env vars: `BASE_URL`, `API_BASE_URL`, `TEST_ENV`, `API_TOKEN`.

## CI quality gate (`.github/workflows/quality-gate.yml`)

- **Blocking** jobs (must pass): `lint-typecheck`, `functional`,
  `accessibility`, `security`. They aggregate into the `quality-gate` status.
- **Non-blocking** jobs (`continue-on-error`): `performance`, `visual`,
  `k6-load`, `cross-browser` (Firefox/WebKit).
- A change is not ready until the blocking jobs would pass. Run their local
  equivalents before finishing.

## When you are asked to...

- **Add a page or feature test:** create/extend a page object with `data-testid`
  locators, add a tagged spec that asserts an observable outcome, run lint +
  typecheck + the relevant suite.
- **Fix a failing test:** reproduce it, find the root cause, apply the smallest
  correct fix without weakening assertions, then re-run until green. See
  `.github/prompts/fix-failing-test.prompt.md`.
- **Extend accessibility or security coverage:** reuse `AccessibilityHelper` and
  the existing security patterns; do not overstate what a check proves.
