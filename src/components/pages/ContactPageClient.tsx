'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle,
  Clock,
  FileText,
  Mail,
  MapPin,
  Phone,
  Send,
  Users,
} from 'lucide-react';

import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';

interface ContactPageClientProps {
  translations: any;
}

export function ContactPageClient({ translations }: ContactPageClientProps) {
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{translations('form.title')}</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      {translations('form.name')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                      placeholder={translations('form.namePlaceholder')}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      {translations('form.email')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                      placeholder={translations('form.emailPlaceholder')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    {translations('form.subject')}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                    placeholder={translations('form.subjectPlaceholder')}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {translations('form.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm resize-none"
                    placeholder={translations('form.messagePlaceholder')}
                  ></textarea>
                </div>

                <LiquidButton variant="albanian" size="lg" className="w-full">
                  <Send className="w-5 h-5 mr-2" />
                  {translations('form.submit')}
                </LiquidButton>
              </form>
            </GlassCard>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-6"
          >
            {/* Contact Details */}
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{translations('contactInfo.title')}</h2>
              <div className="space-y-6">
                {[
                  {
                    title: translations('contactInfo.address.title'),
                    content: translations('contactInfo.address.content'),
                    icon: MapPin,
                  },
                  {
                    title: translations('contactInfo.email.title'),
                    content: translations('contactInfo.email.content'),
                    icon: Mail,
                  },
                  {
                    title: translations('contactInfo.phone.title'),
                    content: translations('contactInfo.phone.content'),
                    icon: Phone,
                  },
                  {
                    title: translations('contactInfo.hours.title'),
                    content: translations('contactInfo.hours.content'),
                    icon: Clock,
                  },
                ].map((contact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                    className="flex items-start space-x-4"
                  >
                    <contact.icon className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{contact.title}</h3>
                      <p className="text-gray-600 whitespace-pre-line">{contact.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Quick Actions */}
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{translations('quickActions.title')}</h2>
              <div className="space-y-4">
                {[
                  {
                    title: translations('quickActions.faq.title'),
                    description: translations('quickActions.faq.description'),
                    icon: FileText,
                    href: '/faq',
                  },
                  {
                    title: translations('quickActions.support.title'),
                    description: translations('quickActions.support.description'),
                    icon: CheckCircle,
                    href: '/support',
                  },
                  {
                    title: translations('quickActions.about.title'),
                    description: translations('quickActions.about.description'),
                    icon: Users,
                    href: '/about',
                  },
                ].map((action, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                    className="flex items-center space-x-4 p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-colors cursor-pointer"
                  >
                    <action.icon className="h-6 w-6 text-red-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 