/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';

import { useCurrency } from '@/hooks/useCurrency';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock fetch
global.fetch = jest.fn();

describe('useCurrency hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ rate: 110 }),
    });
  });

  it('should initialize with default currency', () => {
    const { result } = renderHook(() => useCurrency());

    expect(result.current.userCurrency).toBe('ALL');
    expect(result.current.isLoading).toBe(false);
  });

  it('should load saved currency from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('EUR');

    const { result } = renderHook(() => useCurrency());

    expect(result.current.userCurrency).toBe('EUR');
  });

  it('should save currency preference to localStorage', () => {
    const { result } = renderHook(() => useCurrency());

    act(() => {
      result.current.setUserCurrency('EUR');
    });

    expect(result.current.userCurrency).toBe('EUR');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('userCurrency', 'EUR');
  });

  it('should fetch exchange rate from API', async () => {
    const { result } = renderHook(() => useCurrency());

    // Wait for useEffect to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/exchange-rate');
    expect(result.current.exchangeRate).toBe(110);
  });

  it('should handle API fetch errors gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useCurrency());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Should fall back to default exchange rate
    expect(result.current.exchangeRate).toBe(100); // DEFAULT_EXCHANGE_RATE
  });

  it('should convert prices correctly', () => {
    const { result } = renderHook(() => useCurrency());

    // Test ALL to ALL (no conversion)
    const allPrice = result.current.convertPrice(1000, 'ALL');
    expect(allPrice).toBe(1000);

    // Test ALL to EUR (with default rate)
    const eurPrice = result.current.convertPrice(1000, 'EUR');
    expect(eurPrice).toBe(10); // 1000 / 100
  });

  it('should format prices correctly', () => {
    const { result } = renderHook(() => useCurrency());

    const allFormatted = result.current.formatPrice(1500, 'ALL');
    expect(allFormatted).toContain('1');
    expect(allFormatted).toContain('L');

    const eurFormatted = result.current.formatPrice(15.50, 'EUR');
    expect(eurFormatted).toContain('€');
    expect(eurFormatted).toContain('15');
  });

  it('should format dual prices correctly', () => {
    const { result } = renderHook(() => useCurrency());

    const dualPrice = result.current.formatDualPrice(1000, 10);
    expect(dualPrice.primary).toContain('1');
    expect(dualPrice.primary).toContain('L');
    expect(dualPrice.secondary).toContain('€');
  });

  it('should ignore invalid currency values from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('INVALID');

    const { result } = renderHook(() => useCurrency());

    expect(result.current.userCurrency).toBe('ALL'); // Should default to ALL
  });
});