import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { TermsConditionsPageClient } from '@/components/pages/TermsConditionsPageClient';

export const metadata: Metadata = {
  title: 'Termat dhe Kushtet | Brënda Librave',
  description: 'Lexoni termat dhe kushtet për përdorimin e shërbimeve tona.',
};

export default async function TermsConditionsPage() {
  const t = await getTranslations('terms');
  
  return <TermsConditionsPageClient translations={t} />;
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
            <Scale className="h-12 w-12 text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Termat dhe{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
              Kushtet
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Lexoni me kujdes termat dhe kushtet për përdorimin e shërbimeve tona
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
                Mirë se vini në Brënda Librave! Këto terma dhe kushte ("Termat") rregullojnë përdorimin
                tuaj të faqes sonë të internetit dhe shërbimeve që ofrojmë. Duke përdorur shërbimet tona,
                ju pajtoheni të respektoni këto terma.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Ju lutemi lexojini me kujdes këto terma para se të përdorni shërbimet tona. Nëse keni
                pyetje rreth këtyre termave, na kontaktoni në info@brendalibrave.al.
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
                  <FileText className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>

                <div className="space-y-4">
                  {section.content.map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex} className="text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Additional Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8 space-y-8"
        >
          {/* Privacy and Data */}
          <GlassCard className="p-8">
            <div className="flex items-start space-x-4 mb-6">
              <Shield className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-bold text-gray-900">9. Privatësia dhe të Dhënat</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Mbledhja dhe përdorimi i informacioneve tuaja personale rregullohet nga Politika jonë e
                Privatësisë, e cila është pjesë integrale e këtyre termave.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Duke përdorur shërbimet tona, ju pajtoheni me praktikat e përshkruara në Politikën tonë
                të Privatësisë.
              </p>
            </div>
          </GlassCard>

          {/* Applicable Law */}
          <GlassCard className="p-8">
            <div className="flex items-start space-x-4 mb-6">
              <Scale className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-bold text-gray-900">10. Ligji i Zbatueshëm</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Këto terma rregullohen nga ligjet e Republikës së Shqipërisë.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Çdo mosmarrëveshje do të zgjidhet në gjykatat kompetente të Tiranës, Shqipëri.
              </p>
            </div>
          </GlassCard>

          {/* Contact */}
          <GlassCard className="p-8">
            <div className="flex items-start space-x-4 mb-6">
              <User className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-bold text-gray-900">11. Kontakti</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Për pyetje rreth këtyre termave dhe kushteve, na kontaktoni:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Brënda Librave</strong></p>
                <p className="text-gray-700">Adresa: Rr. Myslym Shyri, Nr. 23, Tiranë, Shqipëri</p>
                <p className="text-gray-700">Email: info@brendalibrave.al</p>
                <p className="text-gray-700">Telefon: +355 69 234 5678</p>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Keni pyetje rreth termave?</h2>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Nëse keni pyetje rreth këtyre termave dhe kushteve, mos hezitoni të na kontaktoni
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <LiquidButton variant="albanian" size="lg">
                  <Mail className="w-5 h-5 mr-2" />
                  Na Kontaktoni
                </LiquidButton>
                <LiquidButton variant="primary" size="lg">
                  <FileText className="w-5 h-5 mr-2" />
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