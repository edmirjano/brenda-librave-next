'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Star } from 'lucide-react';

import { BookCard } from '@/components/books/BookCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

import type { BookListItem } from '@/types/book';

interface FeaturedBooksProps {
  limit?: number;
  showHeader?: boolean;
}

export function FeaturedBooks({ limit = 8, showHeader = true }: FeaturedBooksProps) {
  const [books, setBooks] = useState<BookListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        const response = await fetch(`/api/books/featured?limit=${limit}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch featured books');
        }

        setBooks(data.data);
      } catch (error) {
        console.error('Error fetching featured books:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch featured books');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedBooks();
  }, [limit]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {showHeader && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Libra të Veçantë</h2>
            <p className="text-gray-600 mt-2">Librat më të mirë të zgjedhur nga ne</p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: limit }).map((_, i) => (
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

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard className="p-8 text-center">
          <BookOpen className="h-12 w-12 text-red-600 mx-auto mb-4" />
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

  if (books.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard className="p-8 text-center">
          <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nuk ka libra të veçantë</h3>
          <p className="text-gray-600">
            Aktualisht nuk ka libra të shënuar si të veçantë.
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
      className="space-y-8"
    >
      {showHeader && (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Libra të{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
              Veçantë
            </span>
          </h2>
          <p className="text-gray-600">Librat më të mirë të zgjedhur nga ne</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {books.map((book, index) => (
          <BookCard key={book.id} book={book} index={index} />
        ))}
      </div>

      {showHeader && books.length >= limit && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center"
        >
          <Link href="/books?featured=true">
            <LiquidButton variant="primary" size="lg">
              <ArrowRight className="w-5 h-5 mr-2" />
              Shiko të gjithë librat e veçantë
            </LiquidButton>
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}