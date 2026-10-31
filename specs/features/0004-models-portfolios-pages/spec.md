# 0004 — Models and Portfolios Pages

Status: Authorized for specification and implementation on 2026-10-30.
Branch: `0004-models-portfolios-pages`

## Goal and Scope

Build the Models and Portfolios list-page skeletons so their layout can be reviewed before defining business services, cash rules, or editing workflows.

- Add Models and Portfolios after Dashboard in the workspace navigation.
- Guard `/workspace/models` and `/workspace/portfolios` with the existing session boundary.
- Both pages have a top title/action area and an independently scrollable table beneath it. Keep workspace navigation and the advisor/logout header available while the table scrolls.
- Display deterministic, static fictional sample rows explicitly identified as a layout preview, not current advisor-owned records or live broker data. All sessions see the same illustrative rows. Local presentation fixtures are allowed directly for this UI-only feature; no service layer or simulated network request is needed.
- Models: show name, created date, updated date, and updated-by display text. Include labeled row checkboxes, select-all with mixed state, a live selection count, and a Clear selection action. Selection is transient and resets when the page unmounts or the active session changes.
- Show disabled Create and Delete selected buttons with visible explanatory text that model creation/deletion is unavailable in this preview. Delete remains disabled even with rows selected because mutations are deferred. Names are plain text; there are no nonfunctional edit/detail links.
- Portfolios: show name, fictional broker, last-sync date, and source status. Read-only: no checkboxes, Create/Edit/Delete actions, import button, or simulated synchronization.
- Provide a useful empty-table message for each page and preserve semantic headings, table captions, column headers, and keyboard-operable selection controls.

## Acceptance Criteria

| ID | Required behavior/evidence |
|---|---|
| AC-01 | Navigation order is Dashboard, Models, Portfolios. Each route activates its link and renders inside the existing workspace shell; direct access/refresh works and logged-out access redirects to login. |
| AC-02 | Models shows labeled static sample data and the agreed columns; its disabled future-action buttons have visible explanation and never mutate data. |
| AC-03 | Individual and select-all selection, mixed state, count, and Clear selection work. No selected rows initially; selection resets on navigation away, refresh, or session replacement. |
| AC-04 | Portfolios shows labeled fictional broker-copy sample rows and a read-only table, without selection or mutation controls. No real account identifiers or live sync claims appear. |
| AC-05 | Empty rows render explicit empty states and disabled selection controls as appropriate; no crashes or misleading counts occur. |
| AC-06 | At 1440x900 and 390x844, action controls remain usable and table overflow is contained within a keyboard-focusable scroll region. With enough rows, the table scrolls vertically while page actions and workspace chrome stay visible. Wide columns can scroll horizontally within that region without horizontal page overflow. |
| AC-07 | Required types, ESLint (zero errors/warnings), unit/component tests, coverage, production build, and Chromium E2E checks pass. Existing 80% overall and 90% critical-file thresholds remain enforced. |
| AC-08 | README explains routes, preview rows, transient selection, read-only portfolios, unavailable mutations/details, and deferred business work. |

## Out of Scope

Model/portfolio domain contracts and services, persistent records, ownership policies, creation/editing/deletion, position details, initial cash or cash calculations, quotes, securities selection, broker import/sync, sorting/filtering/pagination, CI/CD, hosting, and deployment.

No production authorization or actual model/portfolio tenant isolation is claimed for these global illustrative rows. Existing session access controls must remain intact.
