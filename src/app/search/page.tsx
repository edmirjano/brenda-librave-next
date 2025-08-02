import { Suspense } from 'react';

import { Metadata } from 'next';

import { GlobalSearch } from '@/components/search/GlobalSearch';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const metadata: Metadata = {
  title: 'Kërkim | Brënda Librave',
  description: 'Kërkoni libra, postime të blogut dhe diskutime në të gjithë faqen.',
};

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    type?: string;
    category?: string;
    page?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;

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
            Kërkim{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
              Global
            </span>
          </h1>
          <p className="text-xl text-gray-700">
            Kërkoni libra, postime të blogut dhe diskutime në të gjithë faqen
          </p>
        </div>

        {/* Global Search */}
        <Suspense
          fallback={
            <GlassCard className="p-8">
              <div className="flex items-center justify-center">
                <LoadingSpinner size="lg" />
                <span className="ml-3 text-gray-700">Duke ngarkuar kërkimin...</span>
              </div>
            </GlassCard>
          }
        >
          <GlobalSearch searchParams={params} />
        </Suspense>
      </div>
    </div>
  );
}