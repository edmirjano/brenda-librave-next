import { Metadata } from 'next';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Gift,
  Heart,
  MessageSquare,
  Package,
  Sparkles,
  Star,
  Truck,
  User,
} from 'lucide-react';

import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';

export const metadata: Metadata = {
  title: 'Dhuroni një Libër | Brënda Librave',
  description: 'Dhuroni libra të dashurëve tuaj me personalizim të veçantë dhe mesazhe të ngrohtë.',
};

export default function GiftPage() {
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
            <Gift className="h-12 w-12 text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Dhuroni{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
              një Libër
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Shprehni dashurinë tuaj përmes librave të zgjedhur me kujdes dhe personalizuar me
            mesazhe të ngrohtë
          </p>
        </motion.div>

        {/* Gift Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Opsionet e Dhurimit</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Dhuratë e Thjeshtë',
                description: 'Libër i zgjedhur me kujdes për dashurinë tuaj',
                price: 'Nga 800 ALL',
                features: ['Libër i zgjedhur', 'Kartë përshëndetje', 'Paketim i bukur'],
                icon: Gift,
                popular: false,
              },
              {
                title: 'Dhuratë e Personalizuar',
                description: 'Libër me mesazh personal dhe paketim të veçantë',
                price: 'Nga 1,200 ALL',
                features: [
                  'Libër i zgjedhur',
                  'Mesazh personal',
                  'Paketim premium',
                  'Kartë e bukur',
                ],
                icon: Heart,
                popular: true,
              },
              {
                title: 'Kuti Dhuratë',
                description: 'Koleksion libra me tema të veçantë dhe paketim luksoz',
                price: 'Nga 2,500 ALL',
                features: [
                  '3-5 libra',
                  'Paketim luksoz',
                  'Mesazh personal',
                  'Kartë e bukur',
                  'Dërgim falas',
                ],
                icon: Package,
                popular: false,
              },
            ].map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                className="relative"
              >
                <GlassCard className={`p-6 h-full ${option.popular ? 'ring-2 ring-red-500' : ''}`}>
                  {option.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Më e Popullarizuar
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <option.icon className="h-12 w-12 text-red-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{option.title}</h3>
                    <p className="text-gray-600 mb-4">{option.description}</p>
                    <div className="text-2xl font-bold text-red-600 mb-4">{option.price}</div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {option.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                        <Sparkles className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <LiquidButton
                    variant={option.popular ? 'albanian' : 'primary'}
                    size="lg"
                    className="w-full"
                  >
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Zgjidhni këtë opsion
                  </LiquidButton>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Featured Gift Books */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Libra të Rekomanduar për Dhuratë
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[
              {
                title: 'Kënga e Malësorëve',
                author: 'Gjergj Fishta',
                price: '1,200 ALL',
                rating: 4.8,
                category: 'Klasik Shqiptar',
                perfectFor: 'Dashuria për kulturën',
              },
              {
                title: 'Gjenerata e Pavarësisë',
                author: 'Ismail Kadare',
                price: '1,500 ALL',
                rating: 4.9,
                category: 'Roman Historik',
                perfectFor: 'Dashuria për historinë',
              },
              {
                title: 'Poezi të Zgjedhura',
                author: 'Migjeni',
                price: '800 ALL',
                rating: 4.7,
                category: 'Poezi',
                perfectFor: 'Dashuria për poezinë',
              },
              {
                title: 'Historia e Shqipërisë',
                author: 'Kristo Frashëri',
                price: '2,000 ALL',
                rating: 4.6,
                category: 'Histori',
                perfectFor: 'Dashuria për mësimin',
              },
            ].map((book, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                className="group"
              >
                <GlassCard className="p-4 hover:scale-105 transition-transform duration-300">
                  {/* Book Cover Placeholder */}
                  <div className="relative mb-4">
                    <div className="w-full h-48 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-red-600" />
                    </div>

                    {/* Gift Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full flex items-center">
                        <Gift className="h-3 w-3 mr-1" />
                        Dhuratë
                      </span>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                        {book.category}
                      </span>
                    </div>
                  </div>

                  {/* Book Info */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600">{book.author}</p>

                    {/* Perfect For */}
                    <p className="text-xs text-red-600 font-medium">{book.perfectFor}</p>

                    {/* Rating */}
                    <div className="flex items-center space-x-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(book.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({book.rating})</span>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-bold text-red-600">{book.price}</span>
                      <div className="flex space-x-2">
                        <button className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                          <Gift className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Gift Process Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Si funksionon?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Zgjidhni librin',
                description: 'Përzgjidhni librin e përsosur për dashurinë tuaj',
                icon: BookOpen,
              },
              {
                step: '02',
                title: 'Personalizoni',
                description: 'Shtoni mesazhin tuaj personal dhe opsionet e paketimit',
                icon: MessageSquare,
              },
              {
                step: '03',
                title: 'Jepni detajet',
                description: 'Vendosni adresën e marrësit dhe informacionet e dërgimit',
                icon: User,
              },
              {
                step: '04',
                title: 'Dërgojmë',
                description: 'Ne dërgojmë dhuratën tuaj me kujdes dhe në kohë',
                icon: Truck,
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <GlassCard className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                    {step.step}
                  </div>
                  <step.icon className="h-8 w-8 text-red-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-center"
        >
          <GlassCard className="p-12 bg-gradient-to-r from-red-500/10 to-red-600/10">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Gati për të dhuruar?</h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Filloni të krijoni dhuratën tuaj të përsosur dhe bëni ditën e dikujt të veçantë
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LiquidButton variant="albanian" size="lg">
                <Gift className="w-5 h-5 mr-2" />
                Krijoni dhuratën tuaj
              </LiquidButton>
              <LiquidButton variant="primary" size="lg">
                <ArrowRight className="w-5 h-5 mr-2" />
                Shiko më shumë libra
              </LiquidButton>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
