/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';

import { GlassCard } from '@/components/ui/GlassCard';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('GlassCard Component', () => {
  it('should render children', () => {
    render(
      <GlassCard>
        <p>Test content</p>
      </GlassCard>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should apply glass morphism classes', () => {
    const { container } = render(<GlassCard>Content</GlassCard>);

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('backdrop-blur-xl');
    expect(card).toHaveClass('bg-white/10');
    expect(card).toHaveClass('border');
    expect(card).toHaveClass('border-white/20');
    expect(card).toHaveClass('rounded-2xl');
    expect(card).toHaveClass('shadow-2xl');
  });

  it('should apply hover classes by default', () => {
    const { container } = render(<GlassCard>Content</GlassCard>);

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('hover:bg-white/20');
    expect(card).toHaveClass('hover:border-white/30');
  });

  it('should not apply hover classes when hover is false', () => {
    const { container } = render(<GlassCard hover={false}>Content</GlassCard>);

    const card = container.firstChild as HTMLElement;
    expect(card).not.toHaveClass('hover:bg-white/20');
    expect(card).not.toHaveClass('hover:border-white/30');
  });

  it('should apply custom className', () => {
    const { container } = render(<GlassCard className="custom-class">Content</GlassCard>);

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('custom-class');
  });

  it('should maintain glass morphism classes with custom className', () => {
    const { container } = render(<GlassCard className="custom-class">Content</GlassCard>);

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('custom-class');
    expect(card).toHaveClass('backdrop-blur-xl');
    expect(card).toHaveClass('bg-white/10');
  });
});