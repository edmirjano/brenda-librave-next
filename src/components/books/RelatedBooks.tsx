import type { BookListItem } from '@/types/book';

import { BookCard } from './BookCard';

interface RelatedBooksProps {
  books: BookListItem[];
}

export function RelatedBooks({ books }: RelatedBooksProps) {
  if (!books || books.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
