# 0003 — Security Catalog

Status: Approved for implementation by the user on 2026-10-30.
Branch: `0003-security-catalog`

## Goal

Provide a shared, typed catalog of real security metadata for future model and portfolio selection, with cached metadata that remains fresh for 300 seconds.

A security is an instrument available for selection. It is not a holding or position: quantities, account ownership, prices, and allocations are outside this catalog.

## Scope

- Shared security contracts and a Promise-based service under `src/services/securities/`.
- An initial mock implementation returning static real security metadata without external network access.
- A reusable React query hook under `src/shared/hooks/` for loading, caching, refreshing, and reporting failures.
- Application-level query cache setup so multiple consumers share the same catalog within one app instance.
- Unit/hook tests, appropriate regression checks, and documentation.

The folder layout is the agreed shared-service convention. Library choice and detailed module design belong in the subsequent technical plan.

## Security Metadata

Each record has exactly the required catalog fields:

| Field | Requirement |
|---|---|
| `id` | Stable, nonempty, unique string identifying the security. Used as the selection identity. |
| `symbol` | Nonempty display symbol. Do not use it as the unique identifier or assume it identifies an exchange listing globally. |
| `name` | Nonempty real security name from the documented static source snapshot. |
| `type` | Initially one of `stock`, `etf`, or `bond`. Additional types require an explicit contract extension. |
| `exchange` | Nonempty listing-exchange display label, initially `NASDAQ` or `NYSE Arca`; not a claim about every venue where the security trades. |

The fixture contains exactly 40 real securities: 20 stocks, 18 ETFs, and 2 exchange-listed senior notes classified as bonds, with stable IDs and deterministic ordering. Bond ETFs remain ETFs. Names, symbols, and listing exchanges come from Nasdaq Trader symbol-directory snapshots checked on 2026-10-30. No customer data, prices, or live data feeds are included. The user explicitly authorized real public security metadata, overriding the project fictional-data rule only for this catalog. Consumers must not mutate the shared catalog or its records; the service and hook expose readonly contracts.

## Service Behavior

1. Expose a typed asynchronous list operation equivalent to `getSecurities(): Promise<readonly Security[]>`.
2. Keep fixture access behind the mock service; UI components and hooks must not import fixture data directly.
3. Allow a future HTTP implementation to replace the mock implementation without changing consuming components or the list contract.
4. Return an empty list as a valid successful result. Propagate failures rather than converting them into an empty successful result.
5. Separate data access from caching. Consumers use the shared query hook; calling the raw service is not promised to use the hook's cache.

## Cache and Freshness Behavior

1. A successful catalog load is fresh for **300 seconds (300,000 milliseconds)**, measured from successful completion.
2. Consumers requesting the catalog during that interval reuse cached results without an additional service call. Concurrent consumers share an in-flight load for the same catalog.
3. At or after 300 seconds, the result is stale. A new consumer, browser-window refocus, or network reconnection may trigger a refresh while a consumer is active. Do not poll on a five-minute timer or fetch merely because time elapsed without an access/refetch trigger.
4. Stale cached data may remain visible while refreshing. Replace it on success. If refresh fails, retain the last successful catalog and expose the error so future UI can distinguish refresh failure from initial-load failure.
5. Support an explicit refresh/retry action that can request current data even within the freshness interval. Default: no automatic retries; explicit retry keeps behavior predictable for the demo.
6. Empty successful results are cached with the same freshness interval. Failed initial loads are not cached as successful data.
7. Keep inactive successful results for at least the freshness interval. Inactive retention: 300 seconds after the last consumer unsubscribes; garbage collection and freshness are separate concerns.
8. Use an in-memory cache per app/tab. Full page reloads and separate tabs can load their own catalog; persistent storage or cross-tab cache synchronization is not required.

The requested TTL is interpreted as a freshness window, not immediate deletion or a requirement to hide old metadata after five minutes. This interpretation was approved with the implementation request.

## Catalog Scope

Approved scope: all fictional firms, advisors, and sessions use the same public demo catalog. The cache therefore does not include firm, advisor, or session IDs. Login/logout and advisor changes do not invalidate this metadata while the app instance remains active.

