'use client';

import type { SupportedCurrency } from '@/lib/currency/config';
import { getCurrencySymbol } from '@/lib/currency/utils';

import { useCurrency } from '@/hooks/useCurrency';

export function CurrencyToggle() {
  const { userCurrency, setUserCurrency } = useCurrency();

  const toggleCurrency = () => {
    const newCurrency: SupportedCurrency = userCurrency === 'ALL' ? 'EUR' : 'ALL';
    setUserCurrency(newCurrency);
  };

  return (
    <button
      onClick={toggleCurrency}
      className="flex items-center space-x-1 px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
      title={`Ndryshoni në ${userCurrency === 'ALL' ? 'Euro' : 'Lek'}`}
    >
      <span>{getCurrencySymbol(userCurrency)}</span>
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
        />
      </svg>
      <span className="text-xs">{userCurrency === 'ALL' ? 'EUR' : 'ALL'}</span>
    </button>
  );
}
