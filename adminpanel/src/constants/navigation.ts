import { ROLES } from "@/src/constants/roles";
import { ROUTES } from "@/src/constants/routes";

import type { AppRole } from "@/src/constants/roles";
import type { MessageKey } from "@/src/i18n/types/messages";

export type NavigationGroup = "main" | "catalog" | "sales" | "system";
export type NavigationIcon = "dashboard" | "users" | "roles" | "products" | "categories" | "orders" | "inventory" | "reports" | "settings";

export interface NavigationItem {
  group: NavigationGroup;
  href: string;
  labelKey: MessageKey;
  icon: NavigationIcon;
  roles?: AppRole[];
}

export const NAVIGATION_GROUP_LABELS: Record<NavigationGroup, MessageKey> = {
  main: "navigation.groups.main",
  catalog: "navigation.groups.catalog",
  sales: "navigation.groups.sales",
  system: "navigation.groups.system",
};

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    group: "main",
    href: ROUTES.admin.dashboard,
    labelKey: "navigation.dashboard",
    icon: "dashboard",
    roles: [ROLES.superAdmin, ROLES.admin, ROLES.manager, ROLES.viewer],
  },
  {
    group: "main",
    href: ROUTES.admin.users,
    labelKey: "navigation.users",
    icon: "users",
    roles: undefined,
  },
  {
    group: "system",
    href: ROUTES.admin.roles,
    labelKey: "navigation.roles",
    icon: "roles",
    roles: [ROLES.superAdmin],
  },
  {
    group: "catalog",
    href: ROUTES.admin.products,
    labelKey: "navigation.products",
    icon: "products",
    roles: [ROLES.superAdmin, ROLES.admin, ROLES.manager],
  },
  {
    group: "catalog",
    href: ROUTES.admin.categories,
    labelKey: "navigation.categories",
    icon: "categories",
    roles: [ROLES.superAdmin, ROLES.admin, ROLES.manager],
  },
  {
    group: "sales",
    href: ROUTES.admin.orders,
    labelKey: "navigation.orders",
    icon: "orders",
    roles: [ROLES.superAdmin, ROLES.admin, ROLES.manager],
  },
  {
    group: "catalog",
    href: ROUTES.admin.inventory,
    labelKey: "navigation.inventory",
    icon: "inventory",
    roles: [ROLES.superAdmin, ROLES.admin, ROLES.manager],
  },
  {
    group: "sales",
    href: ROUTES.admin.reports,
    labelKey: "navigation.reports",
    icon: "reports",
    roles: [ROLES.superAdmin, ROLES.admin, ROLES.manager],
  },
  {
    group: "system",
    href: ROUTES.admin.settings,
    labelKey: "navigation.settings",
    icon: "settings",
    roles: [ROLES.superAdmin, ROLES.admin],
  },
];
