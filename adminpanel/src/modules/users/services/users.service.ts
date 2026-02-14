import { apiClient } from "@/src/api/client/axios-client";
import { env } from "@/src/config/env";
import { API_ENDPOINTS } from "@/src/constants/api-endpoints";
import { normalizeList } from "@/src/modules/users/utils/response-normalizer";

import type {
  UserDetailResponse,
  UserPermissionMutationPayload,
  UserPermissionsResponse,
  UsersListResponse,
  UsersQueryParams,
} from "@/src/modules/users/types";

const withQueryParams = (params: UsersQueryParams = {}): string => {
  const searchParams = new URLSearchParams();

  if (params.q) {
    searchParams.set("q", params.q);
  }

  if (typeof params.page === "number") {
    searchParams.set("page", String(params.page));
  }

  if (typeof params.limit === "number") {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();
  return query ? `${API_ENDPOINTS.admin.users}?${query}` : API_ENDPOINTS.admin.users;
};

export const usersService = {
  async getUsers(params?: UsersQueryParams): Promise<UsersListResponse> {
    const response = await apiClient.get<UsersListResponse>(withQueryParams(params));

    if (env.enableUsersDebugLogs) {
      console.log("[Users] list raw response:", response);
      console.log("[Users] list normalized count:", normalizeList(response).length);
    }

    return response;
  },

  getUserById(id: string): Promise<UserDetailResponse> {
    return apiClient.get<UserDetailResponse>(API_ENDPOINTS.admin.userById(id));
  },

  promoteUser(id: string): Promise<UserDetailResponse> {
    return apiClient.post<UserDetailResponse>(API_ENDPOINTS.admin.userPromote(id));
  },

  demoteUser(id: string): Promise<UserDetailResponse> {
    return apiClient.post<UserDetailResponse>(API_ENDPOINTS.admin.userDemote(id));
  },

  getUserPermissions(id: string): Promise<UserPermissionsResponse> {
    return apiClient.get<UserPermissionsResponse>(API_ENDPOINTS.admin.userPermissions(id));
  },

  replacePermissions(id: string, permissions: string[]): Promise<UserPermissionsResponse> {
    const payload: UserPermissionMutationPayload = { permissions };
    return apiClient.post<UserPermissionsResponse, UserPermissionMutationPayload>(
      API_ENDPOINTS.admin.userPermissions(id),
      payload,
    );
  },

  addUserPermission(id: string, permissions: string[]): Promise<UserPermissionsResponse> {
    const payload: UserPermissionMutationPayload = { permissions };
    return apiClient.patch<UserPermissionsResponse, UserPermissionMutationPayload>(
      API_ENDPOINTS.admin.userPermissionsAdd(id),
      payload,
    );
  },

  removeUserPermission(id: string, permissions: string[]): Promise<UserPermissionsResponse> {
    const payload: UserPermissionMutationPayload = { permissions };
    return apiClient.patch<UserPermissionsResponse, UserPermissionMutationPayload>(
      API_ENDPOINTS.admin.userPermissionsRemove(id),
      payload,
    );
  },
};
