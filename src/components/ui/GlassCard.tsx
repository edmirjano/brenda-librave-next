'use client';

import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const GlassCard = ({ children, className = '', hover = true }: GlassCardProps) => (
  <motion.div
    className={`
      backdrop-blur-xl bg-white/10
      border border-white/20
      rounded-2xl shadow-2xl
      ${hover ? 'hover:bg-white/20 hover:border-white/30' : ''}
      ${className}
    `}
    whileHover={hover ? { scale: 1.02, y: -2 } : {}}
    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
  >
    {children}
  </motion.div>
);
