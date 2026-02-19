import { PageableResponse, PlaceCategory, PlaceResponse } from "../lib/types";
import { toQueryString } from "../lib/query";
import { apiRequest } from "./http";

export interface CreatePlacePayload {
  name: string;
  description?: string;
  category: PlaceCategory;
  latitude: number;
  longitude: number;
  visitRadiusMeters: number;
}

interface PlacesQuery {
  page?: number;
  size?: number;
  category?: PlaceCategory;
}

interface NearPlacesQuery extends PlacesQuery {
  lat: number;
  lon: number;
  radiusMeters: number;
}

export const placesApi = {
  list(query: PlacesQuery): Promise<PageableResponse<PlaceResponse>> {
    const qs = toQueryString({
      page: query.page ?? 0,
      size: query.size ?? 20,
      category: query.category
    });
    return apiRequest<PageableResponse<PlaceResponse>>(`/v1/places?${qs}`);
  },
  getById(id: string): Promise<PlaceResponse> {
    return apiRequest<PlaceResponse>(`/v1/places/${id}`);
  },
  create(payload: CreatePlacePayload): Promise<PlaceResponse> {
    return apiRequest<PlaceResponse>("/v1/places", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  remove(id: string): Promise<void> {
    return apiRequest<void>(`/v1/places/${id}`, {
      method: "DELETE"
    });
  },
  near(query: NearPlacesQuery): Promise<PageableResponse<PlaceResponse>> {
    const qs = toQueryString({
      lat: query.lat,
      lon: query.lon,
      radiusMeters: query.radiusMeters,
      page: query.page ?? 0,
      size: query.size ?? 20,
      category: query.category
    });
    return apiRequest<PageableResponse<PlaceResponse>>(`/v1/places/near?${qs}`);
  }
};
