package com.placemark.explorer.places.controller;

import com.placemark.explorer.places.domain.PlaceCategory;
import com.placemark.explorer.places.dto.place.CreatePlaceRequest;
import com.placemark.explorer.places.dto.place.PlaceResponse;
import com.placemark.explorer.places.dto.place.TrackIntersectionRequest;
import com.placemark.explorer.places.mapper.PlaceMapper;
import com.placemark.explorer.places.service.PlaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import jakarta.validation.Valid;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;
import org.locationtech.jts.geom.Point;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.validation.annotation.Validated;

@RestController
@RequestMapping("/api/v1/places")
@Tag(name = "Places")
@Validated
@Transactional(Transactional.TxType.SUPPORTS)
public class PlaceController {

  private final PlaceService placeService;
  private final PlaceMapper mapper;

  public PlaceController(PlaceService placeService, PlaceMapper mapper) {
    this.placeService = placeService;
    this.mapper = mapper;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @Operation(summary = "Create place")
  @Transactional
  public PlaceResponse createPlace(@Valid @RequestBody CreatePlaceRequest request) {
    return mapper.toResponse(placeService.createPlace(request));
  }

  @GetMapping("/{id}")
  @Operation(summary = "Get place by ID")
  public PlaceResponse getPlace(@PathVariable("id") UUID id) {
    return mapper.toResponse(placeService.getPlace(id));
  }

  @GetMapping
  @Operation(summary = "List places with optional category filter")
  public Page<PlaceResponse> listPlaces(
      @RequestParam(name = "category", required = false) PlaceCategory category,
      @RequestParam(name = "page", defaultValue = "0") @Min(0) int page,
      @RequestParam(name = "size", defaultValue = "20") @Min(1) @Max(100) int size) {
    Pageable pageable = PageRequest.of(page, size);
    return placeService.listPlaces(category, pageable).map(mapper::toResponse);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @Operation(summary = "Soft delete place")
  @Transactional
  public void deletePlace(@PathVariable("id") UUID id) {
    placeService.deletePlace(id);
  }

  @GetMapping("/near")
  @Operation(summary = "Find places near a point")
  public Page<PlaceResponse> findPlacesNear(
      @RequestParam(name = "lat") @Min(-90) @Max(90) double lat,
      @RequestParam(name = "lon") @Min(-180) @Max(180) double lon,
      @RequestParam(name = "radiusMeters") @Positive int radiusMeters,
      @RequestParam(name = "category", required = false) PlaceCategory category,
      @RequestParam(name = "page", defaultValue = "0") @Min(0) int page,
      @RequestParam(name = "size", defaultValue = "20") @Min(1) @Max(100) int size) {
    Pageable pageable = PageRequest.of(page, size);
    return placeService.findPlacesNear(lat, lon, radiusMeters, category, pageable).map(mapper::toResponse);
  }

  @PostMapping("/intersections")
  @Operation(summary = "Find places intersecting a GPS track")
  public Page<PlaceResponse> findPlacesIntersectingTrack(
      @Valid @RequestBody TrackIntersectionRequest request,
      @RequestParam(name = "category", required = false) PlaceCategory category,
      @RequestParam(name = "page", defaultValue = "0") @Min(0) int page,
      @RequestParam(name = "size", defaultValue = "20") @Min(1) @Max(100) int size) {
    List<Point> track = request.points().stream()
        .map(p -> placeService.toPoint(p.latitude(), p.longitude()))
        .toList();
    Pageable pageable = PageRequest.of(page, size);
    return placeService.findPlacesIntersectingTrack(track, category, pageable).map(mapper::toResponse);
  }
}
