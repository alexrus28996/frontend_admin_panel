export type ApiEnvelope<T> = {
  success: boolean;
  data: T;
};

export type UnknownRecord = Record<string, unknown>;

export type UsersListResponse = unknown;
export type UserDetailResponse = ApiEnvelope<UnknownRecord> | UnknownRecord;
export type UserPermissionsResponse = ApiEnvelope<UnknownRecord> | UnknownRecord;

export interface UsersQueryParams {
  q?: string;
  page?: number;
  limit?: number;
}

export interface UserPermissionMutationPayload {
  permissions: string[];
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
}

export interface UsersListResult {
  rows: UnknownRecord[];
  unknownSchema: boolean;
  raw: unknown;
}
