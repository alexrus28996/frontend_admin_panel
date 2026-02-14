import { tokenStorage } from "@/src/auth/storage/token-storage";
import { API_ENDPOINTS } from "@/src/constants/api-endpoints";

interface RefreshResponse {
  token: string;
  refreshToken: string;
}

interface RefreshClient {
  post: <TResponse, TPayload = unknown>(path: string, payload?: TPayload, signal?: AbortSignal) => Promise<TResponse>;
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

export const refreshAccessToken = async (client: RefreshClient): Promise<string> => {
  if (isRefreshing) {
    return enqueueWaitingRequest();
  }

  isRefreshing = true;

  try {
    const data = await client.post<RefreshResponse>(API_ENDPOINTS.auth.refresh);

    tokenStorage.setTokens({
      accessToken: data.token,
      refreshToken: data.refreshToken,
    });

    flushQueueSuccess(data.token);
    return data.token;
  } catch (error) {
    const refreshError = error instanceof Error ? error : new Error("REFRESH_FAILED");
    flushQueueError(refreshError);
    throw refreshError;
  } finally {
    isRefreshing = false;
  }
};
