import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BookDetail } from '@/components/books/BookDetail';
import { RelatedBooks } from '@/components/books/RelatedBooks';

import { BookService } from '@/lib/services/books';

interface BookPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = await BookService.getBookBySlug(slug);

  if (!book) {
    return {
      title: 'Libri nuk u gjet | Brënda Librave',
      description: 'Libri që kërkoni nuk ekziston.',
    };
  }

  return {
    title: `${book.title} - ${book.author} | Brënda Librave`,
    description: book.description.slice(0, 160),
    keywords: [
      book.title,
      book.author,
      book.category.name,
      'libra shqiptarë',
      'literatura',
      ...book.tags.map((bt) => bt.tag.name),
    ],
    openGraph: {
      title: `${book.title} - ${book.author}`,
      description: book.description.slice(0, 160),
      type: 'book',
      images: book.coverImage ? [{ url: book.coverImage }] : [],
    },
  };
}

export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params;
  const book = await BookService.getBookBySlug(slug);

  if (!book) {
    notFound();
  }

  return (
          <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-100/20 to-purple-100/20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <BookDetail book={book} />
        <div className="mt-16">
          <RelatedBooks bookId={book.id} />
        </div>
      </div>
    </div>
  );
}