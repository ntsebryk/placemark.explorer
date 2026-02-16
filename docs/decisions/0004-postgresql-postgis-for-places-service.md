# ADR 0004: PostgreSQL + PostGIS for Places Service

## Status
Accepted

## Context
The service must support efficient radius and track intersection queries on geographic coordinates, with correctness in meter-based distance calculations.

## Decision
- Use PostgreSQL as primary relational store.
- Enable PostGIS extension.
- Store place location as `GEOGRAPHY(Point, 4326)`.
- Use GIST index on location column.
- Implement spatial search using PostGIS functions (for example `ST_DWithin`).

## Consequences
- Accurate geo calculations and strong query performance.
- Requires PostGIS-enabled runtime environments.
- Keeps geo logic in SQL where indexing can be fully used.
