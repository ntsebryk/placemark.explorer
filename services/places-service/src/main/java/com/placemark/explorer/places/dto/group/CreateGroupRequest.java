package com.placemark.explorer.places.dto.group;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateGroupRequest(
    @NotBlank @Size(max = 200) String name,
    @Size(max = 4000) String description) {}
