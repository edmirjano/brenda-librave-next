import { Metadata } from 'next';

import { motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Mail,
  MessageCircle,
  Phone,
  Search,
} from 'lucide-react';

import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';

export const metadata: Metadata = {
  title: 'Pyetje të Shpeshta (FAQ) | Brënda Librave',
  description: 'Gjeni përgjigje për pyetjet më të shpeshta rreth shërbimeve tona.',
};

const faqData = [
  {
    category: 'Porositë dhe Dërgimi',
    questions: [
      {
        question: 'Sa kohë merr dërgimi i librave?',
        answer:
          'Dërgimi në Tiranë bëhet brenda 24 orësh, ndërsa në qytetet e tjera të Shqipërisë brenda 48-72 orësh. Për porositë e bëra të premten pas orës 16:00 ose fundjavave, dërgimi fillon ditën e hënë.',
      },
      {
        question: 'A ka kosto për dërgimin?',
        answer:
          'Dërgimi është falas për porositë mbi 2,000 ALL. Për porositë nën këtë shumë, kostoja e dërgimit është 300 ALL në Tiranë dhe 500 ALL në qytetet e tjera.',
      },
      {
        question: 'Si mund të gjurmoj porosinë time?',
        answer:
          'Pas konfirmimit të porosisë, do të merrni një email me kodin e gjurmimit. Mund ta përdorni këtë kod në seksionin "Gjurmo Porosinë" ose në profilin tuaj.',
      },
      {
        question: 'A mund të anuloj porosinë pas konfirmimit?',
        answer:
          'Po, porositë mund të anulohen deri në 2 orë pas konfirmimit, nëse ende nuk janë përgatitur për dërgim. Pas kësaj kohe, duhet të kontaktoni shërbimin e klientit.',
      },
    ],
  },
  {
    category: 'Pagesa dhe Çmimet',
    questions: [
      {
        question: 'Çfarë mënyrash pagese pranoni?',
        answer:
          'Pranojmë pagesa me karta debiti/krediti (Visa, Mastercard), PayPal, dhe pagesë në dorëzim (vetëm në Tiranë). Gjithashtu pranojmë transferta bankare.',
      },
      {
        question: 'A janë çmimet përfundimtare?',
        answer:
          'Po, të gjitha çmimet e shfaqura në faqen tonë përfshijnë TVSH-në. Nuk ka kosto të fshehura, përveç kostos së dërgimit nëse nuk kualifikoheni për dërgim falas.',
      },
      {
        question: 'A ofrojë zbritje për blerje të shumta?',
        answer:
          'Po, ofrojmë zbritje 5% për porositë mbi 5,000 ALL, 10% për porositë mbi 10,000 ALL, dhe 15% për porositë mbi 20,000 ALL. Zbritjet aplikohen automatikisht.',
      },
    ],
  },
  {
    category: 'Llogaritë dhe Anëtarësimi',
    questions: [
      {
        question: 'A duhet të krijoj llogari për të bërë porosi?',
        answer:
          'Jo, mund të bëni porosi si vizitor. Megjithatë, krijimi i llogarisë ju lejon të gjurmoni porositë, ruani adresat, dhe të merrni rekomandime të personalizuara.',
      },
      {
        question: 'Si mund të ndryshoj fjalëkalimin tim?',
        answer:
          'Shkoni në "Profili" > "Cilësimet" > "Ndrysho Fjalëkalimin". Do t\'ju duhet të fusni fjalëkalimin aktual dhe atë të ri. Do të merrni një email konfirmimi.',
      },
      {
        question: 'Si mund të fshij llogarinë time?',
        answer:
          'Mund të fshini llogarinë tuaj duke na kontaktuar në info@brendalibrave.al. Të dhënat tuaja do të fshihen brenda 30 ditëve, në përputhje me GDPR.',
      },
    ],
  },
  {
    category: 'Librat dhe Produktet',
    questions: [
      {
        question: 'A janë të gjitha librat origjinalë?',
        answer:
          'Po, të gjitha librat që shesin janë origjinalë dhe të reja. Punojmë direkt me botuesit dhe shpërndarësit e autorizuar për të siguruar cilësinë.',
      },
      {
        question: 'Si mund të rekomandoj një libër?',
        answer:
          'Mund të na dërgoni sugjerime për libra të rinj në seksionin "Kontakti" ose përmes email-it. Gjithashtu mund të përfshiheni në forumin tonë të lexuesve.',
      },
      {
        question: 'A ofrojë libra digjitalë?',
        answer:
          'Aktualisht fokusohemi vetëm në libra fizikë. Megjithatë, po punojmë për të shtuar opsionin e librave digjitalë në të ardhmen e afërt.',
      },
    ],
  },
  {
    category: 'Kthimi dhe Shkëmbimi',
    questions: [
      {
        question: 'Cila është politika e kthimit?',
        answer:
          'Mund të ktheni librat brenda 14 ditëve nga data e dorëzimit, nëse janë në gjendje të re dhe me paketimin origjinal. Kostoja e kthimit mbulohet nga ju.',
      },
      {
        question: 'Si mund të shkëmbej një libër?',
        answer:
          'Shkëmbimet bëhen vetëm nëse libri ka defekte ose është dërguar gabimisht. Na kontaktoni brenda 48 orëve dhe ne do ta zëvendësojmë falas.',
      },
    ],
  },
];

