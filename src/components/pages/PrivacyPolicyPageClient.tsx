'use client';

import { motion } from 'framer-motion';
import { Calendar, Shield, Eye, Lock, Users, FileText } from 'lucide-react';

import { GlassCard } from '@/components/ui/GlassCard';

interface PrivacyPolicyPageClientProps {
  translations: any;
}

export function PrivacyPolicyPageClient({ translations }: PrivacyPolicyPageClientProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-100/20 to-purple-100/20"></div>
      </div>

      <div className="relative max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
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

        {/* Last Updated */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <GlassCard className="p-4 bg-blue-50/50">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{translations('lastUpdated')}</span>
            </div>
          </GlassCard>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-12"
        >
          <GlassCard className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{translations('introduction.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                {translations('introduction.paragraph1')}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {translations('introduction.paragraph2')}
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Sections */}
        <div className="space-y-8">
          {translations('sections').map((section: any, index: number) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
              >
                <GlassCard className="p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <Icon className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
                    <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                  </div>

                  <div className="space-y-6">
                    {section.content.map((item: any, itemIndex: number) => (
                      <div key={itemIndex}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.subtitle}</h3>
                        <p className="text-gray-700 leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Cookies Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8"
        >
          <GlassCard className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{translations('cookies.title')}</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                {translations('cookies.description')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{translations('cookies.necessary.title')}</h3>
                  <p className="text-sm text-gray-600">
                    {translations('cookies.necessary.description')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{translations('cookies.analytics.title')}</h3>
                  <p className="text-sm text-gray-600">
                    {translations('cookies.analytics.description')}
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-8"
        >
          <GlassCard className="p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{translations('contact.title')}</h2>
            <p className="text-xl text-gray-700 mb-6">
              {translations('contact.subtitle')}
            </p>
            <p className="text-gray-600">
              {translations('contact.description')}
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
} 