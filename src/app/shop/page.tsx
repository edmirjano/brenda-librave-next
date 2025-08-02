import { Metadata } from 'next';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BookOpen,
  Eye,
  Filter,
  Grid3X3,
  Heart,
  Heart as HeartIcon,
  Library,
  List,
  MessageSquare,
  Search,
  ShoppingCart,
  Star,
} from 'lucide-react';

import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';

export const metadata: Metadata = {
  title: 'Dyqani | Brënda Librave',
  description: 'Eksploroni koleksionin tonë të gjerë të librave shqiptarë dhe ndërkombëtarë.',
};

export default function ShopPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Eksploroni{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
              Dyqanin Tonë
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Zbuloni libra nga autorët më të njohur shqiptarë dhe ndërkombëtarë
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
                  placeholder="Kërkoni libra, autorë, ose kategoritë..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                />
              </div>

              {/* Filter Button */}
              <LiquidButton variant="secondary" size="lg">
                <Filter className="w-5 h-5 mr-2" />
                Filtro
              </LiquidButton>

              {/* View Toggle */}
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-xl bg-white/50 border border-gray-300 hover:bg-white/70 transition-colors">
                  <Grid3X3 className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 rounded-xl bg-red-100 border border-red-300">
                  <List className="h-5 w-5 text-red-600" />
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Categories Quick Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Kategoritë</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Literatura Shqiptare', icon: BookOpen, count: '850+' },
              { name: 'Roman Historik', icon: Library, count: '420+' },
              { name: 'Poezi', icon: HeartIcon, count: '290+' },
              { name: 'Libra për Fëmijë', icon: Award, count: '380+' },
              { name: 'Shkenca', icon: MessageSquare, count: '150+' },
              { name: 'Filosofi', icon: BookOpen, count: '120+' },
            ].map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                className="group cursor-pointer"
              >
                <GlassCard className="p-4 text-center hover:scale-105 transition-transform duration-300">
                  <category.icon className="h-8 w-8 text-red-600 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-xs text-gray-600">{category.count}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Featured Books Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Libra të Rekomanduar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[
              {
                title: 'Kënga e Malësorëve',
                author: 'Gjergj Fishta',
                price: '1,200 ALL',
                rating: 4.8,
                image: '/api/placeholder/200/300',
                category: 'Literatura Shqiptare',
              },
              {
                title: 'Gjenerata e Pavarësisë',
                author: 'Ismail Kadare',
                price: '1,500 ALL',
                rating: 4.9,
                image: '/api/placeholder/200/300',
                category: 'Roman Historik',
              },
              {
                title: 'Poezi të Zgjedhura',
                author: 'Migjeni',
                price: '800 ALL',
                rating: 4.7,
                image: '/api/placeholder/200/300',
                category: 'Poezi',
              },
              {
                title: 'Historia e Shqipërisë',
                author: 'Kristo Frashëri',
                price: '2,000 ALL',
                rating: 4.6,
                image: '/api/placeholder/200/300',
                category: 'Histori',
              },
              {
                title: 'Fëmijët e Botës',
                author: 'Pjetër Arbnori',
                price: '900 ALL',
                rating: 4.5,
                image: '/api/placeholder/200/300',
                category: 'Libra për Fëmijë',
              },
              {
                title: 'Fjalori i Gjuhës Shqipe',
                author: 'Kongresi i Manastirit',
                price: '3,500 ALL',
                rating: 4.9,
                image: '/api/placeholder/200/300',
                category: 'Shkenca',
              },
              {
                title: 'Kronika në Gur',
                author: 'Ismail Kadare',
                price: '1,800 ALL',
                rating: 4.8,
                image: '/api/placeholder/200/300',
                category: 'Roman',
              },
              {
                title: 'Poezi të Reja',
                author: 'Lasgush Poradeci',
                price: '750 ALL',
                rating: 4.7,
                image: '/api/placeholder/200/300',
                category: 'Poezi',
              },
            ].map((book, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                className="group"
              >
                <GlassCard className="p-4 hover:scale-105 transition-transform duration-300">
                  {/* Book Cover Placeholder */}
                  <div className="relative mb-4">
                    <div className="w-full h-48 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-red-600" />
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 flex flex-col space-y-2">
                      <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                        <Heart className="h-4 w-4 text-red-600" />
                      </button>
                      <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                        <Eye className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                        {book.category}
                      </span>
                    </div>
                  </div>

                  {/* Book Info */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600">{book.author}</p>

                    {/* Rating */}
                    <div className="flex items-center space-x-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(book.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({book.rating})</span>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-bold text-red-600">{book.price}</span>
                      <div className="flex space-x-2">
                        <button className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                          <ShoppingCart className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Load More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-12"
        >
          <LiquidButton variant="primary" size="lg">
            <ArrowRight className="w-5 h-5 mr-2" />
            Shiko më shumë libra
          </LiquidButton>
        </motion.div>
      </div>
    </div>
  );
}
