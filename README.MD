# Advisor Station UI

A frontend-only React, TypeScript, and Vite application for a fictional financial advisor demo. Choose a fictional firm and advisor to enter a Dashboard workspace. No backend, passwords, real authentication, or live financial data are used.

## Demo Login and Workspace

Opening the app without a valid session redirects to `/login`. Select one of these hardcoded firms and then an advisor:

| Firm | Advisors |
|---|---|
| Northstar Advisory | Emma Parker, Liam Bennett, Olivia Hayes |
| Harborview Wealth | Noah Brooks, Ava Collins, Ethan Reed |

There is no directory service or backend request. Selecting an advisor opens `/workspace`, which has a top action bar with the advisor name and Logout, a left navigation panel with Dashboard, and a right routed work area containing a default Dashboard placeholder. The selected firm and demo designation are also displayed.

The versioned `{ version, firmId, advisorId, sessionId }` record is stored under `advisor-station.auth.v1` in `localStorage`. New logins generate a UUID; refresh, new tabs, and browser restarts reuse it until logout, invalidation, or storage clearing. All tabs at the same origin in the same browser profile share the selected session. Login, logout, and replacement synchronize using storage events; focus/visibility reconciliation recovers missed changes. The latest persisted selection wins; tabs do not have independent sessions or transactional guarantees.

Different origins (including ports), browsers, profiles, or storage partitions have independent sessions. Logout removes only the session key. A later login generates a new ID. Invalid schema/version/UUID or mismatched firm/advisor data cannot open the workspace. Storage failures show an error instead of claiming successful login/logout.

Future mock-data scope keys contain `firmId`, `advisorId`, and `sessionId`. This feature defines the scope but does not implement financial datasets or mutable storage. Future services must copy seed data and isolate mutations by the full scope; unique session IDs alone do not isolate shared mutable data. Demo route guards are client-side simulations, not production authorization.

## Models and Portfolios Layout Preview

Workspace navigation now includes Dashboard, Models (`/workspace/models`), and Portfolios (`/workspace/portfolios`). These routes use the existing login guard and keep the advisor/logout header and navigation available while their tables scroll. On narrow screens, wide tables scroll horizontally inside their own keyboard-focusable region.

Models displays 12 static fictional research rows with name, created/updated dates, and updated-by text. Each row has a labeled checkbox; select-all supports mixed selection, a count announces the current selection, and Clear selection resets it. Selection is local presentation state and resets on page navigation, refresh, or a changed firm/advisor/session scope. Create and Delete selected are visibly disabled with an explanation because creation, editing, and deletion are not implemented yet.

Portfolios displays 10 static fictional broker-copy rows with name, broker, sample last-sync date, and source. It has no row selection, create/edit/delete controls, or import/sync action. The displayed dates are illustrative, not evidence of a real broker connection. Model/portfolio names are plain text; details and positions are deferred.

These globally shared layout examples are labeled as fictional sample data and are not advisor-owned records. For this UI-first feature, the page components use feature-local readonly preview constants directly rather than introducing business services or network requests. Model/portfolio domain contracts, ownership, persistent data, positions, cash/trading rules, quote integration, and broker synchronization will be defined separately. Empty-table states are component-tested.

## Shared Security Catalog

Security metadata is available through `SecurityService.getSecurities(): Promise<readonly Security[]>` in `src/services/securities/`. Each readonly record has a stable unique `id`, display `symbol`, real `name`, listing `exchange`, and `type` (`stock`, `etf`, or `bond`). The mock returns exactly 40 real instruments in deterministic order: 20 stocks, 18 ETFs, and 2 exchange-listed senior notes classified as bonds. Bond ETFs retain type `etf`. Results and records are frozen copies; callers cannot corrupt the seed catalog. Symbols are display values, not unique selection IDs.

Application components use the shared hook rather than importing fixtures or managing their own caches.

The static metadata snapshot was checked on 2026-10-30 against Nasdaq Trader's [Nasdaq-listed directory](https://www.nasdaqtrader.com/dynamic/SymDir/nasdaqlisted.txt), [other-listed directory](https://www.nasdaqtrader.com/dynamic/SymDir/otherlisted.txt), and [exchange definitions](https://www.nasdaqtrader.com/Trader.aspx?id=SymbolDirDefs). It is test data, not a live catalog. Real public instrument metadata is explicitly approved for this feature; firms, advisors, and future customer fixtures remain fictional.

`useSecurities(search)` accepts optional text and returns case-insensitive partial matches on symbol OR name. Outer whitespace is ignored; blank search returns all 40 records, while unmatched text returns an empty successful list. Matching is literal, preserves order and exchange metadata, and does not search exchange labels. Each consumer filters its own view of one full cached catalog. Typing does not trigger another service call or create another cache entry. A search field/selector UI remains future work.

```tsx
import { useSecurities } from './shared/hooks/useSecurities';

// Inside a component rendered beneath AppDataProvider:
const { data, isLoading, isFetching, isLoadingError, isRefetchError, error, refetch } = useSecurities(search);
// data: readonly Security[] | undefined; an empty array is a valid success.
// isLoading: initial fetch; isFetching: any fetch, including background refresh.
// isLoadingError: no successful data; isRefetchError: refresh failed, previous data remains.
// Call refetch() from a retry/refresh interaction, including while cached data is fresh.
```

