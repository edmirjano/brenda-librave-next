# Scalable Internationalization Implementation Plan
## Brënda Librave - Multi-Language Support System

This document outlines a comprehensive, scalable internationalization strategy designed to start with Albanian and English while being easily expandable to support additional languages in the future.

## 🌍 Scalable Language Architecture

### Phase 1: Initial Languages
- **Albanian (sq)**: Primary language, default locale
- **English (en)**: Secondary language for international users

### Future Expansion Ready
- **Italian (it)**: For Italian diaspora community
- **German (de)**: For German-speaking Albanian communities
- **French (fr)**: For French-speaking communities
- **Turkish (tr)**: Regional neighboring language
- **Macedonian (mk)**: Regional neighboring language
- **Any future language**: System designed for easy addition

## 🏗️ Database Schema for Multilingual Content

### Current Schema Issues
The current schema has some multilingual support but needs enhancement:

```sql
-- Current limited approach
model Category {
  name        String
  nameEn      String?  -- Only supports English, not scalable
}

model Tag {
  name        String
  nameEn      String?  -- Only supports English, not scalable
}
```

### Proposed Scalable Schema

```sql
-- Supported Languages (Dynamic)
model SupportedLanguage {
  id          String   @id @default(cuid())
  code        String   @unique // ISO 639-1 code (sq, en, it, de, etc.)
  name        String   // Language name in English
  nativeName  String   // Language name in native script
  direction   String   @default("ltr") // "ltr" or "rtl"
  isActive    Boolean  @default(true)
  isDefault   Boolean  @default(false)
  
  // SEO and cultural settings
  currency    Currency? // Preferred currency for this language
  timeZone    String?   // Default timezone
  dateFormat  String?   // Preferred date format
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([isActive])
  @@index([isDefault])
}

-- Generic Translation System
model Translation {
  id          String   @id @default(cuid())
  namespace   String   // e.g., "book", "category", "ui", "metadata"
  key         String   // e.g., "title", "description", "name"
  language    String   // Language code (sq, en, it, etc.)
  value       String   // Translated text
  context     String?  // Additional context for translators
  
  // Reference to the original content
  entityType  String   // "Book", "Category", "Tag", "BlogPost", etc.
  entityId    String   // ID of the entity being translated
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@unique([namespace, key, language, entityType, entityId])
  @@index([entityType, entityId])
  @@index([language])
  @@index([namespace])
}

-- Enhanced Book Model
model Book {
  id              String    @id @default(cuid())
  slug            String    @unique
  
  // Core data (language-neutral)
  isbn            String?   @unique
  categoryId      String
  price           Float?
  digitalPrice    Float?
  baseCurrency    Currency  @default(ALL)
  inventory       Int       @default(0)
  hasDigital      Boolean   @default(false)
  digitalFileUrl  String?
  digitalFileSize Int?
  coverImage      String?
  publishedDate   DateTime?
  baseLanguage    String    @default("sq") // Original language of the book
  featured        Boolean   @default(false)
  active          Boolean   @default(true)
  
  // Relations
  category        Category  @relation(fields: [categoryId], references: [id])
  translations    Translation[] // All translations for this book
  
  // ... other relations remain the same
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

-- Enhanced Category Model  
model Category {
  id            String  @id @default(cuid())
  slug          String  @unique
  active        Boolean @default(true)
  
  // Relations
  books         Book[]
  translations  Translation[] // All translations for this category
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

-- Enhanced Tag Model
model Tag {
  id            String    @id @default(cuid())
  slug          String    @unique
  color         String?
  
  // Relations
  books         BookTag[]
  translations  Translation[] // All translations for this tag
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

-- Blog Post Multilingual Support
model BlogPost {
  id            String   @id @default(cuid())
  slug          String   @unique
  authorId      String
  categoryId    String?
  published     Boolean  @default(false)
  featured      Boolean  @default(false)
  baseLanguage  String   @default("sq")
  
  // Relations
  author        User     @relation(fields: [authorId], references: [id])
  translations  Translation[] // All translations for this blog post
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

## 🔧 Next.js Configuration

### Enhanced next-intl Setup

```typescript
// src/lib/i18n/config.ts
export type Locale = 'sq' | 'en' | 'it' | 'de' | 'fr' | 'tr' | 'mk';

export const locales: Locale[] = ['sq', 'en']; // Start with these, expand later
export const defaultLocale: Locale = 'sq';

