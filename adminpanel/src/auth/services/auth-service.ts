import { apiClient } from "@/src/api/client/axios-client";
import { API_ENDPOINTS } from "@/src/constants/api-endpoints";

import type { AuthSession, AuthUser } from "@/src/auth/types/auth";

interface LoginInput {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: AuthUser;
}

interface RefreshResponse {
  token: string;
  refreshToken: string;
}

export const authService = {
  async login(input: LoginInput): Promise<AuthSession> {
    const data = await apiClient.post<LoginResponse, LoginInput>(API_ENDPOINTS.auth.login, input);

    return {
      accessToken: data.token,
      refreshToken: data.refreshToken,
      user: data.user,
    };
  },
  async logout(refreshToken: string): Promise<void> {
    await apiClient.post<unknown, { refreshToken: string }>(API_ENDPOINTS.auth.logout, { refreshToken });
  },
  async me(): Promise<AuthUser> {
    return apiClient.get<AuthUser>(API_ENDPOINTS.auth.me);
  },
  async refresh(refreshToken: string): Promise<RefreshResponse> {
    return apiClient.post<RefreshResponse, { refreshToken: string }>(API_ENDPOINTS.auth.refresh, {
      refreshToken,
    });
  },
};
