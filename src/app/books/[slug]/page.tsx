import { Suspense } from 'react';

// import { BookService } from '@/lib/services/books';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BookDetailSkeleton } from '@/components/books/BookDetailSkeleton';
import { BookDetailView } from '@/components/books/BookDetailView';
import { RelatedBooks } from '@/components/books/RelatedBooks';

interface BookPageProps {
  params: {
    slug: string;
  };
}

async function getBookData(slug: string) {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/books/${slug}`,
      {
        cache: 'no-store', // For development - in production, use appropriate caching
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching book:', error);
    return null;
  }
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const bookData = await getBookData(params.slug);

  if (!bookData) {
    return {
      title: 'Libër i pagjetshëm - Brënda Librave',
      description: 'Libri që kërkoni nuk u gjet.',
    };
  }

  const { book } = bookData;

  return {
    title: `${book.title} - ${book.author} | Brënda Librave`,
    description:
      book.description.length > 160 ? `${book.description.substring(0, 160)}...` : book.description,
    keywords: `${book.title}, ${book.author}, ${book.category.name}, libra shqiptarë, blerje libra online`,
    openGraph: {
      title: `${book.title} - ${book.author}`,
      description: book.description,
      type: 'product',
      locale: 'sq_AL',
      images: book.coverImage
        ? [
            {
              url: book.coverImage,
              width: 400,
              height: 600,
              alt: `Kopertina e librit "${book.title}"`,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${book.title} - ${book.author}`,
      description: book.description,
      images: book.coverImage ? [book.coverImage] : [],
    },
    alternates: {
      canonical: `/books/${book.slug}`,
    },
  };
}

export default async function BookPage({ params }: BookPageProps) {
  const bookData = await getBookData(params.slug);

  if (!bookData) {
    notFound();
  }

  const { book, relatedBooks } = bookData;

  // JSON-LD structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    author: {
      '@type': 'Person',
      name: book.author,
    },
    description: book.description,
    isbn: book.isbn,
    genre: book.category.name,
    inLanguage: book.language === 'SQ' ? 'sq' : 'en',
    datePublished: book.publishedDate,
    offers: {
      '@type': 'Offer',
      price: book.priceALL,
      priceCurrency: 'ALL',
      availability:
        book.inventory > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Brënda Librave',
      },
    },
    image: book.coverImage,
    url: `/books/${book.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="flex text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
            <a href="/books" className="hover:text-gray-700">
              Librat
            </a>
            <span className="mx-2">/</span>
            <a href={`/books?categoryId=${book.category.id}`} className="hover:text-gray-700">
              {book.category.name}
            </a>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{book.title}</span>
          </nav>

          {/* Book Detail */}
          <Suspense fallback={<BookDetailSkeleton />}>
            <BookDetailView book={book} />
          </Suspense>

          {/* Related Books */}
          {relatedBooks && relatedBooks.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Libra të ngjashëm</h2>
              <Suspense
                fallback={
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                        <div className="aspect-[3/4] bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                }
              >
                <RelatedBooks books={relatedBooks} />
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
