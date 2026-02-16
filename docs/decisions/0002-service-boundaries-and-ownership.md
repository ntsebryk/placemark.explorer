# ADR 0002: Service Boundaries and Data Ownership

## Status
Accepted

## Context
The platform is intended to evolve into multiple independent services with geo processing, visits, achievements, and social features. Early boundary mistakes create expensive refactors.

## Decision
- Split by bounded context (`places`, `tracking`, `visit`, `achievement`, `user`, `leaderboard` future).
- Each service owns its own database.
- No direct cross-service database access.
- Start with REST integration; allow event-driven integration later.

## Consequences
- Clear ownership and lower coupling.
- Slightly more integration overhead early.
- Enables independent scaling and deployment.
