---
mode: agent
description: Extend accessibility (axe-core / WCAG) coverage for a page.
---

# Add an accessibility check

You are extending a11y coverage. Read `AGENTS.md` first.

Given a page or component:

1. Reuse `AccessibilityHelper` (`src/utils/`) and follow the existing patterns in
   `tests/a11y/`. Do not hand-roll axe configuration that diverges from the
   established WCAG 2.0/2.1 A and AA scope.
2. Add a spec under `tests/a11y/` tagged `@a11y`. Navigate via the page object,
   run the audit, and assert there are no violations of the in-scope severity.
3. When a real violation is found, prefer fixing the mock app markup
   (`mock-app/pages/`) over excluding the rule. If you must scope a rule out,
   leave a comment explaining why.
4. Do not overstate coverage. An axe scan checks automated rules only; describe
   it as such in any comment or doc.
5. Run `npm run lint`, `npm run typecheck`, and `npm run test:a11y`. Report
   results.
