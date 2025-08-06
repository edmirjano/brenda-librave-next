import { prisma } from '@/lib/db/prisma';
import { RentalService } from './rentals';
import { HardcopyRentalService } from './hardcopy-rentals';

export interface BookRentalInfo {
  bookId: string;
  title: string;
  author: string;
  hasDigital: boolean;
  hasHardcopy: boolean;
  digitalPrice?: number;
  hardcopyPrice?: number;
  inventory: number;
  currency: 'ALL' | 'EUR';
  activeRentals: {
    ebook?: {
      rentalId: string;
      rentalType: string;
      endDate: Date;
      hasAccess: boolean;
    };
    hardcopy?: {
      rentalId: string;
      rentalType: string;
      endDate: Date;
      hasAccess: boolean;
    };
  };
}

export interface RentalAvailability {
  hasEbookRental: boolean;
  hasHardcopyRental: boolean;
  ebookPricing?: {
    SHORT_TERM: { rentalPrice: number; duration: string };
    MEDIUM_TERM: { rentalPrice: number; duration: string };
    LONG_TERM: { rentalPrice: number; duration: string };
    UNLIMITED_READS: { rentalPrice: number; duration: string };
  };
  hardcopyPricing?: {
    SHORT_TERM: { rentalPrice: number; guaranteeAmount: number; duration: string };
    MEDIUM_TERM: { rentalPrice: number; guaranteeAmount: number; duration: string };
    LONG_TERM: { rentalPrice: number; guaranteeAmount: number; duration: string };
    EXTENDED_TERM: { rentalPrice: number; guaranteeAmount: number; duration: string };
  };
}

