'use client';

import { useEffect, useState } from 'react';
import { BookCard } from './BookCard';
import { Pagination } from '@/components/ui/Pagination';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { BookGridSkeleton } from './BookGridSkeleton';
import type { BookSearchResult, BookSearchParams } from '@/types/book';

interface BookGridProps {
  searchParams: {
    query?: string;
    categoryId?: string;
    tags?: string;
    language?: 'SQ' | 'EN';
    minPrice?: string;
    maxPrice?: string;
    currency?: 'ALL' | 'EUR';
    featured?: string;
    sortBy?: 'title' | 'author' | 'price' | 'featured' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    page?: string;
  };
}

export function BookGrid({ searchParams }: BookGridProps) {
  const [books, setBooks] = useState<BookSearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query parameters
        const params = new URLSearchParams();
        
        if (searchParams.query) params.set('query', searchParams.query);
        if (searchParams.categoryId) params.set('categoryId', searchParams.categoryId);
        if (searchParams.tags) params.set('tags', searchParams.tags);
        if (searchParams.language) params.set('language', searchParams.language);
        if (searchParams.minPrice) params.set('minPrice', searchParams.minPrice);
        if (searchParams.maxPrice) params.set('maxPrice', searchParams.maxPrice);
        if (searchParams.currency) params.set('currency', searchParams.currency);
        if (searchParams.featured) params.set('featured', searchParams.featured);
        if (searchParams.sortBy) params.set('sortBy', searchParams.sortBy);
        if (searchParams.sortOrder) params.set('sortOrder', searchParams.sortOrder);
        if (searchParams.page) params.set('page', searchParams.page);

        const response = await fetch(`/api/books?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch books');
        }

        setBooks(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchParams]);

  if (loading) {
    return <BookGridSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium">Gabim në ngarkimin e librave</p>
          <p className="text-sm text-gray-600 mt-2">{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Provo përsëri
        </button>
      </div>
    );
  }

  if (!books || books.books.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-lg font-medium text-gray-600">Nuk u gjetën libra</p>
          <p className="text-sm text-gray-500 mt-2">
            Përpiquni të ndryshoni kriteret e kërkimit ose filtrat.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Results count */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-600">
          {books.totalCount === 1 
            ? `1 libër u gjet`
            : `${books.totalCount} libra u gjetën`
          }
        </p>
        
        {/* Sort dropdown for mobile */}
        <div className="lg:hidden">
          <select 
            className="text-sm border border-gray-300 rounded-lg px-3 py-1 bg-white"
            value={`${searchParams.sortBy || 'createdAt'}-${searchParams.sortOrder || 'desc'}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              const params = new URLSearchParams(window.location.search);
              params.set('sortBy', sortBy);
              params.set('sortOrder', sortOrder);
              params.delete('page'); // Reset to first page
              window.location.href = `${window.location.pathname}?${params.toString()}`;
            }}
          >
            <option value="createdAt-desc">Më të rejat</option>
            <option value="createdAt-asc">Më të vjetrat</option>
            <option value="title-asc">Titulli A-Z</option>
            <option value="title-desc">Titulli Z-A</option>
            <option value="author-asc">Autori A-Z</option>
            <option value="author-desc">Autori Z-A</option>
            <option value="price-asc">Çmimi i ulët</option>
            <option value="price-desc">Çmimi i lartë</option>
            <option value="featured-desc">Të veçuara</option>
          </select>
        </div>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {books.books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {/* Pagination */}
      {books.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={books.currentPage}
            totalPages={books.totalPages}
            hasNextPage={books.hasNextPage}
            hasPreviousPage={books.hasPreviousPage}
            baseUrl="/books"
            searchParams={searchParams}
          />
        </div>
      )}
    </div>
  );
}