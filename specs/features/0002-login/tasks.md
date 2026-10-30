# Tasks — Demo Login

Status: Implemented; local verification evidence is recorded below. Changes remain uncommitted for user review.

## Review

- [x] Review and approve `spec.md` and `plan.md`, including persistent lifetime, routes, the hardcoded directory and three-region workspace, and failure behavior.

## Implementation — Coder

- [x] Read project and coder instructions; inspect skeleton code/tests and verify compatibility before adding the routing dependency.
- [x] Define strict firm, advisor, directory, versioned session, and future scope types. (AC-02, AC-03, AC-06)
- [x] Add readonly hardcoded constants for Northstar Advisory and Harborview Wealth, each with the three advisors specified in the spec. Use them directly without a directory service or backend. (AC-02)
- [x] Implement a namespaced localStorage adapter with explicit read/write/remove failure handling and preservation of unrelated keys. (AC-03, AC-07, AC-08)
- [x] Implement runtime session validation, UUID/version checks, and firm/advisor membership checks. (AC-07)
- [x] Implement shared-session coordination: restore/reuse, fresh UUID on login, duplicate submission prevention, logout, storage/focus synchronization, and listener cleanup. (AC-03 through AC-05, AC-08)
- [x] Add a structured firm/advisor/session scope for future mock-data keys without creating financial datasets. (AC-06)
- [x] Add `/login`, root entry redirect, protected `/workspace`, and guarded unknown-route behavior without exposing content during validation. (AC-01, AC-04, AC-09)
- [x] Build accessible firm/advisor selection and session initialization/storage-error UI. Do not add async directory states. (AC-02, AC-08)
- [x] Build the workspace with a top action bar containing the advisor name and Logout, a left navigation panel with Dashboard, and a right router work area with a Dashboard placeholder. Show firm context and demo designation. (AC-03, AC-05)
- [x] Configure per-file 90% coverage thresholds for modules implementing access and firm-membership rules; retain overall 80% thresholds. (AC-10)
- [x] Update README for lifecycle, sharing boundary, test resets, and deferred data isolation. (AC-11)
- [x] Self-verify and hand off uncommitted changes on `0002-login`.

## Unit/Component Verification — Unit-Test Role

- [x] Read role instructions and derive expectations from approved acceptance criteria.
- [x] Test session shape/version/UUID/membership validation, including mismatched firms/advisors and obsolete data. (AC-07)
- [x] Test namespaced persistence and failures without clearing unrelated data. (AC-03, AC-07, AC-08)
- [x] Test stable scopes within a session and different scopes for independent sessions. (AC-06)
- [x] Test the fixed two-firm/three-advisor directory, selection/filtering, keyboard activation, duplicate submissions, workspace regions/Dashboard outlet, and storage failures. (AC-02, AC-03, AC-08)
- [x] Test restoration, route guards, logout, cross-tab event reconciliation, focus refresh, and subscription cleanup. (AC-01, AC-04, AC-05, AC-09)
- [x] Update skeleton expectations for the approved login behavior; preserve still-valid assertions.
- [x] Run coverage and ESLint; report all four overall metrics and each critical file's metrics. Report defects to the coder and rerun affected tests after fixes. (AC-10)

## Browser Verification — E2E Role

- [x] Read role instructions and map browser acceptance criteria to Playwright scenarios.
- [x] Test logged-out direct access, firm/advisor selection, displayed context, all three workspace regions, Dashboard navigation, keyboard selection, and refresh against the production build. (AC-01 through AC-04, AC-09)
- [x] Test malformed/obsolete/cross-firm session records and preservation of unrelated browser storage. (AC-07)
- [x] Test two tabs sharing the same ID, login/logout/session replacement propagation, and history behavior after logout. (AC-04, AC-05, AC-09)
- [x] Test separate browser contexts selecting the same advisor get different session IDs/scopes. (AC-06)
- [x] Test login-route redirect for active sessions and logged-in unknown-route recovery. (AC-04, AC-09)
- [x] Run Chromium workflows and ESLint; report failures, delegated component-only cases, and untested browsers. Rerun checks affected by fixes. (AC-08, AC-10)

## Final Verification

- [x] Run `npm run verify` against final changes and record acceptance evidence. (AC-10)
- [x] Review README against actual behavior, including persistence across browser restarts and same-origin sharing. (AC-11)
- [x] Report defects, coverage, exclusions, and remaining risks; leave changes uncommitted pending user review and authorization.
- [x] Keep CI/CD, production authentication, financial mock stores, hosting, and deployment out of this feature.

## Verification Evidence — 2026-10-30

- Clean `npm ci`: passed; npm reported zero known dependency vulnerabilities at installation time.
- `npm run verify`: passed TypeScript, ESLint with zero errors/warnings, unit coverage, production build, and Chromium E2E checks.
- Unit/component results: 48 tests passed across 6 files; no failed or skipped tests.
- Overall coverage: statements 100%, lines 100%, functions 100%, branches 100%.
- Critical-file coverage: all four metrics reached 100% in AppRoutes, sessionValidation, SessionProvider, SessionGuard, LoginPage, and WorkspaceLayout. Each has explicit 90% thresholds.
- Existing coverage exclusions remain tests, shared test infrastructure, and declarations; no application entry or access code is excluded. The interface-only types module has no executable statements.
- Browser results: 16 Chromium tests passed against the production build; no failed or skipped tests. Firefox and WebKit were not tested.

| Criteria | Evidence |
|---|---|
| AC-01 | Component and browser tests verify logged-out entry/workspace/unknown-route redirects without workspace navigation. |
| AC-02 | Directory tests verify two firms/three advisors and unique IDs; component/browser tests verify filtering and keyboard entry. |
| AC-03 | Component/browser tests verify persisted login, visible firm/advisor, action bar/navigation/work area, and Dashboard. Provider test verifies repeated submissions reuse one UUID. |
| AC-04 | Browser tests verify refresh, root/login redirects, and a second tab sharing the same session. |
| AC-05 | Browser tests verify shared login/logout/reselection and replacement/clearing; component tests verify focus/visibility reconciliation and listener cleanup. |
| AC-06 | Browser tests verify separate contexts selecting the same advisor get different IDs and retain independent login state. Unit tests verify scope stability/separation. |
| AC-07 | Unit/browser tests reject malformed, obsolete, unknown, and cross-firm records and preserve unrelated storage. |
| AC-08 | Unit/component tests verify initialization and storage read/write/removal failures, error feedback, and recovery without false success. No directory loading/service behavior exists. |
| AC-09 | Browser tests verify deep links, refresh, history guarding after logout, and authenticated not-found recovery. |
| AC-10 | Clean installation and the final full verification command passed with the results above. |
| AC-11 | README updated for demo selection, workspace regions, namespaced persistence/lifetime, shared origins/tabs, reset strategy, and future data isolation. |

No known application defects remain from completed checks. This is simulated access control and does not implement financial data isolation or production authorization. No CI/CD or deployment work was added. All changes remain uncommitted on `0002-login` for user review; no push or PR has been performed.
