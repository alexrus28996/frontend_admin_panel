"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { normalizeApiError } from "@/src/api/utils/error-normalizer";
import { useAuth } from "@/src/auth/providers/auth-provider";
import { AlertBanner } from "@/src/components/ui/alert-banner";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { MutedText, PageTitle, Text } from "@/src/components/ui/typography";
import { APP_ROUTES } from "@/src/constants/routes";
import { useI18n } from "@/src/i18n/providers/i18n-provider";
import { loginSchema } from "@/src/schemas/auth/login.schema";

import type { LoginSchemaInput } from "@/src/schemas/auth/login.schema";

export default function LoginPage() {
  const { t } = useI18n();
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (values: LoginSchemaInput) => {
    setServerError(null);

    try {
      await login(values.email, values.password);
      router.replace(APP_ROUTES.admin.dashboard);
    } catch (error) {
      const normalized = normalizeApiError(error);
      setServerError(normalized.message || t("errors.auth.invalidCredentials"));
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-2">
      <section className="flex flex-col justify-center border-b border-border px-6 py-12 lg:border-b-0 lg:border-r lg:px-16">
        <Text className="font-medium text-primary">{t("app.name")}</Text>
        <PageTitle className="mt-4 max-w-md">{t("auth.login.heroTitle")}</PageTitle>
        <MutedText className="mt-3 max-w-md">{t("auth.login.heroDescription")}</MutedText>
      </section>

      <section className="flex items-center justify-center px-4 py-10 sm:px-8">
        <Card className="w-full max-w-md shadow-md">
          <CardHeader>
            <PageTitle className="text-2xl">{t("auth.login.title")}</PageTitle>
            <MutedText className="mt-1">{t("auth.login.subtitle")}</MutedText>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              aria-label={t("auth.login.formAria")}
            >
              {serverError ? (
                <AlertBanner
                  variant="error"
                  title={t("errors.auth.loginTitle")}
                  description={serverError}
                />
              ) : null}

              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-text-primary">
                  {t("auth.login.emailLabel")}
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  ariaLabel={t("auth.login.emailAria")}
                  placeholder={t("auth.login.emailPlaceholder")}
                  error={errors.email?.message ? t(errors.email.message) : undefined}
                  {...register("email")}
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-text-primary">
                  {t("auth.login.passwordLabel")}
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    ariaLabel={t("auth.login.passwordAria")}
                    placeholder={t("auth.login.passwordPlaceholder")}
                    error={errors.password?.message ? t(errors.password.message) : undefined}
                    className="pr-20"
                    {...register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-1 top-1 h-8 px-2"
                    onClick={() => setShowPassword((prev) => !prev)}
                    ariaLabel={showPassword ? t("auth.login.hidePassword") : t("auth.login.showPassword")}
                  >
                    {showPassword ? t("auth.login.hidePassword") : t("auth.login.showPassword")}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting} ariaLabel={t("auth.login.submit")}>
                {isSubmitting ? t("common.loading") : t("auth.login.submit")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
