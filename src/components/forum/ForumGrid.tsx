'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { motion } from 'framer-motion';
import { AlertCircle, BookOpen, Clock, Eye, MessageCircle, Pin, User } from 'lucide-react';

import { GlassCard } from '@/components/ui/GlassCard';
import { Pagination } from '@/components/ui/Pagination';

import type { ForumSearchResult } from '@/types/forum';

interface ForumGridProps {
  searchParams: {
    query?: string;
    category?: string;
    tags?: string;
    book?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
    limit?: string;
  };
}

export function ForumGrid({ searchParams }: ForumGridProps) {
  const [result, setResult] = useState<ForumSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopics = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        // Add search parameters
        Object.entries(searchParams).forEach(([key, value]) => {
          if (value) {
            params.set(key, value);
          }
        });

        const response = await fetch(`/api/forum/topics?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch forum topics');
        }

        setResult(data.data);
      } catch (error) {
        console.error('Error fetching forum topics:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch forum topics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <GlassCard key={i} className="p-6">
            <div className="animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="flex space-x-4">
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
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
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Gabim në ngarkim</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
          >
            Provo përsëri
          </button>
        </GlassCard>
      </motion.div>
    );
  }

  if (!result || result.topics.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard className="p-12 text-center">
          <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Nuk u gjetën diskutime</h3>
          <p className="text-gray-600 mb-6">
            Nuk ka diskutime që përputhen me kriteret tuaja të kërkimit.
          </p>
          <Link href="/forum/new">
            <button className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors">
              Krijo diskutimin e parë
            </button>
          </Link>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <p className="text-gray-700">
          U gjetën <span className="font-semibold">{result.totalCount}</span> diskutime
          {searchParams.query && (
            <>
              {' '}
              për "<span className="font-semibold">{searchParams.query}</span>"
            </>
          )}
        </p>
        <p className="text-sm text-gray-500">
          Faqja {result.currentPage} nga {result.totalPages}
        </p>
      </motion.div>

      {/* Topics List */}
      <div className="space-y-4">
        {result.topics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.6 }}
          >
            <Link href={`/forum/topics/${topic.slug}`}>
              <GlassCard className="p-6 hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        {topic.category.name}
                      </span>
                      {topic.pinned && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full flex items-center">
                          <Pin className="h-3 w-3 mr-1" />
                          Fiksuar
                        </span>
                      )}
                      {topic.book && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {topic.book.title}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors mb-2">
                      {topic.title}
                    </h3>

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {topic.author.name}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(topic.createdAt).toLocaleDateString('sq-AL')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="text-center">
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        <span className="font-semibold">{topic._count.posts}</span>
                      </div>
                      <span className="text-xs">Përgjigje</span>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="font-semibold">{topic.views}</span>
                      </div>
                      <span className="text-xs">Shikime</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {result.totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex justify-center"
        >
          <Pagination
            currentPage={result.currentPage}
            totalPages={result.totalPages}
            hasNextPage={result.hasNextPage}
            hasPreviousPage={result.hasPreviousPage}
            baseUrl="/forum"
            searchParams={searchParams}
          />
        </motion.div>
      )}
    </div>
  );
}