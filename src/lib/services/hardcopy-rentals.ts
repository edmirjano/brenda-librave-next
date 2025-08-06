import { prisma } from '@/lib/db/prisma';

export interface HardcopyRentalOptions {
  rentalType: 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM' | 'EXTENDED_TERM';
  orderItemId: string;
  userId: string;
  bookId: string;
  shippingAddress: string;
  guaranteeAmount?: number;
}

export interface HardcopyRentalAccess {
  rentalId: string;
  bookId: string;
  title: string;
  author: string;
  rentalType: string;
  rentalPrice: number;
  guaranteeAmount: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  returnDate?: Date;
  isReturned: boolean;
  isDamaged: boolean;
  guaranteeRefunded: boolean;
  refundAmount?: number;
  initialCondition: string;
  returnCondition?: string;
  shippingAddress: string;
  trackingNumber?: string;
  returnTracking?: string;
  hasAccess: boolean;
}

export interface ReturnAssessment {
  returnCondition: 'EXCELLENT' | 'VERY_GOOD' | 'GOOD' | 'FAIR' | 'POOR' | 'DAMAGED';
  conditionNotes?: string;
  returnTracking?: string;
  isDamaged: boolean;
  damageNotes?: string;
}

export class HardcopyRentalService {
  /**
   * Create a new hardcopy book rental
   */
  static async createRental(options: HardcopyRentalOptions): Promise<HardcopyRentalAccess> {
    const { rentalType, orderItemId, userId, bookId, shippingAddress, guaranteeAmount } = options;

    // Validate rental type
    const validRentalTypes = ['SHORT_TERM', 'MEDIUM_TERM', 'LONG_TERM', 'EXTENDED_TERM'];
    if (!validRentalTypes.includes(rentalType)) {
      throw new Error('Invalid rental type');
    }

    // Check if book exists and is available for rental
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: {
        id: true,
        title: true,
        author: true,
        price: true,
        inventory: true,
        active: true
      }
    });

    if (!book) {
      throw new Error('Book not found');
    }

    if (!book.active) {
      throw new Error('Book not available for rental');
    }

    if (book.inventory <= 0) {
      throw new Error('Book not in stock for rental');
    }

    // Check if user has purchased this rental
    const orderItem = await prisma.orderItem.findFirst({
      where: {
        id: orderItemId,
        bookId: bookId,
        isRental: true,
        order: {
          userId: userId,
          status: {
            in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED']
          }
        }
      },
      include: {
        order: true
      }
    });

    if (!orderItem) {
      throw new Error('Rental purchase not found or not paid');
    }

    // Check if user already has an active rental for this book
    const existingRental = await prisma.hardcopyRental.findFirst({
      where: {
        userId: userId,
        bookId: bookId,
        isActive: true,
        isReturned: false
      }
    });

    if (existingRental) {
      throw new Error('You already have an active rental for this book');
    }

    // Calculate rental duration and pricing based on type
    let endDate: Date;
    let rentalPrice: number;
    const startDate = new Date();
    
    switch (rentalType) {
      case 'SHORT_TERM':
        endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
        rentalPrice = Math.round(book.price * 0.15); // 15% of book price
        break;
      case 'MEDIUM_TERM':
        endDate = new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days
        rentalPrice = Math.round(book.price * 0.25); // 25% of book price
        break;
      case 'LONG_TERM':
        endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
        rentalPrice = Math.round(book.price * 0.4); // 40% of book price
        break;
      case 'EXTENDED_TERM':
        endDate = new Date(startDate.getTime() + 60 * 24 * 60 * 60 * 1000); // 60 days
        rentalPrice = Math.round(book.price * 0.6); // 60% of book price
        break;
      default:
        endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        rentalPrice = Math.round(book.price * 0.15);
    }

    // Calculate guarantee amount (default to 80% of book price if not provided)
    const calculatedGuarantee = guaranteeAmount || Math.round(book.price * 0.8);

    // Create the hardcopy rental
    const rental = await prisma.hardcopyRental.create({
      data: {
        userId: userId,
        bookId: bookId,
        orderItemId: orderItemId,
        rentalType: rentalType as any,
        rentalPrice,
        guaranteeAmount: calculatedGuarantee,
        currency: orderItem.currency,
        startDate,
        endDate,
        shippingAddress,
        isActive: true,
        isReturned: false,
        initialCondition: 'EXCELLENT'
      }
    });

    // Log the rental creation
    await prisma.hardcopyRentalLog.create({
      data: {
        rentalId: rental.id,
        userId: userId,
        bookId: bookId,
        logType: 'RENTAL_CREATED',
        description: `Hardcopy rental created for ${rentalType} period`,
        amount: rentalPrice,
        currency: orderItem.currency
      }
    });

    // Log guarantee charge
    await prisma.hardcopyRentalLog.create({
      data: {
        rentalId: rental.id,
        userId: userId,
        bookId: bookId,
        logType: 'GUARANTEE_CHARGED',
        description: `Guarantee amount charged: ${calculatedGuarantee} ${orderItem.currency}`,
        amount: calculatedGuarantee,
        currency: orderItem.currency
      }
    });

    // Update book inventory (reserve one copy)
    await prisma.book.update({
      where: { id: bookId },
      data: {
        inventory: {
          decrement: 1
        }
      }
    });

    return {
      rentalId: rental.id,
      bookId: book.id,
      title: book.title,
      author: book.author,
      rentalType: rental.rentalType,
      rentalPrice: rental.rentalPrice,
      guaranteeAmount: rental.guaranteeAmount,
      currency: rental.currency,
      startDate: rental.startDate,
      endDate: rental.endDate,
      returnDate: rental.returnDate,
      isReturned: rental.isReturned,
      isDamaged: rental.isDamaged,
      guaranteeRefunded: rental.guaranteeRefunded,
      refundAmount: rental.refundAmount,
      initialCondition: rental.initialCondition,
      returnCondition: rental.returnCondition,
      shippingAddress: rental.shippingAddress,
      trackingNumber: rental.trackingNumber,
      returnTracking: rental.returnTracking,
      hasAccess: true
    };
  }

  /**
   * Check if user has access to a hardcopy rental
   */
  static async checkRentalAccess(
    userId: string, 
    bookId: string, 
    rentalId: string
  ): Promise<HardcopyRentalAccess | null> {
    const rental = await prisma.hardcopyRental.findFirst({
      where: {
        id: rentalId,
        userId: userId,
        bookId: bookId,
        isActive: true
      },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            price: true
          }
        }
      }
    });

    if (!rental) {
      return null;
    }

    return {
      rentalId: rental.id,
      bookId: rental.book.id,
      title: rental.book.title,
      author: rental.book.author,
      rentalType: rental.rentalType,
      rentalPrice: rental.rentalPrice,
      guaranteeAmount: rental.guaranteeAmount,
      currency: rental.currency,
      startDate: rental.startDate,
      endDate: rental.endDate,
      returnDate: rental.returnDate,
      isReturned: rental.isReturned,
      isDamaged: rental.isDamaged,
      guaranteeRefunded: rental.guaranteeRefunded,
      refundAmount: rental.refundAmount,
      initialCondition: rental.initialCondition,
      returnCondition: rental.returnCondition,
      shippingAddress: rental.shippingAddress,
      trackingNumber: rental.trackingNumber,
      returnTracking: rental.returnTracking,
      hasAccess: true
    };
  }

  /**
   * Return a hardcopy rental with condition assessment
   */
  static async returnRental(
    rentalId: string,
    userId: string,
    bookId: string,
    assessment: ReturnAssessment
  ) {
    const rental = await prisma.hardcopyRental.findFirst({
      where: {
        id: rentalId,
        userId: userId,
        bookId: bookId,
        isActive: true,
        isReturned: false
      },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            price: true
          }
        }
      }
    });

    if (!rental) {
      throw new Error('Rental not found or already returned');
    }

    // Calculate refund amount based on condition
    let refundAmount = rental.guaranteeAmount;
    let damageDeduction = 0;

    switch (assessment.returnCondition) {
      case 'EXCELLENT':
        // Full refund
        refundAmount = rental.guaranteeAmount;
        break;
      case 'VERY_GOOD':
        // 95% refund
        damageDeduction = rental.guaranteeAmount * 0.05;
        refundAmount = rental.guaranteeAmount - damageDeduction;
        break;
      case 'GOOD':
        // 90% refund
        damageDeduction = rental.guaranteeAmount * 0.10;
        refundAmount = rental.guaranteeAmount - damageDeduction;
        break;
      case 'FAIR':
        // 75% refund
        damageDeduction = rental.guaranteeAmount * 0.25;
        refundAmount = rental.guaranteeAmount - damageDeduction;
        break;
      case 'POOR':
        // 50% refund
        damageDeduction = rental.guaranteeAmount * 0.50;
        refundAmount = rental.guaranteeAmount - damageDeduction;
        break;
      case 'DAMAGED':
        // No refund or minimal refund
        damageDeduction = rental.guaranteeAmount * 0.90;
        refundAmount = rental.guaranteeAmount - damageDeduction;
        break;
      default:
        refundAmount = rental.guaranteeAmount;
    }

    // Check if rental is late
    const now = new Date();
    const isLate = now > rental.endDate;
    let lateFee = 0;

    if (isLate) {
      const daysLate = Math.ceil((now.getTime() - rental.endDate.getTime()) / (1000 * 60 * 60 * 24));
      lateFee = daysLate * (rental.rentalPrice * 0.1); // 10% of rental price per day
      refundAmount = Math.max(0, refundAmount - lateFee);
    }

    // Update the rental
    const updatedRental = await prisma.hardcopyRental.update({
      where: { id: rentalId },
      data: {
        isReturned: true,
        returnDate: now,
        returnCondition: assessment.returnCondition as any,
        conditionNotes: assessment.conditionNotes,
        returnTracking: assessment.returnTracking,
        isDamaged: assessment.isDamaged || assessment.returnCondition === 'DAMAGED',
        damageNotes: assessment.damageNotes,
        guaranteeRefunded: true,
        refundAmount,
        isActive: false
      }
    });

    // Log the return
    await prisma.hardcopyRentalLog.create({
      data: {
        rentalId: rental.id,
        userId: userId,
        bookId: bookId,
        logType: 'BOOK_RETURNED',
        description: `Book returned in ${assessment.returnCondition} condition`,
        amount: 0,
        currency: rental.currency
      }
    });

    // Log damage assessment if applicable
    if (damageDeduction > 0) {
      await prisma.hardcopyRentalLog.create({
        data: {
          rentalId: rental.id,
          userId: userId,
          bookId: bookId,
          logType: 'DAMAGE_ASSESSED',
          description: `Damage deduction: ${damageDeduction} ${rental.currency}`,
          amount: damageDeduction,
          currency: rental.currency
        }
      });
    }

    // Log late fee if applicable
    if (lateFee > 0) {
      await prisma.hardcopyRentalLog.create({
        data: {
          rentalId: rental.id,
          userId: userId,
          bookId: bookId,
          logType: 'LATE_FEE_CHARGED',
          description: `Late fee: ${lateFee} ${rental.currency}`,
          amount: lateFee,
          currency: rental.currency
        }
      });
    }

    // Log guarantee refund
    await prisma.hardcopyRentalLog.create({
      data: {
        rentalId: rental.id,
        userId: userId,
        bookId: bookId,
        logType: 'GUARANTEE_REFUNDED',
        description: `Guarantee refunded: ${refundAmount} ${rental.currency}`,
        amount: refundAmount,
        currency: rental.currency
      }
    });

    // Log rental completion
    await prisma.hardcopyRentalLog.create({
      data: {
        rentalId: rental.id,
        userId: userId,
        bookId: bookId,
        logType: 'RENTAL_COMPLETED',
        description: 'Hardcopy rental completed',
        amount: 0,
        currency: rental.currency
      }
    });

    // Update book inventory (return one copy)
    await prisma.book.update({
      where: { id: bookId },
      data: {
        inventory: {
          increment: 1
        }
      }
    });

    return {
      rentalId: rental.id,
      bookId: rental.book.id,
      title: rental.book.title,
      returnDate: updatedRental.returnDate,
      returnCondition: updatedRental.returnCondition,
      isDamaged: updatedRental.isDamaged,
      damageDeduction,
      lateFee,
      refundAmount: updatedRental.refundAmount,
      guaranteeAmount: rental.guaranteeAmount,
      currency: rental.currency,
      isLate,
      success: true
    };
  }

  /**
   * Get user's active hardcopy rentals
   */
  static async getUserRentals(userId: string) {
    return await prisma.hardcopyRental.findMany({
      where: {
        userId: userId,
        isActive: true,
        isReturned: false
      },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            coverImage: true,
            price: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Get hardcopy rental history for a user
   */
  static async getRentalHistory(userId: string) {
    return await prisma.hardcopyRental.findMany({
      where: {
        userId: userId
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
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Get rental logs for a specific rental
   */
  static async getRentalLogs(rentalId: string, userId: string) {
    return await prisma.hardcopyRentalLog.findMany({
      where: {
        rentalId: rentalId,
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Calculate rental pricing for a book
   */
  static calculateRentalPricing(bookPrice: number) {
    return {
      SHORT_TERM: {
        duration: '7 days',
        rentalPrice: Math.round(bookPrice * 0.15),
        guaranteeAmount: Math.round(bookPrice * 0.8)
      },
      MEDIUM_TERM: {
        duration: '14 days',
        rentalPrice: Math.round(bookPrice * 0.25),
        guaranteeAmount: Math.round(bookPrice * 0.8)
      },
      LONG_TERM: {
        duration: '30 days',
        rentalPrice: Math.round(bookPrice * 0.4),
        guaranteeAmount: Math.round(bookPrice * 0.8)
      },
      EXTENDED_TERM: {
        duration: '60 days',
        rentalPrice: Math.round(bookPrice * 0.6),
        guaranteeAmount: Math.round(bookPrice * 0.8)
      }
    };
  }

  /**
   * Get hardcopy rental statistics for admin
   */
  static async getRentalStats() {
    const totalRentals = await prisma.hardcopyRental.count();
    const activeRentals = await prisma.hardcopyRental.count({
      where: {
        isActive: true,
        isReturned: false
      }
    });
    const returnedRentals = await prisma.hardcopyRental.count({
      where: {
        isReturned: true
      }
    });
    const damagedRentals = await prisma.hardcopyRental.count({
      where: {
        isDamaged: true
      }
    });

    const recentRentals = await prisma.hardcopyRental.findMany({
      take: 10,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        book: {
          select: {
            title: true,
            author: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return {
      totalRentals,
      activeRentals,
      returnedRentals,
      damagedRentals,
      recentRentals
    };
  }
} 