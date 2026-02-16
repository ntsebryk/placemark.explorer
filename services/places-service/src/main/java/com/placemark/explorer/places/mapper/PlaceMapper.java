package com.placemark.explorer.places.mapper;

import com.placemark.explorer.places.domain.Place;
import com.placemark.explorer.places.domain.PlaceGroup;
import com.placemark.explorer.places.dto.group.PlaceGroupResponse;
import com.placemark.explorer.places.dto.place.PlaceResponse;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class PlaceMapper {

  public PlaceResponse toResponse(Place place) {
    return new PlaceResponse(
        place.getId(),
        place.getName(),
        place.getDescription(),
        place.getCategory(),
        place.getLocation().getY(),
        place.getLocation().getX(),
        place.getVisitRadiusMeters(),
        place.getGroups().stream().map(PlaceGroup::getId).collect(Collectors.toSet()),
        place.getCreatedAt(),
        place.getUpdatedAt());
  }

  public PlaceGroupResponse toResponse(PlaceGroup group) {
    return new PlaceGroupResponse(
        group.getId(),
        group.getName(),
        group.getDescription(),
        group.getPlaces().stream().map(Place::getId).collect(Collectors.toSet()),
        group.getCreatedAt(),
        group.getUpdatedAt());
  }
}
