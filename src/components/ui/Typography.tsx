import { cn } from '@/lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

// Book and Literary Content Typography (Crimson Pro)
export const BookTitle = ({ children, className }: TypographyProps) => (
  <h1 className={cn(
    'font-serif text-3xl md:text-4xl lg:text-5xl font-bold',
    'text-gray-900 leading-tight tracking-tight',
    'mb-4 md:mb-6',
    className
  )}>
    {children}
  </h1>
);

export const BookSubtitle = ({ children, className }: TypographyProps) => (
  <h2 className={cn(
    'font-serif text-xl md:text-2xl lg:text-3xl font-medium',
    'text-gray-700 leading-relaxed',
    'mb-3 md:mb-4',
    className
  )}>
    {children}
  </h2>
);

export const BookDescription = ({ children, className }: TypographyProps) => (
  <p className={cn(
    'font-serif text-base md:text-lg leading-relaxed',
    'text-gray-600 mb-4',
    className
  )}>
    {children}
  </p>
);

export const Quote = ({ children, className }: TypographyProps) => (
  <blockquote className={cn(
    'font-serif text-lg md:text-xl italic',
    'text-gray-700 border-l-4 border-albanian-red pl-6 my-6',
    'leading-relaxed',
    className
  )}>
    {children}
  </blockquote>
);

// Interface and Navigation Typography (Outfit)
export const PageTitle = ({ children, className }: TypographyProps) => (
  <h1 className={cn(
    'font-sans text-2xl md:text-3xl lg:text-4xl font-bold',
    'text-gray-900 tracking-tight',
    'mb-4 md:mb-6',
    className
  )}>
    {children}
  </h1>
);

export const SectionTitle = ({ children, className }: TypographyProps) => (
  <h2 className={cn(
    'font-sans text-xl md:text-2xl font-semibold',
    'text-gray-800 tracking-tight',
    'mb-3 md:mb-4',
    className
  )}>
    {children}
  </h2>
);

export const CardTitle = ({ children, className }: TypographyProps) => (
  <h3 className={cn(
    'font-sans text-lg md:text-xl font-semibold',
    'text-gray-800 tracking-tight',
    'mb-2',
    className
  )}>
    {children}
  </h3>
);

export const BodyText = ({ children, className }: TypographyProps) => (
  <p className={cn(
    'font-sans text-sm md:text-base',
    'text-gray-600 leading-relaxed',
    'mb-3',
    className
  )}>
    {children}
  </p>
);

export const Caption = ({ children, className }: TypographyProps) => (
  <p className={cn(
    'font-sans text-xs md:text-sm',
    'text-gray-500 leading-normal',
    className
  )}>
    {children}
  </p>
);

// Navigation and Button Text
export const NavText = ({ children, className }: TypographyProps) => (
  <span className={cn(
    'font-sans text-sm md:text-base font-medium',
    'tracking-wide',
    className
  )}>
    {children}
  </span>
);

export const ButtonText = ({ children, className }: TypographyProps) => (
  <span className={cn(
    'font-sans text-sm md:text-base font-semibold',
    'tracking-wide uppercase',
    className
  )}>
    {children}
  </span>
);

// Price Display (Special formatting for Albanian Lek)
export const PriceText = ({ children, className }: TypographyProps) => (
  <span className={cn(
    'font-sans text-lg md:text-xl font-bold',
    'text-albanian-red tracking-tight',
    className
  )}>
    {children}
  </span>
);

// Albanian Cultural Text
export const AlbanianText = ({ children, className }: TypographyProps) => (
  <span className={cn(
    'font-serif text-base md:text-lg',
    'text-gray-800 leading-relaxed',
    // Ensure proper rendering of Albanian characters
    'font-feature-settings: "kern", "liga", "dlig"',
    className
  )}>
    {children}
  </span>
);
