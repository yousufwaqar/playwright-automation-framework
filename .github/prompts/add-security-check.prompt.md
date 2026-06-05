---
mode: agent
description: Add an API or HTTP security check without overstating what it proves.
---

# Add a security check

You are extending the security suite. Read `AGENTS.md` first.

Given a control to verify (authz, headers, CORS, input handling, info leakage):

1. Add a spec under `tests/security/` tagged `@security @regression`, following
   the existing structure in `tests/security/api-security.spec.ts`.
2. For auth tests, authenticate with
   `Bearer ${process.env.API_TOKEN || "mock-jwt-token-12345"}` for the positive
   case and an **arbitrary** invalid token (for example `Bearer not-a-real-token`)
   for the negative case. Never rely on a single magic invalid string.
3. If the mock does not yet enforce the control honestly, fix
   `mock-app/server.js` so the test proves something real, then assert it.
4. Keep claims accurate: this suite verifies baseline hardening, not a full
   security assessment. Reflect that in comments and any doc you touch.
5. Run `npm run lint`, `npm run typecheck`, and `npm run test:security`. Report
   results.
