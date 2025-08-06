import { Metadata } from 'next';

import { motion } from 'framer-motion';
import {
  Award,
  Calendar,
  DollarSign,
  Eye,
  FileText,
  Heart,
  Mail,
  Shield,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';

import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';

export const metadata: Metadata = {
  title: 'Transparenca | Brënda Librave',
  description: 'Qëndrimi ynë i hapur dhe transparent ndaj komunitetit dhe biznesit.',
};

const metrics = [
  { label: 'Klientë të Kënaqur', value: '50,000+', icon: Users, color: 'blue' },
  { label: 'Libra të Shitur', value: '125,000+', icon: FileText, color: 'green' },
  { label: 'Vlerësim Mesatar', value: '4.8/5', icon: Award, color: 'yellow' },
  { label: 'Kohë Përgjigje', value: '< 2 orë', icon: TrendingUp, color: 'red' },
];

const commitments = [
  {
    title: 'Çmime të Drejta',
    description: 'Çmimet tona janë konkurruese dhe transparente, pa tarifa të fshehura.',
    icon: DollarSign,
    details: [
      'Çmime të qëndrueshme',
      'Pa tarifa të fshehura',
      'Zbritje të vërteta',
      'Krahasim i hapur me konkurrentët',
    ],
  },
  {
    title: 'Cilësi e Garantuar',
    description: 'Të gjitha librat janë origjinalë dhe të reja, me garanci cilësie.',
    icon: Shield,
    details: [
      'Libra 100% origjinalë',
      'Kontroll cilësie para dërgimit',
      'Politikë kthimi 14 ditë',
      'Garanci për defektet',
    ],
  },
  {
    title: 'Shërbim i Ndershëm',
    description: 'Komunikim i hapur dhe i ndershëm me klientët tanë.',
    icon: Heart,
    details: [
      'Përgjigjja e sinqertë',
      'Pranoni gabimet',
      'Zgjidhje të shpejta',
      'Feedback i vlerësuar',
    ],
  },
  {
    title: 'Operacione të Hapura',
    description: 'Jemi transparentë për mënyrën se si funksionon biznesi ynë.',
    icon: Eye,
    details: [
      'Raportim i rregullt',
      'Politika të qarta',
      'Procese të dokumentuara',
      'Akses në informacione',
    ],
  },
];

export default function TransparencyPage() {
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
            <Eye className="h-12 w-12 text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Raport{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
              Transparence
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Besimi ndërtohet përmes transparencës. Ja si funksionojmë dhe çfarë arrijmë së bashku
          </p>
        </motion.div>

        {/* Last Updated */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-12"
        >
          <GlassCard className="p-4 bg-blue-50/50">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Përditësuar më: 1 Janar 2024</span>
            </div>
          </GlassCard>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Shifrat që Flasin</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
              >
                <GlassCard className="p-6 text-center">
                  <metric.icon className={`h-12 w-12 text-${metric.color}-600 mx-auto mb-4`} />
                  <div className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</div>
                  <div className="text-gray-600">{metric.label}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Our Commitments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Angazhimet Tona</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {commitments.map((commitment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
              >
                <GlassCard className="p-6 h-full">
                  <div className="flex items-start space-x-4 mb-4">
                    <commitment.icon className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{commitment.title}</h3>
                      <p className="text-gray-600 mb-4">{commitment.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {commitment.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm text-gray-700">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-3 flex-shrink-0"></span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Financial Transparency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mb-12"
        >
          <GlassCard className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Transparenca Financiare</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Shpërndarja e të Ardhurave</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Kostoja e librave:</span>
                    <span>65%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Operacione:</span>
                    <span>20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Marketing:</span>
                    <span>10%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fitimi:</span>
                    <span>5%</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Investimet 2024</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Teknologji:</span>
                    <span>40%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Koleksion libra:</span>
                    <span>35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ekip:</span>
                    <span>15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Infrastrukturë:</span>
                    <span>10%</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Objektiva 2025</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>+50% libra në koleksion</div>
                  <div>-20% kohë dërgimi</div>
                  <div>+30% qytete të mbuluar</div>
                  <div>100% energji e gjelbër</div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Impact & Responsibility */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-12"
        >
          <GlassCard className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Ndikimi dhe Përgjegjësia Sociale</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Kontributi në Komunitet</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-red-600" />
                    <span className="text-gray-700">500+ libra dhuruar në shkolla</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">20+ evente letrare të organizuara</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Heart className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">15 familje të mbështetura</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-purple-600" />
                    <span className="text-gray-700">5 autorë të rinj të promovuar</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Qëndrueshmëria Mjedisore</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Eye className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Paketim 100% i riciklueshëm</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">-30% emetime karboni (2024)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <span className="text-gray-700">Partneritet me botuese të gjelbra</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Target className="h-5 w-5 text-red-600" />
                    <span className="text-gray-700">Plan neutraliteti karboni 2026</span>
                  </div>
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
        >
          <GlassCard className="p-12 bg-gradient-to-r from-red-500/10 to-red-600/10">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Pyetje rreth transparencës?</h2>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Jemi të hapur për të gjitha pyetjet dhe sugjerimit tuaja për transparencë më të madhe
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <LiquidButton variant="albanian" size="lg">
                  <Mail className="w-5 h-5 mr-2" />
                  Na Kontaktoni
                </LiquidButton>
                <LiquidButton variant="primary" size="lg">
                  <FileText className="w-5 h-5 mr-2" />
                  Shkarko Raportin e Plotë
                </LiquidButton>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}