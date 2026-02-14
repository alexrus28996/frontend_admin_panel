import { ROLES } from "@/src/constants/roles";
import { ROUTES } from "@/src/constants/routes";

import type { AppRole } from "@/src/constants/roles";
import type { MessageKey } from "@/src/i18n/types/messages";

export interface NavigationItem {
  route: string;
  labelKey: MessageKey;
  roles: AppRole[];
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { route: ROUTES.admin.dashboard, labelKey: "navigation.dashboard", roles: [ROLES.superAdmin, ROLES.admin, ROLES.manager, ROLES.viewer] },
  { route: ROUTES.admin.users, labelKey: "navigation.users", roles: [ROLES.superAdmin, ROLES.admin] },
  { route: ROUTES.admin.roles, labelKey: "navigation.roles", roles: [ROLES.superAdmin] },
  { route: ROUTES.admin.products, labelKey: "navigation.products", roles: [ROLES.superAdmin, ROLES.admin, ROLES.manager] },
  { route: ROUTES.admin.categories, labelKey: "navigation.categories", roles: [ROLES.superAdmin, ROLES.admin, ROLES.manager] },
  { route: ROUTES.admin.orders, labelKey: "navigation.orders", roles: [ROLES.superAdmin, ROLES.admin, ROLES.manager] },
  { route: ROUTES.admin.inventory, labelKey: "navigation.inventory", roles: [ROLES.superAdmin, ROLES.admin, ROLES.manager] },
  { route: ROUTES.admin.reports, labelKey: "navigation.reports", roles: [ROLES.superAdmin, ROLES.admin, ROLES.manager] },
  { route: ROUTES.admin.settings, labelKey: "navigation.settings", roles: [ROLES.superAdmin, ROLES.admin] },
];
