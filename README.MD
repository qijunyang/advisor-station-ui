# Advisor Station UI

A frontend-only React, TypeScript, and Vite foundation for a fictional financial advisor demo. The first feature provides one minimal page and local unit/component and browser test tooling. It has no backend, authentication, financial calculations, or persistent data.

## Prerequisites

- Node.js 24.22.1 (the baseline in `.nvmrc`); supported range: Node 24.22.1 or newer within Node 24.
- npm 11 (verified with 11.19.1).

The dependency lockfile fixes the installed versions. Node 24 is an LTS release compatible with the selected tools; see the official [Node release schedule](https://github.com/nodejs/Release), [Vite requirements](https://vite.dev/guide/), and [Vitest requirements](https://vitest.dev/guide/).

## Setup and Development

```sh
npm ci
npx playwright install chromium
npm run dev
```

Open the local address printed by Vite (normally `http://127.0.0.1:5173`). The browser download is required once after setup and again when a Playwright update changes its browser version. On Linux, use `npx playwright install --with-deps chromium` when browser system libraries also need installation.

For environments using a trusted corporate certificate authority, Node can use the system certificate store with `NODE_USE_SYSTEM_CA=1`; do not disable TLS verification. In PowerShell, set `$env:NODE_USE_SYSTEM_CA='1'` before the installation commands when needed.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the local development server with hot reload. |
| `npm run typecheck` | Strictly type-check application, tests, and TypeScript configuration files without emitting output. |
| `npm run lint` | Run ESLint on source, tests, and configuration with zero warnings allowed. |
| `npm test` | Run colocated unit/component tests once. |
| `npm run test:coverage` | Run unit/component tests and enforce coverage thresholds. |
| `npm run build` | Produce the production bundle in `dist/`. Run type checking separately or use `verify`. |
| `npm run preview` | Serve the existing production build locally, normally on port 4173. |
| `npm run test:e2e` | Run Chromium browser tests against the existing production build. |
| `npm run verify` | Run type checks, ESLint, unit coverage, build, and E2E tests sequentially; stop on any failure. |

Run `npm run verify` for the complete local acceptance check. For E2E checks alone, first run `npm run build`, then `npm run test:e2e`. Playwright starts and stops its own preview server at `http://127.0.0.1:4173`; leave that port free. It deliberately does not reuse an existing server, so it cannot accidentally test another app.

## Layout

```text
src/
  App.tsx                 Minimal demo page
  App.test.tsx            Component behavior test beside its source
  main.tsx                React mounting entry point
  main.test.tsx           Entry-point mounting and missing-root tests
  styles.css              Minimal page styling
  test/setup.ts           Shared test initialization and DOM cleanup
e2e/app.spec.ts            Browser page-load and refresh workflow
specs/features/           Feature specifications, plans, and checklists
```

Keep future unit/component tests beside their source files, using `.test.ts` or `.test.tsx`. Keep Playwright workflows in `e2e/` using `.spec.ts`. Feature folders and service layers can be introduced when actual features require them.

## Verification Policy

Vitest includes all application TypeScript/TSX files, including files no tests import. It enforces at least 80% statements, lines, functions, and branches overall. Test files, `src/test/` infrastructure, and type declaration files are excluded because they are verification support or contain no executable application behavior. The entry point remains included.

Financial calculations, allocation validation, tenant isolation, and access rules require 90% for each metric per implementing source file under the project rules. None exist in this skeleton, so that higher threshold is currently inapplicable. Add appropriate per-file coverage enforcement when such files are introduced.

Coverage reports are written to `coverage/`; open `coverage/index.html` for the detailed report or read `coverage/coverage-summary.json` for all four metrics. Coverage complements meaningful assertions and does not prove correctness.

Unit/component tests verify page content, semantics, and entry mounting. Shared setup cleans up React Testing Library renders after each test. The entry test resets its DOM and module cache between cases. Browser tests use Playwright's isolated contexts and test page load and refresh against the production build. No external services, fixtures, browser persistence, or real financial data are required. Only Chromium is configured; Firefox/WebKit compatibility is not claimed.

Playwright writes an HTML report to `playwright-report/` and retains failure traces/screenshots under `test-results/`. Open reports with `npx playwright show-report`. Generated dependencies, build output, coverage, and test reports are ignored by Git.

## Deferred Work

CI/CD, hosting, deployment, routing, UI component libraries, query/state libraries, and business features are outside this skeleton. The future hosting direction is GitHub Actions plus a Cloudflare Pages `pages.dev` address, with manually approved deployment from `release`; no workflows or hosting resources are created here.
