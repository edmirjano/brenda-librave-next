'use client';

import { useEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { debounce } from '@/lib/utils';

interface BookSearchProps {
  defaultQuery?: string;
}

export function BookSearch({ defaultQuery = '' }: BookSearchProps) {
  const [query, setQuery] = useState(defaultQuery);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Debounced search function
  const debouncedSearch = debounce((searchQuery: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (searchQuery.trim()) {
      params.set('query', searchQuery.trim());
    } else {
      params.delete('query');
    }

    // Reset to first page when searching
    params.delete('page');

    const paramString = params.toString();
    router.push(`/books${paramString ? `?${paramString}` : ''}`);
  }, 300);

  useEffect(() => {
    if (query !== defaultQuery) {
      debouncedSearch(query);
    }
  }, [query, debouncedSearch, defaultQuery]);

  const handleClear = () => {
    setQuery('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('query');
    params.delete('page');
    const paramString = params.toString();
    router.push(`/books${paramString ? `?${paramString}` : ''}`);
  };

  return (
    <div className="relative max-w-lg mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          type="text"
          placeholder="Kërkoni libra, autorë..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />

        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg
              className="h-5 w-5 text-gray-400 hover:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
