import { tokenStorage } from "@/src/auth/storage/token-storage";
import { APP_ROUTES } from "@/src/constants/routes";

interface RefreshResponse {
  token: string;
  refreshToken: string;
}

interface RefreshClient {
  refresh: (refreshToken: string) => Promise<RefreshResponse>;
}

let isRefreshing = false;
let waitingQueue: Array<{ resolve: (token: string) => void; reject: (error: Error) => void }> = [];

const flushQueueSuccess = (token: string): void => {
  waitingQueue.forEach((item) => item.resolve(token));
  waitingQueue = [];
};

const flushQueueError = (error: Error): void => {
  waitingQueue.forEach((item) => item.reject(error));
  waitingQueue = [];
};

const enqueueWaitingRequest = (): Promise<string> =>
  new Promise((resolve, reject) => {
    waitingQueue.push({ resolve, reject });
  });

const handleRefreshFailure = (error: Error): never => {
  tokenStorage.clearTokens();

  if (typeof window !== "undefined") {
    window.location.replace(APP_ROUTES.auth.login);
  }

  throw error;
};

export const refreshAccessToken = async (client: RefreshClient): Promise<string> => {
  if (isRefreshing) {
    return enqueueWaitingRequest();
  }

  const refreshToken = tokenStorage.getRefreshToken();

  if (!refreshToken) {
    handleRefreshFailure(new Error("AUTH_REFRESH_TOKEN_MISSING"));
  }

  isRefreshing = true;

  try {
    const data = await client.refresh(refreshToken);

    tokenStorage.setTokens({
      accessToken: data.token,
      refreshToken: data.refreshToken,
    });

    flushQueueSuccess(data.token);
    return data.token;
  } catch (error) {
    const refreshError = error instanceof Error ? error : new Error("AUTH_REFRESH_FAILED");
    flushQueueError(refreshError);
    handleRefreshFailure(refreshError);
  } finally {
    isRefreshing = false;
  }
};
