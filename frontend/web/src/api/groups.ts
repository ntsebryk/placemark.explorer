import { PageableResponse, PlaceGroupResponse } from "../lib/types";
import { toQueryString } from "../lib/query";
import { apiRequest } from "./http";

interface GroupsQuery {
  page?: number;
  size?: number;
}

export const groupsApi = {
  list(query: GroupsQuery): Promise<PageableResponse<PlaceGroupResponse>> {
    const qs = toQueryString({
      page: query.page ?? 0,
      size: query.size ?? 20
    });
    return apiRequest<PageableResponse<PlaceGroupResponse>>(`/v1/groups?${qs}`);
  },
  getById(id: string): Promise<PlaceGroupResponse> {
    return apiRequest<PlaceGroupResponse>(`/v1/groups/${id}`);
  },
  create(payload: { name: string; description?: string }): Promise<PlaceGroupResponse> {
    return apiRequest<PlaceGroupResponse>("/v1/groups", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  remove(id: string): Promise<void> {
    return apiRequest<void>(`/v1/groups/${id}`, {
      method: "DELETE"
    });
  },
  addPlace(groupId: string, placeId: string): Promise<PlaceGroupResponse> {
    return apiRequest<PlaceGroupResponse>(`/v1/groups/${groupId}/places/${placeId}`, {
      method: "POST"
    });
  },
  removePlace(groupId: string, placeId: string): Promise<PlaceGroupResponse> {
    return apiRequest<PlaceGroupResponse>(`/v1/groups/${groupId}/places/${placeId}`, {
      method: "DELETE"
    });
  }
};
