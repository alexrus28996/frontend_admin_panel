export const ROUTES = {
  root: "/",
  auth: {
    login: "/login",
    sessionExpired: "/session-expired",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    verifyEmail: "/verify-email",
    logout: "/logout",
  },
  admin: {
    dashboard: "/admin/dashboard",
    users: "/admin/users",
    roles: "/admin/roles",
    products: "/admin/products",
    categories: "/admin/categories",
    orders: "/admin/orders",
    inventory: "/admin/inventory",
    reports: "/admin/reports",
    settings: "/admin/settings",
    forbidden: "/admin/forbidden",
  },
  system: {
    unauthorized: "/unauthorized",
    notFound: "/not-found",
  },
} as const;

export const APP_ROUTES = ROUTES;

export const PUBLIC_ROUTES = [
  ROUTES.root,
  ROUTES.auth.login,
  ROUTES.auth.sessionExpired,
  ROUTES.auth.forgotPassword,
  ROUTES.auth.resetPassword,
  ROUTES.auth.verifyEmail,
  ROUTES.auth.logout,
] as const;

export const DEFAULT_AUTHENTICATED_ROUTE = ROUTES.admin.dashboard;
