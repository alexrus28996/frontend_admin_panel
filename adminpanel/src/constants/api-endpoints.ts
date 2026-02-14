const withId = (path: string, id: string | number): string => `${path}/${id}`;

export const API_ENDPOINTS = {
  health: "/health",
  auth: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    me: "/api/auth/me",
    refresh: "/api/auth/refresh",
    register: "/api/auth/register",
    email: {
      verify: "/api/auth/email/verify",
      verifyRequest: "/api/auth/email/verify/request",
      changeRequest: "/api/auth/email/change/request",
    },
    password: {
      change: "/api/auth/password/change",
      forgot: "/api/auth/password/forgot",
      reset: "/api/auth/password/reset",
    },
    preferences: "/api/auth/preferences",
    profile: "/api/auth/profile",
  },
  admin: {
    users: "/api/admin/users",
    userById: (id: string | number): string => withId("/api/admin/users", id),
    userPromote: (id: string | number): string => `${withId("/api/admin/users", id)}/promote`,
    userDemote: (id: string | number): string => `${withId("/api/admin/users", id)}/demote`,
    userPermissions: (id: string | number): string => `${withId("/api/admin/users", id)}/permissions`,
    metrics: "/api/admin/metrics",
    reports: {
      sales: "/api/admin/reports/sales",
      topProducts: "/api/admin/reports/top-products",
      topCustomers: "/api/admin/reports/top-customers",
    },
  },
} as const;
