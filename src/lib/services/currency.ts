import { Currency } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { logError, logInfo } from '@/lib/logging/logger';

export interface PriceData {
  amount: number;
  currency: Currency;
}

export interface ConvertedPrice {
  ALL: number;
  EUR: number;
  baseAmount: number;
  baseCurrency: Currency;
}

export class CurrencyService {
  private static DEFAULT_EXCHANGE_RATE = 100; // 1 EUR = 100 ALL (default)
  private static exchangeRateCache: { rate: number; lastUpdated: Date } | null = null;
  private static CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Get the current EUR to ALL exchange rate
   */
  static async getExchangeRate(): Promise<number> {
    try {
      // Check cache first
      if (
        this.exchangeRateCache && 
        Date.now() - this.exchangeRateCache.lastUpdated.getTime() < this.CACHE_DURATION
      ) {
        return this.exchangeRateCache.rate;
      }

      // Try to get from settings first (admin-configured)
      const setting = await prisma.setting.findUnique({
        where: { key: 'exchange_rate_eur_to_all' }
      });

      let rate = this.DEFAULT_EXCHANGE_RATE;

      if (setting) {
        const parsedRate = parseFloat(setting.value);
        if (!isNaN(parsedRate) && parsedRate > 0) {
          rate = parsedRate;
        }
      } else {
        // Create default setting if it doesn't exist
        await this.setExchangeRate(this.DEFAULT_EXCHANGE_RATE);
      }

      // Update cache
      this.exchangeRateCache = {
        rate,
        lastUpdated: new Date()
      };

      return rate;
    } catch (error) {
      logError('Error getting exchange rate', error);
      return this.DEFAULT_EXCHANGE_RATE;
    }
  }

  /**
   * Set the exchange rate (admin function)
   */
  static async setExchangeRate(rate: number): Promise<void> {
    try {
      if (rate <= 0) {
        throw new Error('Exchange rate must be positive');
      }

      await prisma.setting.upsert({
        where: { key: 'exchange_rate_eur_to_all' },
        update: { 
          value: rate.toString(),
          updatedAt: new Date()
        },
        create: {
          key: 'exchange_rate_eur_to_all',
          value: rate.toString(),
          description: 'Exchange rate from EUR to ALL (1 EUR = X ALL)',
          category: 'currency'
        }
      });

      // Clear cache to force refresh
      this.exchangeRateCache = null;

      logInfo('Exchange rate updated', { newRate: rate });
    } catch (error) {
      logError('Error setting exchange rate', error);
      throw error;
    }
  }

  /**
   * Convert amount from one currency to another
   */
  static async convertAmount(
    amount: number, 
    fromCurrency: Currency, 
    toCurrency: Currency
  ): Promise<number> {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    const exchangeRate = await this.getExchangeRate();

    if (fromCurrency === 'EUR' && toCurrency === 'ALL') {
      return amount * exchangeRate;
    } else if (fromCurrency === 'ALL' && toCurrency === 'EUR') {
      return amount / exchangeRate;
    }

    return amount; // Fallback
  }

  /**
   * Get price in both currencies
   */
  static async convertPrice(baseAmount: number, baseCurrency: Currency): Promise<ConvertedPrice> {
    const exchangeRate = await this.getExchangeRate();

    let ALL: number, EUR: number;

    if (baseCurrency === 'ALL') {
      ALL = baseAmount;
      EUR = baseAmount / exchangeRate;
    } else {
      EUR = baseAmount;
      ALL = baseAmount * exchangeRate;
    }

    return {
      ALL: Math.round(ALL),
      EUR: Math.round(EUR * 100) / 100, // Round to 2 decimal places
      baseAmount,
      baseCurrency
    };
  }

  /**
   * Format price for display
   */
  static formatPrice(amount: number, currency: Currency): string {
    if (currency === 'ALL') {
      return `${Math.round(amount)} L`;
    } else {
      return `€${(Math.round(amount * 100) / 100).toFixed(2)}`;
    }
  }

  /**
   * Get both formatted prices
   */
  static async getFormattedPrices(baseAmount: number, baseCurrency: Currency): Promise<{
    ALL: string;
    EUR: string;
    primary: string;
    secondary: string;
  }> {
    const converted = await this.convertPrice(baseAmount, baseCurrency);

    const allFormatted = this.formatPrice(converted.ALL, 'ALL');
    const eurFormatted = this.formatPrice(converted.EUR, 'EUR');

    return {
      ALL: allFormatted,
      EUR: eurFormatted,
      primary: baseCurrency === 'ALL' ? allFormatted : eurFormatted,
      secondary: baseCurrency === 'ALL' ? eurFormatted : allFormatted
    };
  }

  /**
   * Get exchange rate info for admin display
   */
  static async getExchangeRateInfo(): Promise<{
    rate: number;
    lastUpdated: Date;
    examples: {
      eurToAll: string;
      allToEur: string;
    };
  }> {
    const rate = await this.getExchangeRate();
    
    const setting = await prisma.setting.findUnique({
      where: { key: 'exchange_rate_eur_to_all' }
    });

    return {
      rate,
      lastUpdated: setting?.updatedAt || new Date(),
      examples: {
        eurToAll: `1 EUR = ${rate} ALL`,
        allToEur: `${rate} ALL = 1 EUR`
      }
    };
  }

  /**
   * Clear the exchange rate cache (useful for testing)
   */
  static clearCache(): void {
    this.exchangeRateCache = null;
  }
}