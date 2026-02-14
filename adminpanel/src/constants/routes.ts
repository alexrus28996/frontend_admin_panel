export const APP_ROUTES = {
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

export const PUBLIC_ROUTES = [
  APP_ROUTES.root,
  APP_ROUTES.auth.login,
  APP_ROUTES.auth.sessionExpired,
  APP_ROUTES.auth.forgotPassword,
  APP_ROUTES.auth.resetPassword,
  APP_ROUTES.auth.verifyEmail,
  APP_ROUTES.auth.logout,
] as const;

export const DEFAULT_AUTHENTICATED_ROUTE = APP_ROUTES.admin.dashboard;
