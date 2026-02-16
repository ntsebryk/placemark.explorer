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
    return placeRepository.save(place);
  }

  public Place getPlace(UUID id) {
    return placeRepository.findById(id).orElseThrow(() -> new NotFoundException("Place not found: " + id));
  }

  public Page<Place> listPlaces(PlaceCategory category, Pageable pageable) {
    if (category == null) {
      return placeRepository.findAll(pageable);
    }
    return placeRepository.findByCategory(category, pageable);
  }

  public void deletePlace(UUID id) {
    Place place = getPlace(id);
    placeRepository.delete(place);
  }

  public PlaceGroup createGroup(CreateGroupRequest request) {
    PlaceGroup group = new PlaceGroup();
    group.setName(request.name());
    group.setDescription(request.description());
    return groupRepository.save(group);
  }

  public PlaceGroup getGroup(UUID id) {
    return groupRepository.findById(id).orElseThrow(() -> new NotFoundException("Group not found: " + id));
  }

  public Page<PlaceGroup> listGroups(Pageable pageable) {
    return groupRepository.findAll(pageable);
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
    return group;
  }

  public PlaceGroup removePlaceFromGroup(UUID groupId, UUID placeId) {
    PlaceGroup group = getGroup(groupId);
    Place place = getPlace(placeId);
    group.getPlaces().remove(place);
    place.getGroups().remove(group);
    return group;
  }

  public Page<Place> findPlacesNear(double lat, double lon, int radiusMeters, PlaceCategory category, Pageable pageable) {
    validateRadius(radiusMeters);
    return placeRepository.findPlacesNear(lat, lon, radiusMeters, category != null ? category.name() : null, pageable);
  }

  public Page<Place> findPlacesIntersectingTrack(List<Point> trackPoints, PlaceCategory category, Pageable pageable) {
    if (trackPoints == null || trackPoints.isEmpty()) {
      throw new BadRequestException("Track points must not be empty");
    }

    String wkt = toTrackWkt(trackPoints);
    return placeRepository.findPlacesIntersectingTrack(wkt, category != null ? category.name() : null, pageable);
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
}
