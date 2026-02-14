import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { env } from "@/src/config/env";
import { APP_ROUTES, DEFAULT_AUTHENTICATED_ROUTE, PUBLIC_ROUTES } from "@/src/constants/routes";

const isPublicRoute = (pathname: string): boolean =>
  PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

const PROTECTED_ROUTE_PREFIXES = [
  APP_ROUTES.app.dashboard,
  APP_ROUTES.app.users,
  APP_ROUTES.app.roles,
  APP_ROUTES.app.products,
  APP_ROUTES.app.categories,
  APP_ROUTES.app.orders,
  APP_ROUTES.app.inventory,
  APP_ROUTES.app.reports,
  APP_ROUTES.app.settings,
] as const;

const isProtectedApplicationRoute = (pathname: string): boolean =>
  PROTECTED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

const hasAuthIndicator = (request: NextRequest): boolean => {
  const accessTokenCookie = request.cookies.get(env.authCookieName)?.value;
  const bearerToken = request.headers.get("authorization");

  return Boolean(accessTokenCookie || bearerToken?.startsWith("Bearer "));
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = hasAuthIndicator(request);

  if (isPublicRoute(pathname) && isAuthenticated && pathname === APP_ROUTES.auth.login) {
    return NextResponse.redirect(new URL(DEFAULT_AUTHENTICATED_ROUTE, request.url));
  }

  if (isProtectedApplicationRoute(pathname) && !isAuthenticated) {
    return NextResponse.redirect(new URL(APP_ROUTES.auth.login, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
