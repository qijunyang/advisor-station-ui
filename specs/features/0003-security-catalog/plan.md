# Technical Plan — Security Catalog

Status: Approved for implementation by the user's request on 2026-10-30.

## Design

- Add readonly `Security`/`SecurityType` contracts and `SecurityService.getSecurities()` in `src/services/securities/`.
- Put 40 deterministic real metadata records in `src/mocks/securities.ts`, consumed only by `MockSecurityService`. Return frozen copies so callers cannot corrupt the seed catalog.
- Add TanStack Query, following the project stack. Its documented stale-time and garbage-collection policies implement the agreed cache behavior without a separate cache in the service.
- Add `src/app/AppDataProvider.tsx` above routing/auth with one QueryClient per mounted app, retained across session changes. Inject the service through a React context under `src/shared/hooks/`; a future HTTP service can replace it at composition time.
- Add `useSecurities()` using one global key `['securities', 'catalog']`, `staleTime: 300000`, `gcTime: 300000`, no retries, no polling, and stale refetch on mount/focus/reconnect. Return the typed query result, including data, initial loading, fetching, errors, and explicit refetch.
- A cache instance represents one catalog/service source. Do not swap service implementations within a live cache without clearing that catalog; separate test instances use separate QueryClients.
- Do not fetch until a consumer uses the hook, or add a selection UI or dashboard widget in this feature.
- Include `exchange` on every record. Keep the 40-record snapshot's provenance in the fixture comments and README; no runtime market-data requests are introduced.
- Add a pure `filterSecurities` utility and accept optional search text in `useSecurities(search)`. Use query `select` for each consumer's trimmed, case-insensitive symbol/name substring view while retaining the same full-catalog key and freshness settings. Do not filter by exchange or add search UI.

## Tests

Colocate service tests and hook tests. Service tests verify fields, type distribution, stable ordering/IDs, Promise results, readonly typing, and seed immutability. Inject controlled Promise-based services for hook empty/failure cases.

Hook tests use fresh clients, controlled Promises, and fake time. Verify concurrent deduplication, fresh reuse, stale refresh at 300 seconds, no timer polling, focus/reconnect triggers, explicit fresh refetch, empty caching, failure/retry, stale data retained on refresh failure, inactive GC, and independent caches. A provider integration test changes auth identity and verifies the same catalog entry survives. Clear clients and restore timers/event managers between tests.

Keep all current coverage thresholds and run the existing Chromium login/workspace regression suite after provider integration. No new catalog E2E workflow is necessary because no UI is added.

Test filtering independently for blank text, symbol/name partial matching, case, whitespace, punctuation, no results, stable order, and no mutation. Hook tests verify search changes and simultaneous distinct filters reuse a single service load and keep all 40 records in the underlying cache.

## Execution

Implement service/types/fixtures, then provider/hook, then service/hook tests, README, and final `npm run verify`. All work stays uncommitted on `0003-security-catalog` pending review. CI/CD and deployment remain deferred.
