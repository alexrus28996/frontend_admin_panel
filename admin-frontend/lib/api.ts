// ============================================================
// API Client — uses APP_CONFIG, supports auto‑refresh, idempotency
// Based on AUTH_FLOW.md & FRONTEND_INTEGRATION.md
// ============================================================

import { APP_CONFIG } from './config';

// --------------- Token management ---------------
let accessToken: string | null = null;
let refreshTokenValue: string | null = null;
let refreshTimer: ReturnType<typeof setTimeout> | null = null;

export function setTokens(access: string, refresh: string) {
  accessToken = access;
  refreshTokenValue = refresh;
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('accessToken', access);
    sessionStorage.setItem('refreshToken', refresh);
  }
  scheduleTokenRefresh();
}

export function getAccessToken(): string | null {
  if (accessToken) return accessToken;
  if (typeof window !== 'undefined') {
    accessToken = sessionStorage.getItem('accessToken');
  }
  return accessToken;
}

export function getRefreshToken(): string | null {
  if (refreshTokenValue) return refreshTokenValue;
  if (typeof window !== 'undefined') {
    refreshTokenValue = sessionStorage.getItem('refreshToken');
  }
  return refreshTokenValue;
}

export function clearTokens() {
  accessToken = null;
  refreshTokenValue = null;
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = null;
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');
  }
}

export function setUser(user: unknown) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('user', JSON.stringify(user));
  }
}

export function getStoredUser() {
  if (typeof window !== 'undefined') {
    const u = sessionStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }
  return null;
}

// --------------- Token refresh ---------------
function scheduleTokenRefresh() {
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = setTimeout(performRefresh, APP_CONFIG.tokenRefreshInterval);
}

async function performRefresh() {
  const rt = getRefreshToken();
  if (!rt) return;
  try {
    const res = await fetch(`${APP_CONFIG.apiBaseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: rt }),
    });
    if (res.ok) {
      const data = await res.json();
      setTokens(data.token, data.refreshToken);
      if (data.user) setUser(data.user);
    } else {
      clearTokens();
      if (typeof window !== 'undefined') window.location.href = '/login';
    }
  } catch {
    // Network error — retry after delay
    refreshTimer = setTimeout(performRefresh, APP_CONFIG.refreshRetryDelay);
  }
}

// --------------- Error class ---------------
export class ApiError extends Error {
  code: string;
  httpStatus: number;
  details?: Array<{ path: string; message: string }>;

  constructor(
    code: string,
    message: string,
    httpStatus: number,
    details?: Array<{ path: string; message: string }>,
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.httpStatus = httpStatus;
    this.details = details;
  }
}

// --------------- Core fetch wrapper ---------------
interface CallOptions {
  isFormData?: boolean;
  idempotencyKey?: string;
  responseType?: 'blob' | 'json';
}

async function apiCall<T = unknown>(
  method: string,
  path: string,
  body?: unknown,
  options: CallOptions = {},
): Promise<T> {
  const url = `${APP_CONFIG.apiBaseUrl}${path}`;
  const headers: Record<string, string> = {};

  if (!options.isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.idempotencyKey) {
    headers['Idempotency-Key'] = options.idempotencyKey;
  }

  const init: RequestInit = { method, headers };
  if (body !== undefined && body !== null) {
    init.body = options.isFormData ? (body as FormData) : JSON.stringify(body);
  }

  let res = await fetch(url, init);

  // Auto‑refresh on 401 (one retry)
  if (res.status === 401 && getRefreshToken()) {
    await performRefresh();
    const newToken = getAccessToken();
    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(url, { ...init, headers });
    }
  }

  if (!res.ok) {
    let errorData: { code?: string; message?: string; details?: Array<{ path: string; message: string }> } = {
      code: 'UNKNOWN_ERROR',
      message: res.statusText,
    };
    try {
      errorData = await res.json();
    } catch {
      // response body is not JSON
    }
    throw new ApiError(
      errorData.code || 'UNKNOWN_ERROR',
      errorData.message || res.statusText,
      res.status,
      errorData.details,
    );
  }

  if (res.status === 204) return null as T;
  if (options.responseType === 'blob') return (await res.blob()) as T;
  return res.json();
}

// --------------- Public API ---------------
export const api = {
  get: <T = unknown>(path: string, options?: { responseType?: 'blob' | 'json' }) =>
    apiCall<T>('GET', path, undefined, options),

  post: <T = unknown>(
    path: string,
    body?: unknown,
    options?: { isFormData?: boolean; idempotencyKey?: string },
  ) => apiCall<T>('POST', path, body, options),

  put: <T = unknown>(path: string, body?: unknown) =>
    apiCall<T>('PUT', path, body),

  patch: <T = unknown>(path: string, body?: unknown) =>
    apiCall<T>('PATCH', path, body),

  delete: <T = unknown>(path: string) =>
    apiCall<T>('DELETE', path),
};
