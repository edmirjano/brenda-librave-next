/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';

import { BookCard } from '@/components/books/BookCard';

import type { BookListItem } from '@/types/book';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock PriceDisplay component
jest.mock('@/components/ui/PriceDisplay', () => ({
  PriceDisplay: ({ priceALL, priceEUR }: { priceALL: number; priceEUR?: number }) => (
    <div data-testid="price-display">
      {priceALL} ALL {priceEUR && `/ ${priceEUR} EUR`}
    </div>
  ),
}));

const mockBook: BookListItem = {
  id: 'book_1',
  title: 'Test Book Title',
  author: 'Test Author',
  description: 'This is a test book description.',
  isbn: '978-0-123456-78-9',
  categoryId: 'cat_1',
  priceALL: 1500,
  priceEUR: 15,
  digitalPriceALL: 1000,
  digitalPriceEUR: 10,
  inventory: 25,
  hasDigital: true,
  coverImage: 'https://example.com/cover.jpg',
  publishedDate: new Date('2023-01-01'),
  language: 'SQ',
  featured: true,
  active: true,
  slug: 'test-book-title',
  createdAt: new Date(),
  updatedAt: new Date(),
  category: {
    id: 'cat_1',
    name: 'Literatura Shqiptare',
    nameEn: 'Albanian Literature',
    slug: 'literatura-shqiptare',
    description: 'Albanian literature category',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  tags: [
    {
      bookId: 'book_1',
      tagId: 'tag_1',
      tag: {
        id: 'tag_1',
        name: 'Klasik',
        nameEn: 'Classic',
        slug: 'klasik',
        color: '#FF0000',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    {
      bookId: 'book_1',
      tagId: 'tag_2',
      tag: {
        id: 'tag_2',
        name: 'Letërsi',
        nameEn: 'Literature',
        slug: 'lettersi',
        color: '#00FF00',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  ],
};

describe('BookCard Component', () => {
  it('should render book information', () => {
    render(<BookCard book={mockBook} />);

    expect(screen.getByText('Test Book Title')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.getByText('Literatura Shqiptare')).toBeInTheDocument();
  });

  it('should render book cover image when provided', () => {
    render(<BookCard book={mockBook} />);

    const image = screen.getByAltText('Kapaku i librit "Test Book Title"');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/cover.jpg');
  });

  it('should render fallback icon when no cover image', () => {
    const bookWithoutCover = { ...mockBook, coverImage: null };
    render(<BookCard book={bookWithoutCover} />);

    // Should render BookOpen icon as fallback
    expect(screen.queryByAltText('Kapaku i librit "Test Book Title"')).not.toBeInTheDocument();
  });

  it('should show featured badge for featured books', () => {
    render(<BookCard book={mockBook} />);

    expect(screen.getByText('I veçantë')).toBeInTheDocument();
  });

  it('should show digital badge for books with digital version', () => {
    render(<BookCard book={mockBook} />);

    expect(screen.getByText('Dixhital')).toBeInTheDocument();
  });

  it('should show English badge for English books', () => {
    const englishBook = { ...mockBook, language: 'EN' as const };
    render(<BookCard book={englishBook} />);

    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('should not show English badge for Albanian books', () => {
    render(<BookCard book={mockBook} />);

    expect(screen.queryByText('English')).not.toBeInTheDocument();
  });

  it('should render rating stars', () => {
    render(<BookCard book={mockBook} />);

    // Should show rating (mocked as 4.5)
    expect(screen.getByText('(4.5)')).toBeInTheDocument();
  });

  it('should render tags with limit', () => {
    render(<BookCard book={mockBook} />);

    expect(screen.getByText('Klasik')).toBeInTheDocument();
    expect(screen.getByText('Letërsi')).toBeInTheDocument();
  });

  it('should show +N indicator for extra tags', () => {
    const bookWithManyTags = {
      ...mockBook,
      tags: [
        ...mockBook.tags,
        {
          bookId: 'book_1',
          tagId: 'tag_3',
          tag: {
            id: 'tag_3',
            name: 'Extra Tag',
            nameEn: 'Extra Tag',
            slug: 'extra-tag',
            color: '#0000FF',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      ],
    };

    render(<BookCard book={bookWithManyTags} />);

    expect(screen.getByText('+1')).toBeInTheDocument();
  });

  it('should render price display', () => {
    render(<BookCard book={mockBook} />);

    expect(screen.getByTestId('price-display')).toBeInTheDocument();
  });

  it('should link to book detail page', () => {
    render(<BookCard book={mockBook} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/books/test-book-title');
  });

  it('should handle books without featured status', () => {
    const nonFeaturedBook = { ...mockBook, featured: false };
    render(<BookCard book={nonFeaturedBook} />);

    expect(screen.queryByText('I veçantë')).not.toBeInTheDocument();
  });

  it('should handle books without digital version', () => {
    const physicalOnlyBook = { ...mockBook, hasDigital: false };
    render(<BookCard book={physicalOnlyBook} />);

    expect(screen.queryByText('Dixhital')).not.toBeInTheDocument();
  });

  it('should handle books without tags', () => {
    const bookWithoutTags = { ...mockBook, tags: [] };
    render(<BookCard book={bookWithoutTags} />);

    expect(screen.queryByText('Klasik')).not.toBeInTheDocument();
    expect(screen.queryByText('Letërsi')).not.toBeInTheDocument();
  });
});