package com.placemark.explorer.places.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
import org.locationtech.jts.geom.Point;

@Entity
@Table(name = "places")
@SQLDelete(sql = "UPDATE places SET deleted = true, deleted_at = NOW() WHERE id = ?")
@Where(clause = "deleted = false")
public class Place {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false, length = 200)
  private String name;

  @Column(columnDefinition = "TEXT")
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 64)
  private PlaceCategory category;

  @Column(nullable = false, columnDefinition = "geography(Point,4326)")
  private Point location;

  @Column(name = "visit_radius_meters", nullable = false)
  private Integer visitRadiusMeters;

  @Column(nullable = false)
  private boolean deleted = false;

  @Column(name = "deleted_at")
  private Instant deletedAt;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  @ManyToMany
  @JoinTable(
      name = "place_group_membership",
      joinColumns = @JoinColumn(name = "place_id"),
      inverseJoinColumns = @JoinColumn(name = "group_id"))
  private Set<PlaceGroup> groups = new HashSet<>();

  @PrePersist
  void onCreate() {
    Instant now = Instant.now();
    createdAt = now;
    updatedAt = now;
  }

  @PreUpdate
  void onUpdate() {
    updatedAt = Instant.now();
  }

  public UUID getId() { return id; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }
  public PlaceCategory getCategory() { return category; }
  public void setCategory(PlaceCategory category) { this.category = category; }
  public Point getLocation() { return location; }
  public void setLocation(Point location) { this.location = location; }
  public Integer getVisitRadiusMeters() { return visitRadiusMeters; }
  public void setVisitRadiusMeters(Integer visitRadiusMeters) { this.visitRadiusMeters = visitRadiusMeters; }
  public boolean isDeleted() { return deleted; }
  public Instant getDeletedAt() { return deletedAt; }
  public Instant getCreatedAt() { return createdAt; }
  public Instant getUpdatedAt() { return updatedAt; }
  public Set<PlaceGroup> getGroups() { return groups; }
}
