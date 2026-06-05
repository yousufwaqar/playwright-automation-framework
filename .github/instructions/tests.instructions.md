---
applyTo: "tests/**/*.ts"
---

# Test authoring rules

When writing or editing specs under `tests/`:

- Import `test` and `expect` from `../src/fixtures/base.fixture` (adjust the
  relative depth), not from `@playwright/test` directly.
- Consume page objects and `logger` via fixtures.
- Every test must assert an observable outcome with `expect` or a BasePage
  `assert*` helper. A test with no assertion is not allowed.
- Never weaken, skip, or delete an assertion to make a test green. Fix the root
  cause instead.
- Name the test as a behavior and append tags, e.g.
  `"should reject an arbitrary token @security @regression"`.
- Avoid conditional `expect` where practical; assert deterministically.
- For API/security tests, authenticate with `Bearer ${process.env.API_TOKEN || "mock-jwt-token-12345"}`
  and use an arbitrary token (for example `Bearer not-a-real-token`) for negative
  cases, never a single magic string.

Run the relevant suite plus `npm run lint` and `npm run typecheck` before
finishing. See `AGENTS.md` for the full manual.
