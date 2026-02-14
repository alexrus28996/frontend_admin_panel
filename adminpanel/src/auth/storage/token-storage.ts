import { env } from "@/src/config/env";

import type { Nullable } from "@/src/api/types/common";
import type { TokenPair } from "@/src/auth/types/auth";

const cookieMaxAgeSeconds = 60 * 60 * 24 * 7;

const parseCookies = (): Record<string, string> => {
  if (typeof document === "undefined") {
    return {};
  }

  return document.cookie.split(";").reduce<Record<string, string>>((acc, part) => {
    const [rawKey, rawValue] = part.split("=");

    if (!rawKey || typeof rawValue === "undefined") {
      return acc;
    }

    acc[rawKey.trim()] = decodeURIComponent(rawValue.trim());
    return acc;
  }, {});
};

const setCookie = (name: string, value: string): void => {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${cookieMaxAgeSeconds};samesite=lax`;
};

const clearCookie = (name: string): void => {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=;path=/;max-age=0;samesite=lax`;
};

export const tokenStorage = {
  getAccessToken(): Nullable<string> {
    const cookies = parseCookies();
    return cookies[env.authCookieName] ?? null;
  },
  getRefreshToken(): Nullable<string> {
    const cookies = parseCookies();
    return cookies[env.refreshCookieName] ?? null;
  },
  setTokens(tokens: TokenPair): void {
    setCookie(env.authCookieName, tokens.accessToken);
    setCookie(env.refreshCookieName, tokens.refreshToken);
  },
  clearTokens(): void {
    clearCookie(env.authCookieName);
    clearCookie(env.refreshCookieName);
  },
};
