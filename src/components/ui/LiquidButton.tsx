'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { PerformantAnimations, getResponsiveTransition } from '@/lib/animations/performance';

interface LiquidButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'albanian' | 'liquid';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  morphing?: boolean;
  glowEffect?: boolean;
}

export const LiquidButton = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
  morphing = false,
  glowEffect = false,
}: LiquidButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [morphKey, setMorphKey] = useState(0);

  // Auto-morph animation for liquid effect
  useEffect(() => {
    if (morphing && !disabled) {
      const interval = setInterval(() => {
        setMorphKey(prev => prev + 1);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [morphing, disabled]);

  const variants = {
    primary: {
      base: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
      hover: 'hover:from-blue-600 hover:to-purple-700',
      shadow: 'shadow-lg hover:shadow-xl',
    },
    secondary: {
      base: 'bg-white/10 backdrop-blur-xl border border-white/20 text-gray-900',
      hover: 'hover:bg-white/20 hover:border-white/30',
      shadow: 'shadow-lg hover:shadow-xl',
    },
    ghost: {
      base: 'bg-transparent text-gray-700',
      hover: 'hover:bg-white/10',
      shadow: '',
    },
    albanian: {
      base: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
      hover: 'hover:from-red-600 hover:to-red-700',
      shadow: 'shadow-lg hover:shadow-xl',
    },
    liquid: {
      base: 'bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl border border-white/30 text-gray-900',
      hover: 'hover:from-white/30 hover:via-white/20 hover:to-white/10 hover:border-white/50',
      shadow: 'shadow-[0_8px_32px_rgba(255,255,255,0.15),0_4px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(255,255,255,0.2),0_6px_20px_rgba(0,0,0,0.15)]',
    },
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const currentVariant = variants[variant];

  // Dynamic border-radius morphing
  const morphingStyles = morphing && !disabled ? {
    borderRadius: `${40 + Math.sin(morphKey * 0.7) * 15}% ${60 + Math.cos(morphKey * 0.9) * 10}% ${30 + Math.sin(morphKey * 0.5) * 20}% ${70 + Math.cos(morphKey * 0.3) * 15}% / ${50 + Math.sin(morphKey * 0.8) * 10}% ${40 + Math.cos(morphKey * 0.6) * 15}% ${60 + Math.sin(morphKey * 0.4) * 20}% ${35 + Math.cos(morphKey * 0.2) * 10}%`,
    transition: 'border-radius 2s ease-in-out',
  } : {};

  return (
    <motion.button
      className={`
        relative overflow-hidden
        ${currentVariant.base}
        ${currentVariant.hover}
        ${currentVariant.shadow}
        ${sizes[size]}
        ${morphing ? '' : 'rounded-2xl'}
        font-medium
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        select-none touch-manipulation
        inline-flex items-center justify-center
        ${className}
      `}
      style={morphingStyles}
      variants={PerformantAnimations.buttonPress}
      initial="rest"
      whileHover={disabled || loading ? "rest" : "hover"}
      whileTap={disabled || loading ? "rest" : "tap"}
      transition={getResponsiveTransition(PerformantAnimations.buttonPress.transition)}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Liquid highlight effect */}
      <motion.div
        className="absolute inset-0 opacity-0"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)',
          ...morphingStyles,
        }}
        animate={isHovered && !disabled ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Glow effect */}
      {glowEffect && !disabled && (
        <motion.div
          className="absolute -inset-1 opacity-0 blur-lg"
          style={{
            background: variant === 'albanian' 
              ? 'linear-gradient(45deg, rgba(239,68,68,0.4), rgba(220,38,38,0.4))' 
              : 'linear-gradient(45deg, rgba(59,130,246,0.4), rgba(147,51,234,0.4))',
            ...morphingStyles,
          }}
          animate={isHovered ? { opacity: 0.6 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={morphingStyles}
        whileTap={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center">
        {loading && (
          <motion.svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </motion.svg>
        )}
        {children}
      </div>
    </motion.button>
  );
};
