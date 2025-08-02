'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { motion } from 'framer-motion';
import {
  BookOpen,
  Edit,
  Eye,
  Filter,
  Plus,
  Search,
  Star,
  Trash2,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Pagination } from '@/components/ui/Pagination';
import { PriceDisplay } from '@/components/ui/PriceDisplay';

import type { BookListItem, BookSearchResult } from '@/types/book';

export function BookManagement() {
  const [books, setBooks] = useState<BookSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (searchQuery) params.set('query', searchQuery);
      if (selectedCategory) params.set('categoryId', selectedCategory);
      if (statusFilter !== 'all') {
        if (statusFilter === 'active') params.set('active', 'true');
        if (statusFilter === 'inactive') params.set('active', 'false');
        if (statusFilter === 'featured') params.set('featured', 'true');
        if (statusFilter === 'low-stock') {
          // This would need special handling in the API
          params.set('lowStock', 'true');
        }
      }
      params.set('page', currentPage.toString());
      params.set('limit', '20');

      const response = await fetch(`/api/books?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setBooks(data.data);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Gabim në ngarkimin e librave');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [searchQuery, selectedCategory, statusFilter, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBooks();
  };

  const toggleBookStatus = async (bookId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/books/${bookId}/toggle-status`, {
        method: 'PATCH',
      });

      if (response.ok) {
        toast.success(`Libri u ${currentStatus ? 'çaktivizua' : 'aktivizua'} me sukses`);
        fetchBooks();
      } else {
        throw new Error('Failed to toggle book status');
      }
    } catch (error) {
      toast.error('Gabim në ndryshimin e statusit');
    }
  };

  const deleteBook = async (bookId: string, title: string) => {
    if (!confirm(`Jeni të sigurt që dëshironi të fshini librin "${title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/books/${bookId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Libri u fshi me sukses');
        fetchBooks();
      } else {
        throw new Error('Failed to delete book');
      }
    } catch (error) {
      toast.error('Gabim në fshirjen e librit');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menaxhimi i Librave</h1>
          <p className="text-gray-600 mt-1">Menaxho librat, kategoritë dhe etiketat</p>
        </div>

        <Link href="/admin/books/new">
          <LiquidButton variant="albanian" size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Shto Libër të Ri
          </LiquidButton>
        </Link>
      </div>

      {/* Filters */}
      <GlassCard className="p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Kërkoni libra, autorë, ose ISBN..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              >
                <option value="all">Të gjithë</option>
                <option value="active">Aktivë</option>
                <option value="inactive">Jo aktivë</option>
                <option value="featured">Të veçantë</option>
                <option value="low-stock">Stok i ulët</option>
              </select>
            </div>

            {/* Search Button */}
            <div>
              <LiquidButton type="submit" variant="primary" size="lg" className="w-full">
                <Search className="w-5 h-5 mr-2" />
                Kërko
              </LiquidButton>
            </div>
          </div>
        </form>
      </GlassCard>

      {/* Books Table */}
      <GlassCard className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-gray-700">Duke ngarkuar librat...</span>
          </div>
        ) : books && books.books.length > 0 ? (
          <div className="space-y-6">
            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <p className="text-gray-700">
                U gjetën <span className="font-semibold">{books.totalCount}</span> libra
              </p>
              <p className="text-sm text-gray-500">
                Faqja {books.currentPage} nga {books.totalPages}
              </p>
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-1 gap-4">
              {books.books.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="flex items-center space-x-4 p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-colors"
                >
                  {/* Book Cover */}
                  <div className="w-16 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <BookOpen className="h-6 w-6 text-red-600" />
                    )}
                  </div>

                  {/* Book Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{book.title}</h3>
                        <p className="text-sm text-gray-600">{book.author}</p>
                        <p className="text-xs text-red-600 mt-1">{book.category.name}</p>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {book.featured && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center">
                            <Star className="h-3 w-3 mr-1" />
                            I veçantë
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          book.active 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {book.active ? 'Aktiv' : 'Jo aktiv'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Stoku: {book.inventory}</span>
                        <PriceDisplay
                          priceALL={book.priceALL || 0}
                          priceEUR={book.priceEUR}
                          size="sm"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Link href={`/books/${book.slug}`}>
                          <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                        </Link>
                        <Link href={`/admin/books/${book.id}/edit`}>
                          <button className="p-2 text-gray-600 hover:text-green-600 transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => toggleBookStatus(book.id, book.active)}
                          className={`p-2 transition-colors ${
                            book.active 
                              ? 'text-gray-600 hover:text-red-600'
                              : 'text-gray-600 hover:text-green-600'
                          }`}
                          title={book.active ? 'Çaktivizo' : 'Aktivizo'}
                        >
                          <Filter className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteBook(book.id, book.title)}
                          className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {books.totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={books.currentPage}
                  totalPages={books.totalPages}
                  hasNextPage={books.hasNextPage}
                  hasPreviousPage={books.hasPreviousPage}
                  baseUrl="/admin/books"
                  searchParams={{
                    query: searchQuery || undefined,
                    category: selectedCategory || undefined,
                    status: statusFilter !== 'all' ? statusFilter : undefined,
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nuk u gjetën libra</h3>
            <p className="text-gray-600 mb-6">
              Nuk ka libra që përputhen me kriteret tuaja të kërkimit.
            </p>
            <Link href="/admin/books/new">
              <LiquidButton variant="albanian" size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Shto Librin e Parë
              </LiquidButton>
            </Link>
          </div>
        )}
      </GlassCard>
    </div>
  );
}