# Test Strategy

This document explains **what** this framework tests, **why**, and the principles
behind how the suites are organised. It is deliberately a *full-spectrum* quality
framework: a single Playwright + TypeScript codebase that covers functional,
contract, accessibility, security, performance and visual quality — all runnable
offline against a local mock application.

## Goals

1. **Catch regressions early** across multiple quality dimensions, not just
   "does the happy path work".
2. **Stay deterministic and fast** so the blocking checks can gate every PR
   without flaking.
3. **Be reproducible anywhere** — locally, in Docker, and in CI — with zero
   external services or secrets.

## The mock application

All tests run against `mock-app/` — a tiny dependency-free Node HTTP server that
serves two pages (login, dashboard) and a small JSON API (`/api/v1/health`,
`/api/v1/reports`, `POST /api/login`). This makes the whole suite:

- **Hermetic** — no third-party site can break the build.
- **Deterministic** — fixed data, fixed responses.
- **Free** — nothing to pay for, nothing to rate-limit.

External-site demos (SauceDemo, the-internet, restful-booker) live under
`tests/external/` and are tagged `@external`, excluded from the default and
gating runs because they depend on the public internet.

## Test layers

| Layer | Location | Tag | Tooling | What it proves |
|-------|----------|-----|---------|----------------|
| Functional / E2E | `tests/login.spec.ts`, `tests/dashboard.spec.ts` | `@smoke` `@regression` | Playwright + POM | Core user journeys work |
| API contract | `tests/api/` | `@api` | Playwright `request` | Status codes, schema, auth, latency |
| Accessibility | `tests/a11y/` | `@a11y` | `@axe-core/playwright` | No WCAG 2.0/2.1 A & AA violations |
| Security | `tests/security/` | `@security` | Playwright `request` | Authz, headers, CORS, input handling |
| Performance | `tests/performance/` | `@performance` | Navigation Timing + request loop | No gross load/latency regressions |
| Visual | `tests/visual/` | `@visual` | Playwright screenshots | Pages render as expected |
| Load (demonstrative) | `performance/k6/` | — | k6 | API behaviour under ramped load |

## Tagging & selection

Tags drive selection so the same specs serve different purposes:

- `npm test` — default developer loop: functional + API + a11y + security
  (deterministic, fast). Excludes `@external`, `@visual`, `@performance`.
- `npm run test:functional|test:a11y|test:security|test:performance|test:visual`
  — run a single dimension.
- `npm run test:quality` — everything except `@external` (used inside Docker/CI
  where Linux visual baselines exist).

## Design principles

- **Page Object Model** keeps selectors and page behaviour out of test bodies
  (`src/pages/`), so UI changes touch one place.
- **Custom fixtures** (`src/fixtures/`) inject ready-to-use page objects, a
  logger, and an authenticated session, removing boilerplate.
- **Helpers over duplication** — cross-cutting concerns (accessibility auditing,
  performance timing) live in `src/utils/` and are reused by specs.
- **Generous, honest thresholds** — performance budgets guard against *gross*
  regressions, not micro-benchmarks, so they never flake on shared runners.
- **Real controls, real assertions** — the security suite tests controls the
  mock app actually enforces (it was hardened to back them), rather than
  documenting insecure behaviour.

See [architecture.md](./architecture.md) for structure and
[quality-gates.md](./quality-gates.md) for how these run in CI.
