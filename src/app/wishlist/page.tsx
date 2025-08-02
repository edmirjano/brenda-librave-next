import { Suspense } from 'react';

import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { WishlistContent } from '@/components/wishlist/WishlistContent';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

import { authOptions } from '@/lib/auth/config';

export const metadata: Metadata = {
  title: 'Lista e Dëshirave | Brënda Librave',
  description: 'Shikoni dhe menaxhoni librat që dëshironi të blini në të ardhmen.',
  robots: {
    index: false,
    follow: true,
  },
};

export default async function WishlistPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login?callbackUrl=/wishlist');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-50">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-100/20 to-purple-100/20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Lista e{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
              Dëshirave
            </span>
          </h1>
          <p className="text-xl text-gray-700">
            Librat që dëshironi të blini në të ardhmen
          </p>
        </div>

        {/* Wishlist Content */}
        <Suspense
          fallback={
            <GlassCard className="p-8">
              <div className="flex items-center justify-center">
                <LoadingSpinner size="lg" />
                <span className="ml-3 text-gray-700">Duke ngarkuar listën e dëshirave...</span>
              </div>
            </GlassCard>
          }
        >
          <WishlistContent />
        </Suspense>
      </div>
    </div>
  );
}