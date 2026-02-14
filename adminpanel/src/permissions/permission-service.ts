import { PERMISSION_MAP } from "@/src/permissions/permission-map";

import type { AuthUser } from "@/src/auth/types/auth";
import type { AppPermission } from "@/src/constants/permissions";
import type { AppRole } from "@/src/constants/roles";

export const hasAnyRole = (roles: AppRole[], allowedRoles: AppRole[]): boolean =>
  roles.some((role) => allowedRoles.includes(role));

export const hasPermissions = (
  userPermissions: AppPermission[],
  requiredPermissions: AppPermission[] = [],
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
