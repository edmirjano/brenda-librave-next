'use client';

import { useEffect, useRef } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { PriceDisplay } from '@/components/ui/PriceDisplay';

import { truncate } from '@/lib/utils';

import type { BookListItem } from '@/types/book';

interface BookCardProps {
  book: BookListItem;
}

export function BookCard({ book }: BookCardProps) {
  const bookUrl = `/books/${book.slug}`;
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;

      // Holographic effect
      const intensity = Math.min(Math.abs(rotateX) + Math.abs(rotateY), 30) / 30;
      card.style.setProperty('--holo-opacity', intensity.toString());
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.setProperty('--holo-opacity', '0');
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <Link href={bookUrl} className="group block">
      <div
        ref={cardRef}
        className="relative bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-out hover:shadow-2xl book-card-holo"
        style={
          {
            transformStyle: 'preserve-3d',
            '--holo-opacity': '0',
          } as React.CSSProperties & { '--holo-opacity': string }
        }
      >
        {/* Book Cover */}
        <div className="aspect-[3/4] relative overflow-hidden bg-gray-100 z-10">
          {book.coverImage ? (
            <Image
              src={book.coverImage}
              alt={`Kopertina e librit "${book.title}"`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <svg
                className="w-12 h-12 text-gray-400"
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

          {/* Featured Badge */}
          {book.featured && (
            <div className="absolute top-2 left-2">
              <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                E veçuar
              </span>
            </div>
          )}

          {/* Digital Badge */}
          {book.hasDigital && (
            <div className="absolute top-2 right-2">
              <span className="bg-green-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                Digital
              </span>
            </div>
          )}
        </div>

        {/* Book Info */}
        <div className="p-3 sm:p-4 relative z-10">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
            {truncate(book.title, 50)}
          </h3>

          {/* Author */}
          <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-1">{book.author}</p>

          {/* Category */}
          <p className="text-gray-500 text-xs mb-2">{book.category.name}</p>

          {/* Price */}
          {(book.priceALL || book.priceEUR) && (
            <div className="flex items-center justify-between">
              <PriceDisplay
                priceALL={book.priceALL || 0}
                priceEUR={book.priceEUR}
                showBoth={false}
                size="sm"
                className="font-bold"
              />

              {/* Stock indicator */}
              <div className="text-xs">
                {book.inventory > 0 ? (
                  <span className="text-green-600">Në stok</span>
                ) : (
                  <span className="text-red-600">Mbaruar</span>
                )}
              </div>
            </div>
          )}

          {/* Digital Price (if different from physical) */}
          {book.hasDigital && (book.digitalPriceALL || book.digitalPriceEUR) && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Digital:</span>
                <PriceDisplay
                  priceALL={book.digitalPriceALL || 0}
                  priceEUR={book.digitalPriceEUR}
                  showBoth={false}
                  size="sm"
                  variant="accent"
                />
              </div>
            </div>
          )}

          {/* Tags */}
          {book.tags && book.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {book.tags.slice(0, 2).map((bookTag) => (
                <span
                  key={bookTag.tag.id}
                  className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                >
                  {bookTag.tag.name}
                </span>
              ))}
              {book.tags.length > 2 && (
                <span className="text-xs text-gray-500">+{book.tags.length - 2}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
