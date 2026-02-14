export const APP_ROUTES = {
  root: "/",
  auth: {
    login: "/login",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    verifyEmail: "/verify-email",
  },
  app: {
    dashboard: "/dashboard",
    users: "/users",
    roles: "/roles",
    products: "/products",
    categories: "/categories",
    orders: "/orders",
    inventory: "/inventory",
    reports: "/reports",
    settings: "/settings",
  },
  system: {
    unauthorized: "/unauthorized",
    notFound: "/not-found",
  },
} as const;

export const PUBLIC_ROUTES = [
  APP_ROUTES.root,
  APP_ROUTES.auth.login,
  APP_ROUTES.auth.forgotPassword,
  APP_ROUTES.auth.resetPassword,
  APP_ROUTES.auth.verifyEmail,
] as const;

export const DEFAULT_AUTHENTICATED_ROUTE = APP_ROUTES.app.dashboard;
