'use client';

import { motion } from 'framer-motion';
import {
  Calendar,
  FileText,
  Mail,
  Scale,
  Shield,
  User,
} from 'lucide-react';

import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';
import { Link } from '@/navigation';

interface TermsConditionsPageClientProps {
  translations: any;
}

export function TermsConditionsPageClient({ translations }: TermsConditionsPageClientProps) {
  const sections = [
    {
      title: translations('sections.acceptance.title'),
      content: translations('sections.acceptance.content'),
    },
    {
      title: translations('sections.definitions.title'),
      content: translations('sections.definitions.content'),
    },
    {
      title: translations('sections.usage.title'),
      content: translations('sections.usage.content'),
    },
    {
      title: translations('sections.orders.title'),
      content: translations('sections.orders.content'),
    },
    {
      title: translations('sections.shipping.title'),
      content: translations('sections.shipping.content'),
    },
    {
      title: translations('sections.returns.title'),
      content: translations('sections.returns.content'),
    },
    {
      title: translations('sections.intellectualProperty.title'),
      content: translations('sections.intellectualProperty.content'),
    },
    {
      title: translations('sections.liability.title'),
      content: translations('sections.liability.content'),
    },
  ];

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
            <Scale className="h-12 w-12 text-white" />
          </motion.div>

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
          <GlassCard className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Calendar className="h-5 w-5" />
              <span>{translations('lastUpdated')}: 15 Janar 2024</span>
            </div>
          </GlassCard>
        </motion.div>

        {/* Terms Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
            >
              <GlassCard className="p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{section.title}</h2>
                  </div>
                </div>

                <div className="space-y-4">
                  {section.content.map((item: string, itemIndex: number) => (
                    <div key={itemIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="mt-12"
        >
          <GlassCard className="p-8 bg-gradient-to-r from-red-500/10 to-red-600/10">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{translations('contact.title')}</h2>
              <p className="text-gray-700 mb-6">
                {translations('contact.description')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="text-center p-6 bg-white/50 rounded-xl">
                  <Mail className="h-10 w-10 text-red-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{translations('contact.email.title')}</h3>
                  <p className="text-gray-700">legal@brendalibrave.al</p>
                </div>
                <div className="text-center p-6 bg-white/50 rounded-xl">
                  <User className="h-10 w-10 text-red-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{translations('contact.support.title')}</h3>
                  <p className="text-gray-700">support@brendalibrave.al</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <LiquidButton variant="albanian" size="lg">
                    <Mail className="w-5 h-5 mr-2" />
                    {translations('contact.cta')}
                  </LiquidButton>
                </Link>
                <Link href="/privacy-policy">
                  <LiquidButton variant="primary" size="lg">
                    <Shield className="w-5 h-5 mr-2" />
                    {translations('contact.privacy')}
                  </LiquidButton>
                </Link>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
} 