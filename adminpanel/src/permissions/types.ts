import type { AppPermission } from "@/src/constants/permissions";
import type { AppRole } from "@/src/constants/roles";

export interface PermissionRule {
  allowedRoles: AppRole[];
  requiredPermissions?: AppPermission[];
}
