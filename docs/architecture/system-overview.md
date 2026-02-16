# System Overview

## Goal

Build a scalable, geo-enabled microservices platform for travel exploration and achievements.

## Bounded Contexts

1. `places-service`
- Stores places and place groups.
- Exposes geo queries for visit detection.
- Does not store user tracks, visits, achievements, auth, or leaderboards.

2. `tracking-service`
- Receives GPS tracks (raw points or GPX).
- Calls `places-service` for candidate matching.
- Determines visit candidates and emits events.

3. `visit-service`
- Stores user-place visits.
- Enforces idempotency for repeated detections.

4. `achievement-service`
- Computes completion and achievements from visits + place metadata.

5. `user-service`
- Authentication, profiles, user preferences.

6. `leaderboard-service` (future)
- Rankings and comparisons.

## Service Boundaries

- Each service owns its own database.
- No direct cross-service DB access.
- No shared mutable domain tables.
- Communication starts with REST and can evolve to events.

## Communication Strategy

- Phase 1: synchronous REST between services.
- Phase 2: event-driven integration (for example Kafka) for scale and decoupling.

## Data Ownership

- `places-service`: place catalog and groups.
- `tracking-service`: raw GPS tracks and track processing state.
- `visit-service`: visit records and deduplication state.
- `achievement-service`: progress and achievement state.
- `user-service`: user identity and profile data.

## Cross-Cutting Principles

- Layered service architecture: Controller -> Service -> Repository.
- DTO-based API contracts (no entity exposure).
- UUID identifiers.
- Soft delete where recovery/audit is useful.
- Pagination on list and search endpoints.
- Input validation at API boundary.
