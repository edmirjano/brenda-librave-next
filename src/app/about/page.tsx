import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AboutPageClient } from '@/components/pages/AboutPageClient';

export const metadata: Metadata = {
  title: 'Rreth Nesh | Brënda Librave',
  description:
    'Mësoni më shumë për Brënda Librave, misionin tonë dhe ekipin që bën të mundur këtë platformë.',
};

export default async function AboutPage() {
  const t = await getTranslations('about');
  
  return <AboutPageClient translations={t} />;
}
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
          <Logo variant="default" size="xl" animated={true} />

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Rreth{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
              Nesh
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Ne jemi pasionarë për librat dhe kulturën shqiptare. Misioni ynë është të bëjmë librat
            të aksesueshëm për të gjithë
          </p>
        </motion.div>

        {/* Our Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Historia Jonë</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Brënda Librave u themelua në vitin 2024 nga një grup pasionarësh për librat dhe
                  kulturën shqiptare. Ne pamë nevojën për një platformë moderne që të bëjë librat
                  shqiptarë të aksesueshëm për të gjithë.
                </p>
                <p>
                  Nga librat klasikë të Ismail Kadaresë deri te veprat moderne të autorëve të rinj,
                  ne kemi krijuar një hapësirë ku çdo lexues mund të gjejë diçka për veten e tyre.
                </p>
                <p>
                  Misioni ynë është të promovojmë leximin dhe të mbajmë gjallë kulturën shqiptare
                  përmes librave të cilësisë së lartë dhe shërbimit të përsosur.
                </p>
              </div>
            </div>
            <div className="relative">
              <GlassCard className="p-8">
                <div className="w-full h-64 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-red-600" />
                </div>
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Kultura Shqiptare</h3>
                  <p className="text-gray-600">
                    Promovojmë dhe mbajmë gjallë kulturën tonë të pasur
                  </p>
                </div>
              </GlassCard>
            </div>
          </div>
        </motion.div>

        {/* Our Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Vlerat Tona</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Cilësia',
                description: 'Ofrojmë vetëm libra të cilësisë së lartë dhe shërbim të përsosur',
                icon: Award,
                color: 'red',
              },
              {
                title: 'Pasioni',
                description: 'Jemi pasionarë për librat dhe kulturën shqiptare',
                icon: Heart,
                color: 'pink',
              },
              {
                title: 'Inovacioni',
                description: 'Përdorim teknologjitë më të fundit për të përmirësuar përvojën',
                icon: Lightbulb,
                color: 'yellow',
              },
              {
                title: 'Komuniteti',
                description: 'Krijojmë një komunitet të ngrohtë të lexuesve',
                icon: Users,
                color: 'blue',
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
              >
                <GlassCard className="p-6 text-center h-full">
                  <value.icon className={`h-12 w-12 text-${value.color}-600 mx-auto mb-4`} />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Our Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-16"
        >
          <GlassCard className="p-12 bg-gradient-to-r from-red-500/10 to-red-600/10">
            <div className="text-center">
              <Target className="h-16 w-16 text-red-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Misioni Ynë</h2>
              <p className="text-xl text-gray-700 max-w-4xl mx-auto mb-8">
                Të bëjmë librat shqiptarë të aksesueshëm për të gjithë, duke promovuar leximin dhe
                duke mbajtur gjallë kulturën tonë të pasur. Ne besojmë se çdo person ka të drejtë të
                ketë akses në libra të cilësisë së lartë, pavarësisht nga vendndodhja apo mundësitë
                financiare.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {[
                  { number: '10,000+', label: 'Libra në koleksion' },
                  { number: '50,000+', label: 'Klientë të kënaqur' },
                  { number: '100%', label: 'Shërbim i përsosur' },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">{stat.number}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Pse të Zgjidhni Brënda Librave?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Koleksion i Gjerë',
                description: 'Më shumë se 10,000 libra nga autorë shqiptarë dhe ndërkombëtarë',
                icon: BookOpen,
              },
              {
                title: 'Dërgim i Shpejtë',
                description: 'Dërgojmë librat tuaj brenda 24-48 orësh në të gjithë Shqipërinë',
                icon: Truck,
              },
              {
                title: 'Cilësi e Garantuar',
                description: 'Të gjitha librat tona janë origjinalë dhe të cilësisë së lartë',
                icon: Shield,
              },
              {
                title: 'Shërbim Kundër',
                description: 'Ekipi ynë është gjithmonë gati për të ju ndihmuar',
                icon: MessageSquare,
              },
              {
                title: 'Çmime të Arsyetshme',
                description: 'Ofrojmë çmimet më të mira për librat e cilësisë së lartë',
                icon: Star,
              },
              {
                title: 'Komunitet Aktiv',
                description: 'Bashkohuni me komunitetin tonë të pasionarëve për libra',
                icon: Users,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
              >
                <GlassCard className="p-6 h-full">
                  <feature.icon className="h-10 w-10 text-red-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Na Kontaktoni</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Adresa',
                content: 'Rr. Myslym Shyri, Nr. 23, Tiranë, Shqipëri',
                icon: MapPin,
              },
              {
                title: 'Email',
                content: 'info@brendalibrave.al',
                icon: Mail,
              },
              {
                title: 'Telefon',
                content: '+355 4 123 4567',
                icon: Phone,
              },
            ].map((contact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
              >
                <GlassCard className="p-6 text-center">
                  <contact.icon className="h-8 w-8 text-red-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{contact.title}</h3>
                  <p className="text-gray-600">{contact.content}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="text-center"
        >
          <GlassCard className="p-12 bg-gradient-to-r from-red-500/10 to-red-600/10">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Bashkohuni me ne!</h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Zbuloni botën e mrekullueshme të librave shqiptarë dhe bashkohuni me komunitetin tonë
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LiquidButton variant="albanian" size="lg">
                <BookOpen className="w-5 h-5 mr-2" />
                Shiko librat
              </LiquidButton>
              <LiquidButton variant="primary" size="lg">
                <ArrowRight className="w-5 h-5 mr-2" />
                Na kontaktoni
              </LiquidButton>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
