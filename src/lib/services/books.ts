import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/db/prisma';
import { logError, logInfo } from '@/lib/logging/logger';
import { slugify } from '@/lib/utils';

import type {
  BookDetailView,
  BookListItem,
  BookSearchParams,
  BookSearchResult,
  BookStats,
  CreateBookInput,
  UpdateBookInput,
} from '@/types/book';

/**
 * Service class for book-related operations
 */
export class BookService {
  /**
   * Search books with filters and pagination
   */
  static async searchBooks(params: BookSearchParams): Promise<BookSearchResult> {
    try {
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
        limit = 12,
      } = params;

      const offset = (page - 1) * limit;

      // Build where clause
      const where: Prisma.BookWhereInput = {
        active,
        ...(featured !== undefined && { featured }),
        ...(categoryId && { categoryId }),
        ...(language && { language }),
        ...(query && {
          OR: [
            { title: { contains: query } },
            { author: { contains: query } },
            { description: { contains: query } },
            { isbn: { contains: query } },
          ],
        }),
        ...(tags && tags.length > 0 && {
          tags: {
            some: {
              tag: {
                slug: { in: tags },
              },
            },
          },
        }),
        ...(minPrice !== undefined &&
          maxPrice !== undefined && {
            OR: [
              {
                ...(currency === 'ALL'
                  ? {
                      priceALL: {
                        gte: minPrice,
                        lte: maxPrice,
                      },
                    }
                  : {
                      priceEUR: {
                        gte: minPrice,
                        lte: maxPrice,
                      },
                    }),
              },
            ],
          }),
      };

      // Build order by clause
      const orderBy: Prisma.BookOrderByWithRelationInput = {};
      if (sortBy === 'title') {
        orderBy.title = sortOrder;
      } else if (sortBy === 'author') {
        orderBy.author = sortOrder;
      } else if (sortBy === 'price') {
        orderBy[currency === 'ALL' ? 'priceALL' : 'priceEUR'] = sortOrder;
      } else if (sortBy === 'featured') {
        orderBy.featured = sortOrder;
      } else {
        orderBy.createdAt = sortOrder;
      }

      // Execute queries
      const [books, totalCount] = await Promise.all([
        prisma.book.findMany({
          where,
          include: {
            category: true,
            tags: {
              include: {
                tag: true,
              },
            },
          },
          orderBy,
          skip: offset,
          take: limit,
        }),
        prisma.book.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      logInfo('Books search completed', {
        query,
        totalCount,
        page,
        limit,
      });

      return {
        books,
        totalCount,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      logError('Error searching books', error);
      throw new Error('Failed to search books');
    }
  }

  /**
   * Get book by ID with full details
   */
  static async getBookById(id: string): Promise<BookDetailView | null> {
    try {
      const book = await prisma.book.findUnique({
        where: { id },
        include: {
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      if (book) {
        logInfo('Book retrieved by ID', { bookId: id, title: book.title });
      }

      return book;
    } catch (error) {
      logError('Error getting book by ID', error, { bookId: id });
      return null;
    }
  }

  /**
   * Get book by slug with full details
   */
  static async getBookBySlug(slug: string): Promise<BookDetailView | null> {
    try {
      const book = await prisma.book.findUnique({
        where: { slug },
        include: {
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      if (book) {
        logInfo('Book retrieved by slug', { slug, title: book.title });
      }

      return book;
    } catch (error) {
      logError('Error getting book by slug', error, { slug });
      return null;
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
          active: true,
        },
        include: {
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
      });

      logInfo('Featured books retrieved', { count: books.length, limit });

      return books;
    } catch (error) {
      logError('Error getting featured books', error);
      return [];
    }
  }

  /**
   * Get related books based on category and tags
   */
  static async getRelatedBooks(bookId: string, limit: number = 4): Promise<BookListItem[]> {
    try {
      const currentBook = await prisma.book.findUnique({
        where: { id: bookId },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      if (!currentBook) {
        return [];
      }

      const tagIds = currentBook.tags.map((bt) => bt.tag.id);

      const relatedBooks = await prisma.book.findMany({
        where: {
          id: { not: bookId },
          active: true,
          OR: [
            { categoryId: currentBook.categoryId },
            {
              tags: {
                some: {
                  tagId: { in: tagIds },
                },
              },
            },
          ],
        },
        include: {
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: {
          featured: 'desc',
        },
        take: limit,
      });

      logInfo('Related books retrieved', {
        bookId,
        count: relatedBooks.length,
        limit,
      });

      return relatedBooks;
    } catch (error) {
      logError('Error getting related books', error, { bookId });
      return [];
    }
  }

  /**
   * Create a new book
   */
  static async createBook(input: CreateBookInput): Promise<BookDetailView> {
    try {
      // Generate slug if not provided
      const slug = input.slug || slugify(input.title);

      // Check if slug already exists
      const existingBook = await prisma.book.findUnique({
        where: { slug },
      });

      if (existingBook) {
        throw new Error('A book with this title already exists');
      }

      const { tagIds, ...bookData } = input;

      const book = await prisma.book.create({
        data: {
          ...bookData,
          slug,
          ...(tagIds &&
            tagIds.length > 0 && {
              tags: {
                create: tagIds.map((tagId) => ({
                  tag: {
                    connect: { id: tagId },
                  },
                })),
              },
            }),
        },
        include: {
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      logInfo('Book created', {
        bookId: book.id,
        title: book.title,
        author: book.author,
      });

      return book;
    } catch (error) {
      logError('Error creating book', error, { input });
      throw new Error('Failed to create book');
    }
  }

  /**
   * Update an existing book
   */
  static async updateBook(input: UpdateBookInput): Promise<BookDetailView> {
    try {
      const { id, tagIds, ...updateData } = input;

      // If title is being updated, regenerate slug
      if (updateData.title) {
        updateData.slug = slugify(updateData.title);

        // Check if new slug conflicts with existing books
        const existingBook = await prisma.book.findFirst({
          where: {
            slug: updateData.slug,
            id: { not: id },
          },
        });

        if (existingBook) {
          throw new Error('A book with this title already exists');
        }
      }

      // Handle tag updates
      const book = await prisma.book.update({
        where: { id },
        data: {
          ...updateData,
          ...(tagIds !== undefined && {
            tags: {
              deleteMany: {},
              create: tagIds.map((tagId) => ({
                tag: {
                  connect: { id: tagId },
                },
              })),
            },
          }),
        },
        include: {
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      logInfo('Book updated', {
        bookId: book.id,
        title: book.title,
        changes: Object.keys(updateData),
      });

      return book;
    } catch (error) {
      logError('Error updating book', error, { input });
      throw new Error('Failed to update book');
    }
  }

  /**
   * Delete a book
   */
  static async deleteBook(id: string): Promise<void> {
    try {
      const book = await prisma.book.findUnique({
        where: { id },
        select: { title: true, author: true },
      });

      if (!book) {
        throw new Error('Book not found');
      }

      await prisma.book.delete({
        where: { id },
      });

      logInfo('Book deleted', {
        bookId: id,
        title: book.title,
        author: book.author,
      });
    } catch (error) {
      logError('Error deleting book', error, { bookId: id });
      throw new Error('Failed to delete book');
    }
  }

  /**
   * Get book statistics
   */
  static async getBookStats(): Promise<BookStats> {
    try {
      const [
        totalBooks,
        activeBooks,
        featuredBooks,
        booksWithDigital,
        categoriesCount,
        tagsCount,
      ] = await Promise.all([
        prisma.book.count(),
        prisma.book.count({ where: { active: true } }),
        prisma.book.count({ where: { featured: true, active: true } }),
        prisma.book.count({ where: { hasDigital: true, active: true } }),
        prisma.category.count({ where: { active: true } }),
        prisma.tag.count(),
      ]);

      const stats = {
        totalBooks,
        activeBooks,
        featuredBooks,
        booksWithDigital,
        categoriesCount,
        tagsCount,
      };

      logInfo('Book stats retrieved', stats);

      return stats;
    } catch (error) {
      logError('Error getting book stats', error);
      throw new Error('Failed to get book statistics');
    }
  }

  /**
   * Bulk update book status
   */
  static async bulkUpdateBookStatus(bookIds: string[], active: boolean): Promise<number> {
    try {
      const result = await prisma.book.updateMany({
        where: {
          id: { in: bookIds },
        },
        data: {
          active,
        },
      });

      logInfo('Bulk book status update', {
        bookIds,
        active,
        updatedCount: result.count,
      });

      return result.count;
    } catch (error) {
      logError('Error bulk updating book status', error, { bookIds, active });
      throw new Error('Failed to bulk update book status');
    }
  }
}