import { prisma } from '@/lib/db/prisma';

export class EbookService {
  /**
   * Update book with digital file information
   */
  static async updateBookWithEbook(
    bookId: string,
    digitalFileUrl: string,
    digitalFileSize?: number
  ) {
    return await prisma.book.update({
      where: { id: bookId },
      data: {
        hasDigital: true,
        digitalFileUrl,
        digitalFileSize
      }
    });
  }

  /**
   * Get user's reading progress for a book
   */
  static async getReadingProgress(userId: string, bookId: string) {
    return await prisma.readingHistory.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId
        }
      }
    });
  }

  /**
   * Update reading progress
   */
  static async updateReadingProgress(
    userId: string,
    bookId: string,
    data: {
      currentCfi?: string;
      progress?: number;
      readingTime?: number;
      completed?: boolean;
    }
  ) {
    return await prisma.readingHistory.upsert({
      where: {
        userId_bookId: {
          userId,
          bookId
        }
      },
      update: {
        ...data,
        lastReadAt: new Date(),
        ...(data.readingTime && {
          readingTime: {
            increment: data.readingTime
          }
        })
      },
      create: {
        userId,
        bookId,
        currentCfi: data.currentCfi || '',
        progress: data.progress || 0,
        readingTime: data.readingTime || 0,
        completed: data.completed || false,
        lastReadAt: new Date()
      }
    });
  }

  /**
   * Add bookmark
   */
  static async addBookmark(
    userId: string,
    bookId: string,
    bookmark: {
      id: string;
      cfi: string;
      excerpt: string;
      chapter?: string;
      created: Date;
    }
  ) {
    const readingHistory = await this.getReadingProgress(userId, bookId);
    const currentBookmarks = (readingHistory?.bookmarks as any[]) || [];
    
    const updatedBookmarks = [...currentBookmarks, bookmark];

    return await prisma.readingHistory.upsert({
      where: {
        userId_bookId: {
          userId,
          bookId
        }
      },
      update: {
        bookmarks: updatedBookmarks
      },
      create: {
        userId,
        bookId,
        bookmarks: updatedBookmarks,
        progress: 0
      }
    });
  }

  /**
   * Remove bookmark
   */
  static async removeBookmark(
    userId: string,
    bookId: string,
    bookmarkId: string
  ) {
    const readingHistory = await this.getReadingProgress(userId, bookId);
    
    if (!readingHistory) {
      throw new Error('Reading history not found');
    }

    const currentBookmarks = (readingHistory.bookmarks as any[]) || [];
    const updatedBookmarks = currentBookmarks.filter(
      (bookmark: any) => bookmark.id !== bookmarkId
    );

    return await prisma.readingHistory.update({
      where: {
        userId_bookId: {
          userId,
          bookId
        }
      },
      data: {
        bookmarks: updatedBookmarks
      }
    });
  }

  /**
   * Check if user has access to read a digital book
   */
  static async checkDigitalAccess(userId: string, bookId: string) {
    // Check if user has purchased the digital version
    const purchase = await prisma.orderItem.findFirst({
      where: {
        bookId,
        isDigital: true,
        order: {
          userId,
          status: {
            in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED']
          }
        }
      },
      include: {
        order: true,
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            digitalFileUrl: true,
            digitalFileSize: true,
            hasDigital: true
          }
        }
      }
    });

    if (!purchase || !purchase.book.hasDigital || !purchase.book.digitalFileUrl) {
      return null;
    }

    return {
      hasAccess: true,
      bookId: purchase.book.id,
      title: purchase.book.title,
      author: purchase.book.author,
      ebookUrl: purchase.book.digitalFileUrl,
      fileSize: purchase.book.digitalFileSize,
      purchaseDate: purchase.order.createdAt
    };
  }
}