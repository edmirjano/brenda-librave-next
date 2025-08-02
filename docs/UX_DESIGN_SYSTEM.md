# Brënda Librave - UX Design System

Complete design system for mobile-like transitions and Apple Liquid Glass
aesthetics.

## 🎨 Design Philosophy

### Core Principles

- **Mobile-First Native Feel**: Web app that feels like a native mobile
  application
- **Albanian Cultural Identity**: Design elements that resonate with Albanian
  users
- **Apple Liquid Glass Aesthetics**: Premium, modern visual language
- **Accessibility First**: WCAG 2.1 AA compliance throughout
- **Performance Optimized**: 60fps animations and smooth interactions

## 📱 Mobile-like Page Transitions

### Stack Navigation System

```typescript
// lib/navigation/stack-navigation.ts
export const StackNavigation = {
  // iOS-style slide transitions
  slideTransitions: {
    enter: {
      x: '100%',
      opacity: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    center: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    exit: {
      x: '-100%',
      opacity: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  },

  // Android-style material transitions
  materialTransitions: {
    enter: {
      y: 50,
      opacity: 0,
      scale: 0.95,
      transition: { type: 'spring', stiffness: 400, damping: 25 },
    },
    center: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 400, damping: 25 },
    },
    exit: {
      y: -50,
      opacity: 0,
      scale: 1.05,
      transition: { type: 'spring', stiffness: 400, damping: 25 },
    },
  },
};
```

### Gesture Support Implementation

```typescript
// components/navigation/GestureNavigation.tsx
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

export const GestureNavigation = ({ children, onSwipeBack }) => {
  const [{ x }, api] = useSpring(() => ({ x: 0 }));

  const bind = useDrag(({ active, movement: [mx], cancel, canceled }) => {
    // Swipe right to go back (iOS style)
    if (mx > 100 && !canceled) {
      cancel();
      onSwipeBack();
    }

    api.start({
      x: active ? Math.max(0, mx) : 0,
      immediate: active
    });
  }, {
    axis: 'x',
    bounds: { left: 0, right: window.innerWidth * 0.3 },
    rubberband: true
  });

  return (
    <animated.div
      {...bind()}
      style={{
        x,
        touchAction: 'pan-y pinch-zoom'
      }}
      className="h-full w-full"
    >
      {children}
    </animated.div>
  );
};
```

### Loading States & Skeleton Screens

```typescript
// components/ui/SkeletonLoader.tsx
export const BookCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 rounded-lg aspect-[3/4] mb-3"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
  </div>
);

export const PageSkeleton = () => (
  <div className="animate-pulse space-y-4 p-4">
    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  </div>
);
```

## 💰 Albanian Lek Currency System

### Currency Configuration

```typescript
// lib/currency/config.ts
export const CurrencyConfig = {
  primary: 'ALL', // Albanian Lek
  secondary: 'EUR', // Euro

  symbols: {
    ALL: 'L', // Albanian Lek symbol
    EUR: '€',
  },

  formatting: {
    ALL: {
      locale: 'sq-AL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
    EUR: {
      locale: 'sq-AL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  },
};
```

### Currency Conversion Hook

```typescript
// hooks/useCurrency.ts
import { useEffect, useState } from 'react';

export const useCurrency = () => {
  const [exchangeRate, setExchangeRate] = useState(1);
  const [userCurrency, setUserCurrency] = useState('ALL');

  const convertPrice = (
    priceALL: number,
    targetCurrency: string = userCurrency
  ) => {
    if (targetCurrency === 'ALL') return priceALL;
    if (targetCurrency === 'EUR') return priceALL / exchangeRate;
    return priceALL;
  };

  const formatPrice = (price: number, currency: string = userCurrency) => {
    const config = CurrencyConfig.formatting[currency];
    const symbol = CurrencyConfig.symbols[currency];

    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: config.minimumFractionDigits,
      maximumFractionDigits: config.maximumFractionDigits,
    })
      .format(price)
      .replace(currency, symbol);
  };

  return {
    exchangeRate,
    userCurrency,
    setUserCurrency,
    convertPrice,
    formatPrice,
  };
};
```

### Price Display Component

```typescript
// components/ui/PriceDisplay.tsx
import { useCurrency } from '@/hooks/useCurrency';

interface PriceDisplayProps {
  priceALL: number;
  priceEUR?: number;
  showBoth?: boolean;
  className?: string;
}

export const PriceDisplay = ({
  priceALL,
  priceEUR,
  showBoth = false,
  className = ''
}: PriceDisplayProps) => {
  const { userCurrency, formatPrice, convertPrice } = useCurrency();

  const primaryPrice = userCurrency === 'ALL' ? priceALL : (priceEUR || convertPrice(priceALL, 'EUR'));
  const secondaryPrice = userCurrency === 'ALL' ? (priceEUR || convertPrice(priceALL, 'EUR')) : priceALL;

  return (
    <div className={`price-display ${className}`}>
      <span className="text-lg font-bold text-gray-900">
        {formatPrice(primaryPrice, userCurrency)}
      </span>
      {showBoth && (
        <span className="text-sm text-gray-500 ml-2">
          ({formatPrice(secondaryPrice, userCurrency === 'ALL' ? 'EUR' : 'ALL')})
        </span>
      )}
    </div>
  );
};
```

