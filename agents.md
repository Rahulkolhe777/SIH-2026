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
