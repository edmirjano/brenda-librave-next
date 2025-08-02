'use client';

import { forwardRef } from 'react';

import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface GlassFormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | undefined;
  helperText?: string;
  icon?: React.ReactNode;
}

export const GlassFormField = forwardRef<HTMLInputElement, GlassFormFieldProps>(
  ({ label, error, helperText, className, icon, ...props }, ref) => {
    return (
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-800">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 z-10">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            className={clsx(
              // Glass morphism effect
              'w-full backdrop-blur-xl bg-white/20 border border-white/30',
              'rounded-2xl shadow-lg',
              'px-4 py-4 text-gray-900 placeholder-gray-500',
              icon && 'pl-12',

              // Focus states with Albanian red accent
              'focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50',
              'focus:bg-white/30',

              // Hover and transition effects
              'hover:bg-white/30 hover:border-white/40',
              'transition-all duration-200',

              // Touch optimization
              'touch-manipulation select-none',

              // Disabled states
              'disabled:bg-gray-100/50 disabled:text-gray-400 disabled:cursor-not-allowed',

              // Error states
              error &&
                'border-red-400/50 focus:ring-red-500/50 focus:border-red-500/50 bg-red-50/30',

              className
            )}
            {...props}
          />
        </div>

        {error && (
          <motion.p
            className="text-sm text-red-600 font-medium"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            {error}
          </motion.p>
        )}

        {helperText && !error && <p className="text-sm text-gray-600">{helperText}</p>}
      </motion.div>
    );
  }
);

GlassFormField.displayName = 'GlassFormField';
