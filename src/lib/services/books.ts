import { prisma } from '@/lib/db/prisma';
import { slugify } from '@/lib/utils';
import type {
  BookSearchParams,
  BookSearchResult,
  CreateBookInput,
  UpdateBookInput,
  BookListItem,
  BookDetailView,
  BookStats,
  PaginationOptions
} from '@/types/book';

/**
 * Service class for book-related operations
 */
export class BookService {
  /**
   * Search books with filters and pagination
   */
  static async searchBooks(params: BookSearchParams): Promise<BookSearchResult> {
    const {
      query,
      categoryId,
      tags,
      language,
      minPrice,
      maxPrice,
      currency = 'ALL',
      featured,
      active = true,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 12
    } = params;

    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = {
      active: active
    };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { author: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (language) {
      where.language = language;
    }

    if (featured !== undefined) {
      where.featured = featured;
    }

    if (tags && tags.length > 0) {
      where.tags = {
        some: {
          tagId: {
            in: tags
          }
        }
      };
    }

    // Price filtering based on currency
    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceField = currency === 'ALL' ? 'priceALL' : 'priceEUR';
      where[priceField] = {};
      
      if (minPrice !== undefined) {
        where[priceField].gte = minPrice;
      }
      
      if (maxPrice !== undefined) {
        where[priceField].lte = maxPrice;
      }
    }

    // Build order by clause
    const orderBy: any = {};
    if (sortBy === 'price') {
      orderBy[currency === 'ALL' ? 'priceALL' : 'priceEUR'] = sortOrder;
    } else {
      orderBy[sortBy] = sortOrder;
    }

    try {
      const [books, totalCount] = await Promise.all([
        prisma.book.findMany({
          where,
          include: {
            category: true,
            tags: {
              include: {
                tag: true
              }
            }
          },
          orderBy,
          skip: offset,
          take: limit
        }),
        prisma.book.count({ where })
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        books: books as BookListItem[],
        totalCount,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      };
    } catch (error) {
      console.error('Error searching books:', error);
      throw new Error('Failed to search books');
    }
  }

  /**
   * Get book by ID
   */
  static async getBookById(id: string): Promise<BookDetailView | null> {
    try {
      const book = await prisma.book.findUnique({
        where: { id },
        include: {
          category: true,
          tags: {
            include: {
              tag: true
            }
          }
        }
      });

      return book as BookDetailView | null;
    } catch (error) {
      console.error('Error fetching book:', error);
      throw new Error('Failed to fetch book');
    }
  }

  /**
   * Get book by slug
   */
  static async getBookBySlug(slug: string): Promise<BookDetailView | null> {
    try {
      const book = await prisma.book.findUnique({
        where: { slug },
        include: {
          category: true,
          tags: {
            include: {
              tag: true
            }
          }
        }
      });

      return book as BookDetailView | null;
    } catch (error) {
      console.error('Error fetching book by slug:', error);
      throw new Error('Failed to fetch book');
    }
  }

  /**
   * Get featured books
   */
  static async getFeaturedBooks(limit: number = 8): Promise<BookListItem[]> {
    try {
      const books = await prisma.book.findMany({
        where: {
          featured: true,
          active: true
        },
        include: {
          category: true,
          tags: {
            include: {
              tag: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit
      });

      return books as BookListItem[];
    } catch (error) {
      console.error('Error fetching featured books:', error);
      throw new Error('Failed to fetch featured books');
    }
  }

  /**
   * Get related books (same category or author)
   */
  static async getRelatedBooks(bookId: string, limit: number = 4): Promise<BookListItem[]> {
    try {
      const book = await prisma.book.findUnique({
        where: { id: bookId },
        select: { categoryId: true, author: true }
      });

      if (!book) return [];

      const books = await prisma.book.findMany({
        where: {
          AND: [
            { id: { not: bookId } },
            { active: true },
            {
              OR: [
                { categoryId: book.categoryId },
                { author: book.author }
              ]
            }
          ]
        },
        include: {
          category: true,
          tags: {
            include: {
              tag: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit
      });

      return books as BookListItem[];
    } catch (error) {
      console.error('Error fetching related books:', error);
      throw new Error('Failed to fetch related books');
    }
  }

  /**
   * Create new book
   */
  static async createBook(input: CreateBookInput): Promise<BookDetailView> {
    try {
      // Generate slug if not provided
      if (!input.slug) {
        input.slug = slugify(`${input.title}-${input.author}`);
      }

      // Ensure slug is unique
      const existingBook = await prisma.book.findUnique({
        where: { slug: input.slug }
      });

      if (existingBook) {
        input.slug = `${input.slug}-${Date.now()}`;
      }

      const { tagIds, ...bookData } = input;

      const book = await prisma.book.create({
        data: {
          ...bookData,
          tags: tagIds ? {
            create: tagIds.map(tagId => ({
              tag: {
                connect: { id: tagId }
              }
            }))
          } : undefined
        },
        include: {
          category: true,
          tags: {
            include: {
              tag: true
            }
          }
        }
      });

      return book as BookDetailView;
    } catch (error) {
      console.error('Error creating book:', error);
      throw new Error('Failed to create book');
    }
  }

  /**
   * Update book
   */
  static async updateBook(input: UpdateBookInput): Promise<BookDetailView> {
    try {
      const { id, tagIds, ...updateData } = input;

      // Handle tag updates
      if (tagIds !== undefined) {
        // Remove existing tags
        await prisma.bookTag.deleteMany({
          where: { bookId: id }
        });

        // Add new tags
        if (tagIds.length > 0) {
          await prisma.bookTag.createMany({
            data: tagIds.map(tagId => ({
              bookId: id,
              tagId
            }))
          });
        }
      }

      const book = await prisma.book.update({
        where: { id },
        data: updateData,
        include: {
          category: true,
          tags: {
            include: {
              tag: true
            }
          }
        }
      });

      return book as BookDetailView;
    } catch (error) {
      console.error('Error updating book:', error);
      throw new Error('Failed to update book');
    }
  }

  /**
   * Delete book
   */
  static async deleteBook(id: string): Promise<void> {
    try {
      await prisma.book.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error deleting book:', error);
      throw new Error('Failed to delete book');
    }
  }

  /**
   * Get book statistics for admin dashboard
   */
  static async getBookStats(): Promise<BookStats> {
    try {
      const [
        totalBooks,
        activeBooks,
        featuredBooks,
        booksWithDigital,
        categoriesCount,
        tagsCount
      ] = await Promise.all([
        prisma.book.count(),
        prisma.book.count({ where: { active: true } }),
        prisma.book.count({ where: { featured: true } }),
        prisma.book.count({ where: { hasDigital: true } }),
        prisma.category.count({ where: { active: true } }),
        prisma.tag.count()
      ]);

      return {
        totalBooks,
        activeBooks,
        featuredBooks,
        booksWithDigital,
        categoriesCount,
        tagsCount
      };
    } catch (error) {
      console.error('Error fetching book stats:', error);
      throw new Error('Failed to fetch book stats');
    }
  }

  /**
   * Bulk update book status
   */
  static async bulkUpdateBookStatus(bookIds: string[], active: boolean): Promise<number> {
    try {
      const result = await prisma.book.updateMany({
        where: {
          id: {
            in: bookIds
          }
        },
        data: {
          active
        }
      });

      return result.count;
    } catch (error) {
      console.error('Error bulk updating books:', error);
      throw new Error('Failed to update books');
    }
  }
}