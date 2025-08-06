'use client';

import { motion } from 'framer-motion';
import {
  BookOpen,
  CreditCard,
  HelpCircle,
  Mail,
  MessageCircle,
  Phone,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  User,
} from 'lucide-react';

import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';
import { Link } from '@/navigation';

interface HelpPageClientProps {
  translations: any;
}

export function HelpPageClient({ translations }: HelpPageClientProps) {
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
          <motion.div
            className="w-24 h-24 mx-auto bg-gradient-to-r from-red-500 to-red-600 rounded-3xl flex items-center justify-center shadow-2xl mb-6"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <HelpCircle className="h-12 w-12 text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {translations('hero.title')}
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {translations('hero.subtitle')}
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-12"
        >
          <GlassCard className="p-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
              <input
                type="text"
                placeholder={translations('search.placeholder')}
                className="w-full pl-14 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-lg"
              />
              <LiquidButton variant="albanian" size="lg" className="absolute right-2 top-2">
                {translations('search.button')}
              </LiquidButton>
            </div>
          </GlassCard>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{translations('quickActions.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {translations('quickActions.items').map((action: any, index: number) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                >
                  <Link href={action.href}>
                    <GlassCard className="p-6 hover:scale-105 transition-transform duration-300 cursor-pointer group">
                      <div className="text-center">
                        <div className={`w-16 h-16 ${action.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-gray-600">{action.description}</p>
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Help Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{translations('categories.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {translations('categories.items').map((category: any, index: number) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                  className="group"
                >
                  <Link href={category.href}>
                    <GlassCard className="p-6 h-full hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
                      <div className="flex items-start space-x-4 mb-4">
                        <Icon className={`h-8 w-8 text-${category.color}-600 flex-shrink-0 group-hover:scale-110 transition-transform`} />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                            {category.title}
                          </h3>
                          <p className="text-gray-600 text-sm">{category.description}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {category.topics.map((topic: any, topicIndex: number) => (
                          <div key={topicIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                            <span>{topic}</span>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center"
        >
          <GlassCard className="p-12 bg-gradient-to-r from-red-500/10 to-red-600/10">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{translations('contact.title')}</h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              {translations('contact.subtitle')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {translations('contact.methods').map((method: any, index: number) => {
                const Icon = method.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
                    className="flex flex-col items-center space-y-3"
                  >
                    <Icon className="h-8 w-8 text-red-600" />
                    <h3 className="font-semibold text-gray-900">{method.title}</h3>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </motion.div>
                );
              })}
            </div>

            <LiquidButton variant="albanian" size="lg">
              {translations('contact.cta')}
            </LiquidButton>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
} 