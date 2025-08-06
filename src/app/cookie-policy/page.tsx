import { Metadata } from 'next';

import { motion } from 'framer-motion';
import {
  Calendar,
  Cookie,
  Eye,
  Mail,
  Settings,
  Shield,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';

export const metadata: Metadata = {
  title: 'Politika e Cookies | Brënda Librave',
  description: 'Mësoni se si përdorim cookies dhe si mund t\'i menaxhoni ato.',
};

const cookieTypes = [
  {
    name: 'Cookies të Nevojshëm',
    description: 'Këto cookies janë të domosdoshëm për funksionimin e faqes',
    essential: true,
    examples: [
      'Ruajtja e shportës së blerjeve',
      'Sesionet e përdoruesve',
      'Preferencat e gjuhës',
      'Siguria e faqes',
    ],
    retention: 'Deri në mbylljen e browser-it ose 30 ditë',
    canDisable: false,
  },
  {
    name: 'Cookies të Performancës',
    description: 'Na ndihmojnë të kuptojmë se si vizitorët përdorin faqen tonë',
    essential: false,
    examples: [
      'Google Analytics',
      'Kohëzgjatja e vizitës',
      'Faqet më të vizituara',
      'Burimet e trafikut',
    ],
    retention: '2 vjet',
    canDisable: true,
  },
  {
    name: 'Cookies Funksionalë',
    description: 'Mundësojnë funksione të avancuara dhe personalizim',
    essential: false,
    examples: [
      'Preferencat e përdoruesit',
      'Rekomandime të personalizuara',
      'Chat live',
      'Videot e integruar',
    ],
    retention: '1 vit',
    canDisable: true,
  },
  {
    name: 'Cookies të Marketingut',
    description: 'Përdoren për të shfaqur reklama të personalizuara',
    essential: false,
    examples: [
      'Facebook Pixel',
      'Google Ads',
      'Retargeting',
      'Matja e konvertimeve',
    ],
    retention: '2 vjet',
    canDisable: true,
  },
];

export default function CookiePolicyPage() {
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
          <motion.div
            className="w-24 h-24 mx-auto bg-gradient-to-r from-red-500 to-red-600 rounded-3xl flex items-center justify-center shadow-2xl mb-6"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <Cookie className="h-12 w-12 text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Politika e{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
              Cookies
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Mësoni se si përdorim cookies për të përmirësuar përvojën tuaj në faqen tonë
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
              <span>Përditësuar më: 1 Janar 2024</span>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Çfarë janë Cookies?</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Cookies janë fajllë të vegjël teksti që ruhen në kompjuterin ose pajisjen tuaj celulare
                kur vizitoni një faqe interneti. Ato përdoren gjerësisht për të bërë që faqet e internetit
                të funksionojnë, ose të funksionojnë më efektivshëm, si dhe për të dhënë informacione
                për pronarët e faqes.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Brënda Librave përdor cookies për të përmirësuar përvojën tuaj të shfletimit, për të
                ofruar funkcione të personalizuara dhe për të analizuar trafikun në faqen tonë.
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Cookie Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Llojet e Cookies që Përdorim</h2>
          <div className="space-y-6">
            {cookieTypes.map((cookieType, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{cookieType.name}</h3>
                        {cookieType.essential && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                            I Domosdoshëm
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">{cookieType.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {cookieType.canDisable ? (
                        <ToggleRight className="h-6 w-6 text-green-500" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-gray-400" />
                      )}
                      <span className="text-sm text-gray-500">
                        {cookieType.canDisable ? 'Mundësi' : 'I detyrueshëm'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Shembuj përdorimi:</h4>
                      <ul className="space-y-1">
                        {cookieType.examples.map((example, exampleIndex) => (
                          <li key={exampleIndex} className="text-sm text-gray-600 flex items-center">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2 flex-shrink-0"></span>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Kohëzgjatja:</h4>
                      <p className="text-sm text-gray-600">{cookieType.retention}</p>
                      
                      <h4 className="font-semibold text-gray-900 mb-2 mt-4">Kontrolli:</h4>
                      <p className="text-sm text-gray-600">
                        {cookieType.canDisable 
                          ? 'Mund të çaktivizohen përmes cilësimeve të browser-it'
                          : 'Nuk mund të çaktivizohen pa ndikuar në funksionimin e faqes'
                        }
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Cookie Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-12"
        >
          <GlassCard className="p-8">
            <div className="flex items-start space-x-4 mb-6">
              <Settings className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-bold text-gray-900">Si të Menaxhoni Cookies</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Cilësimet e Browser-it</h3>
                <p className="text-gray-700 mb-4">
                  Shumica e browser-ave ju lejojnë të kontrolloni cookies përmes cilësimeve. Këtu janë
                  udhëzimet për browser-at më popullorë:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { browser: 'Chrome', steps: 'Cilësimet > Privatësia dhe siguria > Cookies' },
                    { browser: 'Firefox', steps: 'Opsionet > Privatësia dhe siguria > Cookies' },
                    { browser: 'Safari', steps: 'Preferencat > Privatësia > Cookies' },
                    { browser: 'Edge', steps: 'Cilësimet > Cookies dhe lejet e faqes' },
                  ].map((item, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900">{item.browser}</h4>
                      <p className="text-sm text-gray-600">{item.steps}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Preferencat e Cookies</h3>
                <p className="text-gray-700 mb-4">
                  Mund të menaxhoni preferencat tuaja të cookies duke klikuar butonin më poshtë:
                </p>
                <LiquidButton variant="primary" size="lg">
                  <Settings className="w-5 h-5 mr-2" />
                  Menaxho Preferencat e Cookies
                </LiquidButton>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Third Party Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mb-12"
        >
          <GlassCard className="p-8">
            <div className="flex items-start space-x-4 mb-6">
              <Shield className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-bold text-gray-900">Cookies të Palëve të Treta</h2>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Përdorim gjithashtu shërbime të palëve të treta që mund të vendosin cookies në pajisjen tuaj:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    service: 'Google Analytics',
                    purpose: 'Analizë e trafikut dhe sjelljes së përdoruesve',
                    policy: 'policies.google.com/privacy',
                  },
                  {
                    service: 'Facebook Pixel',
                    purpose: 'Matja e efektivitetit të reklamave',
                    policy: 'facebook.com/privacy',
                  },
                  {
                    service: 'PayPal',
                    purpose: 'Përpunimi i pagesave të sigurta',
                    policy: 'paypal.com/privacy',
                  },
                  {
                    service: 'Sentry',
                    purpose: 'Monitorimi i gabimeve dhe performancës',
                    policy: 'sentry.io/privacy',
                  },
                ].map((service, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">{service.service}</h4>
                    <p className="text-sm text-gray-600 mb-2">{service.purpose}</p>
                    <a 
                      href={`https://${service.policy}`} 
                      className="text-xs text-red-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Politika e Privatësisë
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <GlassCard className="p-12 bg-gradient-to-r from-red-500/10 to-red-600/10">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Keni pyetje rreth cookies?</h2>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Nëse keni pyetje rreth përdorimit tonë të cookies ose dëshironi të mësoni më shumë,
                na kontaktoni
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <LiquidButton variant="albanian" size="lg">
                  <Mail className="w-5 h-5 mr-2" />
                  Na Kontaktoni
                </LiquidButton>
                <LiquidButton variant="primary" size="lg">
                  <Eye className="w-5 h-5 mr-2" />
                  Lexo Politikën e Privatësisë
                </LiquidButton>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}