'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import Link from 'next/link';

import { motion } from 'framer-motion';
import { ArrowRight, FileText, Star } from 'lucide-react';

import { BlogPostCard } from '@/components/blog/BlogPostCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';

import type { BlogPostListItem } from '@/types/blog';

export function FeaturedPosts() {
  const t = useTranslations('blog.featured');
  const [posts, setPosts] = useState<BlogPostListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        const response = await fetch('/api/blog/featured?limit=6');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch featured posts');
        }

        setPosts(data.data);
      } catch (error) {
        console.error('Error fetching featured posts:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch featured posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">{t('title')}</h2>
          <p className="text-gray-600 mt-2">{t('subtitle')}</p>
        </div>
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
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard className="p-8 text-center">
          <FileText className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('error.title')}</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
          >
            {t('error.retry')}
          </button>
        </GlassCard>
      </motion.div>
    );
  }

  if (posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard className="p-8 text-center">
          <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('empty.title')}</h3>
          <p className="text-gray-600">
            {t('empty.description')}
          </p>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {t('hero.title')}
        </h2>
        <p className="text-gray-600">{t('hero.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <BlogPostCard key={post.id} post={post} index={index} />
        ))}
      </div>

      {posts.length >= 6 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center"
        >
          <Link href="/blog?type=FEATURED">
            <LiquidButton variant="primary" size="lg">
              <ArrowRight className="w-5 h-5 mr-2" />
              {t('cta.viewAll')}
            </LiquidButton>
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}