'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { motion } from 'framer-motion';
import { BookOpen, Grid3X3 } from 'lucide-react';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

import type { CategoryWithoutRelations } from '@/types/book';

interface CategoryFilterProps {
  selectedCategory?: string;
}

export function CategoryFilter({ selectedCategory }: CategoryFilterProps) {
  const [categories, setCategories] = useState<
    Array<CategoryWithoutRelations & { bookCount: number }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories?withCounts=true');
        const data = await response.json();

        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner size="md" />
        <span className="ml-3 text-gray-700">Duke ngarkuar kategoritë...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-3 mb-4">
        <Grid3X3 className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Kategoritë</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {/* All Categories */}
        <Link href="/books">
          <motion.div
            className={`p-3 rounded-xl text-center transition-all duration-200 cursor-pointer ${
              !selectedCategory
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-white/50 hover:bg-white/70 text-gray-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BookOpen className="h-6 w-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Të gjitha</p>
            <p className="text-xs opacity-80">
              {categories.reduce((sum, cat) => sum + cat.bookCount, 0)} libra
            </p>
          </motion.div>
        </Link>

        {/* Category Items */}
        {categories.map((category, index) => (
          <Link key={category.id} href={`/books?category=${category.slug}`}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className={`p-3 rounded-xl text-center transition-all duration-200 cursor-pointer ${
                selectedCategory === category.slug
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-white/50 hover:bg-white/70 text-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BookOpen className="h-6 w-6 mx-auto mb-2" />
              <p className="text-sm font-medium truncate" title={category.name}>
                {category.name}
              </p>
              <p className="text-xs opacity-80">{category.bookCount} libra</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}