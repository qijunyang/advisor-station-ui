# Technical Plan — Demo Login

Status: Approved for implementation by the user on 2026-10-30.

## Baseline

The skeleton has a single App page, React/TypeScript/Vite, colocated Vitest tests, and a Playwright smoke test. No router or session model exists. Retain the existing local verification workflow; CI/CD remains deferred.

## Proposed Organization

```text
src/
  app/                         # Router and application providers
  features/auth/
    components/                # Login page and route guard
    hooks/                     # Session coordination
    storage/                   # Namespaced session persistence adapter
    sessionValidation.ts       # Runtime shape, version, UUID, and membership validation
    sessionScope.ts            # Typed future mock-data scope/key
    types.ts                   # Firm, advisor, directory, and AuthSession contracts
    authDirectory.ts           # Typed hardcoded firms/advisors; no service layer
  features/workspace/          # Top action bar, left navigation, right routed work area
e2e/auth.spec.ts               # Browser workflow and cross-tab/context scenarios
```

Keep unit/component tests beside their source files. Split modules only when they have a clear responsibility. Update the skeleton tests to assert the new approved route behavior rather than retaining obsolete root-page expectations.

## Dependencies and Presentation

Add React Router for route guards, deep links, and the workspace content outlet. Use the hardcoded typed directory directly for selection and validation, as explicitly requested by the user; this overrides the general mock-service convention for this directory. Do not add TanStack Query, a directory service, backend calls, or artificial async directory states. Verify current official compatibility guidance when implementing. Keep styles simple using the existing CSS unless a component library is justified during review. No form framework or client-state library is needed for button-based selection.

## Directory and Session Contracts

- `authDirectory.ts` exports readonly typed constants for exactly the firms/advisors in the spec. Components and validation use these constants directly. Keep firm/advisor IDs stable and avoid duplicating directory definitions.
- Versioned session shape: `{ version: 1, firmId, advisorId, sessionId }`. Generate IDs through `crypto.randomUUID()` only for a new login.
- Storage adapter owns one namespaced key, for example `advisor-station.auth.v1`, serialization, and fallible read/write/remove operations. Never clear all browser storage.
- Pure validation checks parsed unknown data for schema/version, nonempty IDs, valid UUID shape, and directory membership. Treat invalid records as unauthenticated; never interpret stored values as real authorization.
- Define a structured scope tuple such as `['demo', firmId, advisorId, sessionId]` for future keys. Do not introduce mutable financial data just to demonstrate it.

## Lifecycle and Cross-Tab Coordination

1. Read storage and validate synchronously against the hardcoded directory before allowing workspace rendering. If initialization needs an intermediate state, keep the workspace hidden; do not simulate network loading.
2. Firm selection changes the offered advisors. Advisor selection validates against the current directory, prevents duplicate in-flight submissions, creates the session, persists successfully, then publishes state and navigates home.
3. Subscribe to the session key's `storage` events, including `key === null` for external storage clearing, and reconcile from current storage rather than trusting an event's possibly stale payload. Reconcile on focus/visibility return as needed. Remove listeners on unmount.
4. Since the writing tab receives no storage event for its own change, update its session state directly after persistence succeeds. Other tabs read the same stored record without generating IDs.
5. Logout removes the namespaced session before publishing logged-out state. Report removal failure and avoid claiming a shared logout that did not persist.
6. Storage read failures block workspace access with an actionable message. Do not silently fall back to an independent in-memory session that breaks the sharing requirement.
7. Latest persisted selection wins across tabs. No locking/transaction guarantees are promised. Revalidate current storage before entry and when returning to a tab; never overwrite a newer session in response to a stale event.

React context coordinates the active session and actions. The firm/advisor directory is a static module with no query layer. Session switches must immediately replace the displayed context; future resource caches must be scoped by the full session tuple. Shared financial mock-data isolation remains future work.

## Routing

Use a browser router, public `/login`, an entry redirect at `/`, and guarded `/workspace`/unknown routes as defined in the spec. Redirect with replacement when entering/leaving login due to session state. A valid logged-in unknown route renders a simple not-found page. Compose the workspace from a top action bar (advisor name, firm context, demo designation, Logout), a left navigation landmark with a Dashboard link, and a right main area containing the router outlet. The workspace index renders only a Dashboard placeholder. Keep the layout usable at narrow widths without overlapping controls; additional business pages are out of scope. No external redirect targets. Verify direct URL requests against the Vite production preview; hosting configuration is separate work.

## Unit and Component Verification

- Validate good/bad session shapes, UUID/version checks, unknown and cross-firm membership, and stable/different scope keys. (AC-03, AC-06, AC-07)
- Verify storage serialization, preservation of unrelated keys, and read/write/remove failures. (AC-07, AC-08)
- Verify login selection, selected-firm filtering, session initialization/storage error states, duplicate-click handling, route guards, and active-session display. (AC-01 through AC-04, AC-08, AC-09)
- Verify storage/focus reconciliation, listener cleanup, logout, session replacement, and malformed-record handling using controlled storage adapters/events. (AC-05, AC-07, AC-08)
- Enforce 80% across all four metrics overall and 90% per file for sessionValidation, access guards, and any other module implementing access or firm-membership rules. Do not exclude unimported source or lower thresholds. (AC-10)

## E2E Verification

Run Chromium against the production build with fresh browser contexts for independent tests. Use two pages within one context for shared-session scenarios and separate contexts for independent visitors. Clear or seed only the namespaced session key for test setup; avoid fixed sleeps.

Cover logged-out redirects, firm/advisor selection, refresh, login-route redirect, keyboard selection, invalid sessions/cross-firm IDs, logout/history guarding, two-tab login/logout/replacement synchronization, and different-context IDs for the same advisor. Inspect the persisted ID for equality/difference assertions; verify visible firm/advisor context as well. (AC-01 through AC-07, AC-09)

Keep difficult storage-access failures at unit/component level, documenting why they do not require public failure controls. Verify the three workspace regions, Dashboard navigation, selected-advisor action bar, and logout through browser tests. (AC-08)

## Execution and Review

1. User reviews and approves spec/plan/tasks, including proposed details.
2. Coder implements contracts, storage, validation, routing, UI, and README.
3. Unit-test role verifies behavior and coverage; coder fixes defects.
4. E2E role verifies browser workflows; coder fixes defects and affected checks rerun.
5. Run `npm run verify`, report acceptance evidence and critical-file coverage, and leave work uncommitted for review.

All roles stay on `0002-login`. No commit, push, PR creation, merge, external account configuration, or deployment without explicit authorization.
