import { Metadata } from 'next';

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

import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';

export const metadata: Metadata = {
  title: 'Forum | Brënda Librave',
  description: 'Bashkohuni me komunitetin tonë të lexuesve dhe ndani mendimet tuaja për libra.',
};

export default function ForumPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-50">
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

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <GlassCard className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Kërkoni diskutime, libra, ose përdorues..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                />
              </div>

              {/* Filter Button */}
              <LiquidButton variant="secondary" size="lg">
                <Filter className="w-5 h-5 mr-2" />
                Filtro
              </LiquidButton>

              {/* New Post Button */}
              <LiquidButton variant="albanian" size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Post i Ri
              </LiquidButton>
            </div>
          </GlassCard>
        </motion.div>

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

        {/* Featured Discussions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Diskutimet e Fundit</h2>
          <div className="space-y-4">
            {[
              {
                title: 'Cili është libri juaj i preferuar nga Ismail Kadare?',
                author: 'Ana D.',
                category: 'Literatura Shqiptare',
                replies: 24,
                views: 156,
                likes: 18,
                time: '2 orë më parë',
                isHot: true,
              },
              {
                title: 'Rekomandime për libra për fëmijë 8-12 vjeç',
                author: 'Marko K.',
                category: 'Rekomandime',
                replies: 31,
                views: 203,
                likes: 25,
                time: '4 orë më parë',
                isHot: false,
              },
              {
                title: 'Kritika e "Kronika në Gur" - mendimet tuaja',
                author: 'Elena S.',
                category: 'Kritika',
                replies: 42,
                views: 289,
                likes: 32,
                time: '6 orë më parë',
                isHot: true,
              },
              {
                title: 'Autorët më të njohur shqiptarë të shekullit XX',
                author: 'Dritan L.',
                category: 'Autorët',
                replies: 19,
                views: 134,
                likes: 15,
                time: '1 ditë më parë',
                isHot: false,
              },
              {
                title: 'Poezi të rekomanduara për fillestarët',
                author: 'Besa M.',
                category: 'Poezi',
                replies: 28,
                views: 167,
                likes: 22,
                time: '1 ditë më parë',
                isHot: false,
              },
            ].map((discussion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                className="group"
              >
                <GlassCard className="p-6 hover:scale-[1.02] transition-transform duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            discussion.isHot
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {discussion.category}
                        </span>
                        {discussion.isHot && (
                          <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Trend
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors mb-2">
                        {discussion.title}
                      </h3>

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {discussion.author}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {discussion.time}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="text-center">
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          <span className="font-semibold">{discussion.replies}</span>
                        </div>
                        <span className="text-xs">Përgjigje</span>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          <span className="font-semibold">{discussion.views}</span>
                        </div>
                        <span className="text-xs">Shikime</span>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          <span className="font-semibold">{discussion.likes}</span>
                        </div>
                        <span className="text-xs">Pëlqime</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

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
              <LiquidButton variant="albanian" size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Krijo post të ri
              </LiquidButton>
              <LiquidButton variant="primary" size="lg">
                <ArrowRight className="w-5 h-5 mr-2" />
                Shiko të gjitha diskutimet
              </LiquidButton>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