export class BookRentalService {
  /**
   * Get comprehensive rental information for a book
   */
  static async getBookRentalInfo(bookId: string, userId: string): Promise<BookRentalInfo | null> {
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: {
        id: true,
        title: true,
        author: true,
        hasDigital: true,
        hasHardcopy: true,
        digitalPrice: true,
        price: true,
        inventory: true,
        baseCurrency: true
      }
    });

    if (!book) {
      return null;
    }

    // Get active rentals for this user and book
    const [ebookRental, hardcopyRental] = await Promise.all([
      // Check for active ebook rental
      book.hasDigital ? prisma.ebookRental.findFirst({
        where: {
          userId,
          bookId,
          isActive: true,
          endDate: { gt: new Date() }
        },
        select: {
          id: true,
          rentalType: true,
          endDate: true
        }
      }) : null,
      
      // Check for active hardcopy rental
      book.hasHardcopy ? prisma.hardcopyRental.findFirst({
        where: {
          userId,
          bookId,
          isActive: true,
          isReturned: false
        },
        select: {
          id: true,
          rentalType: true,
          endDate: true
        }
      }) : null
    ]);

    return {
      bookId: book.id,
      title: book.title,
      author: book.author,
      hasDigital: book.hasDigital,
      hasHardcopy: book.hasHardcopy,
      digitalPrice: book.digitalPrice || undefined,
      hardcopyPrice: book.price || undefined,
      inventory: book.inventory,
      currency: book.baseCurrency,
      activeRentals: {
        ebook: ebookRental ? {
          rentalId: ebookRental.id,
          rentalType: ebookRental.rentalType,
          endDate: ebookRental.endDate,
          hasAccess: true
        } : undefined,
        hardcopy: hardcopyRental ? {
          rentalId: hardcopyRental.id,
          rentalType: hardcopyRental.rentalType,
          endDate: hardcopyRental.endDate,
          hasAccess: true
        } : undefined
      }
    };
  }

  /**
   * Get rental availability and pricing for a book
   */
  static async getRentalAvailability(bookId: string): Promise<RentalAvailability> {
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: {
        hasDigital: true,
        hasHardcopy: true,
        digitalPrice: true,
        price: true,
        inventory: true
      }
    });

    if (!book) {
      return {
        hasEbookRental: false,
        hasHardcopyRental: false
      };
    }

    const hasEbookRental = book.hasDigital && book.digitalPrice && book.digitalPrice > 0;
    const hasHardcopyRental = book.hasHardcopy && book.price && book.price > 0 && book.inventory > 0;

    const result: RentalAvailability = {
      hasEbookRental,
      hasHardcopyRental
    };

    // Calculate ebook pricing if available
    if (hasEbookRental && book.digitalPrice) {
      result.ebookPricing = {
        SHORT_TERM: {
          rentalPrice: Math.round(book.digitalPrice * 0.3),
          duration: '24 orë'
        },
        MEDIUM_TERM: {
          rentalPrice: Math.round(book.digitalPrice * 0.6),
          duration: '7 ditë'
        },
        LONG_TERM: {
          rentalPrice: Math.round(book.digitalPrice * 0.8),
          duration: '30 ditë'
        },
        UNLIMITED_READS: {
          rentalPrice: book.digitalPrice,
          duration: '30 ditë'
        }
      };
    }

    // Calculate hardcopy pricing if available
    if (hasHardcopyRental && book.price) {
      result.hardcopyPricing = {
        SHORT_TERM: {
          rentalPrice: Math.round(book.price * 0.15),
          guaranteeAmount: Math.round(book.price * 0.8),
          duration: '7 ditë'
        },
        MEDIUM_TERM: {
          rentalPrice: Math.round(book.price * 0.25),
          guaranteeAmount: Math.round(book.price * 0.8),
          duration: '14 ditë'
        },
        LONG_TERM: {
          rentalPrice: Math.round(book.price * 0.4),
          guaranteeAmount: Math.round(book.price * 0.8),
          duration: '30 ditë'
        },
        EXTENDED_TERM: {
          rentalPrice: Math.round(book.price * 0.6),
          guaranteeAmount: Math.round(book.price * 0.8),
          duration: '60 ditë'
        }
      };
    }

    return result;
  }

  /**
   * Create ebook rental
   */
  static async createEbookRental(
    bookId: string,
    userId: string,
    rentalType: string,
    orderItemId: string
  ) {
    return await RentalService.createRental({
      rentalType: rentalType as any,
      orderItemId,
      userId,
      bookId
    });
  }

  /**
   * Create hardcopy rental
   */
  static async createHardcopyRental(
    bookId: string,
    userId: string,
    rentalType: string,
    orderItemId: string,
    shippingAddress: string,
    guaranteeAmount?: number
  ) {
    return await HardcopyRentalService.createRental({
      rentalType: rentalType as any,
      orderItemId,
      userId,
      bookId,
      shippingAddress,
      guaranteeAmount
    });
  }

  /**
   * Check if user has any active rental for this book
   */
  static async hasActiveRental(bookId: string, userId: string): Promise<boolean> {
    const [ebookRental, hardcopyRental] = await Promise.all([
      prisma.ebookRental.findFirst({
        where: {
          userId,
          bookId,
          isActive: true,
          endDate: { gt: new Date() }
        }
      }),
      prisma.hardcopyRental.findFirst({
        where: {
          userId,
          bookId,
          isActive: true,
          isReturned: false
        }
      })
    ]);

    return !!(ebookRental || hardcopyRental);
  }

  /**
   * Get all active rentals for a user
   */
  static async getUserActiveRentals(userId: string) {
    const [ebookRentals, hardcopyRentals] = await Promise.all([
      prisma.ebookRental.findMany({
        where: {
          userId,
          isActive: true,
          endDate: { gt: new Date() }
        },
        include: {
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              coverImage: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.hardcopyRental.findMany({
        where: {
          userId,
          isActive: true,
          isReturned: false
        },
        include: {
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              coverImage: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return {
      ebookRentals,
      hardcopyRentals,
      totalActive: ebookRentals.length + hardcopyRentals.length
    };
  }

  /**
   * Get rental history for a user
   */
  static async getUserRentalHistory(userId: string) {
    const [ebookHistory, hardcopyHistory] = await Promise.all([
      prisma.ebookRental.findMany({
        where: { userId },
        include: {
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              coverImage: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.hardcopyRental.findMany({
        where: { userId },
        include: {
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              coverImage: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return {
      ebookHistory,
      hardcopyHistory,
      totalRentals: ebookHistory.length + hardcopyHistory.length
    };
  }

  /**
   * Get rental statistics for admin
   */
  static async getRentalStats() {
    const [
      ebookStats,
      hardcopyStats,
      totalEbookRentals,
      totalHardcopyRentals,
      activeEbookRentals,
      activeHardcopyRentals
    ] = await Promise.all([
      RentalService.getRentalStats(),
      HardcopyRentalService.getRentalStats(),
      prisma.ebookRental.count(),
      prisma.hardcopyRental.count(),
      prisma.ebookRental.count({
        where: {
          isActive: true,
          endDate: { gt: new Date() }
        }
      }),
      prisma.hardcopyRental.count({
        where: {
          isActive: true,
          isReturned: false
        }
      })
    ]);

    return {
      ebook: ebookStats,
      hardcopy: hardcopyStats,
      total: {
        ebook: totalEbookRentals,
        hardcopy: totalHardcopyRentals,
        combined: totalEbookRentals + totalHardcopyRentals
      },
      active: {
        ebook: activeEbookRentals,
        hardcopy: activeHardcopyRentals,
        combined: activeEbookRentals + activeHardcopyRentals
      }
    };
  }

  /**
   * Check if a book can be rented (has any rental option available)
   */
  static async canBeRented(bookId: string): Promise<boolean> {
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: {
        hasDigital: true,
        hasHardcopy: true,
        digitalPrice: true,
        price: true,
        inventory: true,
        active: true
      }
    });

    if (!book || !book.active) {
      return false;
    }

    const hasEbookRental = book.hasDigital && book.digitalPrice && book.digitalPrice > 0;
    const hasHardcopyRental = book.hasHardcopy && book.price && book.price > 0 && book.inventory > 0;

    return hasEbookRental || hasHardcopyRental;
  }

  /**
   * Get recommended rental type based on book characteristics
   */
  static async getRecommendedRentalType(bookId: string): Promise<'ebook' | 'hardcopy' | null> {
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: {
        hasDigital: true,
        hasHardcopy: true,
        digitalPrice: true,
        price: true,
        inventory: true,
        digitalFileSize: true
      }
    });

    if (!book) {
      return null;
    }

    const hasEbookRental = book.hasDigital && book.digitalPrice && book.digitalPrice > 0;
    const hasHardcopyRental = book.hasHardcopy && book.price && book.price > 0 && book.inventory > 0;

    // If only one option is available, recommend that
    if (hasEbookRental && !hasHardcopyRental) {
      return 'ebook';
    }
    if (hasHardcopyRental && !hasEbookRental) {
      return 'hardcopy';
    }

    // If both are available, recommend based on characteristics
    if (hasEbookRental && hasHardcopyRental) {
      // Recommend ebook for larger files (better for digital)
      if (book.digitalFileSize && book.digitalFileSize > 10 * 1024 * 1024) { // > 10MB
        return 'ebook';
      }
      
      // Recommend hardcopy for lower inventory (more valuable)
      if (book.inventory && book.inventory <= 2) {
        return 'hardcopy';
      }
      
      // Default to ebook for convenience
      return 'ebook';
    }

    return null;
  }
} 