'use client';

import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import { AlertCircle, BookOpen } from 'lucide-react';

import { BookCard } from '@/components/books/BookCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Pagination } from '@/components/ui/Pagination';

import type { BookSearchResult } from '@/types/book';

interface BookGridProps {
  searchParams: {
    query?: string;
    category?: string;
    tags?: string;
    language?: string;
    minPrice?: string;
    maxPrice?: string;
    currency?: string;
    featured?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
    limit?: string;
  };
}

export function BookGrid({ searchParams }: BookGridProps) {
  const [result, setResult] = useState<BookSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        // Add search parameters
        Object.entries(searchParams).forEach(([key, value]) => {
          if (value) {
            params.set(key, value);
          }
        });

        const response = await fetch(`/api/books?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch books');
        }

        setResult(data.data);
      } catch (error) {
        console.error('Error fetching books:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch books');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
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
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Gabim në ngarkim</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
          >
            Provo përsëri
          </button>
        </GlassCard>
      </motion.div>
    );
  }

  if (!result || result.books.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard className="p-12 text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Nuk u gjetën libra</h3>
          <p className="text-gray-600 mb-6">
            Nuk ka libra që përputhen me kriteret tuaja të kërkimit.
          </p>
          <p className="text-sm text-gray-500">
            Provoni të ndryshoni filtrat ose termat e kërkimit.
          </p>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Results Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <p className="text-gray-700">
          U gjetën <span className="font-semibold">{result.totalCount}</span> libra
          {searchParams.query && (
            <>
              {' '}
              për "<span className="font-semibold">{searchParams.query}</span>"
            </>
          )}
        </p>
        <p className="text-sm text-gray-500">
          Faqja {result.currentPage} nga {result.totalPages}
        </p>
      </motion.div>

      {/* Books Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {result.books.map((book, index) => (
          <BookCard key={book.id} book={book} index={index} />
        ))}
      </motion.div>

      {/* Pagination */}
      {result.totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex justify-center"
        >
          <Pagination
            currentPage={result.currentPage}
            totalPages={result.totalPages}
            hasNextPage={result.hasNextPage}
            hasPreviousPage={result.hasPreviousPage}
            baseUrl="/books"
            searchParams={searchParams}
          />
        </motion.div>
      )}
    </div>
  );
}