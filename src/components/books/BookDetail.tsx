'use client';

import { useState } from 'react';

import { motion } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  Download,
  Globe,
  Heart,
  Package,
  Star,
  Tag,
} from 'lucide-react';

import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { ShareButton } from '@/components/ui/ShareButton';

import type { BookDetailView } from '@/types/book';

interface BookDetailProps {
  book: BookDetailView;
}

export function BookDetail({ book }: BookDetailProps) {
  const [selectedFormat, setSelectedFormat] = useState<'physical' | 'digital'>('physical');
  const [isWishlisted, setIsWishlisted] = useState(false);

  const averageRating = 4.5; // TODO: Calculate from actual reviews
  const reviewCount = 23; // TODO: Get from actual reviews

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist functionality
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Book Cover and Images */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard className="p-6">
          <div className="relative">
            <div className="w-full h-96 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center overflow-hidden mb-6">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={`Kapaku i librit "${book.title}"`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <BookOpen className="h-24 w-24 text-red-600" />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-3">
                <LiquidButton
                  variant={isWishlisted ? 'albanian' : 'secondary'}
                  size="sm"
                  onClick={handleWishlistToggle}
                >
                  <Heart
                    className={`w-4 h-4 mr-2 ${isWishlisted ? 'fill-current' : ''}`}
                  />
                  {isWishlisted ? 'Në listë' : 'Shto në listë'}
                </LiquidButton>
              </div>

              <ShareButton
                url={`/books/${book.slug}`}
                title={`${book.title} - ${book.author}`}
                description={book.description}
              />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Book Information */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        {/* Title and Author */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{book.title}</h1>
          <p className="text-xl text-gray-700 mb-4">nga {book.author}</p>

          {/* Rating and Reviews */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(averageRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600">
              {averageRating} ({reviewCount} vlerësime)
            </span>
          </div>

          {/* Category and Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
              {book.category.name}
            </span>
            {book.tags.map((bookTag) => (
              <span
                key={bookTag.tag.id}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
              >
                {bookTag.tag.name}
              </span>
            ))}
          </div>
        </div>

        {/* Format Selection */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Zgjidhni formatin</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Physical Book */}
            <div
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedFormat === 'physical'
                  ? 'border-red-500 bg-red-50/50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedFormat('physical')}
            >
              <div className="flex items-center space-x-3 mb-3">
                <Package className="h-6 w-6 text-red-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">Libër Fizik</h4>
                  <p className="text-sm text-gray-600">Dërgim në shtëpi</p>
                </div>
              </div>
              <PriceDisplay
                priceALL={book.priceALL || 0}
                priceEUR={book.priceEUR}
                showBoth
                size="md"
              />
            </div>

            {/* Digital Book */}
            {book.hasDigital && (
              <div
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedFormat === 'digital'
                    ? 'border-red-500 bg-red-50/50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedFormat('digital')}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <Download className="h-6 w-6 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Libër Dixhital</h4>
                    <p className="text-sm text-gray-600">Shkarkoni menjëherë</p>
                  </div>
                </div>
                <PriceDisplay
                  priceALL={book.digitalPriceALL || 0}
                  priceEUR={book.digitalPriceEUR}
                  showBoth
                  size="md"
                />
              </div>
            )}
          </div>

          {/* Add to Cart */}
          <div className="mt-6">
            <AddToCartButton
              book={book}
              format={selectedFormat}
              disabled={selectedFormat === 'physical' && book.inventory === 0}
              className="w-full"
            />
            {selectedFormat === 'physical' && book.inventory === 0 && (
              <p className="text-sm text-red-600 mt-2 text-center">
                Libri fizik nuk është në stok
              </p>
            )}
          </div>
        </GlassCard>

        {/* Book Details */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detajet e librit</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {book.isbn && (
              <div className="flex items-center space-x-3">
                <Tag className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">ISBN</p>
                  <p className="text-sm text-gray-600">{book.isbn}</p>
                </div>
              </div>
            )}

            {book.publishedDate && (
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Data e botimit</p>
                  <p className="text-sm text-gray-600">
                    {new Date(book.publishedDate).toLocaleDateString('sq-AL')}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Gjuha</p>
                <p className="text-sm text-gray-600">
                  {book.language === 'SQ' ? 'Shqip' : 'Anglisht'}
                </p>
              </div>
            </div>

            {selectedFormat === 'physical' && (
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Në stok</p>
                  <p className="text-sm text-gray-600">
                    {book.inventory > 0 ? `${book.inventory} kopje` : 'Jashtë stokut'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Description */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Përshkrimi</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {book.description}
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}