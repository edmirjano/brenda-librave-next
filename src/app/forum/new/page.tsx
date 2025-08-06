import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getServerSession } from 'next-auth';

import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  FileText,
  MessageSquare,
  Plus,
  Save,
  Tag,
  User,
} from 'lucide-react';

import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';
import { authOptions } from '@/lib/auth/config';

export const metadata: Metadata = {
  title: 'Krijo Diskutim të Ri | Brënda Librave',
  description: 'Filloni një diskutim të ri në forumin tonë të lexuesve.',
};

export default async function NewForumTopicPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login?callbackUrl=/forum/new');
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
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-6">
            <LiquidButton variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kthehu te Forumi
            </LiquidButton>
          </div>

          <div className="text-center">
            <motion.div
              className="w-24 h-24 mx-auto bg-gradient-to-r from-red-500 to-red-600 rounded-3xl flex items-center justify-center shadow-2xl mb-6"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Plus className="h-12 w-12 text-white" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Krijo{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
                Diskutim të Ri
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Ndani mendimet tuaja, bëni pyetje ose filloni një diskutim të ri me komunitetin tonë të lexuesve
            </p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <GlassCard className="p-8">
            <form className="space-y-6">
              {/* Topic Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Titulli i Diskutimit
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                  placeholder="Shkruani titullin e diskutimit tuaj..."
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">Maksimumi 200 karaktere</p>
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4 inline mr-2" />
                  Kategoria
                </label>
                <select
                  id="category"
                  name="category"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                >
                  <option value="">Zgjidhni një kategori</option>
                  <option value="literatura-shqiptare">Literatura Shqiptare</option>
                  <option value="rekomandime">Rekomandime</option>
                  <option value="kritika">Kritika</option>
                  <option value="autoret">Autorët</option>
                  <option value="klasiket">Klasikët</option>
                  <option value="poezi">Poezi</option>
                  <option value="histori">Histori</option>
                  <option value="filozofi">Filozofi</option>
                  <option value="shkence">Shkencë</option>
                  <option value="te-tjera">Të tjera</option>
                </select>
              </div>

              {/* Related Book (Optional) */}
              <div>
                <label htmlFor="book" className="block text-sm font-medium text-gray-700 mb-2">
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  Libri i Lidhur (Opsional)
                </label>
                <input
                  type="text"
                  id="book"
                  name="book"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                  placeholder="Kërkoni dhe zgjidhni një libër..."
                />
                <p className="text-xs text-gray-500 mt-1">Filloni të shkruani për të kërkuar libra</p>
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4 inline mr-2" />
                  Etiketat (Opsional)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                  placeholder="klasik, shqiptar, roman, histori..."
                />
                <p className="text-xs text-gray-500 mt-1">Ndajini etiketat me presje</p>
              </div>

              {/* Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Përmbajtja e Diskutimit
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows={12}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm resize-none"
                  placeholder="Shkruani diskutimin tuaj këtu... Mund të përfshini:
- Pyetjen tuaj
- Mendimin tuaj për një libër
- Rekomandime për lexuesit e tjerë
- Kritika konstruktive
- Përvojat tuaja me leximin..."
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">Minimum 50 karaktere</p>
              </div>

              {/* Privacy Options */}
              <div className="bg-blue-50 p-4 rounded-xl">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Opsionet e Privatësisë</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="allowComments"
                      defaultChecked
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Lejo komente në këtë diskutim</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="notifyReplies"
                      defaultChecked
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Më njofto përmes email-it për përgjigje të reja
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <LiquidButton variant="ghost" size="lg" className="flex-1">
                  <Save className="w-5 h-5 mr-2" />
                  Ruaj si Draft
                </LiquidButton>
                <LiquidButton variant="albanian" size="lg" className="flex-1">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Publiko Diskutimin
                </LiquidButton>
              </div>
            </form>
          </GlassCard>
        </motion.div>

        {/* Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8"
        >
          <GlassCard className="p-6 bg-gradient-to-r from-green-500/10 to-green-600/10">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Udhëzimet për Diskutime të Mira
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Jini të qartë dhe specifik në pyetjet tuaja
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Respektoni mendimet e ndryshme
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Shtoni kontekst për librat që diskutoni
                </li>
              </ul>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Evitoni spoiler-at pa paralajmërim
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Përdorni kategoritë e duhura
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Jini konstruktiv në kritikat tuaja
                </li>
              </ul>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}