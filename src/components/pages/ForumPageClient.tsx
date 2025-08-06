'use client';

import { motion } from 'framer-motion';
import {
  Award,
  BookOpen,
  Heart,
  MessageCircle,
  MessageSquare,
  Star,
  User,
  Users,
} from 'lucide-react';

import { ForumGrid } from '@/components/forum/ForumGrid';
import { ForumSearch } from '@/components/forum/ForumSearch';
import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';
import { Link } from '@/navigation';

interface ForumPageClientProps {
  translations: any;
  searchParams: any;
}

export function ForumPageClient({ translations, searchParams }: ForumPageClientProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-100/20 to-purple-100/20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {translations('hero.title')}
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {translations('hero.subtitle')}
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-8">
          <GlassCard className="p-6">
            <ForumSearch initialParams={searchParams} />
          </GlassCard>
        </div>

        {/* Forum Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{translations('categories.title')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {translations('categories.items').map((category: any, index: number) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                  className="group cursor-pointer"
                >
                  <GlassCard className="p-4 text-center hover:scale-105 transition-transform duration-300">
                    <Icon
                      className={`h-8 w-8 text-${category.color}-600 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300`}
                    />
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{category.name}</h3>
                    <p className="text-xs text-gray-600">{category.count} {translations('categories.posts')}</p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Forum Topics */}
        <div className="mb-12">
          <ForumGrid searchParams={searchParams} />
        </div>

        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{translations('stats.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {translations('stats.items').map((stat: any, index: number) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                >
                  <GlassCard className="p-6 text-center">
                    <Icon className={`h-8 w-8 text-${stat.color}-600 mx-auto mb-4`} />
                    <div className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-center"
        >
          <GlassCard className="p-12 bg-gradient-to-r from-red-500/10 to-red-600/10">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {translations('cta.title')}
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              {translations('cta.subtitle')}
            </p>
            <Link href="/forum/new">
              <LiquidButton variant="albanian" size="lg">
                {translations('cta.createTopic')}
              </LiquidButton>
            </Link>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
} 