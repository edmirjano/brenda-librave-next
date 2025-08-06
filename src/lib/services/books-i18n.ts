import { TranslationService } from './translations';
import { prisma } from '@/lib/db/prisma';
import type { Locale } from '@/lib/i18n/config';

export interface BookWithTranslations {
  id: string;
  slug: string;
  isbn?: string | null;
  baseLanguage: string;
  price?: number | null;
  digitalPrice?: number | null;
  baseCurrency: string;
  inventory: number;
  hasDigital: boolean;
  digitalFileUrl?: string | null;
  digitalFileSize?: number | null;
  coverImage?: string | null;
  publishedDate?: Date | null;
  featured: boolean;
  active: boolean;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  translations: {
    title: string;
    description: string;
    author: string;
  };
  category?: {
    id: string;
    slug: string;
    translations: {
      name: string;
    };
  };
  tags?: Array<{
    tag: {
      id: string;
      slug: string;
      color?: string | null;
      translations: {
        name: string;
      };
    };
  }>;
}

export class BooksI18nService {
  static async getBookWithTranslations(
    id: string, 
    language: Locale,
    includeRelations = true
  ): Promise<BookWithTranslations | null> {
    const book = await prisma.book.findUnique({
      where: { id },
      include: includeRelations ? {
        category: true,
        tags: { include: { tag: true } }
      } : undefined
    });

    if (!book) return null;

    const translations = await TranslationService.getTranslations(
      'Book',
      id,
      language
    );

    let categoryTranslations = {};
    if (book.category && includeRelations) {
      categoryTranslations = await TranslationService.getTranslations(
        'Category',
        book.category.id,
        language
      );
    }

    const tagTranslations = includeRelations && book.tags ? 
      await Promise.all(
        book.tags.map(({ tag }) => 
          TranslationService.getTranslations('Tag', tag.id, language)
        )
      ) : [];

    return {
      ...book,
      translations: {
        title: translations.title || '',
        description: translations.description || '',
        author: translations.author || '',
      },
      ...(includeRelations && {
        category: book.category ? {
          ...book.category,
          translations: {
            name: categoryTranslations.name || ''
          }
        } : undefined,
        tags: book.tags?.map((bookTag, index) => ({
          tag: {
            ...bookTag.tag,
            translations: {
              name: tagTranslations[index]?.name || ''
            }
          }
        }))
      })
    };
  }

  static async getBooksWithTranslations(
    language: Locale,
    options?: {
      limit?: number;
      offset?: number;
      categoryId?: string;
      featured?: boolean;
      search?: string;
    }
  ): Promise<BookWithTranslations[]> {
    const books = await prisma.book.findMany({
      where: {
        active: true,
        ...(options?.categoryId && { categoryId: options.categoryId }),
        ...(options?.featured !== undefined && { featured: options.featured })
      },
      include: {
        category: true,
        tags: { include: { tag: true } }
      },
      take: options?.limit,
      skip: options?.offset,
      orderBy: { createdAt: 'desc' }
    });

    // Bulk fetch translations for all books
    const allBookTranslations = await Promise.all(
      books.map(book => 
        TranslationService.getTranslations('Book', book.id, language)
      )
    );

    // Bulk fetch category translations
    const allCategoryTranslations = await Promise.all(
      books.map(book => 
        TranslationService.getTranslations('Category', book.categoryId, language)
      )
    );

    // Bulk fetch tag translations for all books
    const allTagTranslations = await Promise.all(
      books.map(async book => {
        const tagTranslations = await Promise.all(
          book.tags.map(({ tag }) => 
            TranslationService.getTranslations('Tag', tag.id, language)
          )
        );
        return tagTranslations;
      })
    );

    return books.map((book, bookIndex) => ({
      ...book,
      translations: {
        title: allBookTranslations[bookIndex].title || '',
        description: allBookTranslations[bookIndex].description || '',
        author: allBookTranslations[bookIndex].author || '',
      },
      category: book.category ? {
        ...book.category,
        translations: {
          name: allCategoryTranslations[bookIndex].name || ''
        }
      } : undefined,
      tags: book.tags?.map((bookTag, tagIndex) => ({
        tag: {
          ...bookTag.tag,
          translations: {
            name: allTagTranslations[bookIndex][tagIndex]?.name || ''
          }
        }
      }))
    }));
  }

  static async searchBooksWithTranslations(
    query: string,
    language: Locale,
    options?: {
      limit?: number;
      offset?: number;
      categoryId?: string;
    }
  ): Promise<BookWithTranslations[]> {
    // For now, search in the translation table
    // In production, you might want to use a full-text search engine
    const translationMatches = await prisma.translation.findMany({
      where: {
        entityType: 'Book',
        language,
        OR: [
          { key: 'title', value: { contains: query, mode: 'insensitive' } },
          { key: 'author', value: { contains: query, mode: 'insensitive' } },
          { key: 'description', value: { contains: query, mode: 'insensitive' } }
        ]
      },
      select: { entityId: true },
      distinct: ['entityId']
    });

    const bookIds = translationMatches.map(t => t.entityId);

    if (bookIds.length === 0) {
      return [];
    }

    const books = await prisma.book.findMany({
      where: {
        id: { in: bookIds },
        active: true,
        ...(options?.categoryId && { categoryId: options.categoryId })
      },
      include: {
        category: true,
        tags: { include: { tag: true } }
      },
      take: options?.limit,
      skip: options?.offset,
      orderBy: { createdAt: 'desc' }
    });

    // Convert to BookWithTranslations format
    return this.convertToTranslatedBooks(books, language);
  }

  private static async convertToTranslatedBooks(
    books: any[],
    language: Locale
  ): Promise<BookWithTranslations[]> {
    const allBookTranslations = await Promise.all(
      books.map(book => 
        TranslationService.getTranslations('Book', book.id, language)
      )
    );

    const allCategoryTranslations = await Promise.all(
      books.map(book => 
        TranslationService.getTranslations('Category', book.categoryId, language)
      )
    );

    const allTagTranslations = await Promise.all(
      books.map(async book => {
        if (!book.tags) return [];
        const tagTranslations = await Promise.all(
          book.tags.map(({ tag }: any) => 
            TranslationService.getTranslations('Tag', tag.id, language)
          )
        );
        return tagTranslations;
      })
    );

    return books.map((book, bookIndex) => ({
      ...book,
      translations: {
        title: allBookTranslations[bookIndex].title || '',
        description: allBookTranslations[bookIndex].description || '',
        author: allBookTranslations[bookIndex].author || '',
      },
      category: book.category ? {
        ...book.category,
        translations: {
          name: allCategoryTranslations[bookIndex].name || ''
        }
      } : undefined,
      tags: book.tags?.map((bookTag: any, tagIndex: number) => ({
        tag: {
          ...bookTag.tag,
          translations: {
            name: allTagTranslations[bookIndex][tagIndex]?.name || ''
          }
        }
      }))
    }));
  }
}