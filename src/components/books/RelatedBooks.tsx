'use client';

import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

import { BookCard } from '@/components/books/BookCard';
import { GlassCard } from '@/components/ui/GlassCard';

import { BookService } from '@/lib/services/books';

import type { BookListItem } from '@/types/book';

interface RelatedBooksProps {
  bookId: string;
  limit?: number;
}

export function RelatedBooks({ bookId, limit = 4 }: RelatedBooksProps) {
  const [books, setBooks] = useState<BookListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedBooks = async () => {
      try {
        const relatedBooks = await BookService.getRelatedBooks(bookId, limit);
        setBooks(relatedBooks);
      } catch (error) {
        console.error('Error fetching related books:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedBooks();
  }, [bookId, limit]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Libra të ngjashëm</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <GlassCard key={i} className="p-4">
              <div className="animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard className="p-8 text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nuk ka libra të ngjashëm</h3>
          <p className="text-gray-600">
            Nuk u gjetën libra të ngjashëm për këtë titull.
          </p>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-900">Libra të ngjashëm</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {books.map((book, index) => (
          <BookCard key={book.id} book={book} index={index} />
        ))}
      </div>
    </motion.div>
  );
}