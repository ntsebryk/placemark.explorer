export const PLACE_CATEGORIES = [
  "LANDMARK",
  "MUSEUM",
  "PARK",
  "RESTAURANT",
  "CITY",
  "OTHER"
] as const;

export type PlaceCategory = (typeof PLACE_CATEGORIES)[number];

export interface PlaceResponse {
  id: string;
  name: string;
  description: string | null;
  category: PlaceCategory;
  latitude: number;
  longitude: number;
  visitRadiusMeters: number;
  groupIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PlaceGroupResponse {
  id: string;
  name: string;
  description: string | null;
  placeIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PageableResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ApiErrorResponse {
  timestamp?: string;
  status: number;
  error?: string;
  message: string;
  path?: string;
}
