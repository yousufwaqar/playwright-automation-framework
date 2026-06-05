---
mode: agent
description: Self-review the current changes against the framework quality bar before opening a PR.
---

# Review before PR

Review the current diff against this framework's quality bar. Read `AGENTS.md`
first. Report findings grouped as Blocking / Non-blocking / Suggestions, then fix
the Blocking ones.

Check for:

1. **Honesty between docs and code.** Do `package.json` scripts, README, and
   `SKILLS.md` match what the config and code actually do (browsers, jobs,
   linked files)? Any script that references a non-existent project or any link
   to a non-existent file is Blocking.
2. **Assertion integrity.** Every new/changed test asserts an observable outcome.
   No weakened, skipped, or deleted assertions; no assertion-free tests; no
   blanket `try/catch` hiding failures.
3. **Locators and waits.** `data-testid` locators; no new `networkidle` or
   `waitForTimeout`.
4. **Conventions.** Page objects extend `BasePage`; tests import from the
   fixtures; tests are tagged; timeouts come from `ConfigManager`.
5. **Gate readiness.** `npm run lint` (0 errors), `npm run typecheck` (clean),
   and the relevant `npm run test:*` suites pass.

Only raise issues that genuinely matter (bugs, credibility gaps, convention
violations). Do not comment on style or formatting. Run the verification
commands and include their output in your report.
