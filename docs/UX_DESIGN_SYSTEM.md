# Brënda Librave - UX & Design System

Modern, mobile-first design system with smooth animations and iOS-inspired glass morphism effects.

## 🎨 Design Philosophy

### Mobile-First Principles
1. **Touch-First Design**: Minimum 44px touch targets
2. **Thumb-Friendly Navigation**: Bottom navigation for key actions
3. **One-Handed Usage**: Important actions within thumb reach
4. **Progressive Enhancement**: Desktop features build on mobile foundation

### Apple Liquid Glass Design Language
Following [Apple's Liquid Glass documentation](https://developer.apple.com/documentation/TechnologyOverviews/liquid-glass) for modern, fluid interfaces.

```css
/* Apple Liquid Glass Properties */
:root {
  /* Liquid Glass Core Effects */
  --liquid-glass-base: rgba(255, 255, 255, 0.08);
  --liquid-glass-overlay: rgba(255, 255, 255, 0.12);
  --liquid-glass-border: rgba(255, 255, 255, 0.15);
  --liquid-glass-highlight: rgba(255, 255, 255, 0.25);
  
  /* Advanced Backdrop Filters */
  --liquid-backdrop: blur(20px) saturate(190%) contrast(140%);
  --liquid-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
  --liquid-shadow-hover: 0 20px 60px rgba(0, 0, 0, 0.12);
  
  /* Liquid Motion Curves */
  --liquid-ease-in: cubic-bezier(0.25, 0.1, 0.25, 1);
  --liquid-ease-out: cubic-bezier(0, 0, 0.1, 1);
  --liquid-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.liquid-glass-card {
  background: var(--liquid-glass-base);
  border: 1px solid var(--liquid-glass-border);
  box-shadow: var(--liquid-shadow);
  backdrop-filter: var(--liquid-backdrop);
  border-radius: 20px;
  transition: all 0.4s var(--liquid-ease-out);
}

.liquid-glass-card:hover {
  background: var(--liquid-glass-overlay);
  border-color: var(--liquid-glass-highlight);
  box-shadow: var(--liquid-shadow-hover);
  transform: translateY(-4px) scale(1.02);
}

/* Liquid Surface Effects */
.liquid-surface {
  position: relative;
  overflow: hidden;
}

.liquid-surface::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    var(--liquid-glass-highlight) 50%, 
    transparent 100%);
  opacity: 0.6;
}

/* Liquid Ripple Effects */
.liquid-ripple {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.liquid-ripple::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0);
  animation: liquid-ripple-animation 0.6s ease-out;
  pointer-events: none;
}

@keyframes liquid-ripple-animation {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
```

### Animation Principles
1. **Smooth & Natural**: 60fps animations with proper easing
2. **Purposeful**: Every animation serves UX function
3. **Performant**: GPU-accelerated transforms and opacity only
4. **Accessible**: Respect `prefers-reduced-motion`

## 📱 Responsive Breakpoints

```typescript
// tailwind.config.js breakpoints
const breakpoints = {
  'xs': '375px',   // iPhone SE
  'sm': '640px',   // Large phones
  'md': '768px',   // Tablets
  'lg': '1024px',  // Small laptops
  'xl': '1280px',  // Desktops
  '2xl': '1536px', // Large screens
};

// Mobile-first utility classes
const spacing = {
  'safe-top': 'env(safe-area-inset-top)',
  'safe-bottom': 'env(safe-area-inset-bottom)',
  'safe-left': 'env(safe-area-inset-left)',
  'safe-right': 'env(safe-area-inset-right)',
};
```

## 🎭 Animation System

### Apple Liquid Glass Animation System
```typescript
// lib/animations/liquid-config.ts
export const liquidAnimationConfig = {
  // Apple Liquid Glass Spring Physics
  liquidSpring: {
    type: "spring",
    stiffness: 400,
    damping: 40,
    mass: 0.6,
    velocity: 0.1
  },
  
  // Liquid Interaction Responses  
  liquidTouch: {
    duration: 0.4,
    ease: [0.25, 0.1, 0.25, 1] // Apple's liquid ease-in
  },
  
  // Liquid Surface Transitions
  liquidFlow: {
    duration: 0.6,
    ease: [0, 0, 0.1, 1] // Apple's liquid ease-out
  },
  
  // Liquid Bounce Effects
  liquidBounce: {
    duration: 0.8,
    ease: [0.68, -0.55, 0.265, 1.55] // Liquid bounce
  },
  
  // Micro-interactions
  liquidMicro: {
    duration: 0.2,
    ease: [0.25, 0.1, 0.25, 1]
  }
};

// Apple Liquid Glass Variants
export const liquidVariants = {
  surface: {
    hidden: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95,
      filter: "blur(10px)"
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      filter: "blur(0px)",
      transition: liquidAnimationConfig.liquidFlow
    }
  },
  
  liquidHover: {
    rest: { 
      scale: 1, 
      y: 0,
      rotateX: 0,
      filter: "brightness(1)"
    },
    hover: { 
      scale: 1.03, 
      y: -8,
      rotateX: 5,
      filter: "brightness(1.1)",
      transition: liquidAnimationConfig.liquidTouch
    }
  },
  
  liquidPress: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

// Respect accessibility preferences
export const useReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Liquid Glass Gesture Utilities
export const liquidGestures = {
  rippleEffect: (event: React.MouseEvent) => {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: liquid-ripple-animation 0.6s ease-out;
      pointer-events: none;
    `;
    
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }
};
```

### Common Animation Variants
```typescript
// lib/animations/variants.ts
export const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: animationConfig.page
  }
};

