'use client';

import Link from 'next/link';

import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';

interface BackToHomeButtonProps {
  className?: string;
}

export function BackToHomeButton({ className = '' }: BackToHomeButtonProps) {
  return (
    <motion.div
      className={`${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
    >
      <Link
        href="/"
        className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/80 backdrop-blur-sm border border-white/20 text-gray-700 hover:text-gray-900 hover:bg-white/90 transition-all duration-200 shadow-sm hover:shadow-md group"
      >
        <motion.div
          whileHover={{ x: -2 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowLeft className="h-4 w-4" />
        </motion.div>
        <Home className="h-4 w-4" />
        <span className="text-sm font-medium">Kthehu në faqen kryesore</span>
      </Link>
    </motion.div>
  );
}