'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  morphing?: boolean;
  glowEffect?: boolean;
  variant?: 'default' | 'frosted' | 'crystal' | 'bubble';
}

export const GlassCard = ({ 
  children, 
  className = '', 
  hover = true,
  morphing = false,
  glowEffect = false,
  variant = 'default'
}: GlassCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [morphKey, setMorphKey] = useState(0);

  // Auto-morph animation for liquid effect
  useEffect(() => {
    if (morphing) {
      const interval = setInterval(() => {
        setMorphKey(prev => prev + 1);
      }, 3000); // Change shape every 3 seconds

      return () => clearInterval(interval);
    }
  }, [morphing]);

  const variants = {
    default: {
      base: 'backdrop-blur-xl bg-white/10 border border-white/20',
      hover: 'hover:bg-white/20 hover:border-white/30',
      shadow: 'shadow-2xl',
    },
    frosted: {
      base: 'backdrop-blur-2xl bg-white/[0.08] border border-white/30',
      hover: 'hover:bg-white/[0.15] hover:border-white/40',
      shadow: 'shadow-[0_8px_32px_rgba(255,255,255,0.1)]',
    },
    crystal: {
      base: 'backdrop-blur-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 border border-white/25',
      hover: 'hover:from-white/30 hover:via-white/20 hover:to-white/10 hover:border-white/40',
      shadow: 'shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.2)]',
    },
    bubble: {
      base: 'backdrop-blur-xl bg-white/15 border border-white/30',
      hover: 'hover:bg-white/25 hover:border-white/50',
      shadow: 'shadow-[0_8px_32px_rgba(255,255,255,0.15),0_4px_16px_rgba(0,0,0,0.1)]',
    },
  };

  const currentVariant = variants[variant];

  // Dynamic border-radius morphing keyframes
  const morphingStyles = morphing ? {
    borderRadius: `${60 + Math.sin(morphKey * 0.5) * 20}% ${40 + Math.cos(morphKey * 0.7) * 15}% ${30 + Math.sin(morphKey * 0.3) * 25}% ${70 + Math.cos(morphKey * 0.9) * 10}% / ${60 + Math.sin(morphKey * 0.6) * 15}% ${30 + Math.cos(morphKey * 0.4) * 20}% ${70 + Math.sin(morphKey * 0.8) * 10}% ${40 + Math.cos(morphKey * 0.2) * 25}%`,
    transition: 'border-radius 3s ease-in-out',
  } : {};

  return (
    <motion.div
      className={`
        relative overflow-hidden
        ${currentVariant.base}
        ${hover ? currentVariant.hover : ''}
        ${currentVariant.shadow}
        ${morphing ? '' : 'rounded-2xl'}
        ${glowEffect ? 'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:blur-xl' : ''}
        ${className}
      `}
      style={{
        ...morphingStyles,
        ...(glowEffect && {
          position: 'relative',
        }),
      }}
      initial={{ 
        scale: 0.95, 
        opacity: 0,
      }}
      animate={{ 
        scale: 1, 
        opacity: 1,
      }}
      whileHover={hover ? { 
        scale: 1.02, 
        y: -2,
        transition: { 
          type: 'spring', 
          stiffness: 400, 
          damping: 25,
          duration: 0.3,
        }
      } : {}}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 30,
        duration: 0.6,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Liquid highlight effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)',
          ...morphingStyles,
        }}
        animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Glow effect overlay */}
      {glowEffect && (
        <motion.div
          className="absolute -inset-1 rounded-2xl opacity-20 blur-xl"
          style={{
            background: 'linear-gradient(45deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1), rgba(255,255,255,0.3))',
            ...morphingStyles,
          }}
          animate={{
            scale: isHovered ? 1.1 : 1,
            opacity: isHovered ? 0.4 : 0.2,
          }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
