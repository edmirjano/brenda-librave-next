import { Metadata } from 'next';

import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle,
  Eye,
  Mail,
  Shield,
  User,
  Users,
} from 'lucide-react';

import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';

export const metadata: Metadata = {
  title: 'Politika e Privatësisë | Brënda Librave',
  description: 'Lexoni politikën tonë të privatësisë dhe mësoni se si i mbrojmë të dhënat tuaja.',
};

const sections = [
  {
    title: '1. Informacionet që Mbledhim',
    icon: User,
    content: [
      {
        subtitle: 'Informacione Personale',
        text: 'Mbledhim informacione si emri, adresa email, numri i telefonit, dhe adresa e dërgimit kur krijoni një llogari ose bëni një porosi.',
      },
      {
        subtitle: 'Informacione të Pagesës',
        text: 'Të dhënat e kartës së kreditit dhe informacionet e faturimit ruhen në mënyrë të sigurt përmes partnerëve tanë të pagesës të çertifikuar.',
      },
      {
        subtitle: 'Informacione të Përdorimit',
        text: 'Mbledhim informacione për mënyrën se si përdorni faqen tonë, duke përfshirë faqet e vizituara, kohën e qëndrimit, dhe preferencat.',
      },
    ],
  },
  {
    title: '2. Si i Përdorim Informacionet',
    icon: Eye,
    content: [
      {
        subtitle: 'Përmbushja e Porosive',
        text: 'Përdorim informacionet tuaja për të përmbushur porositë, për t\'ju kontaktuar rreth porosisë, dhe për të siguruar dërgimin.',
      },
      {
        subtitle: 'Përmirësimi i Shërbimit',
        text: 'Analizojmë të dhënat për të përmirësuar përvojën tuaj, për të personalizuar rekomandime, dhe për të optimizuar faqen tonë.',
      },
      {
        subtitle: 'Komunikimi',
        text: 'Do t\'ju dërgojmë emaile rreth porosive tuaja, azhurnimeve të produkteve, dhe ofertave speciale (nëse jeni abonuar).',
      },
    ],
  },
  {
    title: '3. Ndarja e Informacioneve',
    icon: Users,
    content: [
      {
        subtitle: 'Partnerët e Dërgimit',
        text: 'Ndajmë informacionet e dërgimit me kompanitë e dërgimit për të mundësuar dorëzimin e porosive tuaja.',
      },
      {
        subtitle: 'Ofruesit e Shërbimeve',
        text: 'Bashkëpunojmë me ofrues të besueshmë për pagesa, analizë, dhe mbështetje teknike, të gjithë të lidhur me marrëveshje konfidencialiteti.',
      },
      {
        subtitle: 'Kërkesat Ligjore',
        text: 'Mund të ndajmë informacione nëse kërkohet nga ligji ose për të mbrojtur të drejtat tona dhe sigurinë e përdoruesve.',
      },
    ],
  },
  {
    title: '4. Siguria e të Dhënave',
    icon: Shield,
    content: [
      {
        subtitle: 'Enkriptimi',
        text: 'Të gjitha të dhënat transmutohen përmes enkriptimit SSL/TLS dhe ruhen në servera të sigurt.',
      },
      {
        subtitle: 'Aksesi i Kufizuar',
        text: 'Vetëm personeli i autorizuar ka akses në të dhënat personale, dhe të gjithë nënshkruajnë marrëveshje konfidencialiteti.',
      },
      {
        subtitle: 'Monitorimi',
        text: 'Monitorojmë vazhdimisht sistemet tona për të identifikuar dhe parandaluar çdo aktivitet të dyshimtë.',
      },
    ],
  },
  {
    title: '5. Të Drejtat Tuaja',
    icon: CheckCircle,
    content: [
      {
        subtitle: 'Aksesi dhe Korrigjimi',
        text: 'Keni të drejtë të shihni dhe korrigjoni informacionet personale që kemi për ju në çdo kohë.',
      },
      {
        subtitle: 'Fshirja',
        text: 'Mund të kërkoni fshirjen e të dhënave tuaja personale, me përjashtim të atyre që janë të nevojshme për qëllime ligjore.',
      },
      {
        subtitle: 'Portabiliteti',
        text: 'Mund të kërkoni një kopje të të dhënave tuaja në format të lexueshëm nga makina.',
      },
      {
        subtitle: 'Tërheqja e Pëlqimit',
        text: 'Mund të tërhiqni pëlqimin tuaj për përpunimin e të dhënave në çdo kohë.',
      },
    ],
  },
];

import { getTranslations } from 'next-intl/server';
import { PrivacyPolicyPageClient } from '@/components/pages/PrivacyPolicyPageClient';

export default async function PrivacyPolicyPage() {
  const t = await getTranslations('privacy');

  return <PrivacyPolicyPageClient translations={t} />;
}
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
            <Shield className="h-12 w-12 text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Politika e{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
              Privatësisë
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Ne respektojmë privatësinë tuaj dhe jemi të angazhuar për të mbrojtur të dhënat tuaja personale
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Hyrje</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Brënda Librave ("ne", "na", "tonë") respekton privatësinë tuaj dhe është e angazhuar për të
                mbrojtur të dhënat tuaja personale. Kjo Politikë e Privatësisë shpjegon se si mbledhim,
                përdorim, ruajmë dhe mbrojmë informacionet tuaja kur vizitoni faqen tonë të internetit dhe
                përdorni shërbimet tona.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Duke përdorur shërbimet tona, ju pajtoheni me praktikat e përshkruara në këtë politikë.
                Nëse nuk pajtoheni me këtë politikë, ju lutemi mos përdorni shërbimet tona.
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
            >
              <GlassCard className="p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <section.icon className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>

                <div className="space-y-6">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.subtitle}</h3>
                      <p className="text-gray-700 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Cookies Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8"
        >
          <GlassCard className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Cookies dhe Teknologji të Ngjashme</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Përdorim cookies dhe teknologji të ngjashme për të përmirësuar përvojën tuaj në faqen tonë.
                Cookies janë fajllë të vegjël teksti që ruhen në pajisjen tuaj kur vizitoni faqen tonë.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Cookies të Nevojshëm</h3>
                  <p className="text-sm text-gray-600">
                    Të nevojshëm për funksionimin bazë të faqes, si ruajtja e shportës së blerjeve.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Cookies Analitik</h3>
                  <p className="text-sm text-gray-600">
                    Na ndihmojnë të kuptojmë se si përdorni faqen për të përmirësuar përvojën.
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
          className="mt-12"
        >
          <GlassCard className="p-12 bg-gradient-to-r from-red-500/10 to-red-600/10">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Keni pyetje rreth privatësisë?</h2>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Nëse keni pyetje rreth kësaj politike ose dëshironi të ushtroni të drejtat tuaja,
                na kontaktoni
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="text-center p-6 bg-white/50 rounded-xl">
                  <Mail className="h-10 w-10 text-red-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                  <p className="text-gray-700">privacy@brendalibrave.al</p>
                </div>
                <div className="text-center p-6 bg-white/50 rounded-xl">
                  <Shield className="h-10 w-10 text-red-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Trajnimi GDPR</h3>
                  <p className="text-gray-700">I çertifikuar për mbrojtjen e të dhënave</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <LiquidButton variant="albanian" size="lg">
                  <Mail className="w-5 h-5 mr-2" />
                  Na Kontaktoni
                </LiquidButton>
                <LiquidButton variant="primary" size="lg">
                  <Eye className="w-5 h-5 mr-2" />
                  Menaxho Preferences
                </LiquidButton>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}