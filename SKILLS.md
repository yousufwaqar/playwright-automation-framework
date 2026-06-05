# Skills Demonstrated

> A working portfolio of the engineering practices, tools, and patterns I've refined over **11+ years in QA — including 5+ years architecting Playwright automation in production**, most recently on Power BI at Microsoft (via LTIMindtree).
>
> This repository is the artifact. Every skill listed below is **demonstrated by code in this repo** — not just claimed. Links point to the exact files where each concept lives.

---

## 👤 About

- **Yousuf Waqar** — Senior SDET / QA Architect
- 📍 Pune, India
- 💼 Currently: SDET & QA Lead on Power BI at Microsoft (via LTIMindtree)
- 🎓 Section 508 Trusted Tester certified (DHS)
- 🔗 [LinkedIn](https://linkedin.com/in/yousuf-waqar/) · [GitHub](https://github.com/yousufwaqar)

---

## 🧰 Technical Skill Set

### Languages & Runtimes
| Skill | Years | Proficiency |
|---|---|---|
| TypeScript | 5+ | Advanced |
| JavaScript (ES6+) | 8+ | Advanced |
| Node.js | 6+ | Advanced |
| HTML / CSS | 11+ | Advanced |
| SQL | 8+ | Intermediate |
| Python (scripting) | 4+ | Intermediate |

### Test Automation
| Skill | Years | Proficiency |
|---|---|---|
| Playwright | 5+ | Advanced |
| Selenium WebDriver | 8+ | Advanced |
| Cypress | 2+ | Intermediate |
| API testing (REST) | 7+ | Advanced |
| Contract testing | 3+ | Intermediate |
| Visual regression testing | 2+ | Intermediate |
| Accessibility testing (axe-core, Section 508) | 4+ | Advanced |
| Mobile web testing (responsive, viewports) | 4+ | Intermediate |

### CI/CD & DevOps
| Skill | Years | Proficiency |
|---|---|---|
| GitHub Actions | 4+ | Advanced |
| Azure DevOps Pipelines | 5+ | Advanced |
| Docker | 3+ | Intermediate |
| Linux / Bash | 8+ | Intermediate |
| Git / GitHub workflow | 11+ | Advanced |

### Quality Engineering Practices
- Test architecture and framework design
- Page Object Model and fixture-based design patterns
- Risk-based test prioritization
- Defect triage and root-cause analysis
- Test data management
- Cross-functional collaboration with dev, PM, and design
- Mentoring junior SDETs and QA engineers

---

## 📂 Where Each Skill Lives in This Repo

Click any link to see the actual implementation.

### 🏗️ Test Architecture & Design Patterns

| Pattern | File |
|---|---|
| **Page Object Model** with shared base class | [`src/pages/BasePage.ts`](src/pages/BasePage.ts) |
| **Concrete Page Object** extending base | [`src/pages/LoginPage.ts`](src/pages/LoginPage.ts), [`src/pages/DashboardPage.ts`](src/pages/DashboardPage.ts) |
| **External-site Page Objects** (clean separation) | [`src/pages/external/saucedemo/`](src/pages/external/saucedemo/) |
| **Custom Playwright fixtures** | [`src/fixtures/base.fixture.ts`](src/fixtures/base.fixture.ts) |
| **Site-specific fixture composition** | [`src/fixtures/saucedemo.fixture.ts`](src/fixtures/saucedemo.fixture.ts) |
| **Centralized configuration management** | [`src/utils/ConfigManager.ts`](src/utils/ConfigManager.ts) |
| **Structured logging utility** | [`src/utils/Logger.ts`](src/utils/Logger.ts) |
| **Test data abstraction layer** | [`src/utils/TestDataManager.ts`](src/utils/TestDataManager.ts) |
| **Type definitions for global scope** | [`src/global.d.ts`](src/global.d.ts) |

### 🎭 Playwright Expertise

| Skill | File |
|---|---|
| **Playwright config — projects, parallelism, retries, reporters** | [`playwright.config.ts`](playwright.config.ts) |
| **Multi-browser project setup** (Chromium / Firefox / WebKit) | [`playwright.config.ts`](playwright.config.ts) |
| **Mobile viewport projects** (Pixel 7, iPhone 14 — configured, opt-in) | [`playwright.config.ts`](playwright.config.ts) |
| **Tag-based test execution** (`@smoke`, `@regression`, `@api`, `@external`) | [`tests/`](tests/) |
| **Trace, screenshot, video on failure** | [`playwright.config.ts`](playwright.config.ts) |

### 🔌 API Testing & Contract Validation

| Skill | File |
|---|---|
| **API contract tests** (status, schema, response time) | [`tests/api/api-contract.spec.ts`](tests/api/api-contract.spec.ts) |
| **External API testing** (RESTful Booker — auth, CRUD) | [`tests/external/api/restful-booker.spec.ts`](tests/external/api/restful-booker.spec.ts) |

### 🧪 Test Coverage Examples

| Type | File |
|---|---|
| **UI smoke tests** | [`tests/login.spec.ts`](tests/login.spec.ts), [`tests/dashboard.spec.ts`](tests/dashboard.spec.ts) |
| **End-to-end checkout flow** | [`tests/external/saucedemo/checkout.spec.ts`](tests/external/saucedemo/checkout.spec.ts) |
| **Dynamic UI elements** | [`tests/external/the-internet/ui-elements.spec.ts`](tests/external/the-internet/ui-elements.spec.ts) |

### 🧱 CI Reliability Engineering

| Skill | File |
|---|---|
| **Bundled mock application** for self-contained CI runs | [`mock-app/server.js`](mock-app/server.js) |
| **Environment-specific config files** (CI / dev / staging / prod) | [`tests/test-data/environments.json`](tests/test-data/environments.json) |
| **Test data files** (users, environments, external sites) | [`tests/test-data/`](tests/test-data/) |

### 🚀 CI/CD Pipelines

| Pipeline | File |
|---|---|
| **Main quality-gate CI** (per-module checks, PR validation, scheduled runs) | [`.github/workflows/quality-gate.yml`](.github/workflows/quality-gate.yml) |
| **External-site nightly suite** (isolated from main badge) | [`.github/workflows/external-ci.yml`](.github/workflows/external-ci.yml) |
| **Automated Playwright version updates** | [`.github/workflows/playwright-update.yml`](.github/workflows/playwright-update.yml) |
| **Release Drafter** (auto-generated changelogs) | [`.github/workflows/release-drafter.yml`](.github/workflows/release-drafter.yml) |
| **Link checker** (catches broken docs) | [`.github/workflows/link-check.yml`](.github/workflows/link-check.yml) |
| **Spell checker** (advisory) | [`.github/workflows/cspell.yml`](.github/workflows/cspell.yml) |
| **Stale issue/PR cleanup** | [`.github/workflows/stale.yml`](.github/workflows/stale.yml) |

### 🤖 Repo Automation & DevOps Practices

| Skill | File |
|---|---|
| **Renovate** — automated dependency updates with grouping rules | [`renovate.json`](renovate.json) |
| **Mergify** — auto-merge config for low-risk PRs | [`.mergify.yml`](.mergify.yml) |
| **Dependabot** — security-focused dependency updates | [`.github/dependabot.yml`](.github/dependabot.yml) |
| **CODEOWNERS** — review routing | [`CODEOWNERS`](CODEOWNERS) |
| **PR template** — consistent PR descriptions | [`pull_request_template.md`](pull_request_template.md) |
| **Issue templates** — bug + feature request | [`.github/ISSUE_TEMPLATE/`](.github/ISSUE_TEMPLATE/) |
| **Contributing guide** | [`CONTRIBUTING.md`](CONTRIBUTING.md) |

### 📦 Project Hygiene

| Practice | File |
|---|---|
| **TypeScript strict configuration** | [`tsconfig.json`](tsconfig.json) |
| **Dependency lockfile committed** | [`package-lock.json`](package-lock.json) |
| **Node version pinning** | [`.nvmrc`](.nvmrc) |
| **VS Code task automation** | [`.vscode/tasks.json`](.vscode/tasks.json) |
| **MIT licensed** | [`LICENSE`](LICENSE) |

---

## 🎯 What This Repository Demonstrates About Me

✅ I can **architect a test framework from first principles** — not just write tests inside an existing one.

✅ I think about **CI reliability as a first-class concern** — bundled mock app, advisory checks, isolated external suites.

✅ I make **opinionated technical decisions** and can defend them — Chromium-only in CI, BasePage scope, tag taxonomy.

✅ I treat **automation around the code** as part of the craft — Renovate, Release Drafter, link checking, stale management.

✅ I **document for humans** — every README section, contributing guide, PR template is written with the reader in mind.

✅ I **ship and iterate publicly** — this repo has commits, PRs, releases, and a real changelog you can audit.

---

## 📬 Hire Me / Talk to Me

Open to **Senior SDET, QA Architect, or Test Engineering Lead** roles — remote or Pune-based.

- 📧 yousufwaqar7@gmail.com
- 🔗 [LinkedIn](https://linkedin.com/in/yousuf-waqar/)
- 🌐 [GitHub](https://github.com/yousufwaqar)

If you're a recruiter or hiring manager evaluating my work — start with [`src/pages/BasePage.ts`](src/pages/BasePage.ts), [`playwright.config.ts`](playwright.config.ts), and [`.github/workflows/quality-gate.yml`](.github/workflows/quality-gate.yml). Those three files capture how I think.
