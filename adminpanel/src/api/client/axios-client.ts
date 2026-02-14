import { refreshAccessToken } from "@/src/api/client/refresh-queue";
import { normalizeApiError } from "@/src/api/utils/error-normalizer";
import { tokenStorage } from "@/src/auth/storage/token-storage";
import { env } from "@/src/config/env";
import { API_ENDPOINTS } from "@/src/constants/api-endpoints";
import { APP_ROUTES } from "@/src/constants/routes";

export class ApiHttpError extends Error {
  status?: number;
  data?: unknown;

  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = "ApiHttpError";
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions extends RequestInit {
  retry?: boolean;
  timeoutMs?: number;
}

const nonRefreshableEndpoints = new Set<string>([
  API_ENDPOINTS.auth.login,
  API_ENDPOINTS.auth.logout,
  API_ENDPOINTS.auth.refresh,
]);

const redirectToSessionExpired = (): void => {
  if (typeof window !== "undefined") {
    window.location.replace(APP_ROUTES.auth.sessionExpired);
  }
};

const withTimeoutSignal = (timeoutMs: number, externalSignal?: AbortSignal | null): AbortSignal => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  if (externalSignal) {
    externalSignal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  controller.signal.addEventListener(
    "abort",
    () => {
      clearTimeout(timeout);
    },
    { once: true },
  );

  return controller.signal;
};

const request = async <TResponse>(path: string, options: RequestOptions = {}): Promise<TResponse> => {
  const accessToken = tokenStorage.getAccessToken();
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${env.apiBaseUrl}${path.replace(env.apiBaseUrl, "")}`, {
    ...options,
    headers,
    signal: withTimeoutSignal(options.timeoutMs ?? env.requestTimeoutMs, options.signal),
    credentials: "include",
  });

  const contentType = response.headers.get("content-type") ?? "";
  const responseData = contentType.includes("application/json")
    ? ((await response.json()) as unknown)
    : ((await response.text()) as unknown);

  if (response.ok) {
    return responseData as TResponse;
  }

  const shouldAttemptRefresh = !options.retry && response.status === 401 && !nonRefreshableEndpoints.has(path);

  if (shouldAttemptRefresh) {
    try {
      const nextToken = await refreshAccessToken(apiClient);
      headers.set("Authorization", `Bearer ${nextToken}`);

      return request<TResponse>(path, {
        ...options,
        retry: true,
        headers,
      });
    } catch (error) {
      tokenStorage.clearTokens();
      redirectToSessionExpired();
      throw normalizeApiError(error);
    }
  }

  throw new ApiHttpError(response.statusText, response.status, responseData);
};

export const apiClient = {
  get: <TResponse>(path: string, signal?: AbortSignal): Promise<TResponse> =>
    request<TResponse>(path, { method: "GET", signal }),
  post: <TResponse, TPayload = unknown>(
    path: string,
    payload?: TPayload,
    signal?: AbortSignal,
  ): Promise<TResponse> =>
    request<TResponse>(path, {
      method: "POST",
      body: payload ? JSON.stringify(payload) : undefined,
      signal,
    }),
};
