'use client';

import Link from 'next/link';

import { motion } from 'framer-motion';
import { BookOpen, Eye, Heart, ShoppingCart, Star } from 'lucide-react';

import { GlassCard } from '@/components/ui/GlassCard';
import { PriceDisplay } from '@/components/ui/PriceDisplay';

import type { BookListItem } from '@/types/book';

interface BookCardProps {
  book: BookListItem;
  index?: number;
}

export function BookCard({ book, index = 0 }: BookCardProps) {
  const averageRating = 4.5; // TODO: Calculate from actual reviews

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group"
    >
      <Link href={`/books/${book.slug}`}>
        <GlassCard className="p-4 hover:scale-105 transition-transform duration-300 cursor-pointer">
          {/* Book Cover */}
          <div className="relative mb-4">
            <div className="w-full h-48 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center overflow-hidden">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={`Kapaku i librit "${book.title}"`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <BookOpen className="h-12 w-12 text-red-600" />
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Add to wishlist
                }}
                title="Shto në listën e dëshirave"
              >
                <Heart className="h-4 w-4 text-red-600" />
              </button>
              <button
                className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Quick view
                }}
                title="Shiko shpejt"
              >
                <Eye className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col space-y-1">
              {book.featured && (
                <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  I veçantë
                </span>
              )}
              {book.hasDigital && (
                <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                  Dixhital
                </span>
              )}
              {book.language === 'EN' && (
                <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                  English
                </span>
              )}
            </div>
          </div>

          {/* Book Info */}
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors truncate">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600 truncate">{book.author}</p>
              </div>
            </div>

            {/* Category */}
            <p className="text-xs text-red-600 font-medium">{book.category.name}</p>

            {/* Rating */}
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">({averageRating})</span>
            </div>

            {/* Tags */}
            {book.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {book.tags.slice(0, 2).map((bookTag) => (
                  <span
                    key={bookTag.tag.id}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    {bookTag.tag.name}
                  </span>
                ))}
                {book.tags.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{book.tags.length - 2}
                  </span>
                )}
              </div>
            )}

            {/* Price and Actions */}
            <div className="flex items-center justify-between pt-2">
              <PriceDisplay
                priceALL={book.priceALL || 0}
                priceEUR={book.priceEUR}
                size="sm"
                variant="accent"
              />
              <button
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Add to cart
                }}
                title="Shto në shportë"
              >
                <ShoppingCart className="h-4 w-4" />
              </button>
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}