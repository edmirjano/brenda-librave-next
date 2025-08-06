import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { BooksI18nService } from '@/lib/services/books-i18n';

export async function generateBookMetadata(
  bookSlug: string,
  locale: Locale
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'books' });
  const metaT = await getTranslations({ locale, namespace: 'metadata' });
  
  // For now, we'll find the book by slug
  // In the future, you might want to create a dedicated service for this
  const book = await BooksI18nService.searchBooksWithTranslations(bookSlug, locale, { limit: 1 });
  const bookData = book[0];
  
  if (!bookData) {
    return {
      title: t('metadata.notFound.title'),
      description: t('metadata.notFound.description')
    };
  }

  const title = t('metadata.title', {
    bookTitle: bookData.translations.title,
    siteName: metaT('siteName')
  });

  const description = t('metadata.description', {
    bookTitle: bookData.translations.title,
    author: bookData.translations.author,
    description: bookData.translations.description.substring(0, 150)
  });

  const keywords = t('metadata.keywords', {
    bookTitle: bookData.translations.title,
    author: bookData.translations.author
  });

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: bookData.coverImage ? [{ 
        url: bookData.coverImage,
        width: 1200,
        height: 630,
        alt: bookData.translations.title
      }] : [],
      type: 'book',
      locale,
      alternateLocale: locale === 'sq' ? ['en'] : ['sq']
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: bookData.coverImage ? [bookData.coverImage] : []
    },
    alternates: {
      canonical: `/${locale}/books/${bookData.slug}`,
      languages: {
        'sq': `/sq/libra/${bookData.slug}`,
        'en': `/en/books/${bookData.slug}`,
        // Future languages
        'it': `/it/libri/${bookData.slug}`,
        'de': `/de/bücher/${bookData.slug}`,
        'x-default': `/sq/libra/${bookData.slug}`
      }
    },
    // Structured data for SEO
    other: {
      'book:author': bookData.translations.author,
      'book:isbn': bookData.isbn || '',
      'book:release_date': bookData.publishedDate?.toISOString() || '',
      'product:price:amount': bookData.price?.toString() || '',
      'product:price:currency': bookData.baseCurrency
    }
  };
}

export async function generateCategoryMetadata(
  categorySlug: string,
  locale: Locale
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'books' });
  const metaT = await getTranslations({ locale, namespace: 'metadata' });

  // Find category by slug and get its translations
  // This would need to be implemented in a category service
  const title = `${t('categories.all')} - ${metaT('siteName')}`;
  const description = metaT('siteDescription');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale,
      alternateLocale: locale === 'sq' ? ['en'] : ['sq']
    },
    alternates: {
      canonical: `/${locale}/books`,
      languages: {
        'sq': '/sq/libra',
        'en': '/en/books',
        'it': '/it/libri',
        'de': '/de/bücher',
        'x-default': '/sq/libra'
      }
    }
  };
}

export async function generateHomeMetadata(locale: Locale): Promise<Metadata> {
  const metaT = await getTranslations({ locale, namespace: 'metadata' });

  const title = metaT('siteName');
  const description = metaT('siteDescription');
  const keywords = metaT('keywords');

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      locale,
      alternateLocale: locale === 'sq' ? ['en'] : ['sq'],
      siteName: metaT('siteName')
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'sq': '/sq',
        'en': '/en',
        'it': '/it',
        'de': '/de',
        'x-default': '/sq'
      }
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    }
  };
}

export async function generateBlogMetadata(
  blogSlug: string,
  locale: Locale
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'blog' });
  const metaT = await getTranslations({ locale, namespace: 'metadata' });

  // Blog post metadata would be similar to book metadata
  const title = `${t('title')} - ${metaT('siteName')}`;
  const description = metaT('siteDescription');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      locale,
      alternateLocale: locale === 'sq' ? ['en'] : ['sq']
    },
    alternates: {
      canonical: `/${locale}/blog/${blogSlug}`,
      languages: {
        'sq': `/sq/blog/${blogSlug}`,
        'en': `/en/blog/${blogSlug}`,
        'x-default': `/sq/blog/${blogSlug}`
      }
    }
  };
}