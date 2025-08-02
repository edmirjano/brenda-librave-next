import { NextRequest } from 'next/server';

// Mock the BookService
const mockBookService = {
  searchBooks: jest.fn(),
  getBookById: jest.fn(),
  getFeaturedBooks: jest.fn(),
};

jest.mock('@/lib/services/books', () => ({
  BookService: mockBookService,
}));

// Mock the validation schema
jest.mock('@/lib/validations/book', () => ({
  bookSearchSchema: {
    safeParse: jest.fn(),
  },
}));

import { GET } from '@/app/api/books/route';
import { bookSearchSchema } from '@/lib/validations/book';

describe('/api/books endpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/books', () => {
    it('should return books with valid search parameters', async () => {
      const mockSearchResult = {
        books: [
          {
            id: 'book_1',
            title: 'Test Book',
            author: 'Test Author',
            priceALL: 1500,
          },
        ],
        totalCount: 1,
        totalPages: 1,
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };

      (bookSearchSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: {
          query: 'test',
          page: 1,
          limit: 12,
        },
      });

      mockBookService.searchBooks.mockResolvedValue(mockSearchResult);

      const request = new NextRequest('http://localhost:3000/api/books?query=test');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.books).toHaveLength(1);
      expect(data.data.books[0].title).toBe('Test Book');
    });

    it('should return 400 for invalid search parameters', async () => {
      (bookSearchSchema.safeParse as jest.Mock).mockReturnValue({
        success: false,
        error: {
          errors: [{ message: 'Invalid parameter' }],
        },
      });

      const request = new NextRequest('http://localhost:3000/api/books?page=invalid');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid search parameters');
    });

    it('should handle service errors', async () => {
      (bookSearchSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: {},
      });

      mockBookService.searchBooks.mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/books');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Failed to fetch books');
    });

    it('should handle empty search results', async () => {
      const emptyResult = {
        books: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };

      (bookSearchSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: { query: 'nonexistent' },
      });

      mockBookService.searchBooks.mockResolvedValue(emptyResult);

      const request = new NextRequest('http://localhost:3000/api/books?query=nonexistent');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.books).toHaveLength(0);
      expect(data.data.totalCount).toBe(0);
    });

    it('should handle search with filters', async () => {
      const filteredResult = {
        books: [
          {
            id: 'book_1',
            title: 'Albanian Book',
            author: 'Albanian Author',
            language: 'SQ',
            featured: true,
          },
        ],
        totalCount: 1,
        totalPages: 1,
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };

      (bookSearchSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: {
          language: 'SQ',
          featured: true,
          minPrice: 1000,
          maxPrice: 2000,
        },
      });

      mockBookService.searchBooks.mockResolvedValue(filteredResult);

      const request = new NextRequest(
        'http://localhost:3000/api/books?language=SQ&featured=true&minPrice=1000&maxPrice=2000'
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.books[0].language).toBe('SQ');
      expect(data.data.books[0].featured).toBe(true);
    });
  });
});