package com.placemark.explorer.places.dto.group;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

public record PlaceGroupResponse(
    UUID id,
    String name,
    String description,
    Set<UUID> placeIds,
    Instant createdAt,
    Instant updatedAt) {}
