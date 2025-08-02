import { BookService } from '@/lib/services/books';
import { prisma } from '@/lib/db/prisma';

// Mock Prisma
jest.mock('@/lib/db/prisma', () => ({
  prisma: {
    book: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      updateMany: jest.fn(),
    },
    category: {
      count: jest.fn(),
    },
    tag: {
      count: jest.fn(),
    },
  },
}));

// Mock logging
jest.mock('@/lib/logging/logger', () => ({
  logInfo: jest.fn(),
  logError: jest.fn(),
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

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
      const mockSearchResult = {
        books: [mockBook],
        totalCount: 1,
        totalPages: 1,
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };

      mockPrisma.book.findMany.mockResolvedValue([mockBook] as any);
      mockPrisma.book.count.mockResolvedValue(1);

      const result = await BookService.searchBooks({
        query: 'test',
        page: 1,
        limit: 12,
      });

      expect(result.books).toHaveLength(1);
      expect(result.totalCount).toBe(1);
      expect(result.currentPage).toBe(1);
      expect(mockPrisma.book.findMany).toHaveBeenCalledWith(
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
      mockPrisma.book.findMany.mockResolvedValue([mockBook] as any);
      mockPrisma.book.count.mockResolvedValue(1);

      await BookService.searchBooks({
        categoryId: 'cat_1',
        language: 'SQ',
        featured: true,
        minPrice: 1000,
        maxPrice: 2000,
        currency: 'ALL',
      });

      expect(mockPrisma.book.findMany).toHaveBeenCalledWith(
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
      mockPrisma.book.findMany.mockResolvedValue([mockBook] as any);
      mockPrisma.book.count.mockResolvedValue(25);

      const result = await BookService.searchBooks({
        page: 2,
        limit: 10,
      });

      expect(result.totalPages).toBe(3); // Math.ceil(25 / 10)
      expect(result.currentPage).toBe(2);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPreviousPage).toBe(true);
      expect(mockPrisma.book.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10, // (page - 1) * limit
          take: 10,
        })
      );
    });

    it('should handle errors gracefully', async () => {
      mockPrisma.book.findMany.mockRejectedValue(new Error('Database error'));

      await expect(BookService.searchBooks({})).rejects.toThrow('Failed to search books');
    });
  });

  describe('getBookById', () => {
    it('should return book when found', async () => {
      mockPrisma.book.findUnique.mockResolvedValue(mockBook as any);

      const result = await BookService.getBookById('book_1');

      expect(result).toEqual(mockBook);
      expect(mockPrisma.book.findUnique).toHaveBeenCalledWith({
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
      mockPrisma.book.findUnique.mockResolvedValue(null);

      const result = await BookService.getBookById('nonexistent');

      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      mockPrisma.book.findUnique.mockRejectedValue(new Error('Database error'));

      const result = await BookService.getBookById('book_1');

      expect(result).toBeNull();
    });
  });

  describe('getBookBySlug', () => {
    it('should return book when found by slug', async () => {
      mockPrisma.book.findUnique.mockResolvedValue(mockBook as any);

      const result = await BookService.getBookBySlug('test-book');

      expect(result).toEqual(mockBook);
      expect(mockPrisma.book.findUnique).toHaveBeenCalledWith({
        where: { slug: 'test-book' },
        include: expect.any(Object),
      });
    });
  });

  describe('getFeaturedBooks', () => {
    it('should return featured books', async () => {
      const featuredBooks = [mockBook, { ...mockBook, id: 'book_2' }];
      mockPrisma.book.findMany.mockResolvedValue(featuredBooks as any);

      const result = await BookService.getFeaturedBooks(8);

      expect(result).toHaveLength(2);
      expect(mockPrisma.book.findMany).toHaveBeenCalledWith({
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
      mockPrisma.book.findMany.mockResolvedValue([]);

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

      mockPrisma.book.findUnique.mockResolvedValue(currentBook as any);
      mockPrisma.book.findMany.mockResolvedValue(relatedBooks as any);

      const result = await BookService.getRelatedBooks('book_1', 4);

      expect(result).toHaveLength(1);
      expect(mockPrisma.book.findMany).toHaveBeenCalledWith(
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
      mockPrisma.book.findUnique.mockResolvedValue(null);

      const result = await BookService.getRelatedBooks('nonexistent');

      expect(result).toHaveLength(0);
    });
  });

  describe('getBookStats', () => {
    it('should return book statistics', async () => {
      mockPrisma.book.count
        .mockResolvedValueOnce(100) // totalBooks
        .mockResolvedValueOnce(95) // activeBooks
        .mockResolvedValueOnce(10) // featuredBooks
        .mockResolvedValueOnce(50); // booksWithDigital

      mockPrisma.category.count.mockResolvedValue(15);
      mockPrisma.tag.count.mockResolvedValue(25);

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
      mockPrisma.book.count.mockRejectedValue(new Error('Database error'));

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
      };

      mockPrisma.book.findUnique.mockResolvedValue(null); // No existing book
      mockPrisma.book.create.mockResolvedValue({ ...mockBook, ...bookInput } as any);

      const result = await BookService.createBook(bookInput);

      expect(result.title).toBe('New Book');
      expect(mockPrisma.book.create).toHaveBeenCalledWith(
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
      };

      mockPrisma.book.findUnique.mockResolvedValue(mockBook as any); // Existing book

      await expect(BookService.createBook(bookInput)).rejects.toThrow(
        'A book with this title already exists'
      );
    });
  });

  describe('bulkUpdateBookStatus', () => {
    it('should update multiple books status', async () => {
      mockPrisma.book.updateMany.mockResolvedValue({ count: 3 });

      const result = await BookService.bulkUpdateBookStatus(['book_1', 'book_2', 'book_3'], false);

      expect(result).toBe(3);
      expect(mockPrisma.book.updateMany).toHaveBeenCalledWith({
        where: {
          id: { in: ['book_1', 'book_2', 'book_3'] },
        },
        data: {
          active: false,
        },
      });
    });
  });
});