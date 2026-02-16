## Service Name
places-service

## Responsibility

The places-service is responsible ONLY for:

- Storing places
- Managing groups of places
- Providing geo-spatial queries
- Supporting visit-detection queries

It must NOT:

- Store user GPS tracks
- Mark places as visited
- Calculate achievements
- Handle leaderboards
- Manage authentication

This service acts as a geo-enabled catalog.

---

# 3️⃣ Domain Model

## 3.1 Place

Represents a real-world location.

Fields:

- id: UUID
- name: String
- description: String
- location: GEOGRAPHY(Point, 4326)
- visitRadiusMeters: Integer
- country: String
- city: String
- category: String
- isActive: Boolean
- createdAt: Timestamp
- updatedAt: Timestamp

Each place defines its own visit radius used for GPS-based detection.

---

## 3.2 PlaceGroup

Represents a collection of places.

Examples:
- "Top 100 Castles in Europe"
- "UNESCO Sites in Italy"

Fields:

- id: UUID
- name: String
- description: String
- type: ENUM (CURATED, USER_CREATED, SYSTEM)
- visibility: ENUM (PUBLIC, PRIVATE)
- createdAt: Timestamp
- updatedAt: Timestamp

---

## 3.3 GroupPlace (Many-to-Many)

- groupId: UUID
- placeId: UUID
- orderIndex: Integer
- PRIMARY KEY (groupId, placeId)

---

# 4️⃣ Database Requirements

Technology:

- PostgreSQL
- PostGIS extension
- Hibernate Spatial
- UUID primary keys
- GIST spatial index

Spatial Index:

CREATE INDEX idx_places_location ON places USING GIST(location);

---

# 5️⃣ API Requirements

## Place Endpoints

POST   /places  
GET    /places/{id}  
PUT    /places/{id}  
DELETE /places/{id} (soft delete)  
GET    /places/near?lat=&lon=&radius=

Must support:
- Pagination
- Filtering by category
- Filtering by country/city

---

## Group Endpoints

POST   /groups  
GET    /groups  
GET    /groups/{id}  
POST   /groups/{groupId}/places/{placeId}  
DELETE /groups/{groupId}/places/{placeId}

---

# 6️⃣ Geo Query Requirements

The service must support:

- Finding places within radius of a point
- Matching places intersecting GPS track
- Efficient spatial indexing
- Distance calculation using PostGIS

Core logic:

distance(point, place.location) <= place.visitRadiusMeters

---

# 7️⃣ Integration with Tracking Service

The tracking-service will:

1. Send GPS track
2. Query places-service for candidate places
3. Check spatial conditions
4. Mark visits in a separate service

places-service must remain stateless regarding users.

---

# 8️⃣ Future Extension Compatibility

Design schema flexible for:

- Tags
- Images
- Difficulty
- Estimated visit duration
- Region hierarchy
- Achievement rules engine

Avoid tight coupling to other services.
Keep boundaries clean.
