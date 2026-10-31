# Tasks — Model Management UI

- [x] Update develop and create feature branch/spec/plan.
- [x] Build reusable modal shell, confirmation dialog, and row-action menu. (AC-05)
- [x] Build reusable model create/view/edit dialog with validation and draft reset. (AC-01, AC-02)
- [x] Wire local create/edit, independent row actions, and confirmed single/bulk deletion. (AC-01 through AC-04)
- [x] Preserve empty states, local/session reset, and read-only portfolios. (AC-03, AC-06)
- [x] Add/update colocated component tests and Chromium workflows. (AC-01 through AC-07)
- [x] Inspect desktop/mobile screenshots and verify focus/menu/scroll behavior. (AC-05)
- [x] Update README, run full verification, and record evidence. (AC-07, AC-08)
- [x] Leave changes uncommitted for review.

## Verification Evidence — 2026-10-30

| Criteria | Evidence |
|---|---|
| AC-01 | Dialog/page/browser tests cover trimmed valid creation, required/length validation, cancellation, close/Escape, and a fresh draft on reopening. |
| AC-02 | Tests verify view has no editable fields or Save, edits target one row, selection/identity and creation date survive renaming, other rows remain unchanged, and abandoned drafts are discarded. |
| AC-03 | Tests verify enablement, exact bulk confirmation names, cancel without mutation/selection loss, deletion counts/selection cleanup, deleting every row, empty state, and restored preview on reload. |
| AC-04 | Single-row confirmation targets only that row and preserves other checked rows; removal restores focus to Create if the row trigger disappears. |
| AC-05 | Shared-component tests and Chromium verify named dialogs, native background inertness, explicit Tab/Shift+Tab containment, initial Cancel/name focus, Escape/close, trigger/fallback focus restoration, keyboard menus, outside dismissal, and viewport-bound last-row menus. Screenshots at 1440x900 and 390x844 were visually inspected. |
| AC-06 | Browser tests verify navigation/refresh resets, cross-tab auth replacement closes an open draft, and portfolio read-only regressions still pass. No portfolio component was modified. |
| AC-07 | Final `npm run verify` passed TypeScript, ESLint with zero errors/warnings, 98 tests across 15 unit/component/hook files, production build, and all 31 Chromium E2E tests. Coverage: statements 98.12%, lines 97.65%, functions 98.96%, branches 94.85%; existing critical-file thresholds remain satisfied. |
| AC-08 | README documents the generic shell/confirmation/menu APIs, shared model modes, draft lifecycle, validation, local mutations, and deferred domain work. |

Two browser defects were found and fixed: native Tab traversal could leave dialog controls, so the shared shell now explicitly cycles Tab/Shift+Tab; queued scroll events could dismiss newly opened last-row menus, so scroll dismissal now checks whether the trigger actually moved. The affected tests and full regression suite pass without retries or weakened assertions.

No known defects remain from completed checks. Only Chromium was tested; jsdom uses minimal dialog-method shims and does not establish native accessibility behavior. No persistence, model/quote services, positions, cash rules, portfolio dialog, broker connection, CI/CD, or deployment was added. All changes remain uncommitted on `0005-model-management-ui` pending user review.
