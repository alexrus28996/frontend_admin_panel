'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  api,
  setTokens,
  setUser,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
} from './api';
import { APP_CONFIG } from './config';
import type { User, LoginResponse } from './types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    const storedUser = getStoredUser();
    if (token && storedUser) {
      setUserState(storedUser);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await api.post<LoginResponse>('/auth/login', { email, password });
    setTokens(data.token, data.refreshToken);
    setUser(data.user);
    setUserState(data.user);
  }, []);

  const logout = useCallback(async () => {
    const rt = getRefreshToken();
    try {
      // AUTH_FLOW.md: POST /auth/logout with { refreshToken }
      await api.post('/auth/logout', { refreshToken: rt });
    } catch {
      // proceed with local cleanup even if server call fails
    }
    clearTokens();
    setUserState(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, []);

  const isAdmin = user?.roles?.includes('admin') ?? false;

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user) return false;
      // admin role bypasses all permission checks
      if (user.roles?.includes('admin')) return true;
      // Check if user has any of the admin roles that can access the panel
      const hasAdminRole = APP_CONFIG.adminRoles.some((r) => user.roles?.includes(r));
      if (!hasAdminRole) return false;
      return user.permissions?.includes(permission) ?? false;
    },
    [user],
  );

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
