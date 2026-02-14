import { STORAGE_KEYS } from "@/src/constants/storage-keys";

const getEnvValue = (value: string | undefined, fallback = ""): string => {
  if (typeof value === "undefined") {
    return fallback;
  }

  return value;
};

export const env = {
  appName: getEnvValue(process.env.NEXT_PUBLIC_APP_NAME, "Enterprise Admin Panel"),
  appUrl: getEnvValue(process.env.NEXT_PUBLIC_APP_URL, "http://localhost:4001"),
  apiBaseUrl: getEnvValue(process.env.NEXT_PUBLIC_API_BASE_URL, "http://localhost:4001"),
  authCookieName: getEnvValue(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME, STORAGE_KEYS.accessToken),
  refreshCookieName: getEnvValue(process.env.NEXT_PUBLIC_REFRESH_COOKIE_NAME, STORAGE_KEYS.refreshToken),
  requestTimeoutMs: Number(process.env.NEXT_PUBLIC_REQUEST_TIMEOUT_MS ?? "15000"),
  enableUsersDebugLogs: process.env.NEXT_PUBLIC_ENABLE_USERS_DEBUG_LOGS === "true",
} as const;

export type EnvConfig = typeof env;
