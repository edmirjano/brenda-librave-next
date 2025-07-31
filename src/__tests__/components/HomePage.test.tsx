import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

describe('HomePage Component', () => {
  it('renders the Albanian welcome message', () => {
    render(<HomePage />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Mirë se vini në Brënda Librave');
  });

  it('displays the Albanian subtitle', () => {
    render(<HomePage />);
    
    const subtitle = screen.getByText('Libraria juaj shqiptare online për libra fizikë dhe dixhitalë');
    expect(subtitle).toBeInTheDocument();
  });

  it('shows key features in Albanian', () => {
    render(<HomePage />);
    
    expect(screen.getByText(/Zbuloni literaturën shqiptare dhe ndërkombëtare/)).toBeInTheDocument();
    expect(screen.getByText(/Çmime në Lek Shqiptarë dhe Euro/)).toBeInTheDocument();
    expect(screen.getByText(/Përvojë mobile-first me dizajn modern/)).toBeInTheDocument();
  });

  it('displays application ready status', () => {
    render(<HomePage />);
    
    const statusMessage = screen.getByText(/Aplikacioni është i gatshëm për zhvillim/);
    expect(statusMessage).toBeInTheDocument();
  });

  it('includes a link to health check', () => {
    render(<HomePage />);
    
    const healthCheckLink = screen.getByRole('link', { name: /Shiko Health Check/i });
    expect(healthCheckLink).toHaveAttribute('href', '/api/health');
  });

  it('shows phase information', () => {
    render(<HomePage />);
    
    expect(screen.getByText('Faza 1: Themelimi i projektit ✅')).toBeInTheDocument();
    expect(screen.getByText('Next.js 14+ • TypeScript • Tailwind CSS • Prisma')).toBeInTheDocument();
  });

  it('applies correct CSS classes for styling', () => {
    render(<HomePage />);
    
    const main = screen.getByRole('main');
    expect(main).toHaveClass('min-h-screen', 'bg-gradient-to-br', 'from-blue-50', 'to-indigo-100');
  });

  it('uses semantic HTML structure', () => {
    render(<HomePage />);
    
    // Check for proper heading hierarchy
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('has accessible color contrast for text', () => {
    render(<HomePage />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    // The heading should have proper contrast classes
    expect(heading).toHaveClass('text-gray-900');
  });

  it('includes Albanian flag colors in the design', () => {
    render(<HomePage />);
    
    const brandName = screen.getByText('Brënda Librave');
    // Should use Albanian red colors
    expect(brandName).toHaveClass('text-transparent', 'bg-clip-text', 'bg-gradient-to-r', 'from-red-600', 'to-red-800');
  });
}); 