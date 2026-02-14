import type { Nullable } from "@/src/api/types/common";
import type { AppPermission } from "@/src/constants/permissions";
import type { AppRole } from "@/src/constants/roles";

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: AppRole[];
  permissions: AppPermission[];
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthSession extends TokenPair {
  user: AuthUser;
}

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: Nullable<AuthUser>;
}
