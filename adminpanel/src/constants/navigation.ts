import { ROLES } from "@/src/constants/roles";
import { APP_ROUTES } from "@/src/constants/routes";

import type { AppRole } from "@/src/constants/roles";
import type { MessageKey } from "@/src/i18n/types/messages";

export interface NavigationItem {
  route: string;
  labelKey: MessageKey;
  roles: AppRole[];
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { route: APP_ROUTES.app.dashboard, labelKey: "navigation.dashboard", roles: [ROLES.superAdmin, ROLES.admin, ROLES.manager, ROLES.viewer] },
  { route: APP_ROUTES.app.users, labelKey: "navigation.users", roles: [ROLES.superAdmin, ROLES.admin] },
  { route: APP_ROUTES.app.roles, labelKey: "navigation.roles", roles: [ROLES.superAdmin] },
  { route: APP_ROUTES.app.products, labelKey: "navigation.products", roles: [ROLES.superAdmin, ROLES.admin, ROLES.manager] },
  { route: APP_ROUTES.app.categories, labelKey: "navigation.categories", roles: [ROLES.superAdmin, ROLES.admin, ROLES.manager] },
  { route: APP_ROUTES.app.orders, labelKey: "navigation.orders", roles: [ROLES.superAdmin, ROLES.admin, ROLES.manager] },
  { route: APP_ROUTES.app.inventory, labelKey: "navigation.inventory", roles: [ROLES.superAdmin, ROLES.admin, ROLES.manager] },
  { route: APP_ROUTES.app.reports, labelKey: "navigation.reports", roles: [ROLES.superAdmin, ROLES.admin, ROLES.manager] },
  { route: APP_ROUTES.app.settings, labelKey: "navigation.settings", roles: [ROLES.superAdmin, ROLES.admin] },
];
