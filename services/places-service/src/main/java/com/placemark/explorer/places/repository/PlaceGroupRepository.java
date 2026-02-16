package com.placemark.explorer.places.repository;

import com.placemark.explorer.places.domain.PlaceGroup;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlaceGroupRepository extends JpaRepository<PlaceGroup, UUID> {}
