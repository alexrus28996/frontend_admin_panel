"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { tokenStorage } from "@/src/auth/storage/token-storage";
import { APP_ROUTES } from "@/src/constants/routes";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const route = tokenStorage.getAccessToken() ? APP_ROUTES.admin.dashboard : APP_ROUTES.auth.login;
    router.replace(route);
  }, [router]);

  return null;
}
