'use client';

import { Suspense } from 'react';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { BlogSearch } from '@/components/blog/BlogSearch';
import { FeaturedPosts } from '@/components/blog/FeaturedPosts';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface BlogPageClientProps {
  translations: any;
  searchParams: any;
}

export function BlogPageClient({ translations, searchParams }: BlogPageClientProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-100/20 to-purple-100/20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {translations('hero.title')}
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {translations('hero.subtitle')}
          </p>
        </div>

        {/* Featured Posts */}
        <div className="mb-12">
          <Suspense
            fallback={
              <GlassCard className="p-8">
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="md" />
                  <span className="ml-3 text-gray-700">{translations('loading.featured')}</span>
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
                  <span className="ml-3 text-gray-700">{translations('loading.search')}</span>
                </div>
              }
            >
              <BlogSearch initialParams={searchParams} />
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
          <BlogGrid searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
} 