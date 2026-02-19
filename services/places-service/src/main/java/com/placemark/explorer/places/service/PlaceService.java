package com.placemark.explorer.places.service;

import com.placemark.explorer.places.domain.Place;
import com.placemark.explorer.places.domain.PlaceCategory;
import com.placemark.explorer.places.domain.PlaceGroup;
import com.placemark.explorer.places.dto.group.CreateGroupRequest;
import com.placemark.explorer.places.dto.place.CreatePlaceRequest;
import com.placemark.explorer.places.exception.BadRequestException;
import com.placemark.explorer.places.exception.NotFoundException;
import com.placemark.explorer.places.repository.PlaceGroupRepository;
import com.placemark.explorer.places.repository.PlaceRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class PlaceService {

  private final PlaceRepository placeRepository;
  private final PlaceGroupRepository groupRepository;
  private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

  public PlaceService(PlaceRepository placeRepository, PlaceGroupRepository groupRepository) {
    this.placeRepository = placeRepository;
    this.groupRepository = groupRepository;
  }

  public Place createPlace(CreatePlaceRequest request) {
    Place place = new Place();
    place.setName(request.name());
    place.setDescription(request.description());
    place.setCategory(request.category());
    place.setVisitRadiusMeters(request.visitRadiusMeters());
    place.setLocation(toPoint(request.latitude(), request.longitude()));
    return initializePlace(placeRepository.save(place));
  }

  public Place getPlace(UUID id) {
    Place place = placeRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Place not found: " + id));
    return initializePlace(place);
  }

  public Page<Place> listPlaces(PlaceCategory category, Pageable pageable) {
    Page<Place> places;
    if (category == null) {
      places = placeRepository.findAll(pageable);
    } else {
      places = placeRepository.findByCategory(category, pageable);
    }
    places.getContent().forEach(this::initializePlace);
    return places;
  }

  public void deletePlace(UUID id) {
    Place place = getPlace(id);
    placeRepository.delete(place);
  }

  public PlaceGroup createGroup(CreateGroupRequest request) {
    PlaceGroup group = new PlaceGroup();
    group.setName(request.name());
    group.setDescription(request.description());
    return initializeGroup(groupRepository.save(group));
  }

  public PlaceGroup getGroup(UUID id) {
    PlaceGroup group = groupRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Group not found: " + id));
    return initializeGroup(group);
  }

  public Page<PlaceGroup> listGroups(Pageable pageable) {
    Page<PlaceGroup> groups = groupRepository.findAll(pageable);
    groups.getContent().forEach(this::initializeGroup);
    return groups;
  }

  public void deleteGroup(UUID id) {
    PlaceGroup group = getGroup(id);
    groupRepository.delete(group);
  }

  public PlaceGroup addPlaceToGroup(UUID groupId, UUID placeId) {
    PlaceGroup group = getGroup(groupId);
    Place place = getPlace(placeId);
    group.getPlaces().add(place);
    place.getGroups().add(group);
    return initializeGroup(group);
  }

  public PlaceGroup removePlaceFromGroup(UUID groupId, UUID placeId) {
    PlaceGroup group = getGroup(groupId);
    Place place = getPlace(placeId);
    group.getPlaces().remove(place);
    place.getGroups().remove(group);
    return initializeGroup(group);
  }

  public Page<Place> findPlacesNear(double lat, double lon, int radiusMeters, PlaceCategory category, Pageable pageable) {
    validateRadius(radiusMeters);
    Page<Place> places = placeRepository.findPlacesNear(
        lat, lon, radiusMeters, category != null ? category.name() : null, pageable);
    places.getContent().forEach(this::initializePlace);
    return places;
  }

  public Page<Place> findPlacesIntersectingTrack(List<Point> trackPoints, PlaceCategory category, Pageable pageable) {
    if (trackPoints == null || trackPoints.isEmpty()) {
      throw new BadRequestException("Track points must not be empty");
    }

    String wkt = toTrackWkt(trackPoints);
    Page<Place> places = placeRepository.findPlacesIntersectingTrack(
        wkt, category != null ? category.name() : null, pageable);
    places.getContent().forEach(this::initializePlace);
    return places;
  }

  public Point toPoint(double lat, double lon) {
    return geometryFactory.createPoint(new Coordinate(lon, lat));
  }

  private void validateRadius(int radiusMeters) {
    if (radiusMeters <= 0) {
      throw new BadRequestException("radiusMeters must be greater than zero");
    }
  }

  private String toTrackWkt(List<Point> points) {
    if (points.size() == 1) {
      Point p = points.get(0);
      return "SRID=4326;POINT(" + p.getX() + " " + p.getY() + ")";
    }

    StringBuilder sb = new StringBuilder("SRID=4326;LINESTRING(");
    for (int i = 0; i < points.size(); i++) {
      Point p = points.get(i);
      if (i > 0) {
        sb.append(',');
      }
      sb.append(p.getX()).append(' ').append(p.getY());
    }
    sb.append(')');
    return sb.toString();
  }

  private Place initializePlace(Place place) {
    place.getGroups().size();
    return place;
  }

  private PlaceGroup initializeGroup(PlaceGroup group) {
    group.getPlaces().size();
    return group;
  }
}
