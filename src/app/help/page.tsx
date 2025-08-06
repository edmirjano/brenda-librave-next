import { Metadata } from 'next';
import Link from 'next/link';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  CreditCard,
  HelpCircle,
  Mail,
  MessageSquare,
  Phone,
  Search,
  ShoppingCart,
  Truck,
  User,
  Users,
} from 'lucide-react';

import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';

export const metadata: Metadata = {
  title: 'Ndihmë dhe Mbështetje | Brënda Librave',
  description: 'Gjeni ndihmë dhe mbështetje për të gjitha pyetjet tuaja rreth shërbimeve tona.',
};

const helpCategories = [
  {
    title: 'Porositë',
    description: 'Si të bëni porosi, gjurmimi, dhe anulimet',
    icon: ShoppingCart,
    color: 'blue',
    topics: [
      'Si të bëj një porosi',
      'Gjurmimi i porosisë',
      'Anulimi i porosisë',
      'Modifikimi i porosisë',
      'Problemet me porosinë',
    ],
    href: '/help/orders',
  },
  {
    title: 'Dërgimi',
    description: 'Kohët e dërgimit, kostot, dhe metodat',
    icon: Truck,
    color: 'green',
    topics: [
      'Kohët e dërgimit',
      'Kostot e dërgimit',
      'Zonat e dërgimit',
      'Dërgim i shpejtë',
      'Problemet me dërgimin',
    ],
    href: '/help/shipping',
  },
  {
    title: 'Pagesa',
    description: 'Metodat e pagesës dhe siguria',
    icon: CreditCard,
    color: 'purple',
    topics: [
      'Metodat e pagesës',
      'Siguria e pagesës',
      'Problemet me pagesën',
      'Faturimi',
      'Rimbursimet',
    ],
    href: '/help/payment',
  },
  {
    title: 'Llogaritë',
    description: 'Krijimi dhe menaxhimi i llogarisë',
    icon: User,
    color: 'red',
    topics: [
      'Krijimi i llogarisë',
      'Hyrja në llogari',
      'Rivendosja e fjalëkalimit',
      'Azhurnimi i profilit',
      'Fshirja e llogarisë',
    ],
    href: '/help/account',
  },
  {
    title: 'Librat',
    description: 'Informacione për librat dhe koleksionin',
    icon: BookOpen,
    color: 'yellow',
    topics: [
      'Kërkimi i librave',
      'Informacionet e librave',
      'Disponueshmëria',
      'Rekomandime',
      'Lista e dëshirave',
    ],
    href: '/help/books',
  },
  {
    title: 'Komuniteti',
    description: 'Forumi, diskutimet, dhe bashkëveprimi',
    icon: Users,
    color: 'indigo',
    topics: [
      'Pjesëmarrja në forum',
      'Rregullat e komunitetit',
      'Moderimi',
      'Raportimi i problemeve',
      'Evente dhe aktivitete',
    ],
    href: '/help/community',
  },
];

const quickActions = [
  {
    title: 'Kontaktoni Mbështetjen',
    description: 'Flisni direkt me ekipin tonë',
    icon: MessageSquare,
    color: 'bg-red-500',
    href: '/contact',
  },
  {
    title: 'Pyetje të Shpeshta',
    description: 'Gjeni përgjigje të shpejta',
    icon: HelpCircle,
    color: 'bg-blue-500',
    href: '/faq',
  },
  {
    title: 'Forumi i Komunitetit',
    description: 'Bëni pyetje te komuniteti',
    icon: Users,
    color: 'bg-green-500',
    href: '/forum',
  },
];

import { getTranslations } from 'next-intl/server';
import { HelpPageClient } from '@/components/pages/HelpPageClient';

export default async function HelpPage() {
  const t = await getTranslations('help');

  return <HelpPageClient translations={t} />;
}
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
            Qendra e{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
              Ndihmës
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Jemi këtu për t'ju ndihmuar. Gjeni përgjigje për pyetjet tuaja ose kontaktoni ekipin tonë
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
                placeholder="Kërkoni për ndihmë..."
                className="w-full pl-14 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-lg"
              />
              <LiquidButton variant="albanian" size="lg" className="absolute right-2 top-2">
                Kërko
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Veprime të Shpejta</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
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
                        <action.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-gray-600">{action.description}</p>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Help Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Kategoritë e Ndihmës</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category, index) => (
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
                      <category.icon className={`h-8 w-8 text-${category.color}-600 flex-shrink-0 group-hover:scale-110 transition-transform`} />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                          {category.title}
                        </h3>
                        <p className="text-gray-600 text-sm">{category.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {category.topics.slice(0, 3).map((topic, topicIndex) => (
                        <div key={topicIndex} className="flex items-center text-sm text-gray-700">
                          <ArrowRight className="h-3 w-3 text-gray-400 mr-2 flex-shrink-0" />
                          {topic}
                        </div>
                      ))}
                      {category.topics.length > 3 && (
                        <div className="text-sm text-gray-500 italic">
                          dhe {category.topics.length - 3} të tjera...
                        </div>
                      )}
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-12"
        >
          <GlassCard className="p-12 bg-gradient-to-r from-red-500/10 to-red-600/10">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Keni nevojë për ndihmë shtesë?</h2>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Ekipi ynë i mbështetjes është gjithmonë gati për t'ju ndihmuar me çdo pyetje që mund të keni
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    title: 'Email',
                    description: 'info@brendalibrave.al',
                    detail: 'Përgjigje brenda 24 orësh',
                    icon: Mail,
                  },
                  {
                    title: 'Telefon',
                    description: '+355 69 234 5678',
                    detail: 'E Hënë - E Premte, 9:00-18:00',
                    icon: Phone,
                  },
                  {
                    title: 'Live Chat',
                    description: 'Chat i drejtpërdrejtë',
                    detail: 'Përgjigje të menjëhershme',
                    icon: MessageSquare,
                  },
                ].map((contact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
                    className="text-center p-6 bg-white/50 rounded-xl"
                  >
                    <contact.icon className="h-10 w-10 text-red-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{contact.title}</h3>
                    <p className="text-gray-700 font-medium mb-1">{contact.description}</p>
                    <p className="text-sm text-gray-600">{contact.detail}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <LiquidButton variant="albanian" size="lg">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Kontaktoni Mbështetjen
                  </LiquidButton>
                </Link>
                <Link href="/forum">
                  <LiquidButton variant="primary" size="lg">
                    <Users className="w-5 h-5 mr-2" />
                    Pyesni Komunitetin
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