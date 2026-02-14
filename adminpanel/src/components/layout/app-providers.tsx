"use client";

import { AuthProvider } from "@/src/auth/providers/auth-provider";
import { I18nProvider } from "@/src/i18n/providers/i18n-provider";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <I18nProvider>
      <AuthProvider>{children}</AuthProvider>
    </I18nProvider>
  );
};
