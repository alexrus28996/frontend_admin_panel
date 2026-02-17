import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { env } from "@/src/config/env";
import { APP_ROUTES, DEFAULT_AUTHENTICATED_ROUTE, PUBLIC_ROUTES } from "@/src/constants/routes";

const adminBaseRoute = APP_ROUTES.admin.dashboard.split("/dashboard")[0] ?? APP_ROUTES.admin.dashboard;

const isPublicRoute = (pathname: string): boolean =>
  PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

const isProtectedApplicationRoute = (pathname: string): boolean =>
  pathname === adminBaseRoute || pathname.startsWith(`${adminBaseRoute}/`);

const hasAuthIndicator = (request: NextRequest): boolean => {
  const accessTokenCookie = request.cookies.get(env.authCookieName)?.value;
  const bearerToken = request.headers.get("authorization");

  return Boolean(accessTokenCookie || bearerToken?.startsWith("Bearer "));
};

const isStaticAssetRequest = (pathname: string): boolean => /\.[^/]+$/.test(pathname);

const redirectIfDifferent = (request: NextRequest, targetPath: string): NextResponse => {
  if (request.nextUrl.pathname === targetPath) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(targetPath, request.url));
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isStaticAssetRequest(pathname)) {
    return NextResponse.next();
  }

  const isAuthenticated = hasAuthIndicator(request);

  if (isPublicRoute(pathname) && isAuthenticated && pathname === APP_ROUTES.auth.login) {
    return redirectIfDifferent(request, DEFAULT_AUTHENTICATED_ROUTE);
  }

  if (isProtectedApplicationRoute(pathname) && !isAuthenticated) {
    return redirectIfDifferent(request, APP_ROUTES.auth.login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
