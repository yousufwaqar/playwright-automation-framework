# Copilot instructions

This repository is a Playwright + TypeScript Page Object Model test framework.
The authoritative, detailed operating manual is [`AGENTS.md`](../AGENTS.md) at the
repo root. **Read it first.** This file is a short summary for tools that load
`.github/copilot-instructions.md`.

Core rules:

- Use `data-testid` locators. Avoid brittle CSS/XPath.
- Every test must assert an observable outcome. Never weaken or delete an
  assertion to make a test pass; fix the root cause instead.
- Do not add `waitForLoadState("networkidle")` or hard `waitForTimeout`. Prefer
  web-first assertions and `waitForVisible()`.
- Page objects extend `BasePage` and live in `src/pages/`. Tests import `test`
  and `expect` from `src/fixtures/base.fixture` and consume fixtures.
- Tag every test (`@smoke`, `@regression`, `@api`, `@a11y`, `@security`,
  `@visual`, `@performance`, `@external`).
- Chromium is the only blocking CI gate. Keep Firefox/WebKit claims honest across
  `package.json`, README, and `SKILLS.md`.

Definition of Done before proposing a change as complete:

```
npm run lint          # 0 errors
npm run typecheck     # clean
npm run test:functional
```

Reusable task recipes live in [`.github/prompts/`](prompts/). Path-scoped rules
live in [`.github/instructions/`](instructions/).
