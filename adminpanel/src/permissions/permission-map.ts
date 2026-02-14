import { PERMISSIONS } from "@/src/constants/permissions";
import { ROLES } from "@/src/constants/roles";
import { APP_ROUTES } from "@/src/constants/routes";

import type { PermissionRule } from "@/src/permissions/types";

export const PERMISSION_MAP: Partial<Record<string, PermissionRule>> = {
  [APP_ROUTES.admin.dashboard]: {
    allowedRoles: [ROLES.superAdmin, ROLES.admin, ROLES.manager, ROLES.viewer],
  },
  [APP_ROUTES.admin.users]: {
    allowedRoles: [ROLES.superAdmin, ROLES.admin],
    requiredPermissions: [PERMISSIONS.usersRead],
  },
  [APP_ROUTES.admin.roles]: {
    allowedRoles: [ROLES.superAdmin],
    requiredPermissions: [PERMISSIONS.rolesManage],
  },
  [APP_ROUTES.admin.orders]: {
    allowedRoles: [ROLES.superAdmin, ROLES.admin, ROLES.manager],
    requiredPermissions: [PERMISSIONS.ordersRead],
  },
  [APP_ROUTES.admin.reports]: {
    allowedRoles: [ROLES.superAdmin, ROLES.admin, ROLES.manager],
    requiredPermissions: [PERMISSIONS.reportsRead],
  },
} as const;
