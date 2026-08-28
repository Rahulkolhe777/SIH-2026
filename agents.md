# AGENTS.md

## Overview

This repository contains the project source code, configuration, documentation, and supporting assets.

## General Guidelines

* Keep changes focused and minimal.
* Follow existing project structure, conventions, and patterns.
* Prefer simple, readable, maintainable solutions.
* Avoid unnecessary dependencies or architectural changes.
* Preserve existing behavior unless a change is explicitly required.
* Update documentation when behavior or interfaces change.

## Production Rules

* **Follow all production rules and requirements without exception.**
* Treat existing production behavior, safeguards, policies, and constraints as authoritative.
* Do not bypass, weaken, disable, or work around production safeguards.
* Do not make assumptions that could compromise production reliability, security, data integrity, privacy, or compliance.
* Prefer backward-compatible changes.
* Do not introduce breaking changes without explicit approval.
* Do not modify production configuration, infrastructure, permissions, secrets, or deployment behavior unless explicitly required.
* Never expose, commit, or hard-code secrets, credentials, tokens, or sensitive configuration.
* When requirements are ambiguous, choose the safest production-compatible behavior and ask for clarification when necessary.

## Development

* Inspect relevant files before making changes.
* Reuse existing utilities and patterns where practical.
* Keep code consistent with surrounding code.
* **Code Style**: Do not write code in the form of classes and objects; write in the form of pure, modular, readable functions.
* **Interface & Type Management**: All interfaces and TypeScript types must reside in a dedicated `interfaces/` folder (e.g., `src/interfaces/<module_name>.interface.ts` and barrel-exported via `src/interfaces/index.ts`). Every time you create an interface, first check if it exists in the `interfaces/` folder; if not, create it there in a modular way and export it.
* **Module Documentation**: Keep comprehensive documentation for every feature/module in `docs/<module_name>/` (including architecture, API references, and frontend/consumer integration guides) updated as each module is built.
* **Shared Database**: All database models, Prisma client, and migrations must reside in `@repo/database` (`packages/database`) so they are sharable across all services (backend, background workers, AI pipelines).
* **Getting Started Documentation**: Maintain and keep `docs/how_to_start/*.md` updated as the project evolves.
* Run appropriate tests, checks, and builds after making changes.

## Testing

* Add or update tests for meaningful behavioral changes.
* Run the most relevant test suite before completing work.
* Investigate failing checks rather than ignoring them.
* Do not claim a change is verified if the relevant checks were not run.

## Git

* Keep commits focused when committing is requested.
* Avoid modifying unrelated files.
* Do not commit secrets, credentials, generated artifacts, or local environment files.

## Communication

* Briefly summarize what changed.
* Mention important tests and checks that were run.
* Clearly call out assumptions, limitations, risks, or unresolved issues.
