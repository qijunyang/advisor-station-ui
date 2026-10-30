# CODEX.md — Advisor Station UI

## Project Instructions

This project uses shared AI instructions so that OpenAI Codex and Claude Code follow the same engineering standards.

Before starting any task, read `AGENTS.md` for project-wide architecture, technology stack, coding standards, testing requirements, and Git workflow.

## Available Agent Roles

Four specialized roles are defined in the `agents/` directory:

| Role | Instruction File | Responsibility |
|---|---|---|
| Senior Developer | `agents/coder.md` | Implement features and maintain architecture |
| Unit Test Engineer | `agents/unit-test.md` | Write and maintain Vitest and React Testing Library tests |
| E2E Test Engineer | `agents/e2e-test.md` | Write and maintain Playwright tests |
| Infrastructure and CI/CD Engineer | `agents/infra-cicd.md` | Maintain reproducible tooling, GitHub Actions, and Cloudflare Pages deployment |

When the user requests a specific role, read its instruction file and follow its instructions.

These files define shared roles. They are not automatically registered as native Codex subagents.

## Specification-Driven Development

Feature specifications are stored under:

`specs/features/NNNN-feature-name/`

Each feature may contain:

- `spec.md` — Functional requirements and acceptance criteria
- `plan.md` — Technical design and implementation approach
- `tasks.md` — Implementation checklist

Before implementing a feature:

1. Read the shared project instructions.
2. Read the relevant role definition.
3. Read the feature specification, plan, and tasks.
4. Inspect existing code and tests.
5. Follow the approved scope.
6. Clarify conflicting or missing requirements.

## Development Workflow

For feature implementation:

1. Follow `agents/coder.md` to implement the approved feature.
2. Follow `agents/unit-test.md` to verify components and business logic.
3. Follow `agents/e2e-test.md` to verify applicable browser workflows.
4. Have the coder fix reported implementation defects, then rerun affected checks.
5. Run required TypeScript, lint, production build, unit, and E2E checks against the final changes.
6. Report results, defects, and outstanding work before requesting commit approval.

Perform dependent tasks sequentially to avoid conflicting changes.

The coder, unit-test, and e2e-test roles use the same feature branch and working directory. Leave implementation and test changes uncommitted throughout verification.

For tooling, CI/CD, or hosting work, follow `agents/infra-cicd.md` on the same task branch and use the testing roles for applicable verification.

## Planned CI/CD and Hosting

- Use GitHub Actions for CI/CD and Cloudflare Pages for the public React/Vite demo.
- Use the Cloudflare-provided `pages.dev` address; no custom domain is required or planned. The project name is subject to availability.
- Use a Cloudflare Pages Direct Upload project so GitHub Actions builds and tests the app, then deploys the verified static build through Wrangler.
- CI should verify pull requests targeting `develop` or `release` and pushes to those branches. Required checks include TypeScript, ESLint, unit coverage, production build, and applicable Playwright workflows.
- Deployment must be a separate, manually triggered GitHub Actions workflow (`workflow_dispatch`) restricted to `release`. Do not deploy automatically on pushes or pull requests.
- Require explicit user approval before triggering a deployment. Revalidate the selected release commit and deploy the exact static artifact produced by that successful run.
- Keep deployment credentials in GitHub Actions secrets with least privilege; never expose them to untrusted pull request code or browser bundles.
- These are planned requirements. Creating accounts, provisioning hosting, configuring secrets, and deploying are separate implementation steps and are not completed by documenting this plan.

## Engineering Rules

- Follow existing architecture and coding conventions.
- Prefer readable and maintainable code.
- Keep UI, business logic, and data access separated.
- Use strict TypeScript types.
- Avoid unnecessary dependencies.
- Do not modify unrelated features.
- Do not change approved specifications without permission.
- Do not weaken tests to hide defects.
- Use fictional financial data only.

## Verification Standards

- Run ESLint on application and test code with zero errors and zero warnings. Use the configured script with `--max-warnings 0` or equivalent enforcement.
- Do not disable or weaken lint rules, suppress findings, lower coverage thresholds, or exclude source files merely to pass checks.
- Unit and component coverage must reach at least 80% for each metric: statements, lines, functions, and branches across application source.
- Financial calculations, allocation validation, tenant isolation, and access rules must reach at least 90% for each of those four metrics, enforced per source file implementing these rules.
- Configure Vitest coverage to include application source files even when no test imports them. Exclude only justified files such as generated code, type declarations, and test infrastructure; document exclusions.
- Enforce coverage thresholds in Vitest configuration and run coverage as part of verification. Missing coverage tooling or configuration is a verification gap, not a pass.
- Coverage percentages complement meaningful assertions; they do not replace acceptance criteria or prove correctness.
- Assess E2E coverage by approved acceptance criteria and critical workflows, rather than a code coverage percentage. Every required browser workflow must pass, including applicable negative paths and tenant isolation scenarios.
- Report all four coverage percentages, critical-file results, exclusions, ESLint results, and E2E workflow results. Explain inapplicable checks.

## Git Workflow

- `develop` — Development and integration
- `release` — Production
- `NNNN-feature-name` — Feature development; use the exact folder name under `specs/features/`, without a branch prefix

### Starting or Resuming Work

- For new feature work, identify the feature folder and inspect the current branch and working tree.
- Never discard, reset, or automatically stash existing changes. If they prevent branch setup, report the issue before proceeding.
- With a clean working tree, fetch the configured remote, switch to `develop`, and update it using `git pull --ff-only` against the remote's `develop` branch.
- If fetching or updating fails, or `develop` has diverged or contains local commits absent from the remote, report the issue before creating the feature branch.
- Create `NNNN-feature-name` from the updated `develop`. For example, `specs/features/0001-client-management/` uses branch `0001-client-management`.
- If the intended branch already exists, inspect and resume it without resetting or overwriting it.
- When resuming ongoing work or handing off between roles, keep the same branch and working directory, including uncommitted changes. Do not switch to `develop`, pull, or create another branch during handoff.
- Use an explicitly user-named branch when provided, including for work without a feature specification folder.
- Routine branch setup under this workflow is authorized; other branch changes require user approval. Do not modify `release` directly unless instructed.

### Commit Gate

Do not commit feature implementation or its tests until:

- Approved acceptance criteria are satisfied.
- Required TypeScript and production build checks pass, and ESLint reports zero errors and zero warnings.
- Required unit and component tests pass and meet the coverage thresholds in Verification Standards.
- Required E2E acceptance criteria and critical workflow tests pass.
- No unresolved defects block acceptance.
- Verification covers the final implementation and test changes; rerun checks affected by subsequent changes.

Missing, failed, skipped, or blocked required checks do not satisfy this gate. Report them and keep the work uncommitted unless the user explicitly approves an exception. Explain any checks considered inapplicable.

Passing the gate does not authorize a commit. Do not commit, push, merge, or deploy without explicit user approval.

## Completion Report

After completing a task, summarize:

1. Changes made.
2. Files created or modified.
3. Tests executed and their results.
4. Outstanding defects or risks.
5. Recommended next steps.
