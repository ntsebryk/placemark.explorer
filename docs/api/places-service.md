# Places Service API

Base path: `/api/v1`

## Places

1. `POST /places`
- Create place.
- Body: `name`, `description`, `category`, `latitude`, `longitude`, `visitRadiusMeters`.
- Returns: `PlaceResponse`.

2. `GET /places/{id}`
- Fetch single place by UUID.
- Returns: `PlaceResponse`.

3. `GET /places`
- List places.
- Query params:
  - `page` (default `0`)
  - `size` (default `20`, max `100`)
  - `category` (optional)
- Returns: paginated `PlaceResponse`.

4. `DELETE /places/{id}`
- Soft delete place.
- Returns: `204 No Content`.

5. `GET /places/near`
- Geo search around point.
- Query params:
  - `lat` `[-90..90]`
  - `lon` `[-180..180]`
  - `radiusMeters` `> 0`
  - `page`, `size`, `category` (optional)
- Returns: paginated `PlaceResponse`.

6. `POST /places/intersections`
- Find places intersecting an input GPS track.
- Body: list of points (`latitude`, `longitude`).
- Query params: `page`, `size`, `category` (optional).
- Returns: paginated `PlaceResponse`.

## Groups

1. `POST /groups`
- Create group.
- Body: `name`, `description`.
- Returns: `PlaceGroupResponse`.

2. `GET /groups/{id}`
- Fetch group by UUID.
- Returns: `PlaceGroupResponse`.

3. `GET /groups`
- List groups.
- Query params: `page`, `size`.
- Returns: paginated `PlaceGroupResponse`.

4. `POST /groups/{groupId}/places/{placeId}`
- Add place to group.
- Returns: updated `PlaceGroupResponse`.

5. `DELETE /groups/{groupId}/places/{placeId}`
- Remove place from group.
- Returns: updated `PlaceGroupResponse`.

6. `DELETE /groups/{id}`
- Soft delete group.
- Returns: `204 No Content`.

## Models (Summary)

- `PlaceResponse`
  - `id`, `name`, `description`, `category`
  - `latitude`, `longitude`
  - `visitRadiusMeters`
  - `groupIds`
  - `createdAt`, `updatedAt`

- `PlaceGroupResponse`
  - `id`, `name`, `description`
  - `placeIds`
  - `createdAt`, `updatedAt`

## Error Format

Errors return:
- `timestamp`
- `status`
- `error`
- `message`
- `path`