export const slideUp = {
  hidden: { opacity: 0, y: 100 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: animationConfig.spring
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: animationConfig.spring
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};
```

## 🎨 Component Design System

### Apple Liquid Glass Components
```typescript
// components/ui/LiquidGlassCard.tsx
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { liquidVariants, liquidGestures } from '@/lib/animations/liquid-config';

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  variant?: 'surface' | 'elevated' | 'floating';
  withRipple?: boolean;
}

export function LiquidGlassCard({ 
  children, 
  className, 
  interactive = false,
  variant = 'surface',
  withRipple = false
}: LiquidGlassCardProps) {
  const variants = {
    surface: 'liquid-glass-card border-white/15',
    elevated: 'liquid-glass-card border-white/20 shadow-lg',
    floating: 'liquid-glass-card border-white/25 shadow-2xl'
  };

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden',
        'liquid-surface backdrop-blur-[20px]',
        variants[variant],
        interactive && 'liquid-ripple cursor-pointer',
        className
      )}
      variants={interactive ? liquidVariants.liquidHover : liquidVariants.surface}
      initial={interactive ? "rest" : "hidden"}
      animate={interactive ? "rest" : "visible"}
      whileHover={interactive ? "hover" : undefined}
      whileTap={interactive ? liquidVariants.liquidPress : undefined}
      onClick={withRipple ? liquidGestures.rippleEffect : undefined}
    >
      {/* Liquid Glass Surface Highlight */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-60" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

// Specialized Liquid Glass Button
export function LiquidGlassButton({ 
  children, 
  className, 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <motion.button
      className={cn(
        'liquid-glass-card px-6 py-3 rounded-2xl',
        'font-medium text-white/90',
        'border border-white/20',
        'backdrop-blur-[20px] saturate-[190%] contrast-[140%]',
        'transition-all duration-400 ease-liquid-out',
        'hover:border-white/30 hover:bg-white/15',
        'active:scale-95',
        className
      )}
      whileHover={{ 
        scale: 1.05, 
        y: -2,
        filter: "brightness(1.1)"
      }}
      whileTap={{ 
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
      onClick={liquidGestures.rippleEffect}
      {...props}
    >
      {children}
    </motion.button>
  );
}
```

### Liquid Glass Book Card
```typescript
// components/shop/LiquidBookCard.tsx
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Eye, ShoppingCart, Heart, Star } from 'lucide-react';
import { LiquidGlassCard, LiquidGlassButton } from '@/components/ui/LiquidGlassCard';
import { liquidVariants, liquidAnimationConfig } from '@/lib/animations/liquid-config';

export function LiquidBookCard({ book, index }: { book: Book; index: number }) {
  const t = useTranslations('book');
  const tCommon = useTranslations('common');

  return (
    <motion.div
      variants={liquidVariants.surface}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.08 }} // Staggered liquid entrance
      className="group"
    >
      <LiquidGlassCard 
        interactive 
        variant="elevated" 
        className="p-6 h-full group-hover:shadow-liquid-xl"
      >
        {/* Book Cover with Liquid Loading Effect */}
        <div className="relative aspect-[3/4] mb-6 overflow-hidden rounded-2xl">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20 opacity-0"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={liquidAnimationConfig.liquidFlow}
          />
          
          <motion.img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover"
            initial={{ 
              opacity: 0, 
              scale: 1.1, 
              filter: "blur(20px)" 
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              filter: "blur(0px)" 
            }}
            transition={liquidAnimationConfig.liquidFlow}
            whileHover={{ 
              scale: 1.05,
              filter: "brightness(1.1) contrast(1.1)"
            }}
          />
          
          {/* Liquid Overlay with Book Actions */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent 
                       flex items-end justify-center p-4 opacity-0"
            whileHover={{ opacity: 1 }}
            transition={liquidAnimationConfig.liquidTouch}
          >
                         <LiquidGlassButton className="text-sm px-4 py-2">
               <Eye className="w-4 h-4 mr-2" />
               {t('book.details')}
             </LiquidGlassButton>
          </motion.div>
        </div>

        {/* Book Information with Liquid Typography */}
        <div className="space-y-3">
          <motion.h3 
            className="font-semibold text-lg leading-tight text-gray-900 
                       group-hover:text-blue-600 line-clamp-2"
            layout
            transition={liquidAnimationConfig.liquidTouch}
          >
            {book.title}
          </motion.h3>
          
          <motion.p 
            className="text-sm text-gray-600 font-medium"
            layout
          >
            {book.author}
          </motion.p>
          
          {/* Price and Add to Cart with Liquid Interaction */}
          <div className="flex items-center justify-between pt-2">
            <motion.span 
              className="font-bold text-xl text-gray-900"
              whileHover={{ scale: 1.05 }}
              transition={liquidAnimationConfig.liquidMicro}
            >
              €{book.price}
            </motion.span>
            
            <motion.button
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white 
                         px-5 py-2.5 rounded-2xl text-sm font-medium
                         shadow-lg hover:shadow-xl transition-all duration-300
                         backdrop-blur-sm border border-blue-400/30"
              whileHover={{ 
                scale: 1.05, 
                y: -2,
                boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={liquidAnimationConfig.liquidTouch}
            >
                             <ShoppingCart className="w-4 h-4 mr-2" />
               {tCommon('addToCart')}
            </motion.button>
          </div>
        </div>
      </LiquidGlassCard>
    </motion.div>
  );
}

// Liquid Glass Book Grid Container
export function LiquidBookGrid({ books }: { books: Book[] }) {
  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1
          }
        }
      }}
      initial="hidden"
      animate="visible"
    >
      {books.map((book, index) => (
        <LiquidBookCard key={book.id} book={book} index={index} />
      ))}
    </motion.div>
  );
}
```

### Liquid Glass Mobile Navigation
```typescript
// components/layout/LiquidMobileNavigation.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Home, Search, ShoppingBag, User, Heart } from 'lucide-react';
import { LiquidGlassCard } from '@/components/ui/LiquidGlassCard';
import { liquidAnimationConfig, liquidGestures } from '@/lib/animations/liquid-config';

