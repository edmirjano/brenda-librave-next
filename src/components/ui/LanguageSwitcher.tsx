'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import { localeConfig, type Locale } from '@/lib/i18n/config';
import { useTranslations } from '@/hooks/useTranslations';

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('common');
  const [isOpen, setIsOpen] = useState(false);

  const supportedLocales: Locale[] = ['sq', 'en']; // Will be dynamic from database

  const handleLanguageChange = (newLocale: Locale) => {
    setIsOpen(false);
    router.replace(pathname, { locale: newLocale });
  };

  const currentLanguage = localeConfig[locale];

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Globe className="h-4 w-4" />
        <span className="font-medium text-sm">{currentLanguage.nativeName}</span>
        <ChevronDown 
          className={`h-3 w-3 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-1 right-0 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
          >
            <div className="py-2">
              {supportedLocales.map((lang) => {
                const langConfig = localeConfig[lang];
                const isActive = lang === locale;
                
                return (
                  <motion.button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors duration-150 ${
                      isActive 
                        ? 'bg-red-50 text-red-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    whileHover={{ backgroundColor: isActive ? undefined : '#f9fafb' }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {langConfig.nativeName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {langConfig.name}
                        </span>
                      </div>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-red-600" />
                    )}
                  </motion.button>
                );
              })}
            </div>
            
            {/* Future languages preview */}
            <div className="border-t border-gray-100 py-2">
              <div className="px-4 py-2">
                <p className="text-xs text-gray-500 mb-2">
                  {t('comingSoon')}:
                </p>
                <div className="flex flex-wrap gap-1">
                  {(['it', 'de', 'fr'] as Locale[]).map((lang) => (
                    <span 
                      key={lang}
                      className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-600"
                    >
                      {localeConfig[lang].nativeName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}