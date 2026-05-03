# Contributing

Thanks for considering a contribution! This guide explains how to set up the project, the conventions used in the codebase, and how to submit your change.

## Code of conduct

Be respectful and constructive. Discussions stay focused on the work.

## Project setup

```bash
git clone https://github.com/yousufwaqar/playwright-automation-framework.git
cd playwright-automation-framework
nvm use            # uses the version pinned in .nvmrc
npm ci
npx playwright install
```

Run the default suite (against the bundled mock app):

```bash
npm run test
```

Run external demo-site suites (optional, may be flaky if those sites are down):

```bash
npm run test:external
```

## Branch naming

Use a short, descriptive prefix:

| Prefix      | When to use                          |
| ----------  | --------------------------           |
| `feat/`     | New tests, fixtures, pages           |
| `fix/`      | Bug fix or flaky test fix            |
| `docs/`     | README / docs only                   |
| `chore/`    | Tooling, deps, CI                    |
| `refactor/` | Internal cleanup, no behavior change |

Examples:

```
feat/add-checkout-discount-tests
fix/login-flake-on-firefox
docs/update-architecture-section
```

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add dashboard filter tests
fix: stabilize login wait condition
docs: clarify mock-app setup steps
chore: bump @playwright/test to 1.46
```

## Code conventions

- **Page Objects** live in `src/pages/`. Each page owns its locators and exposes business-level methods. Tests must not contain raw selectors.
- **Fixtures** live in `src/fixtures/`. Use them to inject pre-wired page objects and helpers into tests.
- **Test files** use the `*.spec.ts` suffix and follow `Arrange → Act → Assert`.
- **Tags** go in the test title: `@smoke`, `@regression`, `@api`, `@external`, `@saucedemo`, `@theinternet`. Tag every external test with `@external`.
- **Test data** lives in `tests/test-data/*.json`. Do not hardcode test users or environment URLs in specs.
- **Logging** goes through the `logger` fixture, not `console.log`.
- **Selectors:** prefer `getByRole`, `getByLabel`, `getByTestId`. Avoid brittle CSS / XPath.
- **Waits:** rely on Playwright auto-waiting and web-first assertions (`expect(locator).toBeVisible()`). Do not use `page.waitForTimeout` outside of debugging.

## Running checks before pushing

```bash
npm run test
npm run lint
```

If you added an external test, also run:

```bash
npm run test:external
```

## Pull request checklist

- [ ] Branch name follows the convention above
- [ ] Commits use Conventional Commits
- [ ] Tests pass locally (`npm run test`)
- [ ] New tests are tagged appropriately (`@smoke` / `@regression` / `@external` / etc.)
- [ ] No raw selectors in spec files
- [ ] No hardcoded URLs or credentials
- [ ] README / docs updated if behavior or structure changed

## Reporting bugs

Open an issue using the **Bug report** template and include:

- Steps to reproduce
- Expected vs actual behavior
- Browser / OS / Node version
- Trace or screenshot if available

## Suggesting features

Open an issue using the **Feature request** template and describe the use case.

Thanks for contributing!
