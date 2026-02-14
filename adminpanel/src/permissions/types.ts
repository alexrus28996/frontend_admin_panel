export const APP_ROLES = ["SUPER_ADMIN", "ADMIN", "MANAGER", "VIEWER"] as const;

export type AppRole = (typeof APP_ROLES)[number];

export interface PermissionRule {
  allowedRoles: AppRole[];
  requiredPermissions?: string[];
}
