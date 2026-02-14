const getEnvValue = (value: string | undefined, fallback = ""): string => {
  if (typeof value === "undefined") {
    return fallback;
  }

  return value;
};

export const env = {
  appName: getEnvValue(process.env.NEXT_PUBLIC_APP_NAME, "Enterprise Admin Panel"),
  appUrl: getEnvValue(process.env.NEXT_PUBLIC_APP_URL, "http://localhost:3000"),
  apiBaseUrl: getEnvValue(process.env.NEXT_PUBLIC_API_BASE_URL, "/api"),
  authCookieName: getEnvValue(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME, "admin_access_token"),
  refreshCookieName: getEnvValue(
    process.env.NEXT_PUBLIC_REFRESH_COOKIE_NAME,
    "admin_refresh_token",
  ),
  requestTimeoutMs: Number(process.env.NEXT_PUBLIC_REQUEST_TIMEOUT_MS ?? "15000"),
} as const;

export type EnvConfig = typeof env;
