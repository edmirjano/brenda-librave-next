'use client';

import Link from 'next/link';

import { motion } from 'framer-motion';
import { AlertCircle, Home, LogIn, Shield } from 'lucide-react';

import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';

interface AuthErrorContentProps {
  error: string;
  errorData: {
    message: string;
    description: string;
  };
}

export function AuthErrorContent({ error, errorData }: AuthErrorContentProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-orange-100/20 to-yellow-100/20"></div>
      </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <GlassCard hover={false} className="p-8">
            {/* Header with Brand Icon */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 30 }}
              className="text-center mb-8"
            >
              <div className="mb-4">
                <motion.div
                  className="w-16 h-16 mx-auto bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl mb-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <AlertCircle className="h-8 w-8 text-white" />
                </motion.div>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">{errorData.message}</h1>
              <div className="flex items-center justify-center mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800 font-semibold">
                  Brënda Librave
                </span>
              </div>
            </motion.div>

            {/* Error Description */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="mb-8"
            >
              <div className="backdrop-blur-xl bg-red-50/30 border border-red-200/30 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-800 text-sm font-medium mb-1">
                      Problem me autentifikimin
                    </p>
                    <p className="text-gray-700 text-sm">{errorData.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
            >
              <Link href="/auth/login">
                <LiquidButton variant="albanian" size="lg" className="w-full">
                  <LogIn className="w-5 h-5 mr-2" />
                  Provoni përsëri
                </LiquidButton>
              </Link>

              <Link href="/">
                <LiquidButton variant="secondary" size="lg" className="w-full">
                  <Home className="w-5 h-5 mr-2" />
                  Kthehu në krye
                </LiquidButton>
              </Link>
            </motion.div>

            {/* Error Details */}
            {error !== 'Default' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="mt-6 text-center"
              >
                <p className="text-xs text-gray-500">
                  Kodi i gabimit: <span className="font-mono">{error}</span>
                </p>
              </motion.div>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
