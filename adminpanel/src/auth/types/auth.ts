import type { Nullable } from "@/src/api/types/common";
import type { AuthUser } from "@/src/modules/auth/types";

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
