# Technical Plan — Project Skeleton

Status: Approved for implementation by the user on 2026-10-30.

## Baseline and Scope

The repository has role instructions, an empty README, and `package.json` without dependencies or scripts. Implement only a minimal React/TypeScript/Vite frontend and local test tooling. CI/CD and deployment are deferred.

## Source and Test Layout

```text
index.html
src/
  main.tsx             # React mounting entry point
  App.tsx              # Minimal semantic demo page
  App.test.tsx         # Component test beside its source
  test/
    setup.ts           # Shared test initialization only
  vite-env.d.ts        # Vite type declarations if needed
e2e/
  app.spec.ts          # Production-build browser smoke test
```

Keep unit/component tests beside the modules they verify. Shared test initialization belongs in `src/test/`; browser workflows belong in top-level `e2e/`. Introduce feature folders and service abstractions only when business features need them.

## Runtime and Dependencies

Use npm and a version-controlled lockfile. During implementation, consult official compatibility guidance to select a supported Node LTS version and compatible React, TypeScript, Vite, Vitest, and Playwright versions. Document and configure the chosen runtime.

Use the React Vite plugin, React DOM, required TypeScript types, ESLint with TypeScript/React rules, Vitest with a compatible coverage provider, React Testing Library, jest-dom, jsdom, and Playwright. Add other testing helpers only when tests require them. Do not add MUI, routing, query/state libraries, backend tooling, or CI/CD dependencies in this feature.

## Minimal Application

Mount `App` through `main.tsx`. Render a semantic main area containing the Advisor Station UI heading and fictional-demo text. Keep styling minimal and readable. Do not add navigation, data services, stateful demo controls, or financial functionality solely to exercise tooling.

## Commands

Provide `dev`, `typecheck`, `lint`, `test`, `test:coverage`, `build`, `preview`, `test:e2e`, and `verify` scripts. Unit verification must run once rather than remain in watch mode. `verify` runs type checking, ESLint, unit coverage, build, and E2E sequentially, stops on failure, and works in PowerShell and other supported development shells.

Configure Playwright to manage a local production preview server on a defined port. Document Chromium installation separately from ordinary verification. E2E verification uses the artifact built by the preceding build step.

## Verification

- AC-01: exercise reproducible installation and documented development/build/preview commands.
- AC-02 and AC-04: colocated component tests assert the visible heading, demo text, and semantic main area with accessible queries.
- AC-03: type-check application, tests, and relevant configuration; ESLint covers source and test files using `--max-warnings 0`.
- AC-04: configure coverage to include unimported application files and enforce 80% statements, lines, functions, and branches. Exclude test files, test infrastructure, and declarations with documented justification. Keep executable application code included; do not exclude entry code merely to pass coverage. Report the 90% critical-file rule as inapplicable if no critical rules exist.
- AC-05: Chromium verifies root-page content and browser refresh against the production build. Use isolated contexts and Playwright assertions without fixed sleeps.
- AC-06: run the full local verification command and preserve failure exit codes.
- AC-07: document commands, browser prerequisites, layout, coverage policy/exclusions, and deferred CI/CD.

No GitHub Actions files, deployment workflows, Cloudflare resources, credentials, or remote CI execution are required.

## Execution Order

1. Review and approve the spec, plan, and tasks.
2. Follow the infrastructure role for local runtime, dependency, lint, and test-tool configuration only.
3. Follow the coder role to implement the minimal page and README.
4. Follow the unit-test role to verify component behavior and coverage; fix defects through the coder role.
5. Follow the E2E role to verify the browser smoke workflow; rerun checks affected by corrections.
6. Run final local verification and report acceptance evidence for review.

Keep all work on `0001-project-skeleton`. Do not commit, push, or create a PR until explicitly authorized. CI/CD and deployment will be separate work.
