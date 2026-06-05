---
mode: agent
description: Write one or more tagged specs for a feature or user story using existing page objects.
---

# Write a test

You are adding coverage to this Playwright POM framework. Read `AGENTS.md` first.

Given a feature, user story, or acceptance criteria:

1. Identify the page object(s) involved under `src/pages/`. If a needed action or
   locator is missing, add it to the page object (using `data-testid`) rather
   than putting raw locators in the spec.
2. Add the spec(s) under the correct `tests/` subfolder:
   - UI behavior at the top level or alongside related specs.
   - API behavior under `tests/api/`, security under `tests/security/`,
     accessibility under `tests/a11y/`.
3. For each test:
   - Import `test`/`expect` from `../src/fixtures/base.fixture`.
   - Consume page objects and `logger` via fixtures; narrate with `logger.step`.
   - Assert at least one observable outcome. No assertion-free tests.
   - Tag it appropriately (`@smoke`, `@regression`, `@api`, `@security`, ...).
4. Cover the meaningful negative/edge case, not just the happy path. For auth,
   use an arbitrary invalid token, never a single magic string.
5. Run `npm run lint`, `npm run typecheck`, and the matching suite. Iterate until
   green without weakening any assertion.

Report the new test names, the tags used, and the verification results.
