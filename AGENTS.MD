# CODEX.md — Advisor Station UI

## Project Instructions

This project uses shared AI instructions so that OpenAI Codex and Claude Code follow the same engineering standards.

Before starting any task, read `AGENTS.md` for project-wide architecture, technology stack, coding standards, testing requirements, and Git workflow.

## Available Agent Roles

Three specialized roles are defined in the `agents/` directory:

| Role | Instruction File | Responsibility |
|---|---|---|
| Senior Developer | `agents/coder.md` | Implement features and maintain architecture |
| Unit Test Engineer | `agents/unit-test.md` | Write and maintain Vitest and React Testing Library tests |
| E2E Test Engineer | `agents/e2e-test.md` | Write and maintain Playwright tests |

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
4. Run relevant TypeScript, lint, unit, and E2E checks.
5. Report results, defects, and outstanding work.

Perform dependent tasks sequentially to avoid conflicting changes.

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

## Git Workflow

- `develop` — Development and integration
- `release` — Production
- `feature/NNNN-feature-name` — Feature development

Do not commit, push, merge, or deploy without explicit user approval.

## Completion Report

After completing a task, summarize:

1. Changes made.
2. Files created or modified.
3. Tests executed and their results.
4. Outstanding defects or risks.
5. Recommended next steps.