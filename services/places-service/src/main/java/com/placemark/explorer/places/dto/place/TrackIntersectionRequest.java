package com.placemark.explorer.places.dto.place;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record TrackIntersectionRequest(@NotEmpty List<@Valid TrackPointRequest> points) {}
