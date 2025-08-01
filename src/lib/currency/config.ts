// Currency configuration for Albanian Lek and Euro support
export const CurrencyConfig = {
  primary: 'ALL' as const, // Albanian Lek
  secondary: 'EUR' as const, // Euro
  
  symbols: {
    ALL: 'L', // Albanian Lek symbol
    EUR: '€'
  } as const,
  
  formatting: {
    ALL: {
      locale: 'sq-AL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    },
    EUR: {
      locale: 'sq-AL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  } as const
} as const;

export type SupportedCurrency = 'ALL' | 'EUR';

export const DEFAULT_EXCHANGE_RATE = 100; // 1 EUR = 100 ALL (approximate)

export const CURRENCY_LABELS = {
  ALL: 'Albanian Lek',
  EUR: 'Euro'
} as const;