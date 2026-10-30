# 0002 — Demo Login

Status: Approved for implementation by the user on 2026-10-30.
Branch: `0002-login`

## Goal

Let visitors enter a fictional advisor workspace without credentials by selecting a firm and an advisor. All tabs at the same application origin in the same browser profile share one demo session. Independent browser profiles or browsers can use the same advisor with independent session IDs.

## Requirements

1. Visitors without a valid demo session are redirected from workspace routes to `/login`. Do not render workspace content before session validation completes.
2. The login page clearly identifies this as a demo and lists exactly two hardcoded fictional firms, each with exactly three advisors. No backend request or firm/advisor service layer is used. Selecting a firm displays that firm's advisors as accessible buttons; selecting a different firm removes the previous advisor list.
3. Clicking an advisor validates the firm/advisor relationship, creates a random UUID session ID, persists the session, and opens `/workspace`. No username, password, or real authentication is required.
4. A stored session includes a schema version, `firmId`, `advisorId`, and `sessionId`. It is the source of truth for login state; do not maintain a separate boolean flag that can disagree with it.
5. Persist the session in `localStorage`. New tabs and refreshes reuse it. Proposed lifetime: retain it across browser restarts until logout, storage clearing, or invalidation; no automatic expiry in this feature.
6. Synchronize login, logout, and session replacement across open tabs. Receiving tabs adopt the latest stored session. The tab making a change updates immediately as well.
7. Logged-in visitors opening `/login` go to `/workspace`. The workspace has three regions: a top action bar displaying the selected advisor name and Logout button, a left navigation panel, and a right work area for routed page content. Show the selected firm name and demo designation in the workspace as well. The initial navigation contains Dashboard, which opens a placeholder in the right work area; business pages are deferred. Changing advisor is supported by logging out and selecting again.
8. Logout removes only this application's session entry and returns all open tabs to `/login`. A later login creates a fresh session ID, even for the same advisor.
9. Missing, malformed, unsupported-version, or obsolete sessions are treated as logged out. Validate that the firm exists and that the advisor belongs to that firm; do not trust stored display names or arbitrary IDs.
10. If storage is unavailable or a write fails, show a useful error and do not claim successful persistent login. The fixed directory is available synchronously; no directory loading, request retry, or empty-directory UI is required. Session restoration must still avoid exposing workspace content before validation.
11. Define a typed future mock-data scope containing `firmId`, `advisorId`, and `sessionId`. Reusing an active session keeps the scope stable; independent sessions produce different scopes. Actual financial datasets and mutable mock-data stores are deferred.

Browser sharing is limited to the same origin and browser profile/storage partition. Different hostnames or ports use different storage. Visitors sharing a browser profile intentionally share the selected advisor. This is simulated UI access control, not backend authorization.

## Proposed Routing and Edge Behavior

- `/login`: public firm/advisor selection; redirect valid sessions to `/workspace`.
- `/`: entry route; redirect to `/workspace` for valid sessions and `/login` otherwise.
- `/workspace`: guarded workspace layout with Dashboard in the right work area. Future child routes render within that area.
- Unknown paths: redirect logged-out visitors to `/login`; show a not-found page with a home link to logged-in visitors.
- Redirects replace history where appropriate so Back does not reveal logged-out workspace content. Do not add external return URLs.
- Concurrent selections use the latest stored session as the authoritative result; do not promise independent sessions per tab or transactional synchronization. Reconcile on tab focus to recover from missed storage events.

## Hardcoded Fictional Directory

| Firm ID | Firm name | Advisor IDs and names |
|---|---|---|
| northstar | Northstar Advisory | northstar-emma: Emma Parker; northstar-liam: Liam Bennett; northstar-olivia: Olivia Hayes |
| harborview | Harborview Wealth | harborview-noah: Noah Brooks; harborview-ava: Ava Collins; harborview-ethan: Ethan Reed |

IDs are stable constants; display names are resolved from this directory rather than trusted from storage.

## Acceptance Criteria

| ID | Required evidence |
|---|---|
| AC-01 | Without a session, opening `/` or an unknown workspace path reaches `/login` without exposing workspace content. |
| AC-02 | Exactly two hardcoded fictional firms with exactly three advisors each can be browsed, without a backend or directory service; advisors from an unselected firm are not offered. Selection works with keyboard and accessible names. |
| AC-03 | Clicking a valid advisor writes a versioned session with a UUID and enters `/workspace`, displaying the correct firm/advisor and the top action bar, left navigation, and right work area. The Dashboard navigation item renders the placeholder in the work area. Duplicate submissions do not create competing login operations. |
| AC-04 | Refresh and a second tab in the same context preserve the same firm, advisor, and session ID. `/login` and `/` redirect to `/workspace` for a valid session. |
| AC-05 | Logout in either tab redirects both to `/login`. Login or replacement in one tab updates the other. Logging in again creates a new ID. |
| AC-06 | Separate browser contexts selecting the same advisor receive different IDs and future data scopes. No actual financial dataset is implemented or claimed isolated by this feature. |
| AC-07 | Invalid JSON, missing/invalid fields, unsupported versions, unknown firms/advisors, and cross-firm advisor IDs cannot open the workspace. Unrelated localStorage entries remain unchanged. |
| AC-08 | Session initialization and storage read/write/removal failures have deterministic tests and useful UI outcomes. A failed logout must not report success while the session remains stored. |
| AC-09 | Direct navigation and refresh work on `/login` and `/workspace` against the production preview; stale browser history cannot bypass the guard after logout. |
| AC-10 | Required type checks, ESLint (zero errors/warnings), build, and unit/E2E checks pass. All four overall coverage metrics reach 80%; files implementing session access validation, route access rules, or firm/advisor membership rules reach 90% per metric per file. |
| AC-11 | README documents demo flow, same-origin cross-tab sharing, persistent lifetime, logout, test reset strategy, and the boundary between session keys and future mutable data isolation. |

## Out of Scope

Passwords, sign-up, account recovery, OAuth, server sessions, production security, admin permissions, firm/advisor CRUD, business dashboard metrics and functionality, financial calculations/data stores, expiration policies, cross-device synchronization, CI/CD, hosting, and deployment.

## Review Decisions

The user approved implementation after reviewing these documents and refining the hardcoded directory, shared cross-tab session, workspace layout, and default Dashboard navigation.
