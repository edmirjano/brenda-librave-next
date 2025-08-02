'use client';

import { useEffect } from 'react';

import * as Sentry from '@sentry/nextjs';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Report error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="sq">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Gabim | Brënda Librave</title>
      </head>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-100 to-pink-50 flex items-center justify-center p-4">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-red-100/20 to-pink-100/20"></div>
          </div>

          <div className="relative max-w-md mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <GlassCard className="p-8">
                {/* Error Icon */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 25 }}
                  className="mb-6"
                >
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl mb-4">
                    <AlertTriangle className="h-8 w-8 text-white" />
                  </div>
                </motion.div>

                {/* Error Content */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Diçka shkoi keq</h1>
                  <p className="text-gray-700 mb-6">
                    Ka ndodhur një gabim në aplikacion. Ju lutemi provoni përsëri.
                  </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <LiquidButton onClick={reset} variant="albanian" size="lg" className="w-full">
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Provo Përsëri
                  </LiquidButton>

                  <LiquidButton
                    onClick={() => (window.location.href = '/')}
                    variant="secondary"
                    size="lg"
                    className="w-full"
                  >
                    <Home className="w-5 h-5 mr-2" />
                    Kthehu në Faqen Kryesore
                  </LiquidButton>
                </motion.div>

                {/* Footer Note */}
                <motion.p
                  className="text-sm text-gray-600 mt-6 backdrop-blur-xl bg-red-50/30 border border-red-200/30 rounded-xl p-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  Gabimi është raportuar automatikisht.
                </motion.p>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </body>
    </html>
  );
}
