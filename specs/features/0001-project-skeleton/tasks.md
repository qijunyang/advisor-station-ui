# Tasks — Project Skeleton

Status: Implemented and locally verified on 2026-10-30. Changes remain uncommitted for user review.

## Review

- [x] Review and approve the minimal frontend scope, plan, and acceptance criteria. CI/CD is deferred.

## Local Tooling

- [x] Read applicable role instructions; verify official compatibility guidance and select/document a supported Node LTS version. (AC-01)
- [x] Configure npm, lockfile, React, React DOM, Vite, and strict TypeScript. (AC-01, AC-03)
- [x] Configure ESLint for application and test code with zero errors/warnings. (AC-03)
- [x] Configure Vitest, React Testing Library, test setup, and coverage including unimported application code with all four 80% thresholds. Document exclusions and assess critical-file applicability. (AC-04)
- [x] Configure Playwright Chromium and an automatically managed production preview server. (AC-05)
- [x] Add development, testing, build, preview, and failure-propagating verification scripts. (AC-01, AC-06)

## Minimal Application — Coder

- [x] Add the React entry point and minimal App with a semantic main area, heading, and fictional-demo text. (AC-02)
- [x] Document prerequisites, setup, browser installation, commands, layout, and coverage policy/exclusions in README. Record CI/CD as deferred. (AC-07)
- [x] Self-verify and hand off uncommitted changes on the same branch.

## Unit/Component Verification — Unit-Test Role

- [x] Add `App.test.tsx` beside `App.tsx` to verify visible content and semantics. (AC-02, AC-04)
- [x] Run tests and coverage; report all four metrics, exclusions, and the inapplicable 90% critical-file rule if no critical code exists. (AC-04)
- [x] Run ESLint, report defects to the coder, and rerun affected checks after corrections. (AC-03)

## Browser Verification — E2E Role

- [x] Add `e2e/app.spec.ts` covering page content and refresh against the production build. (AC-05)
- [x] Run Chromium tests and ESLint; report defects and rerun affected checks after fixes. (AC-03, AC-05)
- [x] Map browser acceptance criteria to actual results and disclose untested browsers.

## Final Verification and Review

- [x] Verify reproducible installation and documented dev/build/preview behavior. (AC-01)
- [x] Run `npm run verify` against final changes; record results. (AC-03 through AC-06)
- [x] Review README accuracy and map acceptance criteria to evidence. (AC-07)
- [x] Report unresolved defects and inapplicable checks; request commit/push/PR approval only after required verification passes.
- [x] Do not add CI/CD configuration, provision hosting, or deploy in this feature.

## Verification Evidence — 2026-10-30

| Criteria | Evidence |
|---|---|
| AC-01 | Node 24.22.1 / npm 11.19.1; `npm ci` succeeded. Development server returned HTTP 200 for `/` and the transformed App module. Production build and preview succeeded through the verification workflow. |
| AC-02 | Component test and Chromium test verified the heading, main area, and fictional-demo text. |
| AC-03 | `npm run verify` passed strict type checks and ESLint with zero errors/warnings. |
| AC-04 | Two unit/component test files, three tests passed. Statements, lines, functions, and branches each reached 100%, including `main.tsx`. No critical-rule source files exist; the 90% rule is inapplicable. |
| AC-05 | One Chromium E2E test passed against the production build, including refresh. Other browsers were not tested. |
| AC-06 | Full sequential `npm run verify` completed successfully. Commands use `&&` to stop and propagate a failing check's exit status. |
| AC-07 | README documents prerequisites, setup, local commands, browser installation, source/test layout, and coverage exclusions/policy. |

The first sandboxed browser run could not access localhost; the full command passed with the required execution permissions. npm registry access used Node's system trusted certificate store without disabling certificate validation. No application defects remain known from the completed checks. CI/CD and deployment remain out of scope. The user authorized committing, pushing, and opening a PR against `develop` on 2026-10-30. Merging and deployment require separate authorization.
