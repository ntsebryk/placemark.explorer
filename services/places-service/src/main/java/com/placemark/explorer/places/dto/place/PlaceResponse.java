package com.placemark.explorer.places.dto.place;

import com.placemark.explorer.places.domain.PlaceCategory;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;

public record PlaceResponse(
    UUID id,
    String name,
    String description,
    PlaceCategory category,
    double latitude,
    double longitude,
    int visitRadiusMeters,
    Set<UUID> groupIds,
    Instant createdAt,
    Instant updatedAt) {}
