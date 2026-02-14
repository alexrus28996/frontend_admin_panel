import { PERMISSION_MAP } from "@/src/permissions/permission-map";

import type { AuthUser } from "@/src/auth/types/auth";

export const hasAnyRole = (roles: AuthUser["roles"], allowedRoles: AuthUser["roles"]): boolean =>
  roles.some((role) => allowedRoles.includes(role));

export const hasPermissions = (
  userPermissions: string[],
  requiredPermissions: string[] = [],
): boolean => requiredPermissions.every((permission) => userPermissions.includes(permission));

export const canAccessRoute = (route: string, user: AuthUser | null): boolean => {
  if (!user) {
    return false;
  }

  const rule = PERMISSION_MAP[route];

  if (!rule) {
    return true;
  }

  return hasAnyRole(user.roles, rule.allowedRoles) && hasPermissions(user.permissions, rule.requiredPermissions);
};
