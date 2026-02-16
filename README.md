# placemark.explorer

Monorepo for placemark.explorer with backend services, frontend app, shared contracts, and local ops tooling.

## Repository layout

- `services/` backend services (`svc-*`)
- `frontend/` frontend apps
- `packages/` shared contracts and libraries
- `ops/` local Docker, scripts, monitoring, gateway
- `deploy/` infrastructure definitions
- `docs/` architecture docs and ADRs

## Quick start (local)

1. Copy environment templates where needed:
   - root: `.env.example` -> `.env`
   - service/app level templates as required
2. Start local dependencies and services:
   - `docker compose -f ops/docker/compose.yaml -f ops/docker/compose.dev.yaml up --build`

## Conventions

- Services are independently runnable/deployable.
- Each service owns its own persistence and migrations.
- Shared API/data contracts live under `packages/contracts`.
- Cross-cutting automation scripts live under `ops/scripts`.
