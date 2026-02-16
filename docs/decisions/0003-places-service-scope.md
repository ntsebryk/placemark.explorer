# ADR 0003: Places Service Scope

## Status
Accepted

## Context
Visit detection, achievements, and social features are related but distinct concerns. Without strict scope, the catalog service can become a monolith.

## Decision
`places-service` is responsible for:
- Place catalog storage.
- Place group management.
- Spatial query capabilities for downstream services.

`places-service` is not responsible for:
- Storing user tracks.
- Storing final visited status.
- Computing achievements.
- Social and leaderboard features.

## Consequences
- Keeps geo catalog logic focused and reusable.
- Requires other services to own visit and achievement state.
