// ============================================================
// Internationalization (i18n) System 
// Currently: en-US only. Extensible for future locales.
// ============================================================

import enUS from '@/locales/en-US.json';

export type LocaleKey = 'en-US';

const locales: Record<LocaleKey, typeof enUS> = {
  'en-US': enUS,
};

let currentLocale: LocaleKey = 'en-US';

export function setLocale(locale: LocaleKey) {
  currentLocale = locale;
}

export function getLocale(): LocaleKey {
  return currentLocale;
}

/**
 * Get a translated string by dot-notation key.
 * Supports interpolation: t('greeting', { name: 'John' }) → "Hello, John"
 */
export function t(key: string, params?: Record<string, string | number>): string {
  const keys = key.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = locales[currentLocale];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback: return key itself if translation missing
      return key;
    }
  }

  if (typeof value !== 'string') return key;

  // Interpolation: replace {{param}} with actual values
  if (params) {
    return value.replace(/\{\{(\w+)\}\}/g, (_, paramKey) => {
      return params[paramKey] !== undefined ? String(params[paramKey]) : `{{${paramKey}}}`;
    });
  }

  return value;
}
