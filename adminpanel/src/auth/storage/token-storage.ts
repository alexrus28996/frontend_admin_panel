import { STORAGE_KEYS } from "@/src/constants/storage-keys";

import type { Nullable } from "@/src/api/types/common";
import type { TokenPair } from "@/src/auth/types/auth";

const getFromStorage = (storage: Storage, key: string): Nullable<string> => {
  const value = storage.getItem(key);
  return value && value.length > 0 ? value : null;
};

const removeFromStorage = (storage: Storage, key: string): void => {
  storage.removeItem(key);
};

export const tokenStorage = {
  getAccessToken(): Nullable<string> {
    if (typeof window === "undefined") {
      return null;
    }

    return getFromStorage(window.sessionStorage, STORAGE_KEYS.accessToken)
      ?? getFromStorage(window.localStorage, STORAGE_KEYS.accessToken);
  },
  getRefreshToken(): Nullable<string> {
    if (typeof window === "undefined") {
      return null;
    }

    return getFromStorage(window.sessionStorage, STORAGE_KEYS.refreshToken)
      ?? getFromStorage(window.localStorage, STORAGE_KEYS.refreshToken);
  },
  setTokens(tokens: TokenPair): void {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEYS.accessToken, tokens.accessToken);
    window.sessionStorage.setItem(STORAGE_KEYS.accessToken, tokens.accessToken);

    window.sessionStorage.setItem(STORAGE_KEYS.refreshToken, tokens.refreshToken);
    window.localStorage.removeItem(STORAGE_KEYS.refreshToken);
  },
  clearTokens(): void {
    if (typeof window === "undefined") {
      return;
    }

    removeFromStorage(window.localStorage, STORAGE_KEYS.accessToken);
    removeFromStorage(window.sessionStorage, STORAGE_KEYS.accessToken);
    removeFromStorage(window.localStorage, STORAGE_KEYS.refreshToken);
    removeFromStorage(window.sessionStorage, STORAGE_KEYS.refreshToken);
  },
};
