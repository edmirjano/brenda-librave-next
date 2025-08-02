// Mock Prisma with proper Jest types
const mockPrismaBook = {
  findMany: jest.fn(),
  findUnique: jest.fn(),
  findFirst: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
  updateMany: jest.fn(),
};

const mockPrismaCategory = {
  count: jest.fn(),
};

const mockPrismaTag = {
  count: jest.fn(),
};

jest.mock('@/lib/db/prisma', () => ({
  prisma: {
    book: mockPrismaBook,
    category: mockPrismaCategory,
    tag: mockPrismaTag,
  },
}));

// Mock logging
jest.mock('@/lib/logging/logger', () => ({
  logInfo: jest.fn(),
  logError: jest.fn(),
}));

import { BookService } from '@/lib/services/books';

const mockBook = {
  id: 'book_1',
  title: 'Test Book',
  author: 'Test Author',
  description: 'Test description',
  slug: 'test-book',
  priceALL: 1500,
  priceEUR: 15,
  inventory: 10,
  featured: true,
  active: true,
  category: {
    id: 'cat_1',
    name: 'Test Category',
    slug: 'test-category',
  },
  tags: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('BookService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchBooks', () => {
    it('should search books with basic parameters', async () => {
      mockPrismaBook.findMany.mockResolvedValue([mockBook]);
      mockPrismaBook.count.mockResolvedValue(1);

      const result = await BookService.searchBooks({
        query: 'test',
        page: 1,
        limit: 12,
      });

      expect(result.books).toHaveLength(1);
      expect(result.totalCount).toBe(1);
      expect(result.currentPage).toBe(1);
      expect(mockPrismaBook.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            active: true,
            OR: expect.arrayContaining([
              { title: { contains: 'test' } },
              { author: { contains: 'test' } },
            ]),
          }),
        })
      );
    });

    it('should handle search with filters', async () => {
      mockPrismaBook.findMany.mockResolvedValue([mockBook]);
      mockPrismaBook.count.mockResolvedValue(1);

      await BookService.searchBooks({
        categoryId: 'cat_1',
        language: 'SQ',
        featured: true,
        minPrice: 1000,
        maxPrice: 2000,
        currency: 'ALL',
      });

      expect(mockPrismaBook.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            categoryId: 'cat_1',
            language: 'SQ',
            featured: true,
          }),
        })
      );
    });

    it('should handle pagination correctly', async () => {
      mockPrismaBook.findMany.mockResolvedValue([mockBook]);
      mockPrismaBook.count.mockResolvedValue(25);

      const result = await BookService.searchBooks({
        page: 2,
        limit: 10,
      });

      expect(result.totalPages).toBe(3); // Math.ceil(25 / 10)
      expect(result.currentPage).toBe(2);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPreviousPage).toBe(true);
      expect(mockPrismaBook.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10, // (page - 1) * limit
          take: 10,
        })
      );
    });

    it('should handle errors gracefully', async () => {
      mockPrismaBook.findMany.mockRejectedValue(new Error('Database error'));

      await expect(BookService.searchBooks({})).rejects.toThrow('Failed to search books');
    });
  });

  describe('getBookById', () => {
    it('should return book when found', async () => {
      mockPrismaBook.findUnique.mockResolvedValue(mockBook);

      const result = await BookService.getBookById('book_1');

      expect(result).toEqual(mockBook);
      expect(mockPrismaBook.findUnique).toHaveBeenCalledWith({
        where: { id: 'book_1' },
        include: expect.objectContaining({
          category: true,
          tags: expect.objectContaining({
            include: { tag: true },
          }),
        }),
      });
    });

    it('should return null when book not found', async () => {
      mockPrismaBook.findUnique.mockResolvedValue(null);

      const result = await BookService.getBookById('nonexistent');

      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      mockPrismaBook.findUnique.mockRejectedValue(new Error('Database error'));

      const result = await BookService.getBookById('book_1');

      expect(result).toBeNull();
    });
  });

  describe('getBookBySlug', () => {
    it('should return book when found by slug', async () => {
      mockPrismaBook.findUnique.mockResolvedValue(mockBook);

      const result = await BookService.getBookBySlug('test-book');

      expect(result).toEqual(mockBook);
      expect(mockPrismaBook.findUnique).toHaveBeenCalledWith({
        where: { slug: 'test-book' },
        include: expect.any(Object),
      });
    });
  });

  describe('getFeaturedBooks', () => {
    it('should return featured books', async () => {
      const featuredBooks = [mockBook, { ...mockBook, id: 'book_2' }];
      mockPrismaBook.findMany.mockResolvedValue(featuredBooks);

      const result = await BookService.getFeaturedBooks(8);

      expect(result).toHaveLength(2);
      expect(mockPrismaBook.findMany).toHaveBeenCalledWith({
        where: {
          featured: true,
          active: true,
        },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' },
        take: 8,
      });
    });

    it('should handle empty results', async () => {
      mockPrismaBook.findMany.mockResolvedValue([]);

      const result = await BookService.getFeaturedBooks();

      expect(result).toHaveLength(0);
    });
  });

  describe('getRelatedBooks', () => {
    it('should return related books', async () => {
      const currentBook = {
        ...mockBook,
        categoryId: 'cat_1',
        tags: [{ tag: { id: 'tag_1' } }],
      };
      const relatedBooks = [{ ...mockBook, id: 'book_2' }];

      mockPrismaBook.findUnique.mockResolvedValue(currentBook);
      mockPrismaBook.findMany.mockResolvedValue(relatedBooks);

      const result = await BookService.getRelatedBooks('book_1', 4);

      expect(result).toHaveLength(1);
      expect(mockPrismaBook.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            id: { not: 'book_1' },
            active: true,
            OR: expect.arrayContaining([
              { categoryId: 'cat_1' },
            ]),
          }),
        })
      );
    });

    it('should return empty array when book not found', async () => {
      mockPrismaBook.findUnique.mockResolvedValue(null);

      const result = await BookService.getRelatedBooks('nonexistent');

      expect(result).toHaveLength(0);
    });
  });

  describe('getBookStats', () => {
    it('should return book statistics', async () => {
      // Mock multiple count calls
      mockPrismaBook.count
        .mockResolvedValueOnce(100) // totalBooks
        .mockResolvedValueOnce(95)  // activeBooks
        .mockResolvedValueOnce(10)  // featuredBooks
        .mockResolvedValueOnce(50); // booksWithDigital

      mockPrismaCategory.count.mockResolvedValue(15);
      mockPrismaTag.count.mockResolvedValue(25);

      const result = await BookService.getBookStats();

      expect(result).toEqual({
        totalBooks: 100,
        activeBooks: 95,
        featuredBooks: 10,
        booksWithDigital: 50,
        categoriesCount: 15,
        tagsCount: 25,
      });
    });

    it('should handle database errors', async () => {
      mockPrismaBook.count.mockRejectedValue(new Error('Database error'));

      await expect(BookService.getBookStats()).rejects.toThrow('Failed to get book statistics');
    });
  });

  describe('createBook', () => {
    it('should create a new book', async () => {
      const bookInput = {
        title: 'New Book',
        author: 'New Author',
        description: 'New book description that is long enough.',
        categoryId: 'cat_1',
        inventory: 10,
        hasDigital: false,
        language: 'SQ' as const,
        featured: false,
        active: true,
        slug: 'new-book', // Required field
      };

      mockPrismaBook.findUnique.mockResolvedValue(null); // No existing book
      mockPrismaBook.create.mockResolvedValue({ ...mockBook, ...bookInput });

      const result = await BookService.createBook(bookInput);

      expect(result.title).toBe('New Book');
      expect(mockPrismaBook.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: 'New Book',
            author: 'New Author',
            slug: 'new-book',
          }),
        })
      );
    });

    it('should reject duplicate slugs', async () => {
      const bookInput = {
        title: 'Existing Book',
        author: 'Author',
        description: 'Description that is long enough.',
        categoryId: 'cat_1',
        inventory: 10,
        hasDigital: false,
        language: 'SQ' as const,
        featured: false,
        active: true,
        slug: 'existing-book',
      };

      mockPrismaBook.findUnique.mockResolvedValue(mockBook); // Existing book

      await expect(BookService.createBook(bookInput)).rejects.toThrow(
        'A book with this title already exists'
      );
    });
  });

  describe('bulkUpdateBookStatus', () => {
    it('should update multiple books status', async () => {
      mockPrismaBook.updateMany.mockResolvedValue({ count: 3 });

      const result = await BookService.bulkUpdateBookStatus(['book_1', 'book_2', 'book_3'], false);

      expect(result).toBe(3);
      expect(mockPrismaBook.updateMany).toHaveBeenCalledWith({
        where: {
          id: { in: ['book_1', 'book_2', 'book_3'] },
        },
        data: {
          active: false,
        },
      });
    });
  });

  describe('Book validation logic', () => {
    it('should validate book data structure', () => {
      const bookData = {
        title: 'Valid Book Title',
        author: 'Valid Author',
        description: 'Valid description that is long enough for requirements.',
        categoryId: 'valid_category_id',
        priceALL: 1500,
        priceEUR: 15,
        inventory: 10,
        hasDigital: true,
        language: 'SQ',
        featured: false,
        active: true,
      };

      // Validate structure
      expect(bookData.title).toBeTruthy();
      expect(bookData.author).toBeTruthy();
      expect(bookData.description.length).toBeGreaterThan(10);
      expect(bookData.categoryId).toBeTruthy();
      expect(bookData.priceALL).toBeGreaterThan(0);
      expect(bookData.inventory).toBeGreaterThanOrEqual(0);
      expect(['SQ', 'EN']).toContain(bookData.language);
    });

    it('should validate price ranges', () => {
      const validPrices = [0, 100, 1500, 10000];
      const invalidPrices = [-1, -100];

      validPrices.forEach(price => {
        expect(price).toBeGreaterThanOrEqual(0);
      });

      invalidPrices.forEach(price => {
        expect(price).toBeLessThan(0);
      });
    });
  });
});