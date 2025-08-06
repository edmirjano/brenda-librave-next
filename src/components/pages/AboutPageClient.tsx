'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BookOpen,
  Heart,
  Lightbulb,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Shield,
  Star,
  Target,
  Truck,
  Users,
  Globe,
} from 'lucide-react';

import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';
import { Logo } from '@/components/ui/Logo';
import { Link } from '@/navigation';

interface AboutPageClientProps {
  translations: any;
}

export function AboutPageClient({ translations }: AboutPageClientProps) {
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
          <Logo variant="default" size="xl" animated={true} />

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {translations('hero.title')}
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {translations('hero.subtitle')}
          </p>
        </motion.div>

        {/* Our Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Historia Jonë</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Brënda Librave u themelua në vitin 2024 nga një grup pasionarësh për librat dhe
                  kulturën shqiptare. Ne pamë nevojën për një platformë moderne që të bëjë librat
                  shqiptarë të aksesueshëm për të gjithë.
                </p>
                <p>
                  Nga librat klasikë të Ismail Kadaresë deri te veprat moderne të autorëve të rinj,
                  ne kemi krijuar një hapësirë ku çdo lexues mund të gjejë diçka për veten e tyre.
                </p>
                <p>
                  Misioni ynë është të promovojmë leximin dhe të mbajmë gjallë kulturën shqiptare
                  përmes librave të cilësisë së lartë dhe shërbimit të përsosur.
                </p>
              </div>
            </div>
            <div className="relative">
              <GlassCard className="p-8">
                <div className="w-full h-64 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-red-600" />
                </div>
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Kultura Shqiptare</h3>
                  <p className="text-gray-600">
                    Promovojmë dhe mbajmë gjallë kulturën tonë të pasur
                  </p>
                </div>
              </GlassCard>
            </div>
          </div>
        </motion.div>

        {/* Our Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-16"
        >
          <GlassCard className="p-12 bg-gradient-to-r from-red-500/10 to-red-600/10">
            <div className="text-center">
              <Target className="h-16 w-16 text-red-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{translations('mission.title')}</h2>
              <p className="text-xl text-gray-700 max-w-4xl mx-auto mb-8">
                {translations('mission.description')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {[
                  { number: '10,000+', label: translations('mission.stats.books') },
                  { number: '50,000+', label: translations('mission.stats.customers') },
                  { number: '100%', label: translations('mission.stats.service') },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">{stat.number}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Përse të Na Zgjidhni?</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Ne ofrojmë përvojën më të mirë të leximit për komunitetin shqiptar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Koleksion i Gjerë',
                description: 'Mbi 10,000 libra shqiptarë dhe ndërkombëtarë në formate dixhitale dhe fizike.',
                color: 'red'
              },
              {
                icon: Shield,
                title: 'Siguri e Plotë',
                description: 'Mbrojtje e plotë e të drejtave të autorit dhe siguri e të dhënave tuaja.',
                color: 'blue'
              },
              {
                icon: Truck,
                title: 'Dërgesa e Shpejtë',
                description: 'Dërgesa falas për porosi mbi 2000 L dhe dërgesa e shpejtë në të gjithë Shqipërinë.',
                color: 'green'
              },
              {
                icon: Users,
                title: 'Komunitet Aktiv',
                description: 'Bashkohuni me mijëra lexues dhe ndani përvojat tuaja të leximit.',
                color: 'purple'
              },
              {
                icon: Globe,
                title: 'Akses Global',
                description: 'Akses në librat tuaj nga kudo në botë, në çdo pajisje.',
                color: 'orange'
              },
              {
                icon: Heart,
                title: 'Shërbim i Përsosur',
                description: 'Ekipi ynë është gjithmonë këtu për të ju ndihmuar me çdo pyetje.',
                color: 'pink'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <GlassCard className="p-8 text-center h-full">
                    <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-600 rounded-2xl flex items-center justify-center`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
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
          transition={{ delay: 1.0, duration: 0.6 }}
          className="text-center"
        >
          <GlassCard className="p-12 bg-gradient-to-r from-red-500/10 to-red-600/10">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{translations('cta.title')}</h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              {translations('cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/books">
                <LiquidButton variant="albanian" size="lg">
                  <BookOpen className="w-5 h-5 mr-2" />
                  {translations('cta.viewBooks')}
                </LiquidButton>
              </Link>
              <Link href="/contact">
                <LiquidButton variant="primary" size="lg">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  {translations('cta.contactUs')}
                </LiquidButton>
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
} 