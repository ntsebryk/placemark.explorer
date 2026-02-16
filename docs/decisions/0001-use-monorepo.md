# ADR 0001: Use Monorepo Layout

## Status
Accepted

## Context
Project requires multiple backend services, frontend app, shared contracts, and local orchestration.

## Decision
Adopt a monorepo with top-level folders: `services`, `frontend`, `packages`, `ops`, `deploy`, and `docs`.

## Consequences
- Easier cross-service development and versioning.
- Requires discipline to keep services independently deployable.
