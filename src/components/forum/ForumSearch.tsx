'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { motion } from 'framer-motion';
import { Filter, Plus, Search, SlidersHorizontal, X } from 'lucide-react';

import { LiquidButton } from '@/components/ui/LiquidButton';

interface ForumSearchProps {
  initialParams: {
    query?: string;
    category?: string;
    tags?: string;
    book?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
    limit?: string;
  };
}

export function ForumSearch({ initialParams }: ForumSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialParams.query || '');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    category: initialParams.category || '',
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

    const url = `/forum${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(url);
  };

  const handleClearFilters = () => {
    setQuery('');
    setFilters({
      category: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    router.push('/forum');
  };

  const hasActiveFilters = query || Object.values(filters).some(value => 
    value !== '' && value !== 'createdAt' && value !== 'desc'
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
            placeholder="Kërkoni diskutime, libra, ose përdorues..."
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

        <LiquidButton
          type="button"
          variant="primary"
          size="lg"
          onClick={() => router.push('/forum/new')}
        >
          <Plus className="w-5 h-5 mr-2" />
          Diskutim i Ri
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategoria
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              >
                <option value="">Të gjitha</option>
                <option value="literatura-shqiptare">Literatura Shqiptare</option>
                <option value="rekomandime">Rekomandime</option>
                <option value="kritika">Kritika</option>
                <option value="autoret">Autorët</option>
                <option value="poezi">Poezi</option>
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
                <option value="views">Shikimet</option>
                <option value="posts">Përgjigjet</option>
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