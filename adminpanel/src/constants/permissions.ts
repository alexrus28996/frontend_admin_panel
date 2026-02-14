export const PERMISSIONS = {
  usersRead: "users.read",
  rolesManage: "roles.manage",
  ordersRead: "orders.read",
  reportsRead: "reports.read",
} as const;

export type AppPermission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