export const localeConfig = {
  sq: {
    name: 'Shqip',
    nativeName: 'Shqip',
    currency: 'ALL',
    timeZone: 'Europe/Tirane',
    direction: 'ltr',
  },
  en: {
    name: 'English',
    nativeName: 'English', 
    currency: 'EUR',
    timeZone: 'Europe/London',
    direction: 'ltr',
  },
  // Future languages can be easily added here
  it: {
    name: 'Italian',
    nativeName: 'Italiano',
    currency: 'EUR',
    timeZone: 'Europe/Rome',
    direction: 'ltr',
  },
  de: {
    name: 'German',
    nativeName: 'Deutsch',
    currency: 'EUR',
    timeZone: 'Europe/Berlin',
    direction: 'ltr',
  },
} as const;

// Dynamic locale detection from database
export async function getSupportedLocales(): Promise<Locale[]> {
  // This will query the database for active languages
  // For now, return the static list
  return locales;
}
```

### Scalable Middleware

```typescript
// src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { getSupportedLocales, defaultLocale } from '@/lib/i18n/config';

export default async function middleware(request: NextRequest) {
  // Get supported locales from database (cached)
  const supportedLocales = await getSupportedLocales();
  
  const handleI18nRouting = createMiddleware({
    locales: supportedLocales,
    defaultLocale,
    localePrefix: 'as-needed',
    
    // SEO-friendly URL structure
    pathnames: {
      '/': '/',
      '/books': {
        sq: '/libra',
        en: '/books',
        it: '/libri',
        de: '/bücher',
      },
      '/books/[slug]': {
        sq: '/libra/[slug]',
        en: '/books/[slug]',
        it: '/libri/[slug]',
        de: '/bücher/[slug]',
      },
      '/blog': {
        sq: '/blog',
        en: '/blog',
        it: '/blog',
        de: '/blog',
      },
      '/cart': {
        sq: '/shporte',
        en: '/cart',
        it: '/carrello',
        de: '/warenkorb',
      },
    },
  });

  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    '/((?!_next|_vercel|.*\\..*).*)',
    '/([\\w-]+)?/users/(.+)'
  ]
};
```

## 📁 Scalable Translation File Structure

```
messages/
├── sq/                    # Albanian (primary)
│   ├── common.json        # Shared UI elements
│   ├── navigation.json    # Navigation and menus
│   ├── metadata.json      # SEO metadata
│   ├── auth.json          # Authentication
│   ├── books.json         # Book-related content
│   ├── cart.json          # Shopping cart
│   ├── currency.json      # Currency and pricing
│   ├── blog.json          # Blog content
│   ├── forum.json         # Forum content
│   ├── notifications.json # Push notifications
│   ├── errors.json        # Error messages
│   └── admin.json         # Admin interface
├── en/                    # English
│   ├── common.json
│   ├── navigation.json
│   ├── metadata.json
│   ├── auth.json
│   ├── books.json
│   ├── cart.json
│   ├── currency.json
│   ├── blog.json
│   ├── forum.json
│   ├── notifications.json
│   ├── errors.json
│   └── admin.json
└── [future-languages]/   # Italian, German, etc.
    ├── common.json
    ├── navigation.json
    └── ...
```

### Example Translation Files

```json
// messages/sq/books.json
{
  "title": "Libra",
  "searchPlaceholder": "Kërko libra...",
  "categories": {
    "all": "Të gjitha",
    "fiction": "Letërsi",
    "nonfiction": "Jo-letërsi",
    "children": "Fëmijë"
  },
  "actions": {
    "addToCart": "Shto në shportë",
    "addToWishlist": "Shto në listën e dëshirave",
    "viewDetails": "Shiko detajet",
    "buyNow": "Bli tani"
  },
  "price": {
    "from": "Nga {price}",
    "digitalVersion": "Versioni dixhital",
    "physicalVersion": "Versioni fizik",
    "currency": {
      "ALL": "Lekë",
      "EUR": "Euro"
    }
  },
  "metadata": {
    "title": "{bookTitle} - Brënda Librave",
    "description": "Zbulo {bookTitle} nga {author}. {description}",
    "keywords": "libra shqip, {bookTitle}, {author}, Brënda Librave"
  }
}

