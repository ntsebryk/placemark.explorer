package com.placemark.explorer.places.integration;

import static org.assertj.core.api.Assertions.assertThat;

import com.placemark.explorer.places.domain.Place;
import com.placemark.explorer.places.domain.PlaceCategory;
import com.placemark.explorer.places.repository.PlaceRepository;
import com.placemark.explorer.places.service.PlaceService;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@Testcontainers(disabledWithoutDocker = true)
@SpringBootTest
class PlaceGeoIntegrationTest {

  @Container
  static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgis/postgis:16-3.4")
      .withDatabaseName("places")
      .withUsername("places")
      .withPassword("places");

  @DynamicPropertySource
  static void properties(DynamicPropertyRegistry registry) {
    registry.add("spring.datasource.url", postgres::getJdbcUrl);
    registry.add("spring.datasource.username", postgres::getUsername);
    registry.add("spring.datasource.password", postgres::getPassword);
  }

  @Autowired
  private PlaceRepository placeRepository;

  @Autowired
  private PlaceService placeService;

  @BeforeEach
  void clean() {
    placeRepository.deleteAll();
  }

  @Test
  void shouldFindPlacesNearPoint() {
    Place near = new Place();
    near.setName("Near");
    near.setDescription("Near place");
    near.setCategory(PlaceCategory.LANDMARK);
    near.setVisitRadiusMeters(100);
    near.setLocation(placeService.toPoint(52.5200, 13.4050));

    Place far = new Place();
    far.setName("Far");
    far.setDescription("Far place");
    far.setCategory(PlaceCategory.LANDMARK);
    far.setVisitRadiusMeters(100);
    far.setLocation(placeService.toPoint(48.8566, 2.3522));

    placeRepository.saveAll(List.of(near, far));

    Page<Place> result = placeService.findPlacesNear(52.5200, 13.4050, 500, null, PageRequest.of(0, 20));

    assertThat(result.getContent()).extracting(Place::getName).contains("Near").doesNotContain("Far");
  }

  @Test
  void shouldFindPlacesIntersectingTrack() {
    Place onTrack = new Place();
    onTrack.setName("OnTrack");
    onTrack.setDescription("Should intersect");
    onTrack.setCategory(PlaceCategory.PARK);
    onTrack.setVisitRadiusMeters(150);
    onTrack.setLocation(placeService.toPoint(52.5202, 13.4052));

    Place offTrack = new Place();
    offTrack.setName("OffTrack");
    offTrack.setDescription("Should not intersect");
    offTrack.setCategory(PlaceCategory.PARK);
    offTrack.setVisitRadiusMeters(50);
    offTrack.setLocation(placeService.toPoint(52.5300, 13.4200));

    placeRepository.saveAll(List.of(onTrack, offTrack));

    List<org.locationtech.jts.geom.Point> trackPoints = List.of(
        placeService.toPoint(52.5200, 13.4050),
        placeService.toPoint(52.5203, 13.4053),
        placeService.toPoint(52.5206, 13.4056)
    );

    Page<Place> result = placeService.findPlacesIntersectingTrack(trackPoints, null, PageRequest.of(0, 20));

    assertThat(result.getContent()).extracting(Place::getName).contains("OnTrack").doesNotContain("OffTrack");
  }
}
