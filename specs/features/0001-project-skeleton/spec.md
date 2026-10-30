# 0001 — Project Skeleton

Status: Approved for implementation by the user on 2026-10-30.
Branch: `0001-project-skeleton`

## Goal

Create a minimal frontend-only React, TypeScript, and Vite application with working unit/component and E2E testing support.

## Scope

- React, strict TypeScript, and Vite.
- One minimal page displaying the Advisor Station UI name and identifying it as a fictional demo foundation.
- Vitest and React Testing Library for unit/component tests beside source files.
- Playwright for browser tests under `e2e/`.
- Type checking, ESLint, coverage reporting/enforcement, and a production build.
- A supported Node version, npm lockfile, reproducible installation, and documented local verification commands.

## Out of Scope

CI/CD workflows, GitHub Actions configuration, hosting, deployment, backend services, authentication, business features, financial calculations, tenant access rules, persistence, mock services, multiple routes, shared UI themes, and a full application shell. MUI, React Router, and TanStack Query are deferred until needed. Shared architecture and domain-model documents are deferred to a feature that needs them.

GitHub Actions and Cloudflare Pages remain the project-wide future direction; this feature does not implement them.

## Acceptance Criteria

| ID | Required behavior or evidence |
|---|---|
| AC-01 | On the documented supported Node version, `npm ci` installs from the lockfile; development, production build, and preview commands work. |
| AC-02 | The root page displays a semantic main area, an Advisor Station UI heading, and text identifying the app as a fictional demo foundation. |
| AC-03 | Strict TypeScript checks pass. ESLint checks application and test code with zero errors and zero warnings. |
| AC-04 | A colocated component test verifies the page's visible content using React Testing Library. Vitest coverage includes unimported application source and enforces at least 80% statements, lines, functions, and branches overall. Exclusions are justified and documented. |
| AC-05 | A Chromium Playwright test under `e2e/` verifies the root page loads with the expected heading and demo text against the production build, including after refresh. |
| AC-06 | `npm run verify` sequentially runs type checking, ESLint, unit coverage, production build, and E2E checks and returns failure if a required check fails. |
| AC-07 | README explains prerequisites, installation, development, build/preview, unit and E2E testing, browser installation, verification, source/test layout, and coverage policy. |

## Verification Boundaries

The 90% per-critical-file threshold is inapplicable while no financial calculations, allocation validation, tenant isolation, or access-rule files exist. Do not add artificial business logic to satisfy coverage. Unit tests verify observable behavior rather than implementation details.

Chromium is the required E2E browser. Multi-route navigation, tenant-isolation workflows, cross-browser claims, responsive-shell workflows, and automated accessibility scanning are outside this feature. CI/CD checks are inapplicable because CI/CD is explicitly deferred.

## Approval and Completion

Review this specification and its aligned plan/tasks before implementation. All roles work sequentially on this branch with changes uncommitted throughout verification. Follow the shared commit gate and obtain explicit authorization before committing, pushing, creating a PR, merging, or deploying.
