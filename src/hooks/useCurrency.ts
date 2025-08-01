'use client';

import { useState, useEffect } from 'react';
import { SupportedCurrency, DEFAULT_EXCHANGE_RATE } from '@/lib/currency/config';
import { convertPrice, formatPrice, formatDualPrice } from '@/lib/currency/utils';

interface UseCurrencyReturn {
  exchangeRate: number;
  userCurrency: SupportedCurrency;
  setUserCurrency: (currency: SupportedCurrency) => void;
  convertPrice: (priceALL: number, targetCurrency?: SupportedCurrency) => number;
  formatPrice: (price: number, currency?: SupportedCurrency) => string;
  formatDualPrice: (priceALL: number, priceEUR?: number) => { primary: string; secondary: string };
  isLoading: boolean;
}

export function useCurrency(): UseCurrencyReturn {
  const [exchangeRate, setExchangeRate] = useState(DEFAULT_EXCHANGE_RATE);
  const [userCurrency, setUserCurrencyState] = useState<SupportedCurrency>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Load user currency preference from localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem('userCurrency') as SupportedCurrency;
    if (savedCurrency && (savedCurrency === 'ALL' || savedCurrency === 'EUR')) {
      setUserCurrencyState(savedCurrency);
    }
    setIsLoading(false);
  }, []);

  // Fetch exchange rate from API
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch('/api/exchange-rate');
        if (response.ok) {
          const data = await response.json();
          setExchangeRate(data.rate || DEFAULT_EXCHANGE_RATE);
        }
      } catch (error) {
        console.warn('Failed to fetch exchange rate, using default:', error);
        setExchangeRate(DEFAULT_EXCHANGE_RATE);
      }
    };

    fetchExchangeRate();
    
    // Refresh exchange rate every hour
    const interval = setInterval(fetchExchangeRate, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const setUserCurrency = (currency: SupportedCurrency) => {
    setUserCurrencyState(currency);
    localStorage.setItem('userCurrency', currency);
  };

  const convertPriceWithRate = (priceALL: number, targetCurrency: SupportedCurrency = userCurrency) => {
    return convertPrice(priceALL, targetCurrency, exchangeRate);
  };

  const formatPriceWithCurrency = (price: number, currency: SupportedCurrency = userCurrency) => {
    return formatPrice(price, currency);
  };

  const formatDualPriceWithRate = (priceALL: number, priceEUR?: number) => {
    return formatDualPrice(priceALL, priceEUR, userCurrency, exchangeRate);
  };

  return {
    exchangeRate,
    userCurrency,
    setUserCurrency,
    convertPrice: convertPriceWithRate,
    formatPrice: formatPriceWithCurrency,
    formatDualPrice: formatDualPriceWithRate,
    isLoading
  };
}