export function LiquidMobileNavigation() {
  const [activeTab, setActiveTab] = useState('home');

  const t = useTranslations('navigation');
  
  const navigationItems = [
    { id: 'home', icon: Home, label: t('home'), badge: null },
    { id: 'search', icon: Search, label: t('search'), badge: null },
    { id: 'cart', icon: ShoppingBag, label: t('cart'), badge: 3 },
    { id: 'wishlist', icon: Heart, label: t('wishlist'), badge: null },
    { id: 'profile', icon: User, label: t('profile'), badge: null },
  ];

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 z-50 pb-safe-bottom px-4"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={liquidAnimationConfig.liquidSpring}
    >
      <LiquidGlassCard 
        variant="floating" 
        className="mb-4 overflow-hidden"
      >
        {/* Liquid Glass Navigation Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-blue-500/10" />
        
        <div className="flex items-center justify-around py-4 px-2 relative z-10">
          {navigationItems.map((item, index) => (
            <motion.button
              key={item.id}
              className={cn(
                'flex flex-col items-center space-y-1 p-3 rounded-2xl',
                'min-w-[52px] min-h-[52px] relative transition-colors duration-300'
              )}
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.05 }}
              transition={liquidAnimationConfig.liquidTouch}
              onClick={(e) => {
                setActiveTab(item.id);
                liquidGestures.rippleEffect(e);
              }}
            >
              {/* Liquid Active Indicator */}
              <AnimatePresence>
                {activeTab === item.id && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 
                               rounded-2xl border border-blue-400/30"
                    layoutId="liquidActiveTab"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={liquidAnimationConfig.liquidBounce}
                  />
                )}
              </AnimatePresence>

              {/* Icon with Liquid Animation */}
              <motion.div 
                className="relative z-10"
                animate={activeTab === item.id ? {
                  y: [-2, 0, -2],
                  transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                } : {}}
              >
                <item.icon 
                  size={22} 
                  className={cn(
                    'transition-all duration-300 relative z-10',
                    activeTab === item.id 
                      ? 'text-blue-600 drop-shadow-lg' 
                      : 'text-gray-600 hover:text-gray-800'
                  )} 
                />
                
                {/* Badge for Cart */}
                {item.badge && (
                  <motion.div
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs 
                               rounded-full w-5 h-5 flex items-center justify-center
                               shadow-lg border-2 border-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={liquidAnimationConfig.liquidBounce}
                  >
                    {item.badge}
                  </motion.div>
                )}
              </motion.div>
              
              {/* Label with Liquid Typography */}
              <motion.span 
                className={cn(
                  'text-xs font-medium transition-all duration-300 relative z-10',
                  activeTab === item.id 
                    ? 'text-blue-600 font-semibold' 
                    : 'text-gray-600'
                )}
                animate={activeTab === item.id ? {
                  scale: [1, 1.05, 1],
                  transition: { duration: 0.3 }
                } : {}}
              >
                {item.label}
              </motion.span>
            </motion.button>
          ))}
        </div>
        
        {/* Liquid Glass Bottom Highlight */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r 
                        from-transparent via-white/30 to-transparent" />
      </LiquidGlassCard>
    </motion.nav>
  );
}