## 🎭 Apple Liquid Glass Components

### Glass Card Component

```typescript
// components/ui/GlassCard.tsx
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
```

### Liquid Button Component

```typescript
// components/ui/LiquidButton.tsx
import { motion } from 'framer-motion';

interface LiquidButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
}

export const LiquidButton = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false
}: LiquidButtonProps) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
    secondary: 'bg-white/10 backdrop-blur-xl border border-white/20 text-gray-900',
    ghost: 'bg-transparent hover:bg-white/10 text-gray-700'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      className={`
        ${variants[variant]} ${sizes[size]}
        rounded-2xl font-medium
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-lg hover:shadow-xl
      `}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};
```

## 🎨 Color System

### Albanian-Inspired Palette

```css
/* globals.css */
:root {
  /* Albanian Flag Colors */
  --albanian-red: #e41e20;
  --albanian-red-dark: #c41e3a;

  /* Cultural Colors */
  --mountain-gray: #6b7280;
  --adriatic-blue: #0ea5e9;
  --olive-green: #84cc16;
  --golden-eagle: #f59e0b;

  /* Liquid Glass Colors */
  --glass-white: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
  --glass-shadow: rgba(0, 0, 0, 0.1);

  /* Semantic Colors */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
}
```

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        albanian: {
          red: '#e41e20',
          'red-dark': '#c41e3a',
        },
        cultural: {
          mountain: '#6b7280',
          adriatic: '#0ea5e9',
          olive: '#84cc16',
          golden: '#f59e0b',
        },
        glass: {
          white: 'rgba(255, 255, 255, 0.1)',
          border: 'rgba(255, 255, 255, 0.2)',
          shadow: 'rgba(0, 0, 0, 0.1)',
        },
      },
      backdropBlur: {
        xs: '2px',
        '4xl': '72px',
      },
      animation: {
        'liquid-morph': 'liquidMorph 3s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        liquidMorph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
      },
    },
  },
};
```

## 📱 Touch Interactions

### Haptic-like Feedback

```typescript
// lib/interactions/haptic-feedback.ts
export const HapticFeedback = {
  // Visual feedback for touch interactions
  light: (element: HTMLElement) => {
    element.style.transform = 'scale(0.98)';
    element.style.opacity = '0.8';
    setTimeout(() => {
      element.style.transform = 'scale(1)';
      element.style.opacity = '1';
    }, 100);
  },

  medium: (element: HTMLElement) => {
    element.style.transform = 'scale(0.95)';
    element.style.opacity = '0.7';
    setTimeout(() => {
      element.style.transform = 'scale(1)';
      element.style.opacity = '1';
    }, 150);
  },

  heavy: (element: HTMLElement) => {
    element.style.transform = 'scale(0.92)';
    element.style.opacity = '0.6';
    setTimeout(() => {
      element.style.transform = 'scale(1)';
      element.style.opacity = '1';
    }, 200);
  },
};
```

### Touch-Optimized Components

```typescript
// components/ui/TouchCard.tsx
import { motion } from 'framer-motion';
import { HapticFeedback } from '@/lib/interactions/haptic-feedback';

export const TouchCard = ({ children, onTap, ...props }) => (
  <motion.div
    className="touch-card cursor-pointer select-none"
    whileTap={{ scale: 0.98 }}
    onTapStart={(event) => {
      HapticFeedback.light(event.target as HTMLElement);
    }}
    onTap={onTap}
    {...props}
  >
    {children}
  </motion.div>
);
```

## 🎯 Performance Optimizations

### Animation Performance

```typescript
// lib/animations/performance.ts
export const PerformantAnimations = {
  // Use transform and opacity for 60fps animations
  slideIn: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      // Use GPU acceleration
      willChange: 'transform, opacity',
    },
  },

  // Reduce motion for accessibility
  respectsReducedMotion: {
    transition: {
      duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 0
        : 0.3,
    },
  },
};
```

### Lazy Loading Components

```typescript
// components/ui/LazyImage.tsx
import { useState, useRef, useEffect } from 'react';

export const LazyImage = ({ src, alt, className, placeholder }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {!isLoaded && placeholder && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
};
```

This comprehensive UX design system provides:

1. **Mobile-like Navigation**: Native app-style transitions and gestures
2. **Albanian Lek Integration**: Complete currency system with conversion
3. **Apple Liquid Glass**: Premium visual components
4. **Performance Optimized**: 60fps animations and lazy loading
5. **Accessibility First**: Reduced motion support and WCAG compliance
6. **Touch Optimized**: Haptic-like feedback and touch-friendly interactions

The system ensures Brënda Librave feels like a premium native mobile application
while maintaining web accessibility and performance standards.
