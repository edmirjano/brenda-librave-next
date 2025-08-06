import type { Locale } from '@/lib/i18n/config';
import type { BookWithTranslations } from '@/lib/services/books-i18n';
import { getTranslations } from 'next-intl/server';

// Book structured data for rich snippets
export async function generateBookStructuredData(
  book: BookWithTranslations,
  locale: Locale
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://brenda-librave.netlify.app';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    '@id': `${baseUrl}/${locale}/books/${book.slug}`,
    name: book.translations.title,
    author: {
      '@type': 'Person',
      name: book.translations.author
    },
    description: book.translations.description,
    isbn: book.isbn,
    inLanguage: locale,
    image: book.coverImage ? `${baseUrl}${book.coverImage}` : undefined,
    datePublished: book.publishedDate?.toISOString(),
    publisher: {
      '@type': 'Organization',
      name: 'Brënda Librave'
    },
    offers: book.price ? {
      '@type': 'Offer',
      price: book.price.toString(),
      priceCurrency: book.baseCurrency,
      availability: book.inventory > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${baseUrl}/${locale}/books/${book.slug}`,
      seller: {
        '@type': 'Organization',
        name: 'Brënda Librave'
      }
    } : undefined,
    // Digital version offer if available
    ...(book.hasDigital && book.digitalPrice && {
      workExample: {
        '@type': 'Book',
        bookFormat: 'https://schema.org/EBook',
        offers: {
          '@type': 'Offer',
          price: book.digitalPrice.toString(),
          priceCurrency: book.baseCurrency,
          availability: 'https://schema.org/InStock',
          url: `${baseUrl}/${locale}/books/${book.slug}?format=digital`
        }
      }
    }),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5', // This would come from actual reviews
      reviewCount: '10'   // This would come from actual reviews
    }
  };
}

// Organization structured data
export async function generateOrganizationStructuredData(locale: Locale) {
  const metaT = await getTranslations({ locale, namespace: 'metadata' });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://brenda-librave.netlify.app';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: metaT('siteName'),
    description: metaT('siteDescription'),
    url: baseUrl,
    logo: `${baseUrl}/favicon.svg`,
    image: `${baseUrl}/og-image.jpg`,
    sameAs: [
      'https://facebook.com/brendalibrave',
      'https://instagram.com/brendalibrave',
      'https://twitter.com/brendalibrave'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+355-XX-XXX-XXXX',
      contactType: 'customer service',
      availableLanguage: ['Albanian', 'English']
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AL',
      addressLocality: 'Tirana'
    },
    paymentAccepted: ['PayPal', 'Credit Card'],
    currenciesAccepted: ['ALL', 'EUR'],
    priceRange: '$$'
  };
}

// Website structured data
export async function generateWebsiteStructuredData(locale: Locale) {
  const metaT = await getTranslations({ locale, namespace: 'metadata' });
  const navT = await getTranslations({ locale, namespace: 'navigation' });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://brenda-librave.netlify.app';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    name: metaT('siteName'),
    description: metaT('siteDescription'),
    url: baseUrl,
    inLanguage: locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/${locale}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

// Breadcrumb structured data
export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>,
  locale: Locale
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://brenda-librave.netlify.app';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`
    }))
  };
}

// Collection page structured data (for book categories)
export async function generateCollectionPageStructuredData(
  categoryName: string,
  books: BookWithTranslations[],
  locale: Locale
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://brenda-librave.netlify.app';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: categoryName,
    description: `Collection of books in ${categoryName} category`,
    inLanguage: locale,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: books.length,
      itemListElement: books.map((book, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Book',
          '@id': `${baseUrl}/${locale}/books/${book.slug}`,
          name: book.translations.title,
          author: {
            '@type': 'Person',
            name: book.translations.author
          },
          image: book.coverImage ? `${baseUrl}${book.coverImage}` : undefined,
          offers: book.price ? {
            '@type': 'Offer',
            price: book.price.toString(),
            priceCurrency: book.baseCurrency
          } : undefined
        }
      }))
    }
  };
}

// Blog post structured data
export function generateArticleStructuredData(
  title: string,
  description: string,
  author: string,
  publishedDate: Date,
  slug: string,
  locale: Locale,
  image?: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://brenda-librave.netlify.app';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${baseUrl}/${locale}/blog/${slug}`,
    headline: title,
    description,
    author: {
      '@type': 'Person',
      name: author
    },
    datePublished: publishedDate.toISOString(),
    dateModified: publishedDate.toISOString(),
    image: image ? `${baseUrl}${image}` : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Brënda Librave',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/favicon.svg`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/${locale}/blog/${slug}`
    },
    inLanguage: locale
  };
}