// messages/en/books.json
{
  "title": "Books",
  "searchPlaceholder": "Search books...",
  "categories": {
    "all": "All",
    "fiction": "Fiction",
    "nonfiction": "Non-fiction",
    "children": "Children"
  },
  "actions": {
    "addToCart": "Add to Cart",
    "addToWishlist": "Add to Wishlist",
    "viewDetails": "View Details",
    "buyNow": "Buy Now"
  },
  "price": {
    "from": "From {price}",
    "digitalVersion": "Digital version",
    "physicalVersion": "Physical version",
    "currency": {
      "ALL": "Albanian Lek",
      "EUR": "Euro"
    }
  },
  "metadata": {
    "title": "{bookTitle} - Brënda Librave",
    "description": "Discover {bookTitle} by {author}. {description}",
    "keywords": "Albanian books, {bookTitle}, {author}, Brënda Librave"
  }
}
```

## 🔄 Dynamic Content Translation System

### Translation Management Service

```typescript
// src/lib/services/translations.ts
import { prisma } from '@/lib/db/prisma';
import type { Locale } from '@/lib/i18n/config';

export class TranslationService {
  // Get translated content for an entity
  static async getTranslations(
    entityType: string,
    entityId: string,
    language: Locale,
    fallbackLanguage: Locale = 'sq'
  ) {
    const translations = await prisma.translation.findMany({
      where: {
        entityType,
        entityId,
        language: { in: [language, fallbackLanguage] }
      }
    });

    // Organize by key with fallback logic
    const result: Record<string, string> = {};
    
    // First pass: set fallback values
    translations
      .filter(t => t.language === fallbackLanguage)
      .forEach(t => {
        result[t.key] = t.value;
      });
    
    // Second pass: override with preferred language
    translations
      .filter(t => t.language === language)
      .forEach(t => {
        result[t.key] = t.value;
      });

    return result;
  }

  // Create or update translation
  static async setTranslation(
    entityType: string,
    entityId: string,
    key: string,
    language: Locale,
    value: string,
    namespace?: string
  ) {
    return prisma.translation.upsert({
      where: {
        namespace_key_language_entityType_entityId: {
          namespace: namespace || entityType.toLowerCase(),
          key,
          language,
          entityType,
          entityId
        }
      },
      update: { value },
      create: {
        namespace: namespace || entityType.toLowerCase(),
        key,
        language,
        value,
        entityType,
        entityId
      }
    });
  }

  // Get all translations for an entity (for admin interface)
  static async getAllTranslations(entityType: string, entityId: string) {
    return prisma.translation.findMany({
      where: { entityType, entityId },
      orderBy: [{ language: 'asc' }, { key: 'asc' }]
    });
  }

  // Bulk create translations
  static async bulkCreateTranslations(translations: Array<{
    entityType: string;
    entityId: string;
    key: string;
    language: Locale;
    value: string;
    namespace?: string;
  }>) {
    return prisma.translation.createMany({
      data: translations.map(t => ({
        ...t,
        namespace: t.namespace || t.entityType.toLowerCase()
      })),
      skipDuplicates: true
    });
  }
}
```

### Enhanced Book Service with Translations

```typescript
// src/lib/services/books-i18n.ts
import { TranslationService } from './translations';
import type { Locale } from '@/lib/i18n/config';

export interface BookWithTranslations {
  id: string;
  slug: string;
  isbn?: string;
  baseLanguage: string;
  // ... other fields
  translations: {
    title: string;
    description: string;
    author: string;
    // Add more translatable fields as needed
  };
}

export class BooksI18nService {
  static async getBookWithTranslations(
    id: string, 
    language: Locale
  ): Promise<BookWithTranslations | null> {
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        category: true,
        tags: { include: { tag: true } }
      }
    });

    if (!book) return null;

    const translations = await TranslationService.getTranslations(
      'Book',
      id,
      language
    );

    return {
      ...book,
      translations: {
        title: translations.title || book.title || '',
        description: translations.description || book.description || '',
        author: translations.author || book.author || '',
      }
    };
  }

  static async getBooksWithTranslations(
    language: Locale,
    options?: {
      limit?: number;
      offset?: number;
      categoryId?: string;
      featured?: boolean;
    }
  ): Promise<BookWithTranslations[]> {
    const books = await prisma.book.findMany({
      where: {
        active: true,
        ...(options?.categoryId && { categoryId: options.categoryId }),
        ...(options?.featured !== undefined && { featured: options.featured })
      },
      take: options?.limit,
      skip: options?.offset,
      orderBy: { createdAt: 'desc' }
    });

    // Bulk fetch translations for all books
    const allTranslations = await Promise.all(
      books.map(book => 
        TranslationService.getTranslations('Book', book.id, language)
      )
    );

    return books.map((book, index) => ({
      ...book,
      translations: {
        title: allTranslations[index].title || book.title || '',
        description: allTranslations[index].description || book.description || '',
        author: allTranslations[index].author || book.author || '',
      }
    }));
  }
}
```

## 🎨 Component Integration

### Enhanced Translation Hook

```typescript
// src/hooks/useTranslations.ts
import { useTranslations as useNextIntlTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useMemo } from 'react';

