import { prisma } from '@/lib/db/prisma';
import { slugify } from '@/lib/utils';
import type {
  Category,
  CategoryWithoutRelations,
  CreateCategoryInput,
  UpdateCategoryInput
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
        where: {
          active: true
        },
        orderBy: {
          name: 'asc'
        }
      });

      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }

  /**
   * Get all categories (including inactive for admin)
   */
  static async getAllCategories(): Promise<CategoryWithoutRelations[]> {
    try {
      const categories = await prisma.category.findMany({
        orderBy: {
          name: 'asc'
        }
      });

      return categories;
    } catch (error) {
      console.error('Error fetching all categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }

  /**
   * Get category by ID with book count
   */
  static async getCategoryById(id: string): Promise<Category | null> {
    try {
      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          books: {
            where: {
              active: true
            }
          }
        }
      });

      return category as Category | null;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw new Error('Failed to fetch category');
    }
  }

  /**
   * Get category by slug
   */
  static async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const category = await prisma.category.findUnique({
        where: { slug },
        include: {
          books: {
            where: {
              active: true
            }
          }
        }
      });

      return category as Category | null;
    } catch (error) {
      console.error('Error fetching category by slug:', error);
      throw new Error('Failed to fetch category');
    }
  }

  /**
   * Get categories with book counts
   */
  static async getCategoriesWithCounts(): Promise<Array<CategoryWithoutRelations & { bookCount: number }>> {
    try {
      const categories = await prisma.category.findMany({
        where: {
          active: true
        },
        include: {
          _count: {
            select: {
              books: {
                where: {
                  active: true
                }
              }
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      });

      return categories.map(category => ({
        id: category.id,
        name: category.name,
        nameEn: category.nameEn,
        slug: category.slug,
        description: category.description,
        active: category.active,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        bookCount: category._count.books
      }));
    } catch (error) {
      console.error('Error fetching categories with counts:', error);
      throw new Error('Failed to fetch categories');
    }
  }

  /**
   * Create new category
   */
  static async createCategory(input: CreateCategoryInput): Promise<CategoryWithoutRelations> {
    try {
      // Generate slug if not provided
      if (!input.slug) {
        input.slug = slugify(input.name);
      }

      // Ensure slug is unique
      const existingCategory = await prisma.category.findUnique({
        where: { slug: input.slug }
      });

      if (existingCategory) {
        input.slug = `${input.slug}-${Date.now()}`;
      }

      const category = await prisma.category.create({
        data: input
      });

      return category;
    } catch (error) {
      console.error('Error creating category:', error);
      throw new Error('Failed to create category');
    }
  }

  /**
   * Update category
   */
  static async updateCategory(input: UpdateCategoryInput): Promise<CategoryWithoutRelations> {
    try {
      const { id, ...updateData } = input;

      // If updating slug, ensure it's unique
      if (updateData.slug) {
        const existingCategory = await prisma.category.findFirst({
          where: {
            slug: updateData.slug,
            id: { not: id }
          }
        });

        if (existingCategory) {
          updateData.slug = `${updateData.slug}-${Date.now()}`;
        }
      }

      const category = await prisma.category.update({
        where: { id },
        data: updateData
      });

      return category;
    } catch (error) {
      console.error('Error updating category:', error);
      throw new Error('Failed to update category');
    }
  }

  /**
   * Delete category (only if no books are associated)
   */
  static async deleteCategory(id: string): Promise<void> {
    try {
      // Check if category has any books
      const bookCount = await prisma.book.count({
        where: { categoryId: id }
      });

      if (bookCount > 0) {
        throw new Error('Cannot delete category with associated books');
      }

      await prisma.category.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to delete category');
    }
  }

  /**
   * Toggle category status
   */
  static async toggleCategoryStatus(id: string): Promise<CategoryWithoutRelations> {
    try {
      const category = await prisma.category.findUnique({
        where: { id }
      });

      if (!category) {
        throw new Error('Category not found');
      }

      const updatedCategory = await prisma.category.update({
        where: { id },
        data: {
          active: !category.active
        }
      });

      return updatedCategory;
    } catch (error) {
      console.error('Error toggling category status:', error);
      throw new Error('Failed to toggle category status');
    }
  }

  /**
   * Search categories
   */
  static async searchCategories(query: string): Promise<CategoryWithoutRelations[]> {
    try {
      const categories = await prisma.category.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { nameEn: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ],
          active: true
        },
        orderBy: {
          name: 'asc'
        }
      });

      return categories;
    } catch (error) {
      console.error('Error searching categories:', error);
      throw new Error('Failed to search categories');
    }
  }
}