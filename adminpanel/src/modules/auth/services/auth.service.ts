import { apiClient } from "@/src/api/client/axios-client";
import { API_ENDPOINTS } from "@/src/constants/api-endpoints";

import type {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthLogoutResponse,
  AuthMeResponse,
  AuthRefreshRequest,
  AuthRefreshResponse,
} from "@/src/modules/auth/types";

export const authService = {
  login: (payload: AuthLoginRequest): Promise<AuthLoginResponse> =>
    apiClient.post<AuthLoginResponse, AuthLoginRequest>(API_ENDPOINTS.auth.login, payload),
  refresh: (payload: AuthRefreshRequest): Promise<AuthRefreshResponse> =>
    apiClient.post<AuthRefreshResponse, AuthRefreshRequest>(API_ENDPOINTS.auth.refresh, payload),
  logout: (payload: AuthRefreshRequest): Promise<AuthLogoutResponse> =>
    apiClient.post<AuthLogoutResponse, AuthRefreshRequest>(API_ENDPOINTS.auth.logout, payload),
  me: async (): Promise<AuthMeResponse> => {
    const response = await apiClient.get<AuthMeResponse>(API_ENDPOINTS.auth.me);
    return response;
  },
};
