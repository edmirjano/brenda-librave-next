// Mock Prisma
const mockPrisma = {
  category: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

jest.mock('@/lib/db/prisma', () => ({
  prisma: mockPrisma,
}));

// Mock logging
jest.mock('@/lib/logging/logger', () => ({
  logInfo: jest.fn(),
  logError: jest.fn(),
}));

import { CategoryService } from '@/lib/services/categories';

const mockCategory = {
  id: 'cat_1',
  name: 'Literatura Shqiptare',
  nameEn: 'Albanian Literature',
  slug: 'literatura-shqiptare',
  description: 'Albanian literature category',
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('CategoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getActiveCategories', () => {
    it('should return active categories', async () => {
      mockPrisma.category.findMany.mockResolvedValue([mockCategory]);

      const result = await CategoryService.getActiveCategories();

      expect(result).toHaveLength(1);
      expect(result[0]?.name).toBe('Literatura Shqiptare');
      expect(mockPrisma.category.findMany).toHaveBeenCalledWith({
        where: { active: true },
        orderBy: { name: 'asc' },
      });
    });

    it('should handle database errors', async () => {
      mockPrisma.category.findMany.mockRejectedValue(new Error('Database error'));

      const result = await CategoryService.getActiveCategories();

      expect(result).toHaveLength(0);
    });
  });

  describe('getCategoriesWithCounts', () => {
    it('should return categories with book counts', async () => {
      const categoryWithCount = {
        ...mockCategory,
        _count: { books: 5 },
      };

      mockPrisma.category.findMany.mockResolvedValue([categoryWithCount]);

      const result = await CategoryService.getCategoriesWithCounts();

      expect(result).toHaveLength(1);
      expect(result[0]?.bookCount).toBe(5);
    });
  });

  describe('getCategoryBySlug', () => {
    it('should return category with books', async () => {
      const categoryWithBooks = {
        ...mockCategory,
        books: [
          {
            id: 'book_1',
            title: 'Test Book',
            active: true,
          },
        ],
      };

      mockPrisma.category.findUnique.mockResolvedValue(categoryWithBooks);

      const result = await CategoryService.getCategoryBySlug('literatura-shqiptare');

      expect(result).toBeTruthy();
      expect(result?.name).toBe('Literatura Shqiptare');
      expect(result?.books).toHaveLength(1);
    });

    it('should return null for non-existent category', async () => {
      mockPrisma.category.findUnique.mockResolvedValue(null);

      const result = await CategoryService.getCategoryBySlug('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('createCategory', () => {
    it('should create new category with generated slug', async () => {
      mockPrisma.category.findUnique.mockResolvedValue(null); // No existing category
      mockPrisma.category.create.mockResolvedValue(mockCategory);

      const input = {
        name: 'New Category',
        nameEn: 'New Category EN',
        slug: 'new-category',
        description: 'Test description',
        active: true,
      };

      const result = await CategoryService.createCategory(input);

      expect(result.name).toBe('Literatura Shqiptare');
      expect(mockPrisma.category.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'New Category',
          slug: expect.any(String),
        }),
      });
    });

    it('should reject duplicate category names', async () => {
      mockPrisma.category.findUnique.mockResolvedValue(mockCategory); // Existing category

      const input = {
        name: 'Existing Category',
        slug: 'existing-category',
        active: true,
      };

      await expect(CategoryService.createCategory(input)).rejects.toThrow(
        'A category with this name already exists'
      );
    });
  });

  describe('searchCategories', () => {
    it('should search categories by name', async () => {
      mockPrisma.category.findMany.mockResolvedValue([mockCategory]);

      const result = await CategoryService.searchCategories('literatura');

      expect(result).toHaveLength(1);
      expect(mockPrisma.category.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: 'literatura' } },
            { nameEn: { contains: 'literatura' } },
            { description: { contains: 'literatura' } },
          ],
        },
        orderBy: { name: 'asc' },
      });
    });
  });

  describe('deleteCategory', () => {
    it('should delete category when no books exist', async () => {
      const mockBookCount = jest.fn().mockResolvedValue(0);
      (mockPrisma as any).book = { count: mockBookCount };
      mockPrisma.category.findUnique.mockResolvedValue(mockCategory);
      mockPrisma.category.delete.mockResolvedValue(mockCategory);

      await CategoryService.deleteCategory('cat_1');

      expect(mockPrisma.category.delete).toHaveBeenCalledWith({
        where: { id: 'cat_1' },
      });
    });

    it('should reject deletion when category has books', async () => {
      const mockBookCount = jest.fn().mockResolvedValue(5);
      (mockPrisma as any).book = { count: mockBookCount };

      await expect(CategoryService.deleteCategory('cat_1')).rejects.toThrow(
        'Cannot delete category that contains books'
      );
    });
  });
});