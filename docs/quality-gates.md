# Quality Gates

CI is defined in `.github/workflows/quality-gate.yml` and is the single
authoritative pipeline (it replaced the older `playwright-ci.yml` so the same
tests don't run twice). Each quality dimension is its own job, giving an
independent, visible status check; the deterministic ones are aggregated into a
required **Quality Gate**.

## Pipeline topology

```
                ┌─────────────────┐
                │ lint-typecheck  │  (tsc + cspell)
                └────────┬────────┘
   ┌─────────────┬───────┼────────┬──────────────┐
   ▼             ▼       ▼         ▼              ▼
┌────────┐  ┌────────┐ ┌────────┐ ┌────────────┐ ┌────────────┐
│functional│ │ a11y  │ │security│ │performance │ │  visual    │
│  (req)  │  │ (req) │ │ (req)  │ │(non-block) │ │(non-block) │
└────┬────┘  └───┬───┘ └───┬────┘ └────────────┘ └────────────┘
     └───────────┴─────────┘                       ┌────────────┐
                 ▼                                  │  k6-load   │
        ┌─────────────────┐                         │(non-block) │
        │  quality-gate   │  ← required status      └────────────┘
        └─────────────────┘
```

## Blocking vs non-blocking

**Blocking** (must pass — these gate the PR):

| Job | Script | Why it's safe to block |
|-----|--------|------------------------|
| `lint-typecheck` | `npm run typecheck` + cspell | Deterministic |
| `functional` | `npm run test:functional` | Deterministic E2E + API |
| `accessibility` | `npm run test:a11y` | Deterministic WCAG audit |
| `security` | `npm run test:security` + `npm audit` | Deterministic |

**Non-blocking** (`continue-on-error: true` — informational showcase):

| Job | Script | Why not blocking |
|-----|--------|------------------|
| `performance` | `npm run test:performance` | Timing varies on shared runners |
| `visual` | `npm run test:visual` | Needs Linux baselines (see below) |
| `k6-load` | `k6 run performance/k6/api-load.js` | Demonstrative load, separate toolchain |

The `quality-gate` job `needs` only the blocking jobs, so a red performance or
visual run never blocks a merge — but the result is still visible.

## Speed & cost

- Test jobs run **inside** `mcr.microsoft.com/playwright:v1.59.1-jammy`, so the
  browsers are already present — no `playwright install` per job.
- `concurrency` cancels superseded runs on the same ref.
- Artifacts (HTML reports) upload on every run with short retention.

## Visual baselines across platforms

Playwright stores screenshot baselines **per platform**
(`*-chromium-win32.png` locally, `*-chromium-linux.png` in CI/Docker). Windows
baselines are committed for local dev. To make the CI `visual` job green, run the
**Update Visual Baselines** workflow (`visual-baseline.yml`, `workflow_dispatch`)
once — it generates the Linux baselines in the Playwright container and commits
them back. After that you can promote `visual` to a blocking job if desired.

## Running the gate locally

```bash
npm run typecheck          # lint-typecheck
npm run test:functional    # functional
npm run test:a11y          # accessibility
npm run test:security      # security
npm run test:performance   # performance (non-blocking)
# Visual + Linux baselines:
docker compose run --rm e2e npm run test:visual:update
```

Or run the whole non-external suite in one go (inside Docker/CI, where Linux
baselines exist):

```bash
npm run test:quality
```
