import { env } from "@/src/config/env";
import { tokenStorage } from "@/src/auth/storage/token-storage";
import { getSingleFlightRefreshToken } from "@/src/api/client/refresh-queue";
import { normalizeApiError } from "@/src/api/utils/error-normalizer";

export class ApiHttpError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiHttpError";
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions extends RequestInit {
  retry?: boolean;
}

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
  });

  const contentType = response.headers.get("content-type") ?? "";
  const responseData = contentType.includes("application/json")
    ? ((await response.json()) as unknown)
    : ((await response.text()) as unknown);

  if (response.ok) {
    return responseData as TResponse;
  }

  if (response.status === 401 && !options.retry) {
    try {
      const nextToken = await getSingleFlightRefreshToken(apiClient);
      headers.set("Authorization", `Bearer ${nextToken}`);

      return request<TResponse>(path, {
        ...options,
        retry: true,
        headers,
      });
    } catch (error) {
      tokenStorage.clearTokens();
      throw normalizeApiError(error);
    }
  }

  throw new ApiHttpError(response.statusText, response.status, responseData);
};

export const apiClient = {
  get: <TResponse>(path: string): Promise<TResponse> => request<TResponse>(path, { method: "GET" }),
  post: <TResponse, TPayload = unknown>(path: string, payload?: TPayload): Promise<TResponse> =>
    request<TResponse>(path, {
      method: "POST",
      body: payload ? JSON.stringify(payload) : undefined,
    }),
};
