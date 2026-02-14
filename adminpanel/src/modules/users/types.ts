export type ApiEnvelope<T> = {
  success: boolean;
  data: T;
};

export type UnknownRecord = Record<string, unknown>;

export type UsersListResponse = ApiEnvelope<UnknownRecord[]>;
export type UserDetailResponse = ApiEnvelope<UnknownRecord>;
export type UserPermissionsResponse = ApiEnvelope<UnknownRecord>;

export interface UsersQueryParams {
  q?: string;
  page?: number;
  limit?: number;
}

export interface UserPermissionMutationPayload {
  permissions: string[];
}
