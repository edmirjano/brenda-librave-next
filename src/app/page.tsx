'use client';

import Link from 'next/link';

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

export default function HomePage() {
  return (
    <LiquidBackground 
      blobCount={6} 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-50"
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
                Zbuloni botën e{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
                  librave shqiptarë
                </span>
              </h1>

              <p className="font-serif text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto">
                Nga klasikët e literaturës shqiptare deri tek autorët bashkëkohorë, gjeni librin
                tuaj të radhës në koleksionin tonë të gjerë dixhital dhe fizik.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                <Link href="/shop">
                  <LiquidButton 
                    variant="albanian" 
                    size="lg" 
                    className="min-w-[200px]"
                    morphing={true}
                    glowEffect={true}
                  >
                    <Library className="w-5 h-5 mr-2" />
                    Eksploroni Librat
                  </LiquidButton>
                </Link>

                <Link href="/auth/register">
                  <LiquidButton 
                    variant="liquid" 
                    size="lg" 
                    className="min-w-[200px]"
                    morphing={true}
                    glowEffect={true}
                  >
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Filloni Tani
                  </LiquidButton>
                </Link>
              </div>

              {/* Live Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { number: '5,000+', label: 'Libra në koleksion', icon: BookOpen },
                  { number: '1,200+', label: 'Lexues të kënaqur', icon: Users },
                  { number: '24/7', label: 'Mbështetje aktive', icon: Shield },
                ].map((stat, index) => (
                  <GlassCard
                    key={index}
                    variant="frosted"
                    morphing={false}
                    glowEffect={false}
                    className="p-6"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <stat.icon className="h-8 w-8 text-red-600 mx-auto mb-3" />
                      <div className="font-sans text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                      <div className="text-gray-600 text-sm">{stat.label}</div>
                    </motion.div>
                  </GlassCard>
                ))}
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
              Përse të zgjidhni{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
                Brënda Librave?
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Ofrojmë përvojën më të mirë të leximit për komunitetin shqiptar
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Smartphone,
                title: 'Dizajn Modern',
                description: 'Përvojë mobile-first me dizajn të inspiruar nga Apple Liquid Glass',
                color: 'text-blue-600',
              },
              {
                icon: CreditCard,
                title: 'Çmime të Favorshme',
                description: 'Paguani në Lek Shqiptarë ose Euro me çmime konkurruese',
                color: 'text-green-600',
              },
              {
                icon: Truck,
                title: 'Dërgim i Shpejtë',
                description: 'Dërgim falas në të gjithë Shqipërinë për porosi mbi 2000 Lek',
                color: 'text-purple-600',
              },
              {
                icon: Download,
                title: 'Libra Dixhitalë',
                description: 'Bibliotekë e gjerë e librave dixhitalë për lexim të menjëhershëm',
                color: 'text-indigo-600',
              },
              {
                icon: Award,
                title: 'Autorë Shqiptarë',
                description: 'Mbështesim autorët vendas dhe promovim kulturën shqiptare',
                color: 'text-red-600',
              },
              {
                icon: MessageSquare,
                title: 'Komunitet Aktiv',
                description: 'Bashkohuni me mijëra lexues në forumin tonë të librave',
                color: 'text-orange-600',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <GlassCard 
                  variant="bubble" 
                  morphing={false} 
                  glowEffect={false} 
                  className="p-8 h-full"
                >
                  <feature.icon className={`h-12 w-12 ${feature.color} mb-6`} />
                                        <h3 className="font-sans text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-700">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-50/50 to-red-100/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">Si funksionon?</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Vetëm tre hapa të thjeshtë për të gjetur librin tuaj të radhës
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: Globe,
                title: 'Eksploroni',
                description:
                  'Navigoni në koleksionin tonë të gjerë të librave shqiptarë dhe ndërkombëtarë',
              },
              {
                step: '02',
                icon: Heart,
                title: 'Zgjidhni',
                description:
                  'Shtoni librat tuaj të preferuar në shportë dhe personalizoni bibliotekën tuaj',
              },
              {
                step: '03',
                icon: Zap,
                title: 'Shijoni',
                description:
                  'Merrni librat në shtëpi ose filloni të lexoni menjëherë me versionin dixhital',
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                <GlassCard 
                  variant="crystal" 
                  morphing={true} 
                  glowEffect={true} 
                  className="p-8 text-center"
                >
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {step.step}
                    </div>
                  </div>
                  <step.icon className="h-16 w-16 text-red-600 mx-auto mb-6 mt-4" />
                  <h3 className="font-serif text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-700">{step.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories Preview */}
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
              Kategoritë më të populluara
            </h2>
            <p className="font-serif text-xl text-gray-700 max-w-3xl mx-auto">
              Zbuloni libra nga kategoritë që preferohen më shumë nga lexuesit tanë
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Literatura Shqiptare',
                count: '850+ libra',
                icon: BookOpen,
                gradient: 'from-red-500 to-red-600',
              },
              {
                name: 'Roman Historik',
                count: '420+ libra',
                icon: Library,
                gradient: 'from-blue-500 to-blue-600',
              },
              {
                name: 'Poezi Bashkëkohore',
                count: '290+ libra',
                icon: Heart,
                gradient: 'from-purple-500 to-purple-600',
              },
              {
                name: 'Libra për Fëmijë',
                count: '380+ libra',
                icon: Star,
                gradient: 'from-green-500 to-green-600',
              },
            ].map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <GlassCard 
                  variant="frosted" 
                  morphing={false} 
                  glowEffect={false} 
                  className="p-6 text-center cursor-pointer"
                >
                  <div
                    className={`w-16 h-16 mx-auto bg-gradient-to-r ${category.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                                      <h3 className="font-serif text-lg font-bold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm">{category.count}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/shop">
              <LiquidButton 
                variant="liquid" 
                size="lg"
                morphing={true}
                glowEffect={true}
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Shihni të gjithë librat
              </LiquidButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <FeaturedBooks limit={8} showHeader={true} />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-gray-50/50 to-blue-50/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <GlassCard 
              variant="crystal" 
              morphing={true} 
              glowEffect={true} 
              className="p-12 text-center"
            >
              <Mail className="h-16 w-16 text-red-600 mx-auto mb-6" />
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Mos humbisni asnjë risi!
              </h2>
              <p className="font-serif text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Regjistrohuni në newsletter-in tonë për të marrë informacione për libra të rinj,
                oferta speciale dhe ngjarje letrare.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Link href="/newsletter" className="flex-1">
                  <LiquidButton 
                    variant="albanian" 
                    size="lg" 
                    className="w-full"
                    morphing={true}
                    glowEffect={true}
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Abonohuni
                  </LiquidButton>
                </Link>
              </div>
            </GlassCard>
          </motion.div>
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
                Gati për të filluar udhëtimin tuaj letar?
              </h2>
              <p className="font-serif text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
                Bashkohuni me mijëra lexues që kanë zbuluar tashmë pasionin e tyre për leximin
                përmes Brënda Librave.
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
                    Krijoni llogarinë tuaj
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
                    Eksploroni librat
                  </LiquidButton>
                </Link>
              </div>

              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Regjistrim falas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Dërgim në të gjithë Shqipërinë</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Mbështetje 24/7</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </LiquidBackground>
  );
}