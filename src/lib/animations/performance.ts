'use client';

/**
 * Performance-optimized animation configurations
 * Following project guidelines for 60fps animations
 */

// Check for reduced motion preference
export const getPrefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const PerformantAnimations = {
  // Header/Navigation animations
  header: {
    initial: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    hidden: { y: -100, opacity: 0 },
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
      mass: 0.8,
      // Use GPU acceleration for better performance
      willChange: 'transform, opacity',
    },
  },

  // Page transitions (iOS-style)
  pageSlide: {
    initial: { x: '100%', opacity: 0 },
    enter: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      willChange: 'transform, opacity',
    },
  },

  // Material-style transitions
  materialTransition: {
    initial: { y: 50, opacity: 0, scale: 0.95 },
    enter: { y: 0, opacity: 1, scale: 1 },
    exit: { y: -50, opacity: 0, scale: 1.05 },
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
      willChange: 'transform, opacity',
    },
  },

  // Card hover animations
  cardHover: {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.02, y: -2 },
    tap: { scale: 0.98 },
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      willChange: 'transform',
    },
  },

  // Button interactions
  buttonPress: {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
      willChange: 'transform',
    },
  },

  // Fade animations
  fadeInOut: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
      willChange: 'opacity',
    },
  },

  // Slide up from bottom (mobile sheets)
  slideUp: {
    initial: { y: '100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 0 },
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
      willChange: 'transform, opacity',
    },
  },

  // Stagger children animations
  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  },

  staggerChild: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
      willChange: 'transform, opacity',
    },
  },
};

// Helper function to get transition with reduced motion support
export const getResponsiveTransition = (baseTransition: any) => {
  const prefersReducedMotion = getPrefersReducedMotion();
  
  if (prefersReducedMotion) {
    return {
      ...baseTransition,
      duration: 0,
      type: 'tween',
    };
  }
  
  return baseTransition;
};

// Common animation variants that respect reduced motion
export const createResponsiveVariants = (variants: any) => {
  const prefersReducedMotion = getPrefersReducedMotion();
  
  if (prefersReducedMotion) {
    // Remove transforms, keep only opacity changes for reduced motion
    return Object.keys(variants).reduce((acc, key) => {
      const variant = variants[key];
      if (typeof variant === 'object' && !Array.isArray(variant)) {
        acc[key] = {
          opacity: variant.opacity !== undefined ? variant.opacity : 1,
          transition: { duration: 0 },
        };
      } else {
        acc[key] = variant;
      }
      return acc;
    }, {} as any);
  }
  
  return variants;
};

// Export commonly used spring configurations
export const SpringConfigs = {
  // Gentle spring for subtle animations
  gentle: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  },
  
  // Bouncy spring for playful interactions
  bouncy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 25,
  },
  
  // Snappy spring for quick interactions
  snappy: {
    type: 'spring' as const,
    stiffness: 500,
    damping: 35,
  },
  
  // Smooth spring for page transitions
  smooth: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
    mass: 0.8,
  },
};