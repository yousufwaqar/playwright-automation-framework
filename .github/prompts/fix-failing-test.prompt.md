---
mode: agent
description: Triage and fix a failing Playwright test by root cause, without weakening assertions.
---

# Fix a failing test

You are fixing a failing test in this framework. Read `AGENTS.md` first.

Given a failing spec (name, file, or CI log):

1. **Reproduce** locally with the narrowest command, for example
   `npm run test:functional -- -g "<test title>"` or the matching tagged script.
   Read the actual error, stack, and any trace/screenshot in `playwright-report/`.
2. **Diagnose the root cause.** Classify it:
   - Locator drift (the `data-testid` changed or is wrong).
   - Timing/flake (a missing web-first wait; never "fix" this by adding
     `networkidle` or `waitForTimeout`).
   - Test data or environment (`tests/test-data/`, env vars, mock contract).
   - A real product/mock bug (fix the source, for example `mock-app/server.js` or
     a page object).
3. **Apply the smallest correct fix.** Do **not** weaken, skip, or delete the
   assertion, and do not add a blanket `try/catch` to swallow the failure. If the
   test is genuinely testing the wrong thing, fix what it asserts and explain why.
4. **Re-run** until the test passes, then run `npm run lint`, `npm run typecheck`,
   and the full relevant suite to confirm no regressions.
5. Report: the root cause, the fix, and the verification output. If the fix would
   change behavior the docs describe, update the docs too.
