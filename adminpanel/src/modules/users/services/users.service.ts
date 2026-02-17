import { apiClient } from "@/src/api/client/axios-client";
import { env } from "@/src/config/env";
import { API_ENDPOINTS } from "@/src/constants/api-endpoints";

import type {
  CreateUserPayload,
  UnknownRecord,
  UserDetailResponse,
  UserPermissionMutationPayload,
  UserPermissionsResponse,
  UsersListResponse,
  UsersListResult,
  UsersQueryParams,
} from "@/src/modules/users/types";

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

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

const toUsersListResult = (response: UsersListResponse): UsersListResult => {
  if (Array.isArray(response)) {
    return { rows: response.filter(isRecord), unknownSchema: false, raw: response };
  }

  if (isRecord(response) && Array.isArray(response.data)) {
    return { rows: response.data.filter(isRecord), unknownSchema: false, raw: response };
  }

  if (isRecord(response) && response.success === true && isRecord(response.data) && Array.isArray(response.data.data)) {
    return { rows: response.data.data.filter(isRecord), unknownSchema: false, raw: response };
  }

  if (isRecord(response) && response.success === true && Array.isArray(response.data)) {
    return { rows: response.data.filter(isRecord), unknownSchema: false, raw: response };
  }

  if (env.enableUsersDebugLogs) {
    console.log("[Users] unknown users list schema:", response);
  }

  return { rows: [], unknownSchema: true, raw: response };
};

export const usersService = {
  async getUsers(params?: UsersQueryParams): Promise<UsersListResult> {
    const response = await apiClient.get<UsersListResponse>(withQueryParams(params));
    return toUsersListResult(response);
  },

  getUserById(id: string): Promise<UserDetailResponse> {
    return apiClient.get<UserDetailResponse>(API_ENDPOINTS.admin.userById(id));
  },

  createUser(payload: CreateUserPayload): Promise<unknown> {
    return apiClient.post(API_ENDPOINTS.auth.register, payload);
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
