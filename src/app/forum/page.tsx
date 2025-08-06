import { Metadata } from 'next';
import Link from 'next/link';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BookOpen,
  Clock,
  Eye,
  Filter,
  Heart,
  MessageCircle,
  MessageSquare,
  Plus,
  Search,
  Star,
  ThumbsUp,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';

import { ForumGrid } from '@/components/forum/ForumGrid';
import { ForumSearch } from '@/components/forum/ForumSearch';
import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';

export const metadata: Metadata = {
  title: 'Forum | Brënda Librave',
  description: 'Bashkohuni me komunitetin tonë të lexuesve dhe ndani mendimet tuaja për libra.',
};

interface ForumPageProps {
  searchParams: Promise<{
    query?: string;
    category?: string;
    tags?: string;
    book?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
    limit?: string;
  }>;
}

import { getTranslations } from 'next-intl/server';
import { ForumPageClient } from '@/components/pages/ForumPageClient';

export default async function ForumPage({ searchParams }: ForumPageProps) {
  const params = await searchParams;
  const t = await getTranslations('forum');

  return <ForumPageClient translations={t} searchParams={params} />;
}
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
          <motion.div
            className="w-24 h-24 mx-auto bg-gradient-to-r from-red-500 to-red-600 rounded-3xl flex items-center justify-center shadow-2xl mb-6"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <MessageSquare className="h-12 w-12 text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Forum{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
              i Lexuesve
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Bashkohuni me komunitetin tonë të lexuesve, ndani mendimet tuaja dhe zbuloni libra të
            rinj
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-8">
          <GlassCard className="p-6">
            <ForumSearch initialParams={params} />
          </GlassCard>
        </div>

        {/* Forum Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Kategoritë</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Literatura Shqiptare', icon: BookOpen, count: '1,250', color: 'red' },
              { name: 'Rekomandime', icon: Star, count: '890', color: 'yellow' },
              { name: 'Kritika', icon: MessageCircle, count: '650', color: 'blue' },
              { name: 'Autorët', icon: User, count: '420', color: 'green' },
              { name: 'Klasikët', icon: Award, count: '380', color: 'purple' },
              { name: 'Poezi', icon: Heart, count: '290', color: 'pink' },
            ].map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                className="group cursor-pointer"
              >
                <GlassCard className="p-4 text-center hover:scale-105 transition-transform duration-300">
                  <category.icon
                    className={`h-8 w-8 text-${category.color}-600 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300`}
                  />
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-xs text-gray-600">{category.count} postime</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Forum Topics */}
        <div className="mb-12">
          <ForumGrid searchParams={params} />
        </div>

        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Statistikat e Komunitetit</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Përdorues Aktivë', value: '2,847', icon: Users, color: 'blue' },
              { label: 'Diskutime', value: '15,234', icon: MessageSquare, color: 'green' },
              { label: 'Përgjigje', value: '89,456', icon: MessageCircle, color: 'purple' },
              { label: 'Pëlqime', value: '234,567', icon: Heart, color: 'red' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
              >
                <GlassCard className="p-6 text-center">
                  <stat.icon className={`h-8 w-8 text-${stat.color}-600 mx-auto mb-4`} />
                  <div className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </GlassCard>
              </motion.div>
            ))}
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
              Bashkohuni me komunitetin tonë!
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Ndani mendimet tuaja, bëni pyetje dhe zbuloni libra të rinj nga lexues të tjerë
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/forum/new">
                <LiquidButton variant="albanian" size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Krijo diskutim të ri
                </LiquidButton>
              </Link>
              <LiquidButton variant="primary" size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Shiko të gjitha diskutimet
              </LiquidButton>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
