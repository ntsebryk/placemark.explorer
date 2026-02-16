# places-service

Spring Boot microservice for storing places, grouping them, and geo queries.

## Features

- Places with GPS coordinates and visit radius
- Place groups and many-to-many membership
- Geo search endpoints for nearby places and track intersections
- PostgreSQL + PostGIS storage (`GEOGRAPHY(Point, 4326)`)
- Soft delete
- Pagination and category filtering
- OpenAPI docs at `/swagger-ui.html`

## Run locally

1. Start PostgreSQL + PostGIS.
2. Configure `application.yml` datasource values.
3. Run: `./gradlew bootRun`