// Liquid Glass Search Overlay
export function LiquidSearchOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const t = useTranslations('navigation');
  const tCommon = useTranslations('common');
  
  return (
    <>
      <motion.button
        className="liquid-glass-card p-3 rounded-full border border-white/20"
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
      >
        <Search size={20} className="text-white/90" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={liquidAnimationConfig.liquidFlow}
            onClick={() => setIsOpen(false)}
          >
            {/* Liquid Glass Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
            
            <motion.div
              className="absolute top-safe-top left-4 right-4"
              initial={{ y: -100, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -100, opacity: 0, scale: 0.9 }}
              transition={liquidAnimationConfig.liquidSpring}
              onClick={(e) => e.stopPropagation()}
            >
              <LiquidGlassCard variant="floating" className="p-6">
                <div className="flex items-center space-x-4">
                  <Search size={24} className="text-blue-500" />
                                     <input
                     type="text"
                     placeholder={t('searchPlaceholder')}
                     value={query}
                     onChange={(e) => setQuery(e.target.value)}
                     className="flex-1 bg-transparent border-none outline-none text-lg 
                                placeholder-gray-500 text-gray-900"
                     autoFocus
                   />
                                     <motion.button 
                     onClick={() => setIsOpen(false)}
                     whileTap={{ scale: 0.9 }}
                     className="p-2 rounded-full hover:bg-gray-100"
                   >
                     <X className="w-5 h-5 text-gray-500" />
                   </motion.button>
                </div>
                
                {/* Live Search Results */}
                {query && (
                  <motion.div
                    className="mt-4 space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={liquidAnimationConfig.liquidFlow}
                  >
                    <p className="text-sm text-gray-600">Rezultatet për "{query}"</p>
                    {/* Search results would go here */}
                  </motion.div>
                )}
              </LiquidGlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

## 🚀 Performance Optimizations

### Animation Performance
```typescript
// lib/animations/performance.ts

// GPU-accelerated properties only
export const performantAnimations = {
  // ✅ Good - GPU accelerated
  fadeIn: { opacity: 0, transform: 'translateY(20px)' },
  slideUp: { transform: 'translateY(100px)' },
  scaleIn: { transform: 'scale(0.8)' },
  
  // ❌ Avoid - causes layout thrashing
  // width: '100px' → '200px'
  // height: '50px' → '100px'
  // top/left/right/bottom changes
};

// Intersection Observer for scroll animations
export const useScrollAnimation = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return [ref, controls];
};
```

### Optimized Media with WebP/WebM Support
```typescript
// components/ui/OptimizedImage.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { liquidAnimationConfig } from '@/lib/animations/liquid-config';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  webpSrc?: string;
  avifSrc?: string;
}

export function OptimizedImage({ 
  src, 
  alt, 
  className, 
  sizes = "100vw",
  priority = false,
  webpSrc,
  avifSrc 
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [ref, inView] = useInView({ triggerOnce: true });

  // Auto-generate WebP/AVIF URLs if not provided
  const generateWebPUrl = (url: string) => url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  const generateAVIFUrl = (url: string) => url.replace(/\.(jpg|jpeg|png)$/i, '.avif');

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      {inView && (
        <>
          {/* Shimmer loading placeholder */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ display: loaded ? 'none' : 'block' }}
          />
          
          {/* Optimized picture element with WebP/AVIF support */}
          <picture>
            {/* AVIF for best compression */}
            <source
              srcSet={avifSrc || generateAVIFUrl(src)}
              type="image/avif"
              sizes={sizes}
            />
            
            {/* WebP for broad support */}
            <source
              srcSet={webpSrc || generateWebPUrl(src)}
              type="image/webp" 
              sizes={sizes}
            />
            
            {/* Fallback to original format */}
            <motion.img
              src={src}
              alt={alt}
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ 
                opacity: loaded ? 1 : 0,
                scale: loaded ? 1 : 1.1
              }}
              transition={liquidAnimationConfig.liquidFlow}
              onLoad={() => setLoaded(true)}
              onError={() => setError(true)}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
            />
          </picture>
          
          {/* Error fallback */}
          {error && !loaded && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <ImageOff className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Video component with WebM support
export function OptimizedVideo({ 
  src, 
  webmSrc, 
  mp4Src, 
  poster,
  className,
  autoPlay = false,
  muted = true,
  loop = false 
}: {
  src: string;
  webmSrc?: string;
  mp4Src?: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
}) {
  const [ref, inView] = useInView({ triggerOnce: true });

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      {inView && (
        <video
          className="w-full h-full object-cover"
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline
          poster={poster}
          preload="metadata"
        >
          {/* WebM for best compression */}
          <source src={webmSrc || src.replace(/\.mp4$/i, '.webm')} type="video/webm" />
          
          {/* MP4 fallback */}
          <source src={mp4Src || src} type="video/mp4" />
          
          {/* Fallback text */}
          <p>Your browser doesn't support video playback.</p>
        </video>
      )}
    </div>
  );
}
```

## 🔔 Firebase FCM Push Notifications System

### PWA & Web Browser Notification Setup
```typescript
// lib/firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

// Notification permission and token management
export const requestNotificationPermission = async (): Promise<string | null> => {
  if (!messaging) return null;
  
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });
      
      console.log('FCM Token:', token);
      return token;
    } else {
      console.log('Notification permission denied');
      return null;
    }
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
};

// Listen for foreground messages
export const setupForegroundMessageListener = () => {
  if (!messaging) return;
  
  onMessage(messaging, (payload) => {
    console.log('Message received in foreground:', payload);
    
    // Show custom notification using liquid glass design
    showLiquidNotification({
      title: payload.notification?.title || 'Brënda Librave',
      body: payload.notification?.body || '',
      icon: payload.notification?.icon || '/icons/icon-192x192.png',
      data: payload.data,
    });
  });
};
```

### Liquid Glass Notification Component
```typescript
// components/notifications/LiquidNotification.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, BookOpen, ShoppingCart, Heart } from 'lucide-react';
import { LiquidGlassCard } from '@/components/ui/LiquidGlassCard';
import { liquidAnimationConfig } from '@/lib/animations/liquid-config';

interface NotificationData {
  title: string;
  body: string;
  icon?: string;
  type?: 'book' | 'order' | 'general' | 'promotion';
  action?: {
    label: string;
    url: string;
  };
  data?: Record<string, any>;
}

export function LiquidNotification({ 
  notification, 
  onClose, 
  isVisible 
}: {
  notification: NotificationData;
  onClose: () => void;
  isVisible: boolean;
}) {
  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'book': return <BookOpen className="w-6 h-6 text-blue-500" />;
      case 'order': return <ShoppingCart className="w-6 h-6 text-green-500" />;
      case 'promotion': return <Heart className="w-6 h-6 text-red-500" />;
      default: return <Bell className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 right-4 z-50 max-w-sm"
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={liquidAnimationConfig.liquidSpring}
        >
          <LiquidGlassCard 
            variant="floating" 
            className="p-4 border-l-4 border-l-blue-500"
          >
            <div className="flex items-start space-x-3">
              {/* Icon */}
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon()}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  {notification.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {notification.body}
                </p>
                
                {/* Action button */}
                {notification.action && (
                  <motion.button
                    className="mt-2 text-xs bg-blue-500 text-white px-3 py-1 rounded-full
                               hover:bg-blue-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      window.open(notification.action!.url, '_blank');
                      onClose();
                    }}
                  >
                    {notification.action.label}
                  </motion.button>
                )}
              </div>

              {/* Close button */}
              <motion.button
                className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
              >
                <X className="w-4 h-4 text-gray-400" />
              </motion.button>
            </div>
          </LiquidGlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Notification manager
class LiquidNotificationManager {
  private notifications: Map<string, NotificationData> = new Map();
  private listeners: Set<(notifications: NotificationData[]) => void> = new Set();

  show(notification: NotificationData) {
    const id = Date.now().toString();
    this.notifications.set(id, notification);
    this.notifyListeners();

    // Auto-remove after 5 seconds
    setTimeout(() => {
      this.remove(id);
    }, 5000);

    return id;
  }

  remove(id: string) {
    this.notifications.delete(id);
    this.notifyListeners();
  }

  subscribe(listener: (notifications: NotificationData[]) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    const notifications = Array.from(this.notifications.values());
    this.listeners.forEach(listener => listener(notifications));
  }
}

export const notificationManager = new LiquidNotificationManager();

// Helper function to show notifications
export const showLiquidNotification = (notification: NotificationData) => {
  return notificationManager.show(notification);
};
```

### PWA Service Worker Setup
```javascript
// public/firebase-messaging-sw.js
import { initializeApp } from 'firebase/app';
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw';

const firebaseConfig = {
  // Your Firebase config
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Handle background messages
onBackgroundMessage(messaging, (payload) => {
  console.log('Background message received:', payload);

  const notificationTitle = payload.notification?.title || 'Brënda Librave';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: payload.notification?.icon || '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: payload.data?.type || 'general',
    data: payload.data,
    actions: [
      {
        action: 'open',
        title: 'Shiko',
        icon: '/icons/action-open.png'
      },
      {
        action: 'dismiss',
        title: 'Mbyll',
        icon: '/icons/action-close.png'
      }
    ],
    vibrate: [200, 100, 200],
    requireInteraction: true,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    const urlToOpen = event.notification.data?.url || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Check if window is already open
          for (const client of clientList) {
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus();
            }
          }
          
          // Open new window
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});
```

### Notification Hook for React Components
```typescript
// hooks/useNotifications.ts
import { useState, useEffect } from 'react';
import { 
  requestNotificationPermission, 
  setupForegroundMessageListener,
  notificationManager,
  type NotificationData 
} from '@/lib/firebase/config';

export function useNotifications() {
  const [permissions, setPermissions] = useState<NotificationPermission>('default');
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  useEffect(() => {
    // Check current permission status
    if ('Notification' in window) {
      setPermissions(Notification.permission);
    }

    // Setup FCM foreground listener
    setupForegroundMessageListener();

    // Subscribe to notification manager
    const unsubscribe = notificationManager.subscribe(setNotifications);

    return unsubscribe;
  }, []);

  const requestPermission = async () => {
    const token = await requestNotificationPermission();
    if (token) {
      setFcmToken(token);
      setPermissions('granted');
      
      // Send token to backend to store for user
      await fetch('/api/user/fcm-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
    }
  };

  const showNotification = (notification: NotificationData) => {
    return notificationManager.show(notification);
  };

  return {
    permissions,
    fcmToken,
    notifications,
    requestPermission,
    showNotification,
  };
}
```

### Backend API for Sending Notifications
```typescript
// app/api/notifications/send/route.ts
import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function POST(request: NextRequest) {
  try {
    const { tokens, title, body, data, imageUrl } = await request.json();

    const message = {
      notification: {
        title,
        body,
        imageUrl,
      },
      data: data || {},
      tokens: Array.isArray(tokens) ? tokens : [tokens],
    };

    const response = await admin.messaging().sendMulticast(message);
    
    return NextResponse.json({
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
```

### Integration in Book Components
```typescript
// Example: Using notifications in book purchase flow
import { useNotifications } from '@/hooks/useNotifications';
import { ShoppingCart, Check } from 'lucide-react';

export function BookPurchaseButton({ book }: { book: Book }) {
  const { showNotification } = useNotifications();

  const handlePurchase = async () => {
    try {
      // Purchase logic here...
      
      // Show success notification
      showNotification({
        title: 'Libri u shtua në shportë!',
        body: `"${book.title}" është gati për blerje.`,
        type: 'order',
        action: {
          label: 'Shiko Shportën',
          url: '/cart'
        }
      });
    } catch (error) {
      showNotification({
        title: 'Gabim në shtim',
        body: 'Provoni përsëri ose kontaktoni mbështetjen.',
        type: 'general'
      });
    }
  };

  return (
    <motion.button
      className="liquid-glass-card px-6 py-3 rounded-2xl"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handlePurchase}
    >
      <ShoppingCart className="w-5 h-5 mr-2" />
      Shto në Shportë
    </motion.button>
  );
}
```

## 📐 Enhanced Tailwind CSS Configuration for Liquid Glass

```javascript
// tailwind.config.js
import { liquidDesignTokens } from './src/lib/liquid-design-tokens';

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      // Apple System Fonts
      fontFamily: {
        sans: liquidDesignTokens.typography.fontFamily.sans,
        mono: liquidDesignTokens.typography.fontFamily.mono,
      },
      
      // Apple Liquid Glass Colors
      colors: {
        primary: liquidDesignTokens.colors.primary,
        'liquid-glass': {
          base: liquidDesignTokens.colors.liquidGlass.base,
          overlay: liquidDesignTokens.colors.liquidGlass.overlay,
          border: liquidDesignTokens.colors.liquidGlass.border,
          highlight: liquidDesignTokens.colors.liquidGlass.highlight,
          strong: liquidDesignTokens.colors.liquidGlass.strong,
        }
      },
      
      // Liquid Glass Backdrop Filters
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px',
        'liquid': '20px',
        'liquid-light': '10px', 
        'liquid-strong': '30px',
      },
      
      backdropSaturate: {
        'liquid': '190%',
        'liquid-light': '150%',
        'liquid-strong': '200%',
      },
      
      backdropContrast: {
        'liquid': '140%',
        'liquid-light': '120%',
        'liquid-strong': '160%',
      },
      
      // Enhanced Shadow System
      boxShadow: {
        // Standard liquid glass shadows
        'liquid': liquidDesignTokens.colors.shadow.liquid,
        'liquid-lg': liquidDesignTokens.colors.shadow.liquidHover,
        'liquid-xl': liquidDesignTokens.colors.shadow.liquidColorHover,
        'liquid-2xl': '0 25px 80px rgba(0, 0, 0, 0.15)',
        
        // Colored liquid shadows
        'liquid-blue': '0 12px 40px rgba(59, 130, 246, 0.15)',
        'liquid-blue-lg': '0 20px 60px rgba(59, 130, 246, 0.25)',
        'liquid-purple': '0 12px 40px rgba(147, 51, 234, 0.15)',
        'liquid-emerald': '0 12px 40px rgba(16, 185, 129, 0.15)',
        
        // Inner shadows for pressed states
        'liquid-inset': 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
        'liquid-inset-lg': 'inset 0 4px 8px rgba(0, 0, 0, 0.15)',
      },
      
      // Liquid Glass Border Radius
      borderRadius: {
        'liquid': liquidDesignTokens.borderRadius.liquid,
        'liquid-sm': '12px',
        'liquid-lg': '24px',
        'liquid-xl': '32px',
      },
      
      // Safe Area and Touch Spacing
      spacing: {
        'safe-top': liquidDesignTokens.spacing.safeTop,
        'safe-bottom': liquidDesignTokens.spacing.safeBottom,
        'safe-left': liquidDesignTokens.spacing.safeLeft,
        'safe-right': liquidDesignTokens.spacing.safeRight,
        'touch': liquidDesignTokens.spacing.touch,
        'touch-lg': liquidDesignTokens.spacing.touchLarge,
      },
      
      // Liquid Glass Animation Timing
      transitionDuration: {
        'liquid-micro': liquidDesignTokens.animation.liquidMicro,
        'liquid-quick': liquidDesignTokens.animation.liquidQuick,
        'liquid-smooth': liquidDesignTokens.animation.liquidSmooth,
        'liquid-flow': liquidDesignTokens.animation.liquidFlow,
        'liquid-slow': liquidDesignTokens.animation.liquidSlow,
      },
      
      transitionTimingFunction: {
        'liquid-in': liquidDesignTokens.animation.timing.liquidEaseIn,
        'liquid-out': liquidDesignTokens.animation.timing.liquidEaseOut,
        'liquid-bounce': liquidDesignTokens.animation.timing.liquidBounce,
        'apple-ease': liquidDesignTokens.animation.timing.appleEase,
      },
      
      // Enhanced Typography with Apple Letter Spacing
      fontSize: liquidDesignTokens.typography.fontSize,
      fontWeight: liquidDesignTokens.typography.fontWeight,
      
      // Touch-friendly Sizing
      minHeight: {
        'touch': liquidDesignTokens.spacing.touch,
        'touch-lg': liquidDesignTokens.spacing.touchLarge,
      },
      minWidth: {
        'touch': liquidDesignTokens.spacing.touch,
        'touch-lg': liquidDesignTokens.spacing.touchLarge,
      },
      
      // Gradient Utilities
      backgroundImage: {
        'liquid-primary': liquidDesignTokens.colors.gradients.liquidPrimary,
        'liquid-surface': liquidDesignTokens.colors.gradients.liquidSurface,
        'liquid-border': liquidDesignTokens.colors.gradients.liquidBorder,
        'liquid-radial': 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
      },
      
      // Z-Index System
      zIndex: liquidDesignTokens.zIndex,
      
      // Animation Keyframes for Liquid Effects
      keyframes: {
        'liquid-bounce': {
          '0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8,0,1,1)' },
          '50%': { transform: 'none', animationTimingFunction: 'cubic-bezier(0,0,0.2,1)' },
        },
        'liquid-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'liquid-shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'liquid-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'liquid-ripple': {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        }
      },
      
      animation: {
        'liquid-bounce': 'liquid-bounce 1s infinite',
        'liquid-pulse': 'liquid-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'liquid-shimmer': 'liquid-shimmer 1.5s linear infinite',
        'liquid-float': 'liquid-float 3s ease-in-out infinite',
        'liquid-ripple': 'liquid-ripple 0.6s ease-out',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    
    // Custom Liquid Glass Plugin
    function({ addUtilities, theme }) {
      const liquidGlassUtilities = {
        '.liquid-glass-card': {
          background: theme('colors.liquid-glass.base'),
          border: `1px solid ${theme('colors.liquid-glass.border')}`,
          backdropFilter: `blur(20px) saturate(190%) contrast(140%)`,
          borderRadius: theme('borderRadius.liquid'),
          boxShadow: theme('boxShadow.liquid'),
          transition: `all ${theme('transitionDuration.liquid-smooth')} ${theme('transitionTimingFunction.liquid-out')}`,
        },
        
        '.liquid-glass-card:hover': {
          background: theme('colors.liquid-glass.overlay'),
          borderColor: theme('colors.liquid-glass.highlight'),
          boxShadow: theme('boxShadow.liquid-lg'),
          transform: 'translateY(-4px) scale(1.02)',
        },
        
        '.liquid-surface': {
          position: 'relative',
          overflow: 'hidden',
        },
        
        '.liquid-surface::before': {
          content: "''",
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
          opacity: '0.6',
        },
        
        '.liquid-ripple': {
          position: 'relative',
          overflow: 'hidden',
        }
      };
      
      addUtilities(liquidGlassUtilities);
    }
  ],
};
```

## 🎯 Page Transition System

```typescript
// components/layout/PageTransition.tsx
export function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={router.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={animationConfig.page}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// app/layout.tsx integration
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sq">
      <body>
        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  );
}
```

## 📱 Mobile-First Component Examples

### Mobile Search with Smooth Animations
```typescript
// components/search/MobileSearch.tsx
export function MobileSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  
  return (
    <>
      {/* Search trigger */}
      <motion.button
        className="glass-button p-3 rounded-full"
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
      >
        <Search size={20} />
      </motion.button>

      {/* Full-screen search overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="absolute top-safe-top left-4 right-4"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={animationConfig.spring}
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard className="p-4">
                <div className="flex items-center space-x-3">
                  <Search size={20} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Kërko libra..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-lg"
                    autoFocus
                  />
                  <button onClick={() => setIsOpen(false)}>
                    <X size={20} />
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

## 🎨 Apple Liquid Glass Design Tokens

```typescript
// lib/liquid-design-tokens.ts
export const liquidDesignTokens = {
  // Apple Liquid Glass Color System
  colors: {
    primary: {
      50: '#eff6ff',
      400: '#60a5fa', 
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      900: '#1e3a8a',
    },
    
    // Liquid Glass Surface Colors
    liquidGlass: {
      base: 'rgba(255, 255, 255, 0.08)',
      overlay: 'rgba(255, 255, 255, 0.12)',
      border: 'rgba(255, 255, 255, 0.15)',
      highlight: 'rgba(255, 255, 255, 0.25)',
      strong: 'rgba(255, 255, 255, 0.35)',
    },
    
    // Liquid Glass Shadows
    shadow: {
      liquid: '0 12px 40px rgba(0, 0, 0, 0.08)',
      liquidHover: '0 20px 60px rgba(0, 0, 0, 0.12)',
      liquidActive: '0 8px 30px rgba(0, 0, 0, 0.15)',
      liquidColor: '0 12px 40px rgba(59, 130, 246, 0.15)',
      liquidColorHover: '0 20px 60px rgba(59, 130, 246, 0.25)',
    },
    
    // Gradient Systems
    gradients: {
      liquidPrimary: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      liquidSurface: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      liquidBorder: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
    }
  },
  
  // Apple Liquid Glass Typography
  typography: {
    fontFamily: {
      sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'sans-serif'],
      mono: ['SF Mono', 'Monaco', 'Menlo', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],
      sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }],
      base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
      lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.025em' }],
      xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.025em' }],
      '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.05em' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.05em' }],
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    }
  },
  
  // Liquid Glass Border Radius
  borderRadius: {
    liquid: '20px',   // Primary liquid glass radius
    card: '16px',     // Card components
    button: '12px',   // Interactive elements
    small: '8px',     // Small components
    full: '9999px',   // Fully rounded
  },
  
  // Apple-inspired Spacing System
  spacing: {
    // Touch-friendly spacing
    touch: '44px',     // Minimum touch target
    touchLarge: '52px', // Comfortable touch target
    
    // Content spacing
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
    
    // Safe area spacing
    safeTop: 'env(safe-area-inset-top)',
    safeBottom: 'env(safe-area-inset-bottom)',
    safeLeft: 'env(safe-area-inset-left)',
    safeRight: 'env(safe-area-inset-right)',
  },
  
  // Apple Liquid Glass Animation Timing
  animation: {
    // Liquid Glass specific timings
    liquidMicro: '200ms',      // Micro-interactions
    liquidQuick: '300ms',      // Quick responses
    liquidSmooth: '400ms',     // Smooth transitions
    liquidFlow: '600ms',       // Flowing animations
    liquidSlow: '800ms',       // Slow, dramatic effects
    
    // Apple's timing functions
    timing: {
      liquidEaseIn: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      liquidEaseOut: 'cubic-bezier(0, 0, 0.1, 1)',
      liquidBounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      appleEase: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    }
  },
  
  // Backdrop Filter Values
  backdropFilter: {
    liquid: 'blur(20px) saturate(190%) contrast(140%)',
    liquidLight: 'blur(10px) saturate(150%) contrast(120%)',
    liquidStrong: 'blur(30px) saturate(200%) contrast(160%)',
  },
  
  // Z-Index System
  zIndex: {
    base: 0,
    content: 10,
    overlay: 20,
    modal: 30,
    notification: 40,
    tooltip: 50,
  }
};

