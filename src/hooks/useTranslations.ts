import { useTranslations as useNextIntlTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useMemo } from 'react';
import type { Locale } from '@/lib/i18n/config';

export function useTranslations(namespace?: string) {
  const t = useNextIntlTranslations(namespace);
  const locale = useLocale() as Locale;
  
  // Enhanced translation function with better TypeScript support
  const translate = useMemo(() => {
    return Object.assign(t, {
      locale,
      // Rich text support
      rich: (key: string, values?: Record<string, any>) => t.rich(key, values),
      // Pluralization helper
      plural: (key: string, count: number, values?: Record<string, any>) => 
        t(key, { count, ...values }),
      // Date formatting
      dateTime: (date: Date, options?: Intl.DateTimeFormatOptions) =>
        new Intl.DateTimeFormat(locale, options).format(date),
      // Number formatting
      number: (num: number, options?: Intl.NumberFormatOptions) =>
        new Intl.NumberFormat(locale, options).format(num),
      // Currency formatting
      currency: (amount: number, currency: 'ALL' | 'EUR') =>
        new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: currency === 'ALL' ? 0 : 2
        }).format(amount)
    });
  }, [t, locale]);
  
  return translate;
}

// Dynamic content translation hook
export function useDynamicTranslation(
  entityType: string,
  entityId: string,
  fallbackValues?: Record<string, string>
) {
  const locale = useLocale() as Locale;
  // Implementation would fetch from our translation service
  // This is a simplified version for now
  return fallbackValues || {};
}

// Language switcher hook
export function useLanguageSwitcher() {
  const locale = useLocale() as Locale;
  
  return {
    currentLocale: locale,
    switchLanguage: (newLocale: Locale) => {
      // This would trigger a language change
      // Implementation depends on your routing strategy
      window.location.href = window.location.pathname.replace(
        `/${locale}`,
        `/${newLocale}`
      );
    }
  };
}