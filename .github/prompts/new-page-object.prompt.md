---
mode: agent
description: Scaffold a new Page Object plus a tagged spec, following the framework conventions.
---

# New Page Object

You are extending this Playwright POM framework. Read `AGENTS.md` first.

Given a page name and (if available) a URL or a description of its key elements:

1. Create `src/pages/<Name>Page.ts` (external sites go under
   `src/pages/external/<site>/`):
   - Extend `BasePage`.
   - Declare locators as `private readonly` fields assigned in the constructor
     from `data-testid` selectors. If you do not know the real `data-testid`
     values, ask or inspect `mock-app/pages/` and `mock-app/public/` rather than
     guessing brittle selectors.
   - Add intent-revealing async methods (navigation, actions, and at least one
     `assert*` validation) that reuse `BasePage` helpers.
   - Do not use `networkidle` or `waitForTimeout`; use `waitForVisible` or
     web-first assertions.
2. If the page should be available as a fixture, wire it into
   `src/fixtures/base.fixture.ts` and the `CustomFixtures` type so specs can
   consume it.
3. Create a spec `tests/<name>.spec.ts` that imports `test`/`expect` from the
   fixtures, exercises the page, asserts an observable outcome, and is tagged
   (for example `@smoke @regression`).
4. Run `npm run lint`, `npm run typecheck`, and the relevant `npm run test:*`
   suite. Fix anything that fails. Report the commands you ran and their results.

Definition of Done: lint 0 errors, typecheck clean, the new spec passes on
Chromium.
