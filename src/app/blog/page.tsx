import { Suspense } from 'react';

import { Metadata } from 'next';

import { BlogGrid } from '@/components/blog/BlogGrid';
import { BlogSearch } from '@/components/blog/BlogSearch';
import { FeaturedPosts } from '@/components/blog/FeaturedPosts';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const metadata: Metadata = {
  title: 'Blog | Brënda Librave',
  description: 'Lexoni artikuj të fundit për libra, autorë dhe kulturën shqiptare.',
  keywords: ['blog shqiptar', 'libra', 'literatura', 'kultura shqiptare', 'Albanian literature'],
};

interface BlogPageProps {
  searchParams: Promise<{
    query?: string;
    category?: string;
    tags?: string;
    language?: string;
    type?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-50">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-100/20 to-purple-100/20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Blog{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
              Letrar
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Zbuloni artikuj të fundit për libra, autorë dhe kulturën shqiptare
          </p>
        </div>

        {/* Featured Posts */}
        <div className="mb-12">
          <Suspense
            fallback={
              <GlassCard className="p-8">
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="md" />
                  <span className="ml-3 text-gray-700">Duke ngarkuar postimet e veçanta...</span>
                </div>
              </GlassCard>
            }
          >
            <FeaturedPosts />
          </Suspense>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <GlassCard className="p-6">
            <Suspense
              fallback={
                <div className="flex items-center justify-center p-4">
                  <LoadingSpinner size="md" />
                  <span className="ml-3 text-gray-700">Duke ngarkuar kërkimin...</span>
                </div>
              }
            >
              <BlogSearch initialParams={params} />
            </Suspense>
          </GlassCard>
        </div>

        {/* Blog Posts Grid */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <GlassCard key={i} className="p-6">
                  <div className="animate-pulse">
                    <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          }
        >
          <BlogGrid searchParams={params} />
        </Suspense>
      </div>
    </div>
  );
}