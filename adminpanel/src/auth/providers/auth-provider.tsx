"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { authService } from "@/src/auth/services/auth-service";
import { tokenStorage } from "@/src/auth/storage/token-storage";
import { APP_ROUTES } from "@/src/constants/routes";

import type { AuthSession, AuthState } from "@/src/auth/types/auth";

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const initialState: AuthState = {
  isLoading: true,
  isAuthenticated: false,
  user: null,
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const router = useRouter();

  const applySession = useCallback((session: AuthSession) => {
    tokenStorage.setTokens({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    });

    setState({
      isLoading: false,
      isAuthenticated: true,
      user: session.user,
    });
  }, []);

  const clearSession = useCallback(() => {
    tokenStorage.clearTokens();
    setState({ isLoading: false, isAuthenticated: false, user: null });
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const user = await authService.me();
      setState((prev) => ({ ...prev, isLoading: false, isAuthenticated: true, user }));
    } catch {
      clearSession();
      router.replace(APP_ROUTES.auth.sessionExpired);
    }
  }, [clearSession, router]);

  const login = useCallback(
    async (email: string, password: string) => {
      const session = await authService.login({ email, password });
      applySession(session);
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    const refreshToken = tokenStorage.getRefreshToken();

    try {
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } finally {
      clearSession();
    }
  }, [clearSession]);

  useEffect(() => {
    const bootstrap = async () => {
      const accessToken = tokenStorage.getAccessToken();
      const refreshToken = tokenStorage.getRefreshToken();

      if (!accessToken && !refreshToken) {
        setState({ isLoading: false, isAuthenticated: false, user: null });
        return;
      }

      if (!accessToken && refreshToken) {
        try {
          const refreshedSession = await authService.refresh(refreshToken);
          tokenStorage.setTokens({
            accessToken: refreshedSession.token,
            refreshToken: refreshedSession.refreshToken,
          });
        } catch {
          clearSession();
          router.replace(APP_ROUTES.auth.sessionExpired);
          return;
        }
      }

      await refreshProfile();
    };

    void bootstrap();
  }, [clearSession, refreshProfile, router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      logout,
      refreshProfile,
    }),
    [login, logout, refreshProfile, state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("AUTH_PROVIDER_MISSING");
  }

  return context;
};
