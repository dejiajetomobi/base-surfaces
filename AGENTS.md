# AI Coding Agent Instructions

<!-- Maintainer note: keep this file short, stable, and universally applicable. -->
<!-- This file is for onboarding your AI coding agent into your codebase. It should define your project's WHY, WHAT, and HOW. -->
<!-- Keep under ~150 lines when possible. -->
<!-- Keep only instructions that should apply to almost every task. -->
<!-- Use progressive disclosure: link to focused docs for deep details. -->
<!-- Avoid embedding long tutorials, API references, or style guides here. -->
<!-- Keep task-specific instructions in separate markdown files with self-descriptive names somewhere in your project. -->
<!-- Example: -->
<!--
agent_docs/
  |- building_the_project.md
  |- running_tests.md
  |- code_conventions.md
  |- service_architecture.md
  |- database_schema.md
  |- service_communication_patterns.md
-->
<!-- Then, in this file, include a list of these files with a brief description of each, and instruct your AI coding agent to decide which (if any) are relevant and to read them before it starts working. -->

## Purpose
- <!-- TODO: 2-3 bullets: what this repo does (summarise from README if available). -->
- <!-- TODO: include business or product intent in one short bullet. -->
- <!-- TODO: include success criteria or primary outcomes. -->

## Architecture
- <!-- TODO: high-level architecture summary (2-4 bullets max). -->
- <!-- TODO: languages/frameworks/runtimes. -->
- <!-- TODO: data systems and external dependencies (DB, queue, APIs). -->

## Development Environment
- **Setup:** <!-- TODO: exact install/bootstrap commands. -->
- **Env Vars:** <!-- TODO: required env vars with safe local defaults when possible. -->
- **Navigation:** <!-- TODO: key directories and where agents should start searching first. -->
<!-- Maintainer note: Review and update as you see fit. -->

## Build & Test
- **Build:** <!-- TODO: exact CI-equivalent build command. -->
- **Test (Unit):** <!-- TODO: exact command + single-file/class/test flags. -->
- **Lint/Format:** <!-- TODO: exact lint/format/typecheck command(s). -->
<!-- Maintainer note: Review and update as you see fit. -->

## Testing Strategy
- Prefer running single tests first for fast feedback, then broaden scope.
- Fix all test/type/lint failures before handoff unless explicitly told otherwise.
- Prefer deterministic verification over manual checks.
- State what was run, what passed, and any unresolved risks.
<!-- Maintainer note: Review and update as you see fit. -->

## Repository Map
- <!-- TODO: main source (or equivalent path) e.g. `src`. -->
- <!-- TODO: test location(s) e.g. `test/` or `tests/`. -->
- <!-- TODO: architecture/runbooks/reference docs e.g. `docs/`. -->
- <!-- TODO: CI/workflows/templates/policies e.g. `.github/`. -->
- <!-- TODO: add only key top-level directories; keep this short. -->

## Code Style
- Reuse existing patterns before introducing new abstractions.
- Use deterministic format/lint tools for style checks.
- <!-- TODO: add 2-4 non-default style conventions that agents often miss. -->
- <!-- TODO: link to detailed style docs instead of embedding long rules. -->

## Git & PR Policy
- **Commits:** Ask permission before pushing unless explicitly requested otherwise.
- **PRs:** Drafts only (`gh pr create --draft`) unless explicitly requested otherwise.
- <!-- TODO: add repo-specific branch/merge rules if applicable. -->
- <!-- TODO: mention required checks before merge. -->

## Security considerations
- Never commit secrets, credentials, or API keys.
- Use environment variables or a secrets manager for sensitive values.
- <!-- TODO: add repo-specific security controls/checks (for example SBOM/policy gates). -->
- <!-- TODO: add non-obvious security constraints relevant to this repo only. -->

## <!-- Extra sections -->
<!-- Maintainer note: Add other things that you would like your Agent to follow, that it wouldn't know otherwise from the code base. -->
