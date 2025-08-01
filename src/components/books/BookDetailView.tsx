'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { Button } from '@/components/ui/Button';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { CurrencyToggle } from '@/components/ui/CurrencyToggle';
import { ShareButton } from '@/components/ui/ShareButton';
import { BookDetailTabs } from '@/components/books/BookDetailTabs';
import type { BookDetailView as BookDetailType } from '@/types/book';
import { cn } from '@/lib/utils';

interface BookDetailViewProps {
  book: BookDetailType;
}

export function BookDetailView({ book }: BookDetailViewProps) {
  const [selectedFormat, setSelectedFormat] = useState<'physical' | 'digital'>('physical');

  const hasPhysicalCopy = book.inventory > 0 || (book.priceALL || book.priceEUR);
  const hasDigitalCopy = book.hasDigital && (book.digitalPriceALL || book.digitalPriceEUR);

  const getCurrentPrice = () => {
    if (selectedFormat === 'digital') {
      return {
        priceALL: book.digitalPriceALL || 0,
        priceEUR: book.digitalPriceEUR
      };
    }
    return {
      priceALL: book.priceALL || 0,
      priceEUR: book.priceEUR
    };
  };

  const { priceALL, priceEUR } = getCurrentPrice();

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:p-8">
        {/* Book Cover */}
        <div className="lg:col-span-1">
          <div className="aspect-[3/4] relative bg-gray-100 lg:sticky lg:top-4">
            {book.coverImage ? (
              <Image
                src={book.coverImage}
                alt={`Kopertina e librit "${book.title}"`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <svg 
                  className="w-20 h-20 text-gray-400" 
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

            {/* Badges */}
            <div className="absolute top-4 left-4 space-y-2">
              {book.featured && (
                <span className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                  E veçuar
                </span>
              )}
              {book.hasDigital && (
                <span className="bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                  Digital
                </span>
              )}
            </div>

            {/* Share Button - Mobile */}
            <div className="absolute top-4 right-4 lg:hidden">
              <ShareButton 
                url={`/books/${book.slug}`}
                title={book.title}
                description={book.description}
              />
            </div>
          </div>
        </div>

        {/* Book Details */}
        <div className="lg:col-span-1 p-6 lg:p-0">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  {book.title}
                </h1>
                <p className="text-lg text-gray-600 mb-1">
                  nga <span className="font-semibold">{book.author}</span>
                </p>
              </div>
              
              {/* Share Button - Desktop */}
              <div className="hidden lg:block ml-4">
                <ShareButton 
                  url={`/books/${book.slug}`}
                  title={book.title}
                  description={book.description}
                />
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
              <span>📚 {book.category.name}</span>
              <span>🌐 {book.language === 'SQ' ? 'Shqip' : 'Anglisht'}</span>
              {book.publishedDate && (
                <span>📅 {new Date(book.publishedDate).getFullYear()}</span>
              )}
              {book.isbn && (
                <span>📖 ISBN: {book.isbn}</span>
              )}
            </div>

            {/* Tags */}
            {book.tags && book.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {book.tags.map((bookTag) => (
                  <span
                    key={bookTag.tag.id}
                    className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
                  >
                    {bookTag.tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Format Selection */}
          {hasPhysicalCopy && hasDigitalCopy && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Zgjidhni formatin:</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedFormat('physical')}
                  className={cn(
                    'flex-1 px-4 py-2 text-sm font-medium rounded-lg border transition-colors',
                    selectedFormat === 'physical'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  )}
                >
                  📖 Fizik
                </button>
                <button
                  onClick={() => setSelectedFormat('digital')}
                  className={cn(
                    'flex-1 px-4 py-2 text-sm font-medium rounded-lg border transition-colors',
                    selectedFormat === 'digital'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  )}
                >
                  💻 Digital
                </button>
              </div>
            </div>
          )}

          {/* Price and Currency */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <PriceDisplay
                  priceALL={priceALL}
                  priceEUR={priceEUR}
                  showBoth={true}
                  size="lg"
                  className="mb-2"
                />
                
                {/* Stock Status */}
                <div className="text-sm">
                  {selectedFormat === 'physical' ? (
                    book.inventory > 0 ? (
                      <span className="text-green-600 font-medium">
                        ✓ Në stok ({book.inventory} copë)
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium">
                        ✗ Mbaruar
                      </span>
                    )
                  ) : (
                    <span className="text-green-600 font-medium">
                      ✓ Gati për shkarkim
                    </span>
                  )}
                </div>
              </div>
              
              <CurrencyToggle />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <AddToCartButton
                book={book}
                format={selectedFormat}
                disabled={selectedFormat === 'physical' && book.inventory === 0}
                className="w-full"
              />
              
              {selectedFormat === 'digital' && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    // Handle direct digital purchase
                    console.log('Direct digital purchase');
                  }}
                >
                  🛒 Blej tani (shkarkim i menjëhershëm)
                </Button>
              )}
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-4 text-sm mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <span className="text-gray-500">Kategoria:</span>
              <p className="font-medium">{book.category.name}</p>
            </div>
            <div>
              <span className="text-gray-500">Gjuha:</span>
              <p className="font-medium">{book.language === 'SQ' ? 'Shqip' : 'Anglisht'}</p>
            </div>
            {book.publishedDate && (
              <div>
                <span className="text-gray-500">Botimi:</span>
                <p className="font-medium">
                  {new Date(book.publishedDate).toLocaleDateString('sq-AL')}
                </p>
              </div>
            )}
            {book.isbn && (
              <div>
                <span className="text-gray-500">ISBN:</span>
                <p className="font-medium text-xs">{book.isbn}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs for Description, Details, etc. */}
      <div className="border-t border-gray-200">
        <BookDetailTabs book={book} />
      </div>
    </div>
  );
}