/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';

import { LiquidButton } from '@/components/ui/LiquidButton';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}));

describe('LiquidButton Component', () => {
  it('should render button with children', () => {
    render(<LiquidButton>Test Button</LiquidButton>);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<LiquidButton onClick={handleClick}>Click Me</LiquidButton>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<LiquidButton disabled>Disabled Button</LiquidButton>);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should be disabled when loading prop is true', () => {
    render(<LiquidButton loading>Loading Button</LiquidButton>);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should show loading spinner when loading', () => {
    render(<LiquidButton loading>Loading Button</LiquidButton>);

    expect(screen.getByRole('button')).toBeDisabled();
    // Check for SVG spinner
    expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();
  });

  it('should apply different variants', () => {
    const { rerender } = render(<LiquidButton variant="primary">Primary</LiquidButton>);
    expect(screen.getByRole('button')).toHaveClass('bg-gradient-to-r', 'from-blue-500');

    rerender(<LiquidButton variant="albanian">Albanian</LiquidButton>);
    expect(screen.getByRole('button')).toHaveClass('bg-gradient-to-r', 'from-red-500');

    rerender(<LiquidButton variant="secondary">Secondary</LiquidButton>);
    expect(screen.getByRole('button')).toHaveClass('bg-white/10', 'backdrop-blur-xl');

    rerender(<LiquidButton variant="ghost">Ghost</LiquidButton>);
    expect(screen.getByRole('button')).toHaveClass('bg-transparent');
  });

  it('should apply different sizes', () => {
    const { rerender } = render(<LiquidButton size="sm">Small</LiquidButton>);
    expect(screen.getByRole('button')).toHaveClass('px-4', 'py-2', 'text-sm');

    rerender(<LiquidButton size="md">Medium</LiquidButton>);
    expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3', 'text-base');

    rerender(<LiquidButton size="lg">Large</LiquidButton>);
    expect(screen.getByRole('button')).toHaveClass('px-8', 'py-4', 'text-lg');
  });

  it('should apply custom className', () => {
    render(<LiquidButton className="custom-class">Custom</LiquidButton>);

    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('should handle different button types', () => {
    const { rerender } = render(<LiquidButton type="submit">Submit</LiquidButton>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');

    rerender(<LiquidButton type="reset">Reset</LiquidButton>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
  });

  it('should not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(
      <LiquidButton onClick={handleClick} disabled>
        Disabled
      </LiquidButton>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should not call onClick when loading', () => {
    const handleClick = jest.fn();
    render(
      <LiquidButton onClick={handleClick} loading>
        Loading
      </LiquidButton>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});