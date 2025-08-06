'use client';

import { Suspense } from 'react';
import { CartContent } from '@/components/cart/CartContent';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface CartPageClientProps {
  translations: any;
}

export function CartPageClient({ translations }: CartPageClientProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-100/20 to-purple-100/20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {translations('hero.title')}
          </h1>
          <p className="text-xl text-gray-700">
            {translations('hero.subtitle')}
          </p>
        </div>

        {/* Cart Content */}
        <Suspense
          fallback={
            <GlassCard className="p-8">
              <div className="flex items-center justify-center">
                <LoadingSpinner size="lg" />
                <span className="ml-3 text-gray-700">{translations('loading')}</span>
              </div>
            </GlassCard>
          }
        >
          <CartContent />
        </Suspense>
      </div>
    </div>
  );
} 