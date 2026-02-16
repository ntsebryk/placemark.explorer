package com.placemark.explorer.places.repository;

import com.placemark.explorer.places.domain.Place;
import com.placemark.explorer.places.domain.PlaceCategory;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PlaceRepository extends JpaRepository<Place, UUID> {

  @Query(
      value = """
      SELECT p.*
      FROM places p
      WHERE p.deleted = false
        AND (:category IS NULL OR p.category = CAST(:category AS VARCHAR))
        AND ST_DWithin(
          p.location,
          ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography,
          :radiusMeters
        )
      """,
      countQuery = """
      SELECT COUNT(*)
      FROM places p
      WHERE p.deleted = false
        AND (:category IS NULL OR p.category = CAST(:category AS VARCHAR))
        AND ST_DWithin(
          p.location,
          ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography,
          :radiusMeters
        )
      """,
      nativeQuery = true)
  Page<Place> findPlacesNear(
      @Param("lat") double lat,
      @Param("lon") double lon,
      @Param("radiusMeters") int radiusMeters,
      @Param("category") String category,
      Pageable pageable);

  @Query(
      value = """
      SELECT DISTINCT p.*
      FROM places p
      WHERE p.deleted = false
        AND (:category IS NULL OR p.category = CAST(:category AS VARCHAR))
        AND ST_DWithin(
          p.location,
          ST_GeogFromText(:trackWkt),
          p.visit_radius_meters
        )
      """,
      countQuery = """
      SELECT COUNT(DISTINCT p.id)
      FROM places p
      WHERE p.deleted = false
        AND (:category IS NULL OR p.category = CAST(:category AS VARCHAR))
        AND ST_DWithin(
          p.location,
          ST_GeogFromText(:trackWkt),
          p.visit_radius_meters
        )
      """,
      nativeQuery = true)
  Page<Place> findPlacesIntersectingTrack(
      @Param("trackWkt") String trackWkt,
      @Param("category") String category,
      Pageable pageable);

  Page<Place> findByCategory(PlaceCategory category, Pageable pageable);
}
