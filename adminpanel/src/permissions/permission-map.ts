import { APP_ROUTES } from "@/src/constants/routes";

import type { PermissionRule } from "@/src/permissions/types";

export const PERMISSION_MAP: Partial<Record<string, PermissionRule>> = {
  [APP_ROUTES.app.dashboard]: {
    allowedRoles: ["SUPER_ADMIN", "ADMIN", "MANAGER", "VIEWER"],
  },
  [APP_ROUTES.app.users]: {
    allowedRoles: ["SUPER_ADMIN", "ADMIN"],
    requiredPermissions: ["users.read"],
  },
  [APP_ROUTES.app.roles]: {
    allowedRoles: ["SUPER_ADMIN"],
    requiredPermissions: ["roles.manage"],
  },
  [APP_ROUTES.app.orders]: {
    allowedRoles: ["SUPER_ADMIN", "ADMIN", "MANAGER"],
    requiredPermissions: ["orders.read"],
  },
  [APP_ROUTES.app.reports]: {
    allowedRoles: ["SUPER_ADMIN", "ADMIN", "MANAGER"],
    requiredPermissions: ["reports.read"],
  },
} as const;
