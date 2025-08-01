import { CurrencyConfig, SupportedCurrency, DEFAULT_EXCHANGE_RATE } from './config';

/**
 * Convert price from Albanian Lek to target currency
 */
export function convertPrice(
  priceALL: number, 
  targetCurrency: SupportedCurrency = 'ALL',
  exchangeRate: number = DEFAULT_EXCHANGE_RATE
): number {
  if (targetCurrency === 'ALL') return priceALL;
  if (targetCurrency === 'EUR') return priceALL / exchangeRate;
  return priceALL;
}

/**
 * Format price with proper currency symbol and locale
 */
export function formatPrice(
  price: number, 
  currency: SupportedCurrency = 'ALL'
): string {
  const config = CurrencyConfig.formatting[currency];
  const symbol = CurrencyConfig.symbols[currency];
  
  // Format the number with proper decimals
  const formattedNumber = new Intl.NumberFormat(config.locale, {
    minimumFractionDigits: config.minimumFractionDigits,
    maximumFractionDigits: config.maximumFractionDigits
  }).format(price);
  
  // Return with currency symbol
  if (currency === 'ALL') {
    return `${formattedNumber} ${symbol}`;
  } else {
    return `${symbol}${formattedNumber}`;
  }
}

/**
 * Format dual currency display (primary + secondary in parentheses)
 */
export function formatDualPrice(
  priceALL: number,
  priceEUR?: number,
  userCurrency: SupportedCurrency = 'ALL',
  exchangeRate: number = DEFAULT_EXCHANGE_RATE
): { primary: string; secondary: string } {
  const primaryPrice = userCurrency === 'ALL' ? priceALL : (priceEUR || convertPrice(priceALL, 'EUR', exchangeRate));
  const secondaryPrice = userCurrency === 'ALL' ? (priceEUR || convertPrice(priceALL, 'EUR', exchangeRate)) : priceALL;
  
  return {
    primary: formatPrice(primaryPrice, userCurrency),
    secondary: formatPrice(secondaryPrice, userCurrency === 'ALL' ? 'EUR' : 'ALL')
  };
}

/**
 * Parse price string back to number (useful for form inputs)
 */
export function parsePrice(priceString: string): number {
  // Remove currency symbols and spaces, then parse
  const cleanedPrice = priceString.replace(/[L€\s]/g, '').replace(',', '.');
  return parseFloat(cleanedPrice) || 0;
}

/**
 * Validate if price is valid
 */
export function isValidPrice(price: number): boolean {
  return !isNaN(price) && isFinite(price) && price >= 0;
}

/**
 * Get currency symbol for a given currency
 */
export function getCurrencySymbol(currency: SupportedCurrency): string {
  return CurrencyConfig.symbols[currency];
}

/**
 * Round price to appropriate decimal places based on currency
 */
export function roundPrice(price: number, currency: SupportedCurrency): number {
  const decimals = CurrencyConfig.formatting[currency].maximumFractionDigits;
  return Math.round(price * Math.pow(10, decimals)) / Math.pow(10, decimals);
}