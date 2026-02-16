CREATE TABLE places (
  id UUID PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(64) NOT NULL,
  location GEOGRAPHY(Point, 4326) NOT NULL,
  visit_radius_meters INTEGER NOT NULL CHECK (visit_radius_meters > 0),
  deleted BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE place_groups (
  id UUID PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  deleted BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE place_group_membership (
  place_id UUID NOT NULL,
  group_id UUID NOT NULL,
  PRIMARY KEY (place_id, group_id),
  CONSTRAINT fk_membership_place FOREIGN KEY (place_id) REFERENCES places(id),
  CONSTRAINT fk_membership_group FOREIGN KEY (group_id) REFERENCES place_groups(id)
);

CREATE INDEX idx_places_location_gist ON places USING GIST (location);
CREATE INDEX idx_places_category ON places (category);
CREATE INDEX idx_places_deleted ON places (deleted);
CREATE INDEX idx_groups_deleted ON place_groups (deleted);
CREATE INDEX idx_membership_group_id ON place_group_membership (group_id);
