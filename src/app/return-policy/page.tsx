import { Metadata } from 'next';

import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  Mail,
  Package,
  RefreshCw,
  Truck,
  XCircle,
} from 'lucide-react';

import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';

export const metadata: Metadata = {
  title: 'Politika e Kthimit | Brënda Librave',
  description: 'Lexoni politikën tonë të kthimit dhe shkëmbimit të produkteve.',
};

const returnSteps = [
  {
    step: '01',
    title: 'Kontaktoni Ne',
    description: 'Dërgoni një email ose telefononi për të filluar procesin e kthimit',
    icon: Mail,
    timeframe: 'Brenda 14 ditëve',
  },
  {
    step: '02',
    title: 'Konfirmimi',
    description: 'Do të merrni një kod kthimi dhe instruksione për paketimin',
    icon: CheckCircle,
    timeframe: 'Brenda 24 orësh',
  },
  {
    step: '03',
    title: 'Paketimi',
    description: 'Paketoni produktin në gjendje origjinale me të gjitha aksesorët',
    icon: Package,
    timeframe: '2-3 ditë',
  },
  {
    step: '04',
    title: 'Dërgimi',
    description: 'Dërgoni produktin në adresën e dhënë ose ne e marrim falas',
    icon: Truck,
    timeframe: '1-3 ditë',
  },
  {
    step: '05',
    title: 'Inspektimi',
    description: 'Inspektojmë produktin për të konfirmuar gjendjen',
    icon: CheckCircle,
    timeframe: '1-2 ditë',
  },
  {
    step: '06',
    title: 'Rimbursi',
    description: 'Rimbursi processohet në metodën origjinale të pagesës',
    icon: CreditCard,
    timeframe: '3-7 ditë',
  },
];

const eligibleProducts = [
  { name: 'Libra të rinj', eligible: true, note: 'Në gjendje origjinale' },
  { name: 'Libra të përdorur', eligible: false, note: 'Nuk pranohen kthime' },
  { name: 'Libra digjitalë', eligible: false, note: 'Nuk mund të kthehen' },
  { name: 'Dhurata', eligible: true, note: 'Me faturat origjinale' },
  { name: 'Libra me zbritje', eligible: true, note: 'Të njëjtat kushte' },
  { name: 'Libra të personalizuar', eligible: false, note: 'Nuk mund të kthehen' },
];

export default function ReturnPolicyPage() {
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
            <RefreshCw className="h-12 w-12 text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Politika e{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
              Kthimit
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Jemi të angazhuar për kënaqësinë tuaj. Lexoni politikën tonë të kthimit dhe shkëmbimit
          </p>
        </motion.div>

        {/* Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-12"
        >
          <GlassCard className="p-8 bg-gradient-to-r from-green-500/10 to-green-600/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">14 Ditë</h3>
                <p className="text-gray-600">Periudhë kthimi falas</p>
              </div>
              <div>
                <RefreshCw className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Kthim i Lehtë</h3>
                <p className="text-gray-600">Proces i thjeshtë dhe transparent</p>
              </div>
              <div>
                <CreditCard className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Rimbursi i Shpejtë</h3>
                <p className="text-gray-600">3-7 ditë punë për rimbursin</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Return Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Procesi i Kthimit</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {returnSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
              >
                <GlassCard className="p-6 text-center h-full">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                      {step.step}
                    </div>
                    <step.icon className="h-8 w-8 text-red-600 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  <div className="text-sm text-red-600 font-medium">{step.timeframe}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Eligible Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Produktet e Pranuara</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Gjendja e Produkteve</h3>
              <div className="space-y-4">
                {eligibleProducts.map((product, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05, duration: 0.4 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/50"
                  >
                    <div className="flex items-center space-x-3">
                      {product.eligible ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">{product.note}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Kushtet e Kthimit</h3>
              <div className="space-y-4">
                {[
                  { icon: Calendar, text: 'Brenda 14 ditëve nga data e dorëzimit' },
                  { icon: Package, text: 'Në paketimin dhe gjendjen origjinale' },
                  { icon: FileText, text: 'Me faturën ose recepisën e blerjes' },
                  { icon: CheckCircle, text: 'Pa dëme ose njolla' },
                  { icon: ArrowLeft, text: 'Me të gjitha aksesorët dhe materialet' },
                ].map((condition, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05, duration: 0.4 }}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-white/50"
                  >
                    <condition.icon className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <span className="text-gray-700">{condition.text}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>
        </motion.div>

        {/* Refund Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-12"
        >
          <GlassCard className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Informacione Rimbursi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Metodat e Rimbursit</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Karta e kreditit/debitit (3-5 ditë)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">PayPal (1-3 ditë)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    <span className="text-gray-700">Transfer bankar (5-7 ditë)</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Kostot e Kthimit</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Kthim i rregullt</span>
                    <span className="font-semibold text-red-600">Ju mbuloni koston</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Produkt i defektuar</span>
                    <span className="font-semibold text-green-600">Ne mbulojmë koston</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Gabim nga ana jonë</span>
                    <span className="font-semibold text-green-600">Ne mbulojmë koston</span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Exchange Policy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mb-12"
        >
          <GlassCard className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Politika e Shkëmbimit</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Shkëmbimet janë të mundshme vetëm në raste specifike dhe brenda të njëjtës periudhë kohore
                si kthimet. Shkëmbimet kryhen kur:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Arsye të Pranuara:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-gray-700">Produkt i defektuar</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-gray-700">Produkt i gabuar i dërguar</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-gray-700">Dëm gjatë transportit</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Procesi i Shkëmbimit:</h3>
                  <ol className="space-y-2">
                    <li className="text-gray-700">1. Kontaktoni shërbimin e klientit</li>
                    <li className="text-gray-700">2. Dërgoni foto të problemit</li>
                    <li className="text-gray-700">3. Merrni konfirmimin për shkëmbim</li>
                    <li className="text-gray-700">4. Dërgojmë produktin e ri</li>
                  </ol>
                </div>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Nevojë për ndihmë me kthimin?</h2>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Ekipi ynë është gati për t'ju ndihmuar me çdo pyetje rreth kthimit ose shkëmbimit
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-white/50 rounded-xl">
                  <Mail className="h-10 w-10 text-red-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                  <p className="text-gray-700">returns@brendalibrave.al</p>
                </div>
                <div className="text-center p-6 bg-white/50 rounded-xl">
                  <FileText className="h-10 w-10 text-red-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Telefon</h3>
                  <p className="text-gray-700">+355 69 234 5678</p>
                </div>
                <div className="text-center p-6 bg-white/50 rounded-xl">
                  <Clock className="h-10 w-10 text-red-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Orari</h3>
                  <p className="text-gray-700">9:00 - 18:00, E Hënë - E Premte</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <LiquidButton variant="albanian" size="lg">
                  <Mail className="w-5 h-5 mr-2" />
                  Fillo Kthimin
                </LiquidButton>
                <LiquidButton variant="primary" size="lg">
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Gjurmo Kthimin
                </LiquidButton>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}