This sharing applies only to common security metadata. Future portfolios, models, holdings, or mutable session data must follow their own ownership and session-isolation rules. If the catalog later differs by firm, both the service request and cache key must become firm-scoped before that data is introduced.

## Hook Contract

Accept an optional search string. Apply trimmed, case-insensitive, literal substring matching to symbol OR name; blank search returns all records and no matches returns an empty successful list. Preserve catalog order and metadata fields, including exchange. Exchange is returned for display, not included in this text filter.

Filter each consumer's view of the full cached catalog locally. Changing search text must not reload the service, create a per-search cache entry, or change the full catalog seen by other consumers. A future selector can supply this text; no search input UI is added in this feature.

Consumers can determine:

- The current readonly catalog, if a successful result exists.
- Initial loading versus background refreshing.
- Initial failure versus a failed refresh with previously loaded data.
- Successful empty results.
- How to explicitly refresh/retry.

Do not add a catalog page, selector, or dashboard widget merely to demonstrate the hook. Model/portfolio selection interfaces will use it in a later feature.

## Acceptance Criteria

| ID | Required evidence |
|---|---|
| AC-01 | The shared service contract provides records with stable unique IDs, nonempty real symbols/names, a listing exchange, and supported types. The fixture contains exactly 40 real records: 20 stocks, 18 ETFs, and 2 listed bonds. |
| AC-02 | The mock list operation is Promise-based, deterministic, and exposes readonly results. Tests verify empty success and failure behavior through controlled service implementations. Components/hooks do not import fixtures directly. |
| AC-03 | Multiple hook consumers share a catalog load and its results. Reusing cached success before 300 seconds does not issue another ordinary load. |
| AC-04 | Deterministic clock-controlled tests verify freshness immediately before 300 seconds and staleness at/after the boundary. A refetch trigger refreshes stale data without requiring polling. |
| AC-05 | Tests distinguish initial loading, successful results, empty success, initial failure, background refresh, and refresh failure retaining previous data. Explicit refresh/retry works, including while data is fresh. |
| AC-06 | Inactive-cache retention is configured and tested separately from freshness. Remounting before collection can reuse cached results; app reload or a separate cache instance can load independently. |
| AC-07 | Under the shared-catalog assumption, firm/advisor/session changes do not create separate metadata entries or invalidate the catalog. Session-specific business-data cache rules are not changed. |
| AC-08 | Required TypeScript, ESLint (zero errors/warnings), coverage, production build, and existing login/workspace E2E regression checks pass. Overall statements, lines, functions, and branches remain at least 80%; existing 90% critical-file thresholds remain enforced. |
| AC-09 | README documents service/hook usage, metadata fields, cache scope, the 300-second freshness policy, inactive retention, refresh/error semantics, and the absence of persistent/cross-tab caching. |
| AC-10 | Unit/hook tests verify case-insensitive partial symbol OR name matching, trimming, empty/no-match searches, literal punctuation, preserved order/metadata, and different concurrent filters sharing one full-catalog load/cache. |

## Verification Boundaries

New service and hook behavior is verified through unit/hook tests with isolated query caches, deterministic fixtures, controlled Promises, and fake time. Tests must exercise failure and concurrency behavior without real network access or fixed sleeps.

No new user-facing workflow is introduced, so new catalog-specific browser tests are not required. Existing Chromium login/workspace tests must still pass after application-level provider setup. New financial calculations or access rules are outside scope; do not weaken the existing critical-file thresholds.

## Out of Scope

Model/portfolio creation, selection widgets, pagination, security-detail lookup, real market data, prices, positions/holdings, financial calculations, CRUD, backend endpoints, per-firm catalogs, persistent caches, cross-tab cache sharing, CI/CD, hosting, and deployment.

## Review Decisions

The user authorized completing the plan/tasks and implementing this specification. The shared global catalog, initial types, five-minute freshness/retention, and explicit retry policy are the implementation scope. Changes remain uncommitted pending verification and explicit commit authorization.
