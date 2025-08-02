import {
  convertPrice,
  formatDualPrice,
  formatPrice,
  getCurrencySymbol,
  isValidPrice,
  parsePrice,
  roundPrice,
} from '@/lib/currency/utils';

describe('Currency utilities', () => {
  describe('convertPrice', () => {
    it('should return same price for ALL currency', () => {
      const priceALL = 1000;
      const result = convertPrice(priceALL, 'ALL', 100);
      expect(result).toBe(1000);
    });

    it('should convert ALL to EUR correctly', () => {
      const priceALL = 1000;
      const exchangeRate = 100; // 1 EUR = 100 ALL
      const result = convertPrice(priceALL, 'EUR', exchangeRate);
      expect(result).toBe(10);
    });

    it('should use default exchange rate when not provided', () => {
      const priceALL = 1000;
      const result = convertPrice(priceALL, 'EUR');
      expect(result).toBe(10); // Using DEFAULT_EXCHANGE_RATE = 100
    });
  });

  describe('formatPrice', () => {
    it('should format ALL prices correctly', () => {
      const price = 1500;
      const result = formatPrice(price, 'ALL');
      expect(result).toBe('1.500 L');
    });

    it('should format EUR prices correctly', () => {
      const price = 15.50;
      const result = formatPrice(price, 'EUR');
      expect(result).toBe('€15,50');
    });

    it('should handle zero prices', () => {
      const result = formatPrice(0, 'ALL');
      expect(result).toBe('0 L');
    });

    it('should handle large numbers', () => {
      const price = 1000000;
      const result = formatPrice(price, 'ALL');
      expect(result).toBe('1.000.000 L');
    });
  });

  describe('formatDualPrice', () => {
    it('should format dual prices with user preference ALL', () => {
      const priceALL = 1000;
      const priceEUR = 10;
      const result = formatDualPrice(priceALL, priceEUR, 'ALL', 100);

      expect(result.primary).toBe('1.000 L');
      expect(result.secondary).toBe('€10,00');
    });

    it('should format dual prices with user preference EUR', () => {
      const priceALL = 1000;
      const priceEUR = 10;
      const result = formatDualPrice(priceALL, priceEUR, 'EUR', 100);

      expect(result.primary).toBe('€10,00');
      expect(result.secondary).toBe('1.000 L');
    });

    it('should calculate EUR price when not provided', () => {
      const priceALL = 1000;
      const result = formatDualPrice(priceALL, undefined, 'EUR', 100);

      expect(result.primary).toBe('€10,00');
      expect(result.secondary).toBe('1.000 L');
    });
  });

  describe('parsePrice', () => {
    it('should parse ALL price strings', () => {
      const priceString = '1.500 L';
      const result = parsePrice(priceString);
      expect(result).toBe(1500);
    });

    it('should parse EUR price strings', () => {
      const priceString = '€15,50';
      const result = parsePrice(priceString);
      expect(result).toBe(15.50);
    });

    it('should handle invalid price strings', () => {
      const priceString = 'invalid';
      const result = parsePrice(priceString);
      expect(result).toBe(0);
    });

    it('should handle empty strings', () => {
      const result = parsePrice('');
      expect(result).toBe(0);
    });
  });

  describe('isValidPrice', () => {
    it('should validate positive numbers', () => {
      expect(isValidPrice(100)).toBe(true);
      expect(isValidPrice(0)).toBe(true);
      expect(isValidPrice(0.01)).toBe(true);
    });

    it('should reject negative numbers', () => {
      expect(isValidPrice(-1)).toBe(false);
    });

    it('should reject invalid numbers', () => {
      expect(isValidPrice(NaN)).toBe(false);
      expect(isValidPrice(Infinity)).toBe(false);
      expect(isValidPrice(-Infinity)).toBe(false);
    });
  });

  describe('getCurrencySymbol', () => {
    it('should return correct symbols', () => {
      expect(getCurrencySymbol('ALL')).toBe('L');
      expect(getCurrencySymbol('EUR')).toBe('€');
    });
  });

  describe('roundPrice', () => {
    it('should round ALL prices to no decimals', () => {
      const result = roundPrice(1500.67, 'ALL');
      expect(result).toBe(1501);
    });

    it('should round EUR prices to 2 decimals', () => {
      const result = roundPrice(15.678, 'EUR');
      expect(result).toBe(15.68);
    });
  });
});