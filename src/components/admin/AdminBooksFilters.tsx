'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { debounce } from '@/lib/utils';

interface AdminBooksFiltersProps {
  searchParams: {
    query?: string;
    categoryId?: string;
    status?: 'all' | 'active' | 'inactive';
    featured?: string;
    page?: string;
    limit?: string;
  };
}

export function AdminBooksFilters({ searchParams }: AdminBooksFiltersProps) {
  const [query, setQuery] = useState(searchParams.query || '');
  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([]);
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setCategories(data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Debounced search function
  const debouncedSearch = debounce((searchQuery: string) => {
    const params = new URLSearchParams(urlSearchParams.toString());
    
    if (searchQuery.trim()) {
      params.set('query', searchQuery.trim());
    } else {
      params.delete('query');
    }
    
    params.delete('page'); // Reset to first page
    
    const paramString = params.toString();
    router.push(`/admin/books${paramString ? `?${paramString}` : ''}`);
  }, 300);

  useEffect(() => {
    if (query !== searchParams.query) {
      debouncedSearch(query);
    }
  }, [query, debouncedSearch, searchParams.query]);

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(urlSearchParams.toString());
    
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    params.delete('page'); // Reset to first page
    
    const paramString = params.toString();
    router.push(`/admin/books${paramString ? `?${paramString}` : ''}`);
  };

  const clearFilters = () => {
    setQuery('');
    router.push('/admin/books');
  };

  const hasActiveFilters = Boolean(
    searchParams.query || 
    searchParams.categoryId || 
    (searchParams.status && searchParams.status !== 'all') ||
    searchParams.featured
  );

  return (
    <div className="space-y-4">
      {/* Search and Clear */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Kërkoni libra, autorë..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            🗑️ Pastro Filtrat
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kategoria
          </label>
          <select
            value={searchParams.categoryId || 'all'}
            onChange={(e) => updateFilter('categoryId', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Të gjitha</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Statusi
          </label>
          <select
            value={searchParams.status || 'all'}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Të gjitha</option>
            <option value="active">Aktive</option>
            <option value="inactive">Joaktive</option>
          </select>
        </div>

        {/* Featured Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            E veçuar
          </label>
          <select
            value={searchParams.featured || 'all'}
            onChange={(e) => updateFilter('featured', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Të gjitha</option>
            <option value="true">Të veçuara</option>
            <option value="false">Jo të veçuara</option>
          </select>
        </div>

        {/* Items per page */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Për faqe
          </label>
          <select
            value={searchParams.limit || '20'}
            onChange={(e) => updateFilter('limit', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>
    </div>
  );
}