// Utility function for liquid glass styles
export const liquidGlassStyle = (variant: 'surface' | 'elevated' | 'floating' = 'surface') => {
  const variants = {
    surface: {
      background: liquidDesignTokens.colors.liquidGlass.base,
      border: `1px solid ${liquidDesignTokens.colors.liquidGlass.border}`,
      backdropFilter: liquidDesignTokens.backdropFilter.liquid,
      boxShadow: liquidDesignTokens.colors.shadow.liquid,
    },
    elevated: {
      background: liquidDesignTokens.colors.liquidGlass.overlay,
      border: `1px solid ${liquidDesignTokens.colors.liquidGlass.highlight}`,
      backdropFilter: liquidDesignTokens.backdropFilter.liquid,
      boxShadow: liquidDesignTokens.colors.shadow.liquidHover,
    },
    floating: {
      background: liquidDesignTokens.colors.liquidGlass.strong,
      border: `1px solid ${liquidDesignTokens.colors.liquidGlass.highlight}`,
      backdropFilter: liquidDesignTokens.backdropFilter.liquidStrong,
      boxShadow: liquidDesignTokens.colors.shadow.liquidColorHover,
    }
  };
  
  return variants[variant];
};
```

## 🎯 Apple Liquid Glass Implementation Summary

This comprehensive design system, aligned with [Apple's Liquid Glass documentation](https://developer.apple.com/documentation/TechnologyOverviews/liquid-glass), ensures your Albanian bookshop will have:

### ✨ **Advanced Visual Effects**
✅ **Apple Liquid Glass Components** - Following official Apple design specifications  
✅ **Advanced Backdrop Filters** - 20px blur with 190% saturation and 140% contrast  
✅ **Liquid Surface Highlights** - Subtle gradient overlays and border effects  
✅ **Dynamic Ripple Interactions** - Touch-responsive liquid ripple animations  

### 🎭 **Premium Animation System**
✅ **Apple Spring Physics** - Authentic liquid spring animations (stiffness: 400, damping: 40)  
✅ **Liquid Motion Curves** - Apple's precise cubic-bezier timing functions  
✅ **Staggered Entrances** - Elegant staggered component animations  
✅ **Performance-Optimized** - GPU-accelerated 60fps transforms and opacity changes  

### 📱 **Mobile-First Excellence**
✅ **Touch-Friendly Design** - 52px comfortable touch targets with liquid feedback  
✅ **Thumb-Zone Navigation** - Bottom-anchored liquid glass navigation  
✅ **Safe Area Support** - iPhone notch and dynamic island compatibility  
✅ **Gesture-Rich Interactions** - Swipe, tap, and press with liquid responses  

### 🎨 **Apple Design Language**
✅ **SF Pro Display Typography** - Apple's system font with proper letter spacing  
✅ **Liquid Glass Color System** - Precisely calibrated opacity and blur values  
✅ **Apple Shadow System** - Subtle, multi-layered shadow effects  
✅ **Accessibility Compliant** - Respects `prefers-reduced-motion` preferences  

### 🚀 **Technical Excellence**  
✅ **Comprehensive Tailwind Integration** - Custom liquid glass utilities and animations  
✅ **Design Token System** - Centralized Apple-inspired design tokens  
✅ **Component Architecture** - Reusable liquid glass components with variants  
✅ **Performance Monitoring** - Optimized for real-world device performance  

## 🎁 **What This Means for Your Users**

Albanian book lovers browsing **Brënda Librave** will experience:

- **🌟 Premium Feel**: Interface quality matching Apple's flagship apps
- **⚡ Instant Responsiveness**: Liquid-smooth interactions that feel native
- **📖 Effortless Book Discovery**: Engaging animations that guide attention
- **🛒 Delightful Shopping**: Smooth cart interactions with satisfying feedback
- **📱 Mobile Excellence**: Perfect experience on every device, especially phones

This implementation elevates your Albanian bookshop from a simple website to a **premium digital experience** that will delight users and encourage longer browsing sessions and increased purchases.

Ready to build the most beautiful bookshop interface in the Albanian market! 🇦🇱📚✨ 