'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { PriceDisplay } from '@/components/ui/PriceDisplay';

import { cn } from '@/lib/utils';

import type { BookSearchResult } from '@/types/book';

interface AdminBooksTableProps {
  searchParams: {
    query?: string;
    categoryId?: string;
    status?: 'all' | 'active' | 'inactive';
    featured?: string;
    page?: string;
    limit?: string;
  };
}

export function AdminBooksTable({ searchParams }: AdminBooksTableProps) {
  const [books, setBooks] = useState<BookSearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        if (searchParams.query) params.set('query', searchParams.query);
        if (searchParams.categoryId) params.set('categoryId', searchParams.categoryId);
        if (searchParams.status && searchParams.status !== 'all') {
          params.set('active', searchParams.status === 'active' ? 'true' : 'false');
        }
        if (searchParams.featured) params.set('featured', searchParams.featured);
        if (searchParams.page) params.set('page', searchParams.page);
        params.set('limit', searchParams.limit || '20');

        const response = await fetch(`/api/books?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setBooks(data.data);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchParams]);

  const toggleBookSelection = (bookId: string) => {
    const newSelection = new Set(selectedBooks);
    if (newSelection.has(bookId)) {
      newSelection.delete(bookId);
    } else {
      newSelection.add(bookId);
    }
    setSelectedBooks(newSelection);
  };

  const toggleAllBooks = () => {
    if (!books) return;

    const allSelected = selectedBooks.size === books.books.length;
    if (allSelected) {
      setSelectedBooks(new Set());
    } else {
      setSelectedBooks(new Set(books.books.map((book) => book.id)));
    }
  };

  const handleBulkAction = async (
    action: 'activate' | 'deactivate' | 'feature' | 'unfeature' | 'delete'
  ) => {
    if (selectedBooks.size === 0) return;

    setBulkActionLoading(true);
    try {
      // TODO: Implement bulk action API calls
      console.warn(`Bulk ${action} for books:`, Array.from(selectedBooks));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Refresh the table data
      setSelectedBooks(new Set());
    } catch (error) {
      console.error(`Error performing bulk ${action}:`, error);
    } finally {
      setBulkActionLoading(false);
    }
  };

  const deleteBook = async (bookId: string, bookTitle: string) => {
    if (!confirm(`Jeni i sigurt që dëshironi të fshini librin "${bookTitle}"?`)) {
      return;
    }

    try {
      // TODO: Implement delete API call
      console.warn('Deleting book:', bookId);
      // TODO: Refresh the table data
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Duke ngarkuar...</div>;
  }

  if (!books || books.books.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <p className="text-lg font-medium text-gray-600">Nuk u gjetën libra</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Bulk Actions */}
      {selectedBooks.size > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">{selectedBooks.size} libra të zgjedhur</span>

            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('activate')}
                disabled={bulkActionLoading}
              >
                ✅ Aktivizo
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('deactivate')}
                disabled={bulkActionLoading}
              >
                ❌ Çaktivizo
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('feature')}
                disabled={bulkActionLoading}
              >
                ⭐ Veço
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleBulkAction('delete')}
                disabled={bulkActionLoading}
              >
                🗑️ Fshi
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={books.books.length > 0 && selectedBooks.size === books.books.length}
                  onChange={toggleAllBooks}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Libri
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Çmimi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stoku
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statusi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Veprimet
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {books.books.map((book) => (
              <tr
                key={book.id}
                className={cn('hover:bg-gray-50', selectedBooks.has(book.id) && 'bg-blue-50')}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedBooks.has(book.id)}
                    onChange={() => toggleBookSelection(book.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-16 w-12">
                      {book.coverImage ? (
                        <Image
                          src={book.coverImage}
                          alt={book.title}
                          width={48}
                          height={64}
                          className="h-16 w-12 object-cover rounded"
                        />
                      ) : (
                        <div className="h-16 w-12 bg-gray-200 rounded flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        <Link href={`/admin/books/${book.slug}`} className="hover:text-blue-600">
                          {book.title}
                        </Link>
                      </div>
                      <div className="text-sm text-gray-500">{book.author}</div>
                      <div className="flex items-center mt-1 space-x-2">
                        {book.featured && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            ⭐ E veçuar
                          </span>
                        )}
                        {book.hasDigital && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            💻 Digital
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {book.category.name}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <PriceDisplay
                    priceALL={book.priceALL || 0}
                    priceEUR={book.priceEUR}
                    showBoth={false}
                    size="sm"
                  />
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {book.inventory}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      book.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    )}
                  >
                    {book.active ? '✅ Aktiv' : '❌ Joaktiv'}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Link href={`/books/${book.slug}`} className="text-blue-600 hover:text-blue-900">
                    👁️ Shiko
                  </Link>
                  <Link
                    href={`/admin/books/${book.slug}/edit`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    ✏️ Përditëso
                  </Link>
                  <button
                    onClick={() => deleteBook(book.id, book.title)}
                    className="text-red-600 hover:text-red-900"
                  >
                    🗑️ Fshi
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {books.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <Pagination
            currentPage={books.currentPage}
            totalPages={books.totalPages}
            hasNextPage={books.hasNextPage}
            hasPreviousPage={books.hasPreviousPage}
            baseUrl="/admin/books"
            searchParams={searchParams}
          />
        </div>
      )}
    </div>
  );
}