export function useTranslations(namespace?: string) {
  const t = useNextIntlTranslations(namespace);
  const locale = useLocale();
  
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
  const locale = useLocale();
  // Implementation would fetch from our translation service
  // This is a simplified version
  return fallbackValues || {};
}
```

## 🔍 SEO Optimization for Multiple Languages

### Dynamic Metadata Generation

```typescript
// src/lib/seo/metadata.ts
import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { getTranslations } from 'next-intl/server';

export async function generateBookMetadata(
  bookId: string,
  locale: Locale
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const book = await BooksI18nService.getBookWithTranslations(bookId, locale);
  
  if (!book) {
    return {
      title: t('notFound.title'),
      description: t('notFound.description')
    };
  }

  const title = t('book.title', {
    bookTitle: book.translations.title,
    siteName: t('siteName')
  });

  const description = t('book.description', {
    bookTitle: book.translations.title,
    author: book.translations.author,
    description: book.translations.description.substring(0, 150)
  });

  return {
    title,
    description,
    keywords: t('book.keywords', {
      bookTitle: book.translations.title,
      author: book.translations.author
    }),
    openGraph: {
      title,
      description,
      images: book.coverImage ? [{ url: book.coverImage }] : [],
      type: 'book',
      locale,
      alternateLocale: locale === 'sq' ? 'en' : 'sq'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: book.coverImage ? [book.coverImage] : []
    },
    alternates: {
      canonical: `/${locale}/books/${book.slug}`,
      languages: {
        'sq': `/sq/libra/${book.slug}`,
        'en': `/en/books/${book.slug}`,
        // Future languages
        'it': `/it/libri/${book.slug}`,
        'de': `/de/bücher/${book.slug}`
      }
    }
  };
}
```

## 🚀 PWA Multilingual Support

### Enhanced Manifest Generation

```typescript
// src/app/manifest.ts
import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { getLocale, getTranslations } from 'next-intl/server';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'pwa' });

  return {
    name: t('name'),
    short_name: t('shortName'),
    description: t('description'),
    start_url: `/${locale}/`,
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#dc2626',
    lang: locale,
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ],
    categories: ['books', 'education', 'reading'],
    shortcuts: [
      {
        name: t('shortcuts.books'),
        short_name: t('shortcuts.booksShort'),
        description: t('shortcuts.booksDescription'),
        url: `/${locale}/books`,
        icons: [{ src: '/icon-books.png', sizes: '96x96' }]
      },
      {
        name: t('shortcuts.cart'),
        short_name: t('shortcuts.cartShort'),
        description: t('shortcuts.cartDescription'),
        url: `/${locale}/cart`,
        icons: [{ src: '/icon-cart.png', sizes: '96x96' }]
      }
    ]
  };
}
```

## 🎯 Implementation Timeline

### Phase 1: Foundation (Week 1-2)
1. ✅ Install and configure next-intl
2. ✅ Set up basic translation structure for sq/en
3. ✅ Create scalable database schema
4. ✅ Implement middleware for routing

### Phase 2: Core Translation (Week 3-4)
1. Create all translation files for sq/en
2. Migrate Navigation component
3. Migrate Book components
4. Implement dynamic translation service

### Phase 3: SEO & Advanced Features (Week 5-6)
1. Implement multilingual SEO
2. Create admin interface for translations
3. Set up PWA multilingual support
4. Add currency localization

### Phase 4: Testing & Optimization (Week 7-8)
1. Comprehensive testing
2. Performance optimization
3. A/B testing for conversions
4. Documentation completion

### Future Phases: Language Expansion
- Add Italian support for diaspora communities
- Add German support for European markets
- Implement right-to-left language support
- Add regional currency preferences

## 📊 Benefits of This Scalable Approach

1. **Easy Language Addition**: New languages require only translation files and minimal database updates
2. **SEO Optimized**: Each language gets proper URLs and metadata
3. **Performance**: Optimized for speed with proper caching
4. **Maintainable**: Clear separation of concerns
5. **Future-Proof**: Designed for growth and expansion
6. **User Experience**: Seamless language switching
7. **Admin Friendly**: Easy translation management interface
8. **PWA Ready**: Full offline support in multiple languages

This system will allow Brënda Librave to easily expand to new markets while maintaining excellent performance and user experience across all supported languages.