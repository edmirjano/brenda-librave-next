'use client';

import { useState, useEffect } from 'react';
import { Currency } from '@prisma/client';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/hooks/useCurrency';

interface PriceDisplayProps {
  basePrice: number;
  baseCurrency?: Currency;
  showBoth?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'muted' | 'accent';
  
  // Legacy props for backward compatibility
  priceALL?: number;
  priceEUR?: number;
}

export function PriceDisplay({
  basePrice,
  baseCurrency = 'ALL',
  showBoth = false,
  className = '',
  size = 'md',
  variant = 'default',
  // Legacy props
  priceALL,
  priceEUR,
}: PriceDisplayProps) {
  const { formatDualPrice, isLoading } = useCurrency();
  const [convertedPrices, setConvertedPrices] = useState<{
    primary: string;
    secondary: string;
  } | null>(null);

  // Handle legacy props
  const actualBasePrice = basePrice || priceALL || 0;
  const actualBaseCurrency = basePrice ? baseCurrency : 'ALL';

  useEffect(() => {
    const convertPrice = async () => {
      if (basePrice || priceALL) {
        try {
          const response = await fetch('/api/currency/convert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: actualBasePrice,
              baseCurrency: actualBaseCurrency
            })
          });
          
          if (response.ok) {
            const data = await response.json();
            setConvertedPrices({
              primary: data.primary,
              secondary: data.secondary
            });
          } else {
            // Fallback for legacy format
            if (priceALL && priceEUR) {
              const { primary, secondary } = formatDualPrice(priceALL, priceEUR);
              setConvertedPrices({ primary, secondary });
            }
          }
        } catch (error) {
          console.error('Error converting price:', error);
          // Fallback for legacy format
          if (priceALL && priceEUR) {
            const { primary, secondary } = formatDualPrice(priceALL, priceEUR);
            setConvertedPrices({ primary, secondary });
          }
        }
      }
    };

    convertPrice();
  }, [actualBasePrice, actualBaseCurrency, priceALL, priceEUR, formatDualPrice]);

  if (isLoading || !convertedPrices) {
    return (
      <div className={cn('animate-pulse', className)}>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
    );
  }

  const { primary, secondary } = convertedPrices;

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
  };

  const variantClasses = {
    default: 'text-gray-900',
    muted: 'text-gray-600',
    accent: 'text-blue-600',
  };

  return (
    <div className={cn('price-display', className)}>
      <span className={cn('font-bold', sizeClasses[size], variantClasses[variant])}>{primary}</span>
      {showBoth && (
        <span
          className={cn(
            'text-gray-500 ml-2',
            size === 'lg' ? 'text-base' : size === 'md' ? 'text-sm' : 'text-xs'
          )}
        >
          ({secondary})
        </span>
      )}
    </div>
  );
}
