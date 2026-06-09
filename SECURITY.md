# Security Policy

The security of this project and the people who use it matters. Thank you for
taking the time to report vulnerabilities responsibly.

## Supported versions

This is an actively maintained reference framework; security fixes always land
on `main`. Only the latest release line receives security updates.

| Version | Supported          |
| ------- | ------------------ |
| Latest `main` / newest tag | :white_check_mark: |
| Older tags | :x:              |

## Reporting a vulnerability

**Please do not open a public issue for security problems.**

Use GitHub's private vulnerability reporting instead:

1. Go to the [**Security** tab](https://github.com/yousufwaqar/playwright-automation-framework/security)
   of this repository.
2. Click **Report a vulnerability** to open a private advisory.

If you cannot use private reporting, email the maintainer at
**yousufwaqar7@gmail.com** with the details below.

Please include, where possible:

- A description of the vulnerability and its impact.
- Steps to reproduce, or a proof of concept.
- Affected files, versions, or configuration.
- Any suggested remediation.

## What to expect

- **Acknowledgement** within 5 business days.
- **An initial assessment** (severity and whether it is accepted) within
  10 business days.
- **Progress updates** as a fix is developed, and credit in the release notes
  once a fix ships, unless you prefer to remain anonymous.

## Scope

This repository is a self-contained test-automation framework that bundles a
mock application for demonstration purposes. The mock app (`mock-app/`) uses
hard-coded, non-production credentials **by design** so the suite runs
out-of-the-box; these are not real secrets and are out of scope.

In-scope examples:

- Vulnerabilities in framework code, fixtures, or utilities under `src/`,
  `tests/`, and `scripts/`.
- Supply-chain or CI/CD configuration weaknesses in `.github/`.
- Dependency vulnerabilities that affect users of this framework.

Out-of-scope examples:

- The intentional demo credentials and permissive settings in `mock-app/`.
- Findings that require a compromised developer machine or maintainer account.
- Vulnerabilities in third-party demo sites exercised by the `@external` suite.

Thank you for helping keep this project and its users safe.
