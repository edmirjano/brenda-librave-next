import {
  bookSearchSchema,
  createBookSchema,
  createCategorySchema,
  createTagSchema,
  updateBookSchema,
  updateCategorySchema,
  updateTagSchema,
} from '@/lib/validations/book';

describe('Book validation schemas', () => {
  describe('createBookSchema', () => {
    it('should validate correct book data', () => {
      const validData = {
        title: 'Test Book Title',
        author: 'Test Author',
        description: 'This is a test book description that is long enough.',
        categoryId: 'cat_123',
        priceALL: 1500,
        priceEUR: 15,
        inventory: 10,
        hasDigital: true,
        language: 'SQ' as const,
        featured: false,
        active: true,
      };

      const result = createBookSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject books with short titles', () => {
      const invalidData = {
        title: 'A',
        author: 'Test Author',
        description: 'This is a test book description.',
        categoryId: 'cat_123',
        inventory: 10,
      };

      const result = createBookSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject books with short descriptions', () => {
      const invalidData = {
        title: 'Valid Title',
        author: 'Test Author',
        description: 'Short',
        categoryId: 'cat_123',
        inventory: 10,
      };

      const result = createBookSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should validate ISBN format', () => {
      const validData = {
        title: 'Test Book',
        author: 'Test Author',
        description: 'This is a test book description that is long enough.',
        categoryId: 'cat_123',
        isbn: '978-0-123456-78-9',
        inventory: 10,
      };

      const result = createBookSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid ISBN format', () => {
      const invalidData = {
        title: 'Test Book',
        author: 'Test Author',
        description: 'This is a test book description that is long enough.',
        categoryId: 'cat_123',
        isbn: 'invalid-isbn',
        inventory: 10,
      };

      const result = createBookSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject negative prices', () => {
      const invalidData = {
        title: 'Test Book',
        author: 'Test Author',
        description: 'This is a test book description that is long enough.',
        categoryId: 'cat_123',
        priceALL: -100,
        inventory: 10,
      };

      const result = createBookSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject negative inventory', () => {
      const invalidData = {
        title: 'Test Book',
        author: 'Test Author',
        description: 'This is a test book description that is long enough.',
        categoryId: 'cat_123',
        inventory: -5,
      };

      const result = createBookSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should trim whitespace from strings', () => {
      const data = {
        title: '  Test Book Title  ',
        author: '  Test Author  ',
        description: '  This is a test book description that is long enough.  ',
        categoryId: 'cat_123',
        inventory: 10,
      };

      const result = createBookSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('Test Book Title');
        expect(result.data.author).toBe('Test Author');
        expect(result.data.description).toBe('This is a test book description that is long enough.');
      }
    });
  });

  describe('updateBookSchema', () => {
    it('should validate partial updates', () => {
      const validData = {
        id: 'book_123',
        title: 'Updated Title',
        priceALL: 2000,
      };

      const result = updateBookSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should require book ID', () => {
      const invalidData = {
        title: 'Updated Title',
      };

      const result = updateBookSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should require at least one update field', () => {
      const invalidData = {
        id: 'book_123',
      };

      const result = updateBookSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('createCategorySchema', () => {
    it('should validate correct category data', () => {
      const validData = {
        name: 'Test Category',
        nameEn: 'Test Category EN',
        description: 'Test description',
        active: true,
      };

      const result = createCategorySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject short names', () => {
      const invalidData = {
        name: 'A',
        active: true,
      };

      const result = createCategorySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should default active to true', () => {
      const data = {
        name: 'Test Category',
      };

      const result = createCategorySchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.active).toBe(true);
      }
    });
  });

  describe('createTagSchema', () => {
    it('should validate correct tag data', () => {
      const validData = {
        name: 'Test Tag',
        nameEn: 'Test Tag EN',
        color: '#FF0000',
      };

      const result = createTagSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid hex colors', () => {
      const invalidData = {
        name: 'Test Tag',
        color: 'invalid-color',
      };

      const result = createTagSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept valid hex colors', () => {
      const validColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFFFF', '#000000'];

      validColors.forEach((color) => {
        const data = {
          name: 'Test Tag',
          color,
        };

        const result = createTagSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('bookSearchSchema', () => {
    it('should validate search parameters', () => {
      const validData = {
        query: 'test query',
        categoryId: 'cat_123',
        language: 'SQ' as const,
        minPrice: 100,
        maxPrice: 2000,
        currency: 'ALL' as const,
        featured: true,
        sortBy: 'title' as const,
        sortOrder: 'asc' as const,
        page: 1,
        limit: 12,
      };

      const result = bookSearchSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should use default values', () => {
      const data = {};

      const result = bookSearchSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.currency).toBe('ALL');
        expect(result.data.active).toBe(true);
        expect(result.data.sortBy).toBe('createdAt');
        expect(result.data.sortOrder).toBe('desc');
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(12);
      }
    });

    it('should reject invalid page numbers', () => {
      const invalidData = {
        page: 0,
      };

      const result = bookSearchSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid limit values', () => {
      const invalidData = {
        limit: 0,
      };

      const result = bookSearchSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject limit over maximum', () => {
      const invalidData = {
        limit: 101,
      };

      const result = bookSearchSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject negative prices', () => {
      const invalidData = {
        minPrice: -100,
      };

      const result = bookSearchSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});