import { apiClient } from "@/src/api/client/axios-client";
import { API_ENDPOINTS } from "@/src/constants/api-endpoints";

import type {
  UserDetailsResponse,
  UserListItem,
  UserPermissionMutationPayload,
  UserPermissionsResponse,
  UserRecord,
  UsersListResponse,
  UsersQueryParams,
} from "@/src/modules/users/types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const unwrapResponseData = (response: unknown): unknown => {
  if (isRecord(response) && "data" in response) {
    return response.data;
  }

  return response;
};

const resolveUserId = (value: unknown): string | null => {
  if (!isRecord(value)) {
    return null;
  }

  const directId = value.id;
  if (typeof directId === "string" || typeof directId === "number") {
    return String(directId);
  }

  const nestedUserId = value.userId;
  if (typeof nestedUserId === "string" || typeof nestedUserId === "number") {
    return String(nestedUserId);
  }

  return null;
};

const normalizeUserListItems = (payload: unknown): UserListItem[] => {
  if (Array.isArray(payload)) {
    return payload
      .filter((item): item is UserRecord => isRecord(item))
      .map((item) => ({
        id: resolveUserId(item),
        data: item,
      }));
  }

  if (!isRecord(payload)) {
    return [];
  }

  const candidates = [payload.items, payload.rows, payload.users];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate
        .filter((item): item is UserRecord => isRecord(item))
        .map((item) => ({
          id: resolveUserId(item),
          data: item,
        }));
    }
  }

  return [];
};

const normalizeUsersListResponse = (response: unknown): UsersListResponse => {
  const payload = unwrapResponseData(response);

  if (!isRecord(payload)) {
    return { items: [], page: 1, pageSize: 10, totalItems: 0, totalPages: 1 };
  }

  const items = normalizeUserListItems(payload);
  const page = typeof payload.page === "number" ? payload.page : 1;
  const pageSize = typeof payload.pageSize === "number"
    ? payload.pageSize
    : typeof payload.limit === "number"
      ? payload.limit
      : 10;
  const totalItems = typeof payload.totalItems === "number"
    ? payload.totalItems
    : typeof payload.total === "number"
      ? payload.total
      : items.length;
  const totalPages = typeof payload.totalPages === "number"
    ? payload.totalPages
    : Math.max(1, Math.ceil(totalItems / pageSize));

  return { items, page, pageSize, totalItems, totalPages };
};

const normalizeUserDetails = (id: string, response: unknown): UserDetailsResponse => {
  const payload = unwrapResponseData(response);

  if (isRecord(payload)) {
    return {
      id,
      data: payload,
    };
  }

  return {
    id,
    data: {},
  };
};

const normalizePermissions = (id: string, response: unknown): UserPermissionsResponse => {
  const payload = unwrapResponseData(response);

  if (Array.isArray(payload)) {
    return {
      id,
      permissions: payload.filter((entry): entry is string => typeof entry === "string"),
    };
  }

  if (!isRecord(payload)) {
    return { id, permissions: [] };
  }

  const permissionsSource = payload.permissions;
  if (Array.isArray(permissionsSource)) {
    return {
      id,
      permissions: permissionsSource.filter((entry): entry is string => typeof entry === "string"),
    };
  }

  return { id, permissions: [] };
};

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
    const response = await apiClient.get<unknown>(withQueryParams(params));
    return normalizeUsersListResponse(response);
  },

  async getUserById(id: string): Promise<UserDetailsResponse> {
    const response = await apiClient.get<unknown>(API_ENDPOINTS.admin.userById(id));
    return normalizeUserDetails(id, response);
  },

  async promoteUser(id: string): Promise<UserDetailsResponse> {
    const response = await apiClient.post<unknown>(API_ENDPOINTS.admin.userPromote(id));
    return normalizeUserDetails(id, response);
  },

  async demoteUser(id: string): Promise<UserDetailsResponse> {
    const response = await apiClient.post<unknown>(API_ENDPOINTS.admin.userDemote(id));
    return normalizeUserDetails(id, response);
  },

  async getUserPermissions(id: string): Promise<UserPermissionsResponse> {
    const response = await apiClient.get<unknown>(API_ENDPOINTS.admin.userPermissions(id));
    return normalizePermissions(id, response);
  },

  async addUserPermission(id: string, permission: string): Promise<UserPermissionsResponse> {
    const payload: UserPermissionMutationPayload = { permissions: [permission] };
    const response = await apiClient.post<unknown, UserPermissionMutationPayload>(
      API_ENDPOINTS.admin.userPermissionsAdd(id),
      payload,
    );

    return normalizePermissions(id, response);
  },

  async removeUserPermission(id: string, permission: string): Promise<UserPermissionsResponse> {
    const payload: UserPermissionMutationPayload = { permissions: [permission] };
    const response = await apiClient.post<unknown, UserPermissionMutationPayload>(
      API_ENDPOINTS.admin.userPermissionsRemove(id),
      payload,
    );

    return normalizePermissions(id, response);
  },
};
