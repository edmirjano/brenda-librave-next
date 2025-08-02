import { prisma } from '@/lib/db/prisma';
import { logError, logInfo } from '@/lib/logging/logger';
import { slugify } from '@/lib/utils';

import type {
  Category,
  CategoryWithoutRelations,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@/types/book';

/**
 * Service class for category-related operations
 */
export class CategoryService {
  /**
   * Get all active categories
   */
  static async getActiveCategories(): Promise<CategoryWithoutRelations[]> {
    try {
      const categories = await prisma.category.findMany({
        where: { active: true },
        orderBy: { name: 'asc' },
      });

      logInfo('Active categories retrieved', { count: categories.length });

      return categories;
    } catch (error) {
      logError('Error getting active categories', error);
      return [];
    }
  }

  /**
   * Get all categories (including inactive)
   */
  static async getAllCategories(): Promise<CategoryWithoutRelations[]> {
    try {
      const categories = await prisma.category.findMany({
        orderBy: [{ active: 'desc' }, { name: 'asc' }],
      });

      logInfo('All categories retrieved', { count: categories.length });

      return categories;
    } catch (error) {
      logError('Error getting all categories', error);
      return [];
    }
  }

  /**
   * Get category by ID with books
   */
  static async getCategoryById(id: string): Promise<Category | null> {
    try {
      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          books: {
            where: { active: true },
            include: {
              category: true,
              tags: {
                include: {
                  tag: true,
                },
              },
            },
            orderBy: { featured: 'desc' },
          },
        },
      });

      if (category) {
        logInfo('Category retrieved by ID', {
          categoryId: id,
          name: category.name,
          bookCount: category.books.length,
        });
      }

      return category;
    } catch (error) {
      logError('Error getting category by ID', error, { categoryId: id });
      return null;
    }
  }

  /**
   * Get category by slug with books
   */
  static async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const category = await prisma.category.findUnique({
        where: { slug },
        include: {
          books: {
            where: { active: true },
            include: {
              category: true,
              tags: {
                include: {
                  tag: true,
                },
              },
            },
            orderBy: { featured: 'desc' },
          },
        },
      });

      if (category) {
        logInfo('Category retrieved by slug', {
          slug,
          name: category.name,
          bookCount: category.books.length,
        });
      }

      return category;
    } catch (error) {
      logError('Error getting category by slug', error, { slug });
      return null;
    }
  }

  /**
   * Get categories with book counts
   */
  static async getCategoriesWithCounts(): Promise<
    Array<CategoryWithoutRelations & { bookCount: number }>
  > {
    try {
      const categories = await prisma.category.findMany({
        where: { active: true },
        include: {
          _count: {
            select: {
              books: {
                where: { active: true },
              },
            },
          },
        },
        orderBy: { name: 'asc' },
      });

      const categoriesWithCounts = categories.map((category) => ({
        id: category.id,
        name: category.name,
        nameEn: category.nameEn,
        slug: category.slug,
        description: category.description,
        active: category.active,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        bookCount: category._count.books,
      }));

      logInfo('Categories with counts retrieved', {
        count: categoriesWithCounts.length,
      });

      return categoriesWithCounts;
    } catch (error) {
      logError('Error getting categories with counts', error);
      return [];
    }
  }

  /**
   * Create a new category
   */
  static async createCategory(input: CreateCategoryInput): Promise<CategoryWithoutRelations> {
    try {
      // Generate slug if not provided
      const slug = input.slug || slugify(input.name);

      // Check if slug already exists
      const existingCategory = await prisma.category.findUnique({
        where: { slug },
      });

      if (existingCategory) {
        throw new Error('A category with this name already exists');
      }

      const category = await prisma.category.create({
        data: {
          ...input,
          slug,
        },
      });

      logInfo('Category created', {
        categoryId: category.id,
        name: category.name,
        slug: category.slug,
      });

      return category;
    } catch (error) {
      logError('Error creating category', error, { input });
      throw new Error('Failed to create category');
    }
  }

  /**
   * Update an existing category
   */
  static async updateCategory(input: UpdateCategoryInput): Promise<CategoryWithoutRelations> {
    try {
      const { id, ...updateData } = input;

      // If name is being updated, regenerate slug
      if (updateData.name) {
        updateData.slug = slugify(updateData.name);

        // Check if new slug conflicts with existing categories
        const existingCategory = await prisma.category.findFirst({
          where: {
            slug: updateData.slug,
            id: { not: id },
          },
        });

        if (existingCategory) {
          throw new Error('A category with this name already exists');
        }
      }

      const category = await prisma.category.update({
        where: { id },
        data: updateData,
      });

      logInfo('Category updated', {
        categoryId: category.id,
        name: category.name,
        changes: Object.keys(updateData),
      });

      return category;
    } catch (error) {
      logError('Error updating category', error, { input });
      throw new Error('Failed to update category');
    }
  }

  /**
   * Delete a category
   */
  static async deleteCategory(id: string): Promise<void> {
    try {
      // Check if category has books
      const bookCount = await prisma.book.count({
        where: { categoryId: id },
      });

      if (bookCount > 0) {
        throw new Error('Cannot delete category that contains books');
      }

      const category = await prisma.category.findUnique({
        where: { id },
        select: { name: true },
      });

      if (!category) {
        throw new Error('Category not found');
      }

      await prisma.category.delete({
        where: { id },
      });

      logInfo('Category deleted', {
        categoryId: id,
        name: category.name,
      });
    } catch (error) {
      logError('Error deleting category', error, { categoryId: id });
      throw new Error('Failed to delete category');
    }
  }

  /**
   * Toggle category status
   */
  static async toggleCategoryStatus(id: string): Promise<CategoryWithoutRelations> {
    try {
      const category = await prisma.category.findUnique({
        where: { id },
        select: { active: true, name: true },
      });

      if (!category) {
        throw new Error('Category not found');
      }

      const updatedCategory = await prisma.category.update({
        where: { id },
        data: {
          active: !category.active,
        },
      });

      logInfo('Category status toggled', {
        categoryId: id,
        name: category.name,
        newStatus: updatedCategory.active,
      });

      return updatedCategory;
    } catch (error) {
      logError('Error toggling category status', error, { categoryId: id });
      throw new Error('Failed to toggle category status');
    }
  }

  /**
   * Search categories by name
   */
  static async searchCategories(query: string): Promise<CategoryWithoutRelations[]> {
    try {
      const categories = await prisma.category.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { nameEn: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        orderBy: { name: 'asc' },
      });

      logInfo('Categories search completed', {
        query,
        count: categories.length,
      });

      return categories;
    } catch (error) {
      logError('Error searching categories', error, { query });
      return [];
    }
  }
}