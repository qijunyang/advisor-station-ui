# Tasks — Models and Portfolios Pages

Status: Implemented and locally verified on 2026-10-30. Changes remain uncommitted for review.

- [x] Create the feature branch from current develop and write spec/plan.
- [x] Add minimal shared collection layout and readonly presentation fixtures. (AC-02, AC-04)
- [x] Implement Models table/selection, disabled future actions, and empty state. (AC-02, AC-03, AC-05)
- [x] Implement read-only Portfolios table and empty state. (AC-04, AC-05)
- [x] Add guarded navigation/routes and reset selection on session change. (AC-01, AC-03)
- [x] Implement contained scrolling and responsive layout. (AC-06)
- [x] Add colocated component and route tests, preserving existing assertions. (AC-01 through AC-05)
- [x] Add Chromium navigation/selection/scrolling/guard regressions and inspect screenshots. (AC-01, AC-03, AC-06)
- [x] Update README and run full verification; record metrics and limitations. (AC-07, AC-08)
- [x] Leave all changes uncommitted for user review.

## Verification Evidence — 2026-10-30

| Criteria | Evidence |
|---|---|
| AC-01 | Route/component and browser tests verify Dashboard/Models/Portfolios order, active links, guarded direct access, history, and refresh. |
| AC-02 | Component/browser tests verify 12 labeled model preview rows, audit columns, and disabled future-action buttons without mutations. |
| AC-03 | Tests verify individual, mixed, select-all, keyboard, clear, count, route/refresh reset, and cross-tab session-replacement reset. |
| AC-04 | Component/browser tests verify 10 labeled broker-copy preview rows, read-only columns, and absence of selection/mutation controls. |
| AC-05 | Colocated tests verify both empty tables and disabled selection controls/counts. |
| AC-06 | Chromium tests verify keyboard table scrolling, fixed title/action positions, visible logout/nav, and no horizontal page overflow at 1440x900 and 390x844. Representative desktop/mobile screenshots were visually inspected; wide mobile table content remains inside its scroll region. |
| AC-07 | Final `npm run verify` passed types, ESLint with zero errors/warnings, 86 unit/component/hook tests across 12 files, production build, and 23 Chromium E2E tests. Coverage: statements 100%, lines 100%, functions 100%, branches 98.83%. Existing critical files meet their 90% thresholds. No tests were skipped or weakened. |
| AC-08 | README documents preview routes/data, transient selection, read-only portfolios, unavailable operations/details, and deferred business behavior. |

Coverage settings and exclusions are unchanged. The uncovered branch is the defensive missing-ref check in the Models selection effect; all specified selection paths pass. No known defects remain from completed checks. Firefox/WebKit and production hosting were not tested. This feature does not implement model/portfolio persistence, ownership, services, mutation workflows, cash or price calculations, or broker synchronization. All changes remain uncommitted on `0004-models-portfolios-pages` for review.
