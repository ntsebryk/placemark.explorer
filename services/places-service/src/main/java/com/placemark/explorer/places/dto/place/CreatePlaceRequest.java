package com.placemark.explorer.places.dto.place;

import com.placemark.explorer.places.domain.PlaceCategory;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record CreatePlaceRequest(
    @NotBlank @Size(max = 200) String name,
    @Size(max = 4000) String description,
    @NotNull PlaceCategory category,
    @NotNull @Min(-90) @Max(90) Double latitude,
    @NotNull @Min(-180) @Max(180) Double longitude,
    @NotNull @Positive Integer visitRadiusMeters) {}