import { getTranslations } from 'next-intl/server';
import { FAQPageClient } from '@/components/pages/FAQPageClient';

export default async function FAQPage() {
  const t = await getTranslations('faq');

  return <FAQPageClient translations={t} />;
}
  return (
          <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-100/20 to-purple-100/20"></div>
      </div>

      <div className="relative max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
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
            Pyetje të{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
              Shpeshta
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Gjeni përgjigje të shpejta për pyetjet më të shpeshta rreth shërbimeve tona
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
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Kërkoni për një pyetje..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-lg"
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* FAQ Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {faqData.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + categoryIndex * 0.1, duration: 0.6 }}
            >
              <GlassCard className="p-6 h-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">
                  {category.category}
                </h2>

                <div className="space-y-4">
                  {category.questions.map((item, questionIndex) => (
                    <motion.details
                      key={questionIndex}
                      className="group"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 + questionIndex * 0.05 }}
                    >
                      <summary className="flex items-center justify-between cursor-pointer p-4 rounded-xl bg-white/50 hover:bg-white/70 transition-colors">
                        <h3 className="font-semibold text-gray-900 flex-1 pr-4">
                          {item.question}
                        </h3>
                        <ChevronDown className="h-5 w-5 text-gray-500 group-open:hidden" />
                        <ChevronUp className="h-5 w-5 text-gray-500 hidden group-open:block" />
                      </summary>
                      <div className="mt-3 px-4 pb-4">
                        <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                      </div>
                    </motion.details>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12"
        >
          <GlassCard className="p-12 bg-gradient-to-r from-red-500/10 to-red-600/10">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Nuk gjetët përgjigjen që kërkonit?
              </h2>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Ekipi ynë i mbështetjes është gjithmonë gati për t'ju ndihmuar me çdo pyetje që mund
                të keni
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    title: 'Email',
                    description: 'Përgjigje brenda 24 orësh',
                    icon: Mail,
                    action: 'Na shkruani',
                    href: 'mailto:info@brendalibrave.al',
                  },
                  {
                    title: 'Telefon',
                    description: 'E Hënë - E Premte, 9:00-18:00',
                    icon: Phone,
                    action: 'Na telefononi',
                    href: 'tel:+355692345678',
                  },
                  {
                    title: 'Live Chat',
                    description: 'Përgjigje të menjëhershme',
                    icon: MessageCircle,
                    action: 'Filloni chat',
                    href: '#',
                  },
                ].map((contact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
                    className="text-center"
                  >
                    <contact.icon className="h-10 w-10 text-red-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{contact.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{contact.description}</p>
                    <LiquidButton variant="primary" size="sm" className="w-full">
                      {contact.action}
                    </LiquidButton>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <LiquidButton variant="albanian" size="lg">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Kontaktoni Mbështetjen
                </LiquidButton>
                <LiquidButton variant="primary" size="lg">
                  <Mail className="w-5 h-5 mr-2" />
                  Dërgoni Email
                </LiquidButton>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}