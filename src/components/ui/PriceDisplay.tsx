'use client';

import { useCurrency } from '@/hooks/useCurrency';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  priceALL: number;
  priceEUR?: number;
  showBoth?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'muted' | 'accent';
}

export function PriceDisplay({ 
  priceALL, 
  priceEUR, 
  showBoth = false,
  className = '',
  size = 'md',
  variant = 'default'
}: PriceDisplayProps) {
  const { formatDualPrice, isLoading } = useCurrency();
  
  if (isLoading) {
    return (
      <div className={cn('animate-pulse', className)}>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
    );
  }

  const { primary, secondary } = formatDualPrice(priceALL, priceEUR);
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  };

  const variantClasses = {
    default: 'text-gray-900',
    muted: 'text-gray-600',
    accent: 'text-blue-600'
  };

  return (
    <div className={cn('price-display', className)}>
      <span className={cn(
        'font-bold',
        sizeClasses[size],
        variantClasses[variant]
      )}>
        {primary}
      </span>
      {showBoth && (
        <span className={cn(
          'text-gray-500 ml-2',
          size === 'lg' ? 'text-base' : size === 'md' ? 'text-sm' : 'text-xs'
        )}>
          ({secondary})
        </span>
      )}
    </div>
  );
}