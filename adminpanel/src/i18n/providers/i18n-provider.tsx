"use client";

import { createContext, useContext, useMemo } from "react";

import enMessages from "@/messages/en.json";

import type { MessageKey, Messages } from "@/src/i18n/types/messages";

interface I18nContextValue {
  locale: "en";
  t: (key: MessageKey) => string;
}

const flattenMessages = (
  obj: Record<string, unknown>,
  prefix = "",
): Record<string, string> => {
  return Object.entries(obj).reduce<Record<string, string>>((acc, [key, value]) => {
    const nestedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "string") {
      acc[nestedKey] = value;
      return acc;
    }

    if (value && typeof value === "object") {
      Object.assign(acc, flattenMessages(value as Record<string, unknown>, nestedKey));
    }

    return acc;
  }, {});
};

const dictionaries: Record<"en", Messages> = {
  en: enMessages,
};

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider = ({
  children,
  locale = "en",
}: {
  children: React.ReactNode;
  locale?: "en";
}) => {
  const value = useMemo<I18nContextValue>(() => {
    const dictionary = flattenMessages(dictionaries[locale] as unknown as Record<string, unknown>);

    return {
      locale,
      t: (key: MessageKey) => dictionary[key] ?? key,
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextValue => {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("I18N_PROVIDER_MISSING");
  }

  return context;
};
