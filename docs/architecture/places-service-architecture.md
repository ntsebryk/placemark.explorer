# Places Service Architecture

## Purpose

`places-service` is the geo-enabled catalog service used by other services for place metadata and spatial queries.

## Responsibilities

- Store places with coordinates and visit radius.
- Store groups/lists of places.
- Manage many-to-many membership between places and groups.
- Provide spatial queries:
  - find places near a point
  - find places intersecting a GPS track

## Explicit Non-Responsibilities

- No user track storage.
- No final visited decision persistence.
- No achievements calculation.
- No social/leaderboard logic.

## Internal Layers

- Controller: request validation + API contracts.
- Service: business logic and orchestration.
- Repository: persistence and PostGIS native queries.

## Data Model (Current)

- `places`
  - `id` UUID
  - `name`, `description`, `category`
  - `location` `GEOGRAPHY(Point, 4326)`
  - `visit_radius_meters`
  - `deleted`, `deleted_at`, timestamps
- `place_groups`
  - `id` UUID
  - `name`, `description`
  - `deleted`, `deleted_at`, timestamps
- `place_group_membership`
  - many-to-many join (`place_id`, `group_id`)

## Performance and Indexing

- GIST index on `places.location` for geo proximity operations.
- B-tree indexes on category and soft-delete flags.

## Geo Query Strategy

- Near search: PostGIS `ST_DWithin(place.location, point, radiusMeters)`.
- Track intersection: `ST_DWithin(place.location, trackGeography, place.visit_radius_meters)`.

## Contracts and Evolution

- REST API under `/api/v1`.
- OpenAPI published by the service.
- Keep DTO contracts stable; evolve with additive changes where possible.
