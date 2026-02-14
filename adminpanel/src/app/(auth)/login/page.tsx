"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { normalizeApiError } from "@/src/api/utils/error-normalizer";
import { useAuth } from "@/src/auth/providers/auth-provider";
import { AlertBanner } from "@/src/components/ui/alert-banner";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { MutedText, PageTitle, Text } from "@/src/components/ui/typography";
import { APP_ROUTES } from "@/src/constants/routes";
import { useI18n } from "@/src/i18n/providers/i18n-provider";

interface LoginFormState {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const { t } = useI18n();
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<LoginFormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = (): LoginFormErrors => {
    const nextErrors: LoginFormErrors = {};

    if (!form.email) {
      nextErrors.email = t("validation.required");
    } else if (!emailRegex.test(form.email)) {
      nextErrors.email = t("validation.invalidEmail");
    }

    if (!form.password) {
      nextErrors.password = t("validation.required");
    }

    return nextErrors;
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setServerError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      await login(form.email, form.password);
      router.replace(APP_ROUTES.admin.dashboard);
    } catch (error) {
      const normalized = normalizeApiError(error);
      setServerError(normalized.message || t("errors.auth.invalidCredentials"));
    } finally {
      setIsSubmitting(false);
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
            <form className="space-y-4" onSubmit={onSubmit} noValidate aria-label={t("auth.login.formAria") }>
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
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  ariaLabel={t("auth.login.emailAria")}
                  placeholder={t("auth.login.emailPlaceholder")}
                  error={errors.email}
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-text-primary">
                  {t("auth.login.passwordLabel")}
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={form.password}
                    onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                    ariaLabel={t("auth.login.passwordAria")}
                    placeholder={t("auth.login.passwordPlaceholder")}
                    error={errors.password}
                    className="pr-20"
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

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
                ariaLabel={t("auth.login.submit")}
              >
                {isSubmitting ? t("common.loading") : t("auth.login.submit")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
