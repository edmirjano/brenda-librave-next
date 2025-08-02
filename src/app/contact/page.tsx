import { Metadata } from 'next';
import Link from 'next/link';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Clock,
  FileText,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Star,
  Users,
} from 'lucide-react';

import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';

export const metadata: Metadata = {
  title: 'Kontakti | Brënda Librave',
  description: 'Na kontaktoni për çdo pyetje, sugjerim ose ndihmë që mund të keni.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-50">
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
            <MessageSquare className="h-12 w-12 text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Na{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
              Kontaktoni
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Jemi këtu për të ju ndihmuar. Na kontaktoni për çdo pyetje, sugjerim ose ndihmë që mund
            të keni.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Dërgoni një Mesazh</h2>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Emri
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                      placeholder="Emri juaj"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Mbiemri
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                      placeholder="Mbiemri juaj"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon (Opsional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                    placeholder="+355 6X XXX XXX"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subjekti
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                  >
                    <option value="">Zgjidhni një subjekt</option>
                    <option value="general">Pyetje e përgjithshme</option>
                    <option value="order">Pyetje për porosi</option>
                    <option value="support">Mbështetje teknike</option>
                    <option value="suggestion">Sugjerim</option>
                    <option value="complaint">Ankesë</option>
                    <option value="partnership">Partneritet</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mesazhi
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm resize-none"
                    placeholder="Shkruani mesazhin tuaj këtu..."
                  ></textarea>
                </div>

                <LiquidButton variant="albanian" size="lg" className="w-full">
                  <Send className="w-5 h-5 mr-2" />
                  Dërgo Mesazhin
                </LiquidButton>
              </form>
            </GlassCard>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-6"
          >
            {/* Contact Details */}
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Informacionet e Kontaktit</h2>
              <div className="space-y-6">
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
                  {
                    title: 'Orari i Punës',
                    content: 'E Hënë - E Premte: 9:00 - 18:00\nE Shtunë: 9:00 - 14:00',
                    icon: Clock,
                  },
                ].map((contact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                    className="flex items-start space-x-4"
                  >
                    <contact.icon className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{contact.title}</h3>
                      <p className="text-gray-600 whitespace-pre-line">{contact.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Quick Actions */}
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Veprime të Shpejta</h2>
              <div className="space-y-4">
                {[
                  {
                    title: 'FAQ',
                    description: 'Pyetje të shpeshta',
                    icon: FileText,
                    href: '/faq',
                  },
                  {
                    title: 'Mbështetje',
                    description: 'Ndihmë teknike',
                    icon: CheckCircle,
                    href: '/support',
                  },
                  {
                    title: 'Rreth Nesh',
                    description: 'Më shumë për ne',
                    icon: Users,
                    href: '/about',
                  },
                ].map((action, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                    className="group cursor-pointer"
                  >
                    <Link href={action.href}>
                      <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 hover:bg-white/70 transition-colors">
                        <div className="flex items-center space-x-3">
                          <action.icon className="h-5 w-5 text-red-600" />
                          <div>
                            <h3 className="font-semibold text-gray-900">{action.title}</h3>
                            <p className="text-sm text-gray-600">{action.description}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Customer Satisfaction */}
            <GlassCard className="p-8 bg-gradient-to-r from-red-500/10 to-red-600/10">
              <div className="text-center">
                <Star className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Klientë të Kënaqur</h3>
                <p className="text-gray-600 mb-4">
                  Më shumë se 50,000 klientë të kënaqur në të gjithë Shqipërinë
                </p>
                <div className="flex items-center justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 text-sm font-semibold text-gray-700">4.9/5</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Map Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12"
        >
          <GlassCard className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Vendndodhja Jonë</h2>
            <div className="w-full h-64 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-red-600 mx-auto mb-4" />
                <p className="text-gray-700 font-medium">Harta do të shtohet së shpejti</p>
                <p className="text-sm text-gray-600">Rr. Myslym Shyri, Nr. 23, Tiranë</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-center mt-12"
        >
          <GlassCard className="p-12 bg-gradient-to-r from-red-500/10 to-red-600/10">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Jemi këtu për ju!</h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Na kontaktoni për çdo pyetje ose sugjerim. Ekipi ynë është gjithmonë gati për të ju
              ndihmuar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LiquidButton variant="albanian" size="lg">
                <Phone className="w-5 h-5 mr-2" />
                Na telefononi
              </LiquidButton>
              <LiquidButton variant="primary" size="lg">
                <Mail className="w-5 h-5 mr-2" />
                Na shkruani
              </LiquidButton>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
