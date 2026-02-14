import { API_ENDPOINTS } from "@/src/constants/api-endpoints";
import { tokenStorage } from "@/src/auth/storage/token-storage";

interface RefreshResponse {
  token: string;
  refreshToken: string;
}

interface RefreshClient {
  post: <TResponse, TPayload = unknown>(path: string, payload?: TPayload) => Promise<TResponse>;
}

let activeRefreshPromise: Promise<string> | null = null;

const requestTokenRefresh = async (client: RefreshClient): Promise<string> => {
  const refreshToken = tokenStorage.getRefreshToken();

  if (!refreshToken) {
    throw new Error("MISSING_REFRESH_TOKEN");
  }

  const data = await client.post<RefreshResponse, { refreshToken: string }>(API_ENDPOINTS.auth.refresh, {
    refreshToken,
  });

  tokenStorage.setTokens({
    accessToken: data.token,
    refreshToken: data.refreshToken,
  });

  return data.token;
};

export const getSingleFlightRefreshToken = async (client: RefreshClient): Promise<string> => {
  if (!activeRefreshPromise) {
    activeRefreshPromise = requestTokenRefresh(client).finally(() => {
      activeRefreshPromise = null;
    });
  }

  return activeRefreshPromise;
};