The app's `AppDataProvider` owns one TanStack Query client above routing and auth. The catalog key is `['securities', 'catalog']`, shared across firms, advisors, and sessions because this metadata is identical for everyone. Auth changes do not clear it. No catalog page or selector is added yet, and no catalog fetch occurs until the hook is used.

Successful data stays fresh for **300 seconds from load completion**. Ordinary mounts, refocus, and reconnection reuse fresh data and may refresh stale data. Time passing alone does not start a fetch: there is no polling. Manual `refetch()` can bypass the freshness window. Concurrent consumers share the same load.

During background refresh, previously loaded data remains available. A refresh failure retains that data and exposes the error. Initial failures have no successful data, and retries are explicit rather than automatic. Empty successful results are cached normally. Inactive entries are eligible for collection 300 seconds after their final consumer unsubscribes; this retention is separate from freshness.

Caching is in memory per mounted app/tab. Full reloads, separate tabs, and new cache instances may load independently. No browser-storage persistence or cross-tab catalog synchronization is used. Future firm-specific catalogs must include firm scope in both service requests and query keys. This global metadata exception does not change the isolation rules for models, portfolios, or session data.

To replace the mock with a future HTTP service, implement the same `SecurityService` interface and supply it through `<AppDataProvider securityService={service}>`. A cache represents one data source: replace the provider/cache together, or clear the catalog before changing the service in a running app. The raw service itself has no five-minute cache; use the hook to get this behavior.

Service tests sit beside `MockSecurityService.ts`; cache tests sit beside `useSecurities.ts`. Tests use controlled Promises, isolated clients, and fake time for freshness and collection boundaries. Provider integration tests verify reuse across auth changes. Fixtures stay behind the service in `src/mocks/securities.ts`.

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
  App.tsx                 Router and session-provider composition
  App.test.tsx            Integrated route and component behavior tests
  app/AppRoutes.tsx       Login, entry redirect, guarded workspace, not-found routes
  app/AppDataProvider.tsx Shared query cache and security service injection
  services/securities/    Shared metadata types, service contract, and mock implementation
  shared/hooks/          Reusable security query hook and service context
  mocks/securities.ts    Static real security metadata consumed only by the mock service
  features/auth/          Hardcoded directory, session validation, persistence, coordination, and login UI
  features/workspace/     Top action bar, left navigation, Dashboard, and routed content outlet
  main.tsx                React mounting entry point
  main.test.tsx           Entry-point mounting and missing-root tests
  styles.css              Login and responsive workspace styling
  test/setup.ts           Shared test initialization and DOM cleanup
e2e/                      Login, shared tabs, independent contexts, invalid sessions, and refresh workflows
specs/features/           Feature specifications, plans, and checklists
```

Keep unit/component tests beside their source files, using `.test.ts` or `.test.tsx`. Keep Playwright workflows in `e2e/` using `.spec.ts`. Tests covering routing composition are colocated with App. Firm/advisor constants are used directly as required for this demo; future asynchronous business data should follow project service contracts.

## Verification Policy

Vitest includes all application TypeScript/TSX files, including files no tests import. It enforces at least 80% statements, lines, functions, and branches overall. Test files, `src/test/` infrastructure, and type declaration files are excluded because they are verification support or contain no executable application behavior. The entry point remains included.

Financial calculations, allocation validation, tenant isolation, and access rules require 90% for each metric per implementing source file. Per-file thresholds currently cover `AppRoutes.tsx`, `sessionValidation.ts`, `SessionProvider.tsx`, `SessionGuard.tsx`, `LoginPage.tsx`, and `WorkspaceLayout.tsx`, which implement session access and firm/advisor rules. Extend enforcement as new critical files are added.

Coverage reports are written to `coverage/`; open `coverage/index.html` for the detailed report or read `coverage/coverage-summary.json` for all four metrics. Coverage complements meaningful assertions and does not prove correctness.

Unit/component tests verify session validation, scopes, persistence failures, synchronization, routing, login, layout, and entry mounting. Shared setup cleans up React Testing Library renders after each test. Session tests restore mocks and reset test storage; the entry test resets its DOM and module cache between cases. Browser tests use fresh isolated contexts; two pages in one context verify shared tabs, while separate contexts verify independent visitors. Invalid-session tests seed only the namespaced key and a disposable unrelated key in isolated contexts. Storage failures are injected at unit/component level without adding failure controls to the app. Only Chromium is configured; Firefox/WebKit compatibility is not claimed.

Playwright writes an HTML report to `playwright-report/` and retains failure traces/screenshots under `test-results/`. Open reports with `npx playwright show-report`. Generated dependencies, build output, coverage, and test reports are ignored by Git.

## Deferred Work

CI/CD, hosting, deployment, UI component libraries, additional state libraries, production authentication, and financial business features remain deferred. The future hosting direction is GitHub Actions plus a Cloudflare Pages `pages.dev` address, with manually approved deployment from `release`; no workflows or hosting resources are created here.
