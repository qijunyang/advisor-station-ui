# 0005 — Model Management UI

Status: Authorized for specification and implementation on 2026-10-30.
Branch: `0005-model-management-ui`

## Scope

Enable model creation, viewing, editing, and confirmed deletion in the existing UI preview. Portfolio behavior remains unchanged.

- Create opens a reusable model dialog with Name and optional Description. A trimmed name is required (maximum 100 characters); description is limited to 1000 characters. Display validation feedback and keep invalid input open. Duplicate names are allowed; IDs identify rows.
- One `ModelDialog` supports create/view/edit modes. View is read-only with no Save action; edit starts with the model's current values. Closing/canceling never saves. Each opening initializes a fresh draft.
- Successful create/edit immediately updates the local list. New records have UUIDs, creation/update dates, and preview audit labels; editing preserves identity and creation metadata. This is presentation state, not a finalized model-domain contract.
- Delete selected is enabled exactly when at least one existing row is checked. Confirm the model names before deleting; cancellation preserves rows and selection. Confirmed deletion removes only the indicated records and cleans their selected IDs.
- Each row has an accessible three-dot action menu with View, Edit, and Delete, independent of checkboxes. Row Delete confirms only that row, even if other rows are checked.
- Share a generic modal shell and confirmation dialog under shared components. They own title, close, content/footer slots, keyboard dismissal, initial focus, focus containment, and focus restoration. Model fields stay in the model-specific dialog; do not build a portfolio dialog now.
- Row action menus support pointer/keyboard activation, arrow/Home/End navigation, Escape/outside dismissal, and appropriate focus return. Menus must remain visible near scroll-container edges.
- Local list mutations and drafts reset when leaving/reloading the Models page or changing the active auth scope. No persistence, cross-tab mutation synchronization, cash, positions, prices, model services, or backend is introduced.

## Acceptance Criteria

| ID | Evidence |
|---|---|
| AC-01 | Create opens the reusable dialog, validates fields, trims saved text, creates one row, and cancellation/Escape/close leaves rows unchanged. |
| AC-02 | Every row menu exposes View/Edit/Delete without selecting the row. View is read-only; edit updates only the targeted row and preserves its ID/creation date. Reopening clears abandoned drafts. |
| AC-03 | Bulk delete is disabled with zero selection and enabled with selected rows. Confirmation lists exact names; cancel preserves data/selection and confirm removes only targets, updates counts, and supports deleting the last row into the empty state. |
| AC-04 | Row deletion does not require or change unrelated selection; confirmation targets only that row. |
| AC-05 | Shared dialogs have accessible names, focus placement/containment, Escape, close/cancel, restored focus, and mobile scrolling. Shared menus support keyboard and outside dismissal and avoid clipping. |
| AC-06 | Leaving/reloading or changing auth scope restores the preview and closes pending drafts/confirmations; no model changes leak across sessions. Existing portfolios remain read-only. |
| AC-07 | Required TypeScript, ESLint (zero errors/warnings), coverage, production build, and Chromium component/workflow regressions pass. Retain current coverage thresholds. |
| AC-08 | README documents reusable components, fields, local lifetime, and deferred positions/cash/services. |
