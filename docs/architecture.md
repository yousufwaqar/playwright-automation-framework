# Architecture

A single Playwright + TypeScript project, organised by responsibility. Nothing
here depends on a network service: a local mock app is the system under test.

## Directory layout

```
.
├── mock-app/                 # System under test (dependency-free Node server)
│   ├── server.js             # Routes, security headers, JSON API
│   ├── pages/                # login.html, dashboard.html (no inline scripts)
│   └── public/               # Externalised page JS (CSP-friendly)
├── src/
│   ├── pages/                # Page Object Model
│   │   ├── BasePage.ts       # Shared element/wait/assert helpers
│   │   ├── LoginPage.ts
│   │   ├── DashboardPage.ts
│   │   └── external/         # POMs for external-site demos
│   ├── fixtures/             # Custom Playwright fixtures (DI for specs)
│   └── utils/                # Cross-cutting helpers
│       ├── ConfigManager.ts          # Env/config (singleton)
│       ├── Logger.ts                 # Structured step logging
│       ├── TestDataManager.ts        # Test data access
│       ├── AccessibilityHelper.ts    # axe-core audit wrapper
│       └── PerformanceHelper.ts      # Navigation Timing + percentiles
├── tests/
│   ├── login.spec.ts, dashboard.spec.ts   # Functional/E2E
│   ├── api/                  # API contract
│   ├── a11y/                 # Accessibility
│   ├── security/             # API & HTTP security
│   ├── performance/          # Performance smoke
│   ├── visual/               # Visual regression (+ committed baselines)
│   ├── external/             # @external demos (public sites)
│   └── test-data/            # JSON fixtures
├── performance/k6/           # Demonstrative k6 load script
├── docs/                     # This documentation
├── Dockerfile, docker-compose.yml
└── .github/workflows/        # CI (quality-gate.yml is authoritative)
```

## Key design decisions

### Page Object Model + fixtures
Specs never touch raw selectors. `BasePage` centralises interaction primitives
(click/fill/wait/assert) with sensible auto-waits; concrete pages expose intent
("login", "searchReport"). Custom fixtures construct these objects and an
authenticated session once, so specs stay declarative.

### Local mock app as the system under test
`mock-app/server.js` is plain Node `http` — no framework, no install. It serves
the UI and a small API and is started automatically by Playwright's `webServer`
config (`reuseExistingServer: true`), so a single `npm test` boots everything.

### Security-hardened by construction
The mock app sets real browser-hardening headers (CSP, `X-Content-Type-Options`,
`X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`), uses a non-wildcard
CORS origin, and rejects malformed input with `400`. To allow a **strict CSP**
(`script-src 'self'`), all page JavaScript was moved out of inline `<script>`
blocks and inline `on*` handlers into `mock-app/public/*.js`. This is what makes
the security assertions meaningful rather than cosmetic.

### Helpers for cross-cutting concerns
- `AccessibilityHelper` wraps `@axe-core/playwright`, scoping audits to WCAG
  success-criteria tags and returning a structured, printable result.
- `PerformanceHelper` reads the W3C Navigation Timing Level 2 API and computes
  percentiles for the API latency check — no third-party perf tooling.

### Configuration
`ConfigManager` (singleton) resolves base URLs, timeouts and environment from
env vars with safe defaults, so the same specs run locally, in Docker and in CI
by changing only environment variables.

## Execution model

| Mode | How the mock app starts | Command |
|------|------------------------|---------|
| Local | Playwright `webServer` | `npm test` |
| Docker | Playwright `webServer` (in container) | `docker compose up --build` |
| CI | Playwright `webServer` per job (containerised) | `quality-gate.yml` |

See [quality-gates.md](./quality-gates.md) for the CI topology.
