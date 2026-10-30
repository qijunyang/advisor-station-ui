# CLAUDE.md — Advisor Station UI

## Project Instructions

This project uses shared AI instructions so that Claude Code and OpenAI Codex follow the same engineering standards.

Before starting any task, read `AGENTS.md` for project-wide architecture, technology stack, coding standards, testing requirements, and Git workflow.

## Available Agent Roles

The project defines three specialized roles in the `agents/` directory.

| Role | Instruction File | Responsibility |
|---|---|---|
| Senior Developer | `agents/coder.md` | Implement features, refactor code, maintain architecture |
| Unit Test Engineer | `agents/unit-test.md` | Write and maintain Vitest and React Testing Library tests |
| E2E Test Engineer | `agents/e2e-test.md` | Write and maintain Playwright browser tests |

When the user requests a specific role, read its instruction file and follow it.

Do not assume these files are automatically registered as Claude Code subagents. They are shared role instructions.

## Specification-Driven Development

Feature specifications are stored under:

`specs/features/NNNN-feature-name/`

Each feature may contain:

- `spec.md` — Functional requirements and acceptance criteria
- `plan.md` — Technical design and implementation approach
- `tasks.md` — Implementation checklist

Before implementing a feature:

1. Read `AGENTS.md`.
2. Read the relevant role instructions.
3. Read the feature specification, plan, and tasks.
4. Inspect the existing implementation.
5. Follow the approved scope.
6. Report missing or conflicting requirements before making assumptions.

## Development Workflow

For a feature implementation:

1. Follow `agents/coder.md` to implement the approved tasks.
2. Follow `agents/unit-test.md` to verify components and business logic.
3. Follow `agents/e2e-test.md` to verify applicable browser workflows.
4. Run relevant TypeScript, lint, unit, and E2E checks.
5. Summarize changes, test results, and outstanding defects.

Perform dependent steps sequentially to avoid conflicting file modifications.

## Engineering Rules

- Prefer maintainable, readable code over clever solutions.
- Follow existing project architecture and conventions.
- Keep UI, business logic, and data access separated.
- Use TypeScript types rather than `any`.
- Do not introduce dependencies without justification.
- Do not modify unrelated features.
- Do not change specifications without approval.
- Never weaken tests to hide implementation defects.
- Use fictional data only for the financial demo.

## Git Workflow

- `develop` — Active development and integration
- `release` — Production-ready code
- `feature/NNNN-feature-name` — Individual feature development

Do not commit, push, merge, or deploy without explicit user approval.

## Completion Report

After completing a task, report:

1. What was implemented or tested.
2. Files created or modified.
3. Tests executed and their results.
4. Any defects, risks, or incomplete work.
5. Recommended next steps.