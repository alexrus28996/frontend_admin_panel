import type { PaginatedResponse } from "@/src/api/types/common";

export interface UsersQueryParams {
  q?: string;
  page?: number;
  limit?: number;
}

export type UserRecord = Record<string, unknown>;

export interface UserListItem {
  id: string | null;
  data: UserRecord;
}

// TODO(/api/admin/users): IMPLEMENTED_API_DOCUMENTATION.md does not provide response item fields.
export type UsersListResponse = PaginatedResponse<UserListItem>;

// TODO(/api/admin/users/{id}): IMPLEMENTED_API_DOCUMENTATION.md does not provide response fields.
export interface UserDetailsResponse {
  id: string;
  data: UserRecord;
}

// TODO(/api/admin/users/{id}/permissions): IMPLEMENTED_API_DOCUMENTATION.md does not provide response fields.
export interface UserPermissionsResponse {
  id: string;
  permissions: string[];
}

export interface UserPermissionMutationPayload {
  permissions: string[];
}
