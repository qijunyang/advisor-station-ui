# Tasks — Security Catalog

Status: Implemented and locally verified on 2026-10-30. Changes remain uncommitted for review.

- [x] Review specification and record the approved technical plan.
- [x] Add readonly security types, service contract, static real security seed catalog, and mock service. (AC-01, AC-02)
- [x] Add TanStack Query, application-level cache/provider, service injection, and reusable hook. (AC-03 through AC-07)
- [x] Verify service metadata, deterministic results, and immutable seed handling. (AC-01, AC-02)
- [x] Verify concurrent load sharing, 300-second freshness boundary, no polling, and refetch triggers with controlled time. (AC-03, AC-04)
- [x] Verify loading/success/empty/failure/background-refresh states and explicit refresh/retry. (AC-05)
- [x] Verify inactive retention/GC, independent cache instances, and shared catalog across auth changes. (AC-06, AC-07)
- [x] Update README with usage, cache policies, scope, and replacement contract. (AC-09)
- [x] Run type checks, ESLint, coverage, production build, and existing Chromium E2E regressions. (AC-08)
- [x] Verify real symbols/names and listing exchanges against official Nasdaq Trader directories and replace the fixture with 40 records. (AC-01)
- [x] Add/test local symbol-or-name partial filtering without additional loads/cache entries. (AC-10)
- [x] Record results/risks and leave changes uncommitted for review.

## Verification Evidence — 2026-10-30

| Criteria | Evidence |
|---|---|
| AC-01, AC-02 | Service tests verify 40 valid real securities: 20 stocks, 18 ETFs, and 2 listed bonds, unique stable IDs, deterministic order, Promise/readonly contracts, frozen results, and protection of future seed loads. Controlled hook services verify empty/failure contracts. |
| AC-03 | Hook tests verify concurrent in-flight deduplication and fresh-cache reuse across consumers/remounts. |
| AC-04 | Fake-time tests verify the completion-based freshness boundary at 299,999/300,000 ms, no polling after expiry, and stale refetch on mount, focus, and reconnect. |
| AC-05 | Controlled Promises verify initial loading/success, empty success, initial failure without automatic retries, explicit fresh refetch, background refreshing, retained data/age after refresh failure, and recovery. |
| AC-06 | Tests verify inactive data exists immediately before its 300-second retention boundary, is collected at the boundary, and reloads afterward. Separate cache instances load independently. |
| AC-07 | Provider integration test logs in, logs out, and changes firm/advisor while retaining one catalog cache entry and one service load. |
| AC-08 | Final `npm run verify` passed TypeScript, ESLint (zero errors/warnings), 77 unit/component/hook tests in 10 files, production build, and all 16 existing Chromium E2E tests. Statements, lines, functions, and branches each reached 100%; existing critical thresholds/exclusions remain unchanged. |
| AC-09 | README documents the shared-service convention, hook/provider usage, fields, source snapshot, filtering, cache lifecycle, failure/refresh behavior, and boundaries. |
| AC-10 | Pure-filter tests cover case/whitespace/literal punctuation, partial symbol OR name, blank/no results, and source-order preservation. Hook tests verify changing text and concurrent different filters retain all 40 cached records under one key and one load. |

Dependency installation succeeded and npm reported zero known vulnerabilities at installation time. An additional clean `npm ci` attempt was blocked by a Windows native-module file lock from the user's running Vite server. `npm install` restored dependencies successfully, retaining a warning about the locked old module; the full verification above then passed. The development server was not stopped. A clean-install recheck can be performed after stopping it.

No known feature defects remain from these checks. Only Chromium was tested. No selection UI, prices, customer holdings, CI/CD, hosting, or deployment was added. All changes remain uncommitted on `0003-security-catalog`; commit/push/PR require explicit authorization.
