# Technical Plan — Models and Portfolios Pages

Status: Authorized for implementation on 2026-10-30.

## Approach

- Add feature-local `ModelsPage` and `PortfoliosPage` components with readonly presentation row contracts and deterministic preview constants. Unit tests can pass empty rows. These are UI fixtures, not future persisted domain types.
- Extract only a small shared `CollectionPage` layout: heading/context/actions, scrollable table region, and footer. Use ordinary semantic HTML tables and existing CSS; no new dependency or generic table framework.
- Models owns row selection in local React state. Implement a select-all checkbox with an indeterminate state and individually labeled inputs. Clear selection is the only bulk action that changes anything; Create/Delete selected stay disabled with an explanatory note.
- Portfolios renders a separate read-only table with its own columns. Avoid configurable edit permissions or generic selection machinery for this page.
- Add routes within the existing guarded workspace layout and new links after Dashboard. Key routed content by active session ID so externally replaced sessions reset transient page state without altering auth rules.
- Constrain the workspace to viewport height using CSS grid and `min-height: 0`. Collection pages use header/table/footer rows; only the table region scrolls. Let the nav wrap into a compact strip on narrow screens and retain horizontal table scrolling within the table region.

## Verification

Colocated tests cover populated/empty tables, individual/select-all/mixed/clear selection, disabled mutation controls, read-only portfolios, active route navigation, and session-change reset. Chromium tests cover guarded deep links, refresh/history, selection reset on route and cross-tab session changes, keyboard selection, and contained scrolling at desktop/mobile sizes. Capture representative page screenshots for visual inspection.

Run `npm run verify` against the final code. Keep coverage settings and existing financial/auth rules unchanged. Document scope/limitations in README and record evidence in tasks. All changes remain uncommitted until explicitly authorized.
