'use client';

import Link from 'next/link';

import { motion } from 'framer-motion';
import {
  Cookie,
  Eye,
  Facebook,
  FileText,
  Heart,
  HelpCircle,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Scale,
  Shield,
} from 'lucide-react';

import { GlassCard } from '@/components/ui/GlassCard';
import { LogoWithText } from '@/components/ui/Logo';

const socialLinks = [
  {
    name: 'WhatsApp',
    href: 'https://wa.me/355692345678',
    icon: MessageCircle,
    color: 'hover:text-green-600',
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/brendalibrave',
    icon: Instagram,
    color: 'hover:text-pink-600',
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com/brendalibrave',
    icon: Facebook,
    color: 'hover:text-blue-600',
  },
];

const legalLinks = [
  { name: 'Pyetje të Shpeshta (FAQ)', href: '/faq', icon: HelpCircle },
  { name: 'Politika e Privatësisë', href: '/privacy-policy', icon: Shield },
  { name: 'Politika e Cookies', href: '/cookie-policy', icon: Cookie },
  { name: 'Termat dhe Kushtet', href: '/terms-conditions', icon: Scale },
  { name: 'Politika e Kthimit', href: '/return-policy', icon: FileText },
  { name: 'Transparenca', href: '/transparency', icon: Eye },
];

const quickLinks = [
  { name: 'Rreth Nesh', href: '/about' },
  { name: 'Kontakti', href: '/contact' },
  { name: 'Forumi', href: '/forum' },
  { name: 'Dhuro një Libër', href: '/gift' },
  { name: 'Ndihmë', href: '/help' },
  { name: 'Karriera', href: '/careers' },
];

const contactInfo = [
  {
    icon: Mail,
    text: 'info@brendalibrave.com',
    href: 'mailto:info@brendalibrave.com',
  },
  {
    icon: Phone,
    text: '+355 69 234 5678',
    href: 'tel:+355692345678',
  },
  {
    icon: MapPin,
    text: 'Tiranë, Shqipëri',
    href: 'https://maps.google.com/?q=Tirana,Albania',
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 border-t border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <GlassCard className="p-6 h-full">
              <LogoWithText 
                variant="default" 
                size="lg" 
                textColor="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800"
                animated={true}
              />
              <p className="text-gray-600 mb-6 leading-relaxed mt-4">
                Libraria juaj shqiptare online për libra fizikë dhe dixhitalë. Zbuloni botën e
                librave me çmime të favorshme dhe shërbim të shkëlqyer.
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-xl bg-white/50 text-gray-600 ${social.color} transition-all duration-200 hover:scale-110 hover:bg-white/70`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title={social.name}
                  >
                    <social.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-6 h-full">
              <h4 className="text-lg font-semibold text-gray-900 mb-6">Lidhje të Shpejta</h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-red-600 transition-all duration-200 block py-1 hover:translate-x-1 transform"
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>

          {/* Legal & Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-6 h-full">
              <h4 className="text-lg font-semibold text-gray-900 mb-6">Informacione Ligjore</h4>
              <ul className="space-y-3">
                {legalLinks.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href={link.href}
                      className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-all duration-200 py-1 hover:translate-x-1 transform"
                    >
                      <link.icon className="h-4 w-4" />
                      <span className="text-sm">{link.name}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-6 h-full">
              <h4 className="text-lg font-semibold text-gray-900 mb-6">Kontaktoni</h4>
              <div className="space-y-4">
                {contactInfo.map((contact, index) => (
                  <motion.a
                    key={contact.text}
                    href={contact.href}
                    target={contact.href.startsWith('http') ? '_blank' : undefined}
                    rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center space-x-3 text-gray-600 hover:text-red-600 transition-colors duration-200 group"
                    whileHover={{ x: 5 }}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="p-2 rounded-lg bg-white/50 group-hover:bg-red-50 transition-colors duration-200">
                      <contact.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm">{contact.text}</span>
                  </motion.a>
                ))}
              </div>

              {/* Newsletter Signup */}
              <div className="mt-6 pt-6 border-t border-white/30">
                <h5 className="text-sm font-semibold text-gray-900 mb-3">Newsletter</h5>
                <p className="text-xs text-gray-600 mb-3">
                  Merrni lajme të reja dhe oferta speciale
                </p>
                <Link
                  href="/newsletter"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Abonohuni
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-white/20"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>© {currentYear} Brënda Librave.</span>
              <span>Të gjitha të drejtat e rezervuara.</span>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Bërë me</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              <span>në Shqipëri</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
