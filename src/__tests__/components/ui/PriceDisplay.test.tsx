/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';

import { PriceDisplay } from '@/components/ui/PriceDisplay';

// Mock the useCurrency hook
jest.mock('@/hooks/useCurrency', () => ({
  useCurrency: () => ({
    formatDualPrice: (priceALL: number, priceEUR?: number) => ({
      primary: `${priceALL.toLocaleString()} L`,
      secondary: priceEUR ? `€${priceEUR.toFixed(2)}` : `€${(priceALL / 100).toFixed(2)}`,
    }),
    isLoading: false,
  }),
}));

describe('PriceDisplay Component', () => {
  it('should render primary price', () => {
    render(<PriceDisplay priceALL={1500} />);

    expect(screen.getByText('1,500 L')).toBeInTheDocument();
  });

  it('should render both prices when showBoth is true', () => {
    render(<PriceDisplay priceALL={1500} priceEUR={15} showBoth />);

    expect(screen.getByText('1,500 L')).toBeInTheDocument();
    expect(screen.getByText('(€15.00)')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<PriceDisplay priceALL={1500} className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should handle different sizes', () => {
    const { rerender } = render(<PriceDisplay priceALL={1500} size="sm" />);
    expect(screen.getByText('1,500 L')).toHaveClass('text-sm');

    rerender(<PriceDisplay priceALL={1500} size="lg" />);
    expect(screen.getByText('1,500 L')).toHaveClass('text-xl');
  });

  it('should handle different variants', () => {
    const { rerender } = render(<PriceDisplay priceALL={1500} variant="muted" />);
    expect(screen.getByText('1,500 L')).toHaveClass('text-gray-600');

    rerender(<PriceDisplay priceALL={1500} variant="accent" />);
    expect(screen.getByText('1,500 L')).toHaveClass('text-blue-600');
  });

  it('should show loading state', () => {
    // Mock loading state
    jest.doMock('@/hooks/useCurrency', () => ({
      useCurrency: () => ({
        formatDualPrice: jest.fn(),
        isLoading: true,
      }),
    }));

    const { PriceDisplay: LoadingPriceDisplay } = require('@/components/ui/PriceDisplay');
    render(<LoadingPriceDisplay priceALL={1500} />);

    expect(screen.getByRole('generic')).toHaveClass('animate-pulse');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});