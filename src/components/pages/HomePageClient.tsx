'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle,
  CreditCard,
  Download,
  Globe,
  Heart,
  Library,
  Mail,
  MessageSquare,
  Shield,
  Smartphone,
  Star,
  Truck,
  Users,
  Zap,
} from 'lucide-react';

import { FeaturedBooks } from '@/components/books/FeaturedBooks';
import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';
import { LiquidBackground, LiquidBlob } from '@/components/ui/LiquidBlob';
import { Link } from '@/navigation';

interface HomePageClientProps {
  translations: any;
}

export function HomePageClient({ translations }: HomePageClientProps) {
  return (
    <LiquidBackground 
      blobCount={6} 
      className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50"
    >
      {/* Additional decorative blobs */}
      <LiquidBlob 
        position={{ x: 15, y: 20 }} 
        size="lg" 
        color="red" 
        opacity={0.3}
        floating={true}
        morphing={true}
      />
      <LiquidBlob 
        position={{ x: 85, y: 60 }} 
        size="md" 
        color="blue" 
        opacity={0.4}
        floating={true}
        morphing={true}
      />
      <LiquidBlob 
        position={{ x: 20, y: 80 }} 
        size="xl" 
        color="purple" 
        opacity={0.2}
        floating={true}
        morphing={true}
      />

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-100/20 to-purple-100/20"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="text-center"
          >
            <GlassCard 
              variant="crystal" 
              morphing={true} 
              glowEffect={true} 
              className="p-8 md:p-16 max-w-5xl mx-auto"
            >
              <motion.div
                className="w-24 h-24 mx-auto bg-gradient-to-r from-red-500 to-red-600 rounded-3xl flex items-center justify-center shadow-2xl mb-8"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <BookOpen className="h-12 w-12 text-white" />
              </motion.div>

              <h1 className="font-serif text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                {translations('hero.title')}
              </h1>

              <p className="font-serif text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto">
                {translations('hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link href="/books">
                  <LiquidButton 
                    variant="albanian" 
                    size="lg" 
                    className="min-w-[220px]"
                    morphing={true}
                    glowEffect={true}
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    {translations('hero.cta')}
                  </LiquidButton>
                </Link>

                <Link href="/auth/register">
                  <LiquidButton 
                    variant="liquid" 
                    size="lg" 
                    className="min-w-[220px]"
                    morphing={true}
                    glowEffect={true}
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Regjistrohu Falas
                  </LiquidButton>
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {translations('features.title')}
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              {translations('features.subtitle')}
            </p>
          </motion.div>

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
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Librat e Veçantë
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Zbuloni librat më të fundit dhe më të popullarizuar nga koleksioni ynë
            </p>
          </motion.div>
          
          <FeaturedBooks />
        </div>
      </section>

      {/* AI Recommendations Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* BookRecommendations component would go here */}
          {/* For now, it's a placeholder */}
          <p>AI Recommendations Section Placeholder</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <GlassCard 
              variant="crystal" 
              morphing={true} 
              glowEffect={true} 
              className="p-12 md:p-16 text-center bg-gradient-to-r from-red-500/10 to-red-600/10"
            >
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {translations('cta.title')}
              </h2>
              <p className="font-serif text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
                {translations('cta.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                <Link href="/auth/register">
                  <LiquidButton 
                    variant="albanian" 
                    size="lg" 
                    className="min-w-[220px]"
                    morphing={true}
                    glowEffect={true}
                  >
                    <ArrowRight className="w-5 h-5 mr-2" />
                    {translations('cta.createAccount')}
                  </LiquidButton>
                </Link>

                <Link href="/books">
                  <LiquidButton 
                    variant="liquid" 
                    size="lg" 
                    className="min-w-[220px]"
                    morphing={true}
                    glowEffect={true}
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    {translations('cta.exploreBooks')}
                  </LiquidButton>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                {[
                  { icon: Award, text: 'Cilësi e Garantuar' },
                  { icon: Shield, text: 'Siguri e Plotë' },
                  { icon: Users, text: '50,000+ Klientë' },
                  { icon: Star, text: '4.9/5 Vlerësim' }
                ].map((indicator, index) => {
                  const Icon = indicator.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      viewport={{ once: true }}
                      className="text-center"
                    >
                      <Icon className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">{indicator.text}</p>
                    </motion.div>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </LiquidBackground>
  );
} 