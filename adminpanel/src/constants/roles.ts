export const ROLES = {
  superAdmin: "SUPER_ADMIN",
  admin: "ADMIN",
  manager: "MANAGER",
  viewer: "VIEWER",
} as const;

export type AppRole = (typeof ROLES)[keyof typeof ROLES];

export const APP_ROLES: readonly AppRole[] = Object.values(ROLES);
