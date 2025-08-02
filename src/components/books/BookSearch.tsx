'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { motion } from 'framer-motion';
import { Filter, Search, SlidersHorizontal, X } from 'lucide-react';

import { LiquidButton } from '@/components/ui/LiquidButton';

interface BookSearchProps {
  initialParams: {
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

export function BookSearch({ initialParams }: BookSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialParams.query || '');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    language: initialParams.language || '',
    minPrice: initialParams.minPrice || '',
    maxPrice: initialParams.maxPrice || '',
    currency: initialParams.currency || 'ALL',
    featured: initialParams.featured === 'true',
    sortBy: initialParams.sortBy || 'createdAt',
    sortOrder: initialParams.sortOrder || 'desc',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    
    if (query.trim()) {
      params.set('query', query.trim());
    }
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value.toString());
      }
    });

    const url = `/books${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(url);
  };

  const handleClearFilters = () => {
    setQuery('');
    setFilters({
      language: '',
      minPrice: '',
      maxPrice: '',
      currency: 'ALL',
      featured: false,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    router.push('/books');
  };

  const hasActiveFilters = query || Object.values(filters).some(value => 
    value !== '' && value !== 'ALL' && value !== 'createdAt' && value !== 'desc' && value !== false
  );

  return (
    <div className="space-y-4">
      {/* Main Search */}
      <form onSubmit={handleSearch} className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Kërkoni libra, autorë, ose ISBN..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
          />
        </div>

        <LiquidButton type="submit" variant="albanian" size="lg">
          <Search className="w-5 h-5 mr-2" />
          Kërko
        </LiquidButton>

        <LiquidButton
          type="button"
          variant="secondary"
          size="lg"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <SlidersHorizontal className="w-5 h-5 mr-2" />
          Filtro
        </LiquidButton>
      </form>

      {/* Advanced Filters */}
      {showAdvanced && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Language Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gjuha
              </label>
              <select
                value={filters.language}
                onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              >
                <option value="">Të gjitha</option>
                <option value="SQ">Shqip</option>
                <option value="EN">Anglisht</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Çmimi nga
              </label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                placeholder="0"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Çmimi deri
              </label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                placeholder="10000"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monedha
              </label>
              <select
                value={filters.currency}
                onChange={(e) => setFilters({ ...filters, currency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              >
                <option value="ALL">Lek Shqiptarë (ALL)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rendit sipas
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              >
                <option value="createdAt">Më të rejat</option>
                <option value="title">Titulli</option>
                <option value="author">Autori</option>
                <option value="price">Çmimi</option>
                <option value="featured">Të veçantë</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Drejtimi
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              >
                <option value="desc">Zbritës</option>
                <option value="asc">Rritës</option>
              </select>
            </div>

            {/* Featured Filter */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="featured"
                checked={filters.featured}
                onChange={(e) => setFilters({ ...filters, featured: e.target.checked })}
                className="h-5 w-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                Vetëm libra të veçantë
              </label>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/20">
            <div className="flex items-center space-x-3">
              {hasActiveFilters && (
                <LiquidButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  <X className="w-4 h-4 mr-2" />
                  Pastro filtrat
                </LiquidButton>
              )}
            </div>

            <LiquidButton type="submit" variant="albanian" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Apliko filtrat
            </LiquidButton>
          </div>
        </motion.div>
      )}
    </div>
  );
}