---
applyTo: "src/**/*.ts"
---

# Source / Page Object rules

When editing anything under `src/` (especially `src/pages/`):

- Page objects extend `BasePage` and live in `src/pages/` (external sites in
  `src/pages/external/<site>/`).
- Declare locators as `private readonly` fields assigned in the constructor,
  using `data-testid` selectors: `page.locator('[data-testid="..."]')`.
- Reuse `BasePage` helpers (`click`, `fill`, `waitForVisible`, `assertVisible`,
  `assertUrlContains`, `assertTitle`, ...) instead of raw Playwright calls where a
  helper exists.
- Expose intent-revealing async methods; do not expose raw locators to tests.
- Do not introduce new `waitForLoadState("networkidle")` or `waitForTimeout`
  calls. Prefer web-first waits.
- Read timeouts and URLs from `ConfigManager`, not hardcoded literals.
- Route real errors/warnings through `Logger.error` / `Logger.warn` (these go to
  stderr).

See `AGENTS.md` for the full manual.
