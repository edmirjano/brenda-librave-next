'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface BookFiltersProps {
  searchParams: Record<string, string | undefined>;
  isMobile: boolean;
}

export function BookFilters({ searchParams, isMobile }: BookFiltersProps) {
  const [categories, setCategories] = useState<Array<{id: string, name: string, bookCount: number}>>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  useEffect(() => {
    // Fetch categories with book counts
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories?withCounts=true');
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

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(urlSearchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Reset to first page when filtering
    params.delete('page');
    
    const paramString = params.toString();
    router.push(`/books${paramString ? `?${paramString}` : ''}`);
    
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    
    // Keep only the search query if it exists
    if (searchParams.query) {
      params.set('query', searchParams.query);
    }
    
    const paramString = params.toString();
    router.push(`/books${paramString ? `?${paramString}` : ''}`);
    
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const hasActiveFilters = Boolean(
    searchParams.categoryId || 
    searchParams.minPrice || 
    searchParams.maxPrice || 
    searchParams.language
  );

  if (isMobile) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtro
          {hasActiveFilters && (
            <span className="ml-1 w-2 h-2 bg-blue-600 rounded-full"></span>
          )}
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="p-4">
              <FilterContent
                categories={categories}
                searchParams={searchParams}
                updateFilter={updateFilter}
                clearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FilterContent
        categories={categories}
        searchParams={searchParams}
        updateFilter={updateFilter}
        clearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />
    </div>
  );
}

interface FilterContentProps {
  categories: Array<{id: string, name: string, bookCount: number}>;
  searchParams: Record<string, string | undefined>;
  updateFilter: (key: string, value: string | null) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

function FilterContent({ 
  categories, 
  searchParams, 
  updateFilter, 
  clearFilters, 
  hasActiveFilters 
}: FilterContentProps) {
  return (
    <>
      {/* Clear filters */}
      {hasActiveFilters && (
        <div className="pb-4 border-b border-gray-200">
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Pastro të gjitha filtrat
          </button>
        </div>
      )}

      {/* Categories */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Kategoritë</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              checked={!searchParams.categoryId}
              onChange={() => updateFilter('categoryId', null)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Të gjitha</span>
          </label>
          
          {categories.map((category) => (
            <label key={category.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  checked={searchParams.categoryId === category.id}
                  onChange={() => updateFilter('categoryId', category.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">{category.name}</span>
              </div>
              <span className="text-xs text-gray-500">({category.bookCount})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Language */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Gjuha</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="language"
              checked={!searchParams.language}
              onChange={() => updateFilter('language', null)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Të gjitha</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="radio"
              name="language"
              checked={searchParams.language === 'SQ'}
              onChange={() => updateFilter('language', 'SQ')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Shqip</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="radio"
              name="language"
              checked={searchParams.language === 'EN'}
              onChange={() => updateFilter('language', 'EN')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Anglisht</span>
          </label>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Çmimi (Lek)</h3>
        <div className="space-y-2">
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={searchParams.minPrice || ''}
              onChange={(e) => updateFilter('minPrice', e.target.value || null)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            />
            <input
              type="number"
              placeholder="Max"
              value={searchParams.maxPrice || ''}
              onChange={(e) => updateFilter('maxPrice', e.target.value || null)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
          
          {/* Quick price filters */}
          <div className="space-y-1">
            <button
              onClick={() => {
                updateFilter('minPrice', null);
                updateFilter('maxPrice', '1000');
              }}
              className="block w-full text-left text-xs text-gray-600 hover:text-blue-600 py-1"
            >
              Nën 1,000 L
            </button>
            <button
              onClick={() => {
                updateFilter('minPrice', '1000');
                updateFilter('maxPrice', '3000');
              }}
              className="block w-full text-left text-xs text-gray-600 hover:text-blue-600 py-1"
            >
              1,000 - 3,000 L
            </button>
            <button
              onClick={() => {
                updateFilter('minPrice', '3000');
                updateFilter('maxPrice', null);
              }}
              className="block w-full text-left text-xs text-gray-600 hover:text-blue-600 py-1"
            >
              Mbi 3,000 L
            </button>
          </div>
        </div>
      </div>
    </>
  );
}