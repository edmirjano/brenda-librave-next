export type Locale = 'sq' | 'en' | 'it' | 'de' | 'fr' | 'tr' | 'mk';

export const locales: Locale[] = ['sq', 'en']; // Start with these, expand later
export const defaultLocale: Locale = 'sq';

export const localeConfig = {
  sq: {
    name: 'Shqip',
    nativeName: 'Shqip',
    currency: 'ALL' as const,
    timeZone: 'Europe/Tirane',
    direction: 'ltr' as const,
  },
  en: {
    name: 'English',
    nativeName: 'English', 
    currency: 'EUR' as const,
    timeZone: 'Europe/London',
    direction: 'ltr' as const,
  },
  // Future languages can be easily added here
  it: {
    name: 'Italian',
    nativeName: 'Italiano',
    currency: 'EUR' as const,
    timeZone: 'Europe/Rome',
    direction: 'ltr' as const,
  },
  de: {
    name: 'German',
    nativeName: 'Deutsch',
    currency: 'EUR' as const,
    timeZone: 'Europe/Berlin',
    direction: 'ltr' as const,
  },
  fr: {
    name: 'French',
    nativeName: 'Français',
    currency: 'EUR' as const,
    timeZone: 'Europe/Paris',
    direction: 'ltr' as const,
  },
  tr: {
    name: 'Turkish',
    nativeName: 'Türkçe',
    currency: 'EUR' as const,
    timeZone: 'Europe/Istanbul',
    direction: 'ltr' as const,
  },
  mk: {
    name: 'Macedonian',
    nativeName: 'Македонски',
    currency: 'EUR' as const,
    timeZone: 'Europe/Skopje',
    direction: 'ltr' as const,
  },
} as const;

// Dynamic locale detection from database
export async function getSupportedLocales(): Promise<Locale[]> {
  // This will query the database for active languages
  // For now, return the static list
  return locales;
}

// SEO-friendly URL pathnames for different locales
export const pathnames = {
  '/': '/',
  '/books': {
    sq: '/libra',
    en: '/books',
    it: '/libri',
    de: '/bücher',
    fr: '/livres',
    tr: '/kitaplar',
    mk: '/knigi',
  },
  '/books/[slug]': {
    sq: '/libra/[slug]',
    en: '/books/[slug]',
    it: '/libri/[slug]',
    de: '/bücher/[slug]',
    fr: '/livres/[slug]',
    tr: '/kitaplar/[slug]',
    mk: '/knigi/[slug]',
  },
  '/blog': {
    sq: '/blog',
    en: '/blog',
    it: '/blog',
    de: '/blog',
    fr: '/blog',
    tr: '/blog',
    mk: '/blog',
  },
  '/cart': {
    sq: '/shporte',
    en: '/cart',
    it: '/carrello',
    de: '/warenkorb',
    fr: '/panier',
    tr: '/sepet',
    mk: '/korpa',
  },
  '/profile': {
    sq: '/profili',
    en: '/profile',
    it: '/profilo',
    de: '/profil',
    fr: '/profil',
    tr: '/profil',
    mk: '/profil',
  },
  '/admin': {
    sq: '/admin',
    en: '/admin',
    it: '/admin',
    de: '/admin',
    fr: '/admin',
    tr: '/admin',
    mk: '/admin',
  },
} as const;