import { prisma } from '@/lib/db/prisma';
import { randomBytes } from 'crypto';

export interface RentalOptions {
  rentalType: 'SINGLE_READ' | 'TIME_LIMITED' | 'UNLIMITED_READS';
  orderItemId: string;
  userId: string;
  bookId: string;
}

export interface RentalAccess {
  rentalId: string;
  securityToken: string;
  bookId: string;
  title: string;
  author: string;
  ebookUrl: string;
  fileSize: number;
  rentalType: string;
  startDate: Date;
  endDate: Date;
  accessCount: number;
  hasAccess: boolean;
}

export class RentalService {
  /**
   * Create a new ebook rental
   */
  static async createRental(options: RentalOptions): Promise<RentalAccess> {
    const { rentalType, orderItemId, userId, bookId } = options;

    // Validate rental type
    const validRentalTypes = ['SINGLE_READ', 'TIME_LIMITED', 'UNLIMITED_READS'];
    if (!validRentalTypes.includes(rentalType)) {
      throw new Error('Invalid rental type');
    }

    // Check if book exists and has digital version
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: {
        id: true,
        title: true,
        author: true,
        hasDigital: true,
        digitalFileUrl: true,
        digitalFileSize: true,
        digitalPrice: true
      }
    });

    if (!book) {
      throw new Error('Book not found');
    }

    if (!book.hasDigital || !book.digitalFileUrl) {
      throw new Error('Digital version not available');
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
    const existingRental = await prisma.ebookRental.findFirst({
      where: {
        userId: userId,
        bookId: bookId,
        isActive: true,
        endDate: {
          gt: new Date()
        }
      }
    });

    if (existingRental) {
      throw new Error('You already have an active rental for this book');
    }

    // Calculate rental duration based on type
    let endDate: Date;
    const startDate = new Date();
    
    switch (rentalType) {
      case 'SINGLE_READ':
        // Single read - expires after 24 hours
        endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
        break;
      case 'TIME_LIMITED':
        // Time limited - expires after 7 days
        endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case 'UNLIMITED_READS':
        // Unlimited reads - expires after 30 days
        endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
    }

    // Generate unique security token
    const securityToken = randomBytes(32).toString('hex');

    // Create watermark data (user-specific)
    const watermarkData = {
      userId: userId,
      rentalId: null, // Will be set after creation
      timestamp: new Date().toISOString(),
      deviceInfo: 'unknown'
    };

    // Create the rental
    const rental = await prisma.ebookRental.create({
      data: {
        userId: userId,
        bookId: bookId,
        orderItemId: orderItemId,
        rentalType: rentalType as any,
        rentalPrice: orderItem.price,
        currency: orderItem.currency,
        startDate,
        endDate,
        securityToken,
        watermarkData: JSON.stringify(watermarkData),
        isActive: true
      }
    });

    // Update watermark data with rental ID
    watermarkData.rentalId = rental.id;
    await prisma.ebookRental.update({
      where: { id: rental.id },
      data: {
        watermarkData: JSON.stringify(watermarkData)
      }
    });

    return {
      rentalId: rental.id,
      securityToken: rental.securityToken,
      bookId: book.id,
      title: book.title,
      author: book.author,
      ebookUrl: book.digitalFileUrl,
      fileSize: book.digitalFileSize || 0,
      rentalType: rental.rentalType,
      startDate: rental.startDate,
      endDate: rental.endDate,
      accessCount: 0,
      hasAccess: true
    };
  }

  /**
   * Check if user has access to a rental
   */
  static async checkRentalAccess(
    userId: string, 
    bookId: string, 
    rentalId: string, 
    securityToken: string
  ): Promise<RentalAccess | null> {
    const rental = await prisma.ebookRental.findFirst({
      where: {
        id: rentalId,
        securityToken: securityToken,
        userId: userId,
        bookId: bookId,
        isActive: true,
        endDate: {
          gt: new Date()
        }
      },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            hasDigital: true,
            digitalFileUrl: true,
            digitalFileSize: true
          }
        }
      }
    });

    if (!rental) {
      return null;
    }

    if (!rental.book.hasDigital || !rental.book.digitalFileUrl) {
      return null;
    }

    // Update access count and last access time
    await prisma.ebookRental.update({
      where: { id: rentalId },
      data: {
        accessCount: {
          increment: 1
        },
        lastAccessAt: new Date()
      }
    });

    return {
      rentalId: rental.id,
      securityToken: rental.securityToken,
      bookId: rental.book.id,
      title: rental.book.title,
      author: rental.book.author,
      ebookUrl: rental.book.digitalFileUrl,
      fileSize: rental.book.digitalFileSize || 0,
      rentalType: rental.rentalType,
      startDate: rental.startDate,
      endDate: rental.endDate,
      accessCount: rental.accessCount + 1,
      hasAccess: true
    };
  }

  /**
   * Get user's active rentals
   */
  static async getUserRentals(userId: string) {
    return await prisma.ebookRental.findMany({
      where: {
        userId: userId,
        isActive: true,
        endDate: {
          gt: new Date()
        }
      },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            coverImage: true,
            hasDigital: true,
            digitalFileUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Get rental history for a user
   */
  static async getRentalHistory(userId: string) {
    return await prisma.ebookRental.findMany({
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
   * End a rental early
   */
  static async endRental(rentalId: string, userId: string) {
    const rental = await prisma.ebookRental.findFirst({
      where: {
        id: rentalId,
        userId: userId,
        isActive: true
      }
    });

    if (!rental) {
      throw new Error('Rental not found');
    }

    await prisma.ebookRental.update({
      where: { id: rentalId },
      data: {
        isActive: false,
        endDate: new Date()
      }
    });

    return rental;
  }

  /**
   * Log security event
   */
  static async logSecurityEvent(
    rentalId: string,
    userId: string,
    bookId: string,
    eventType: string,
    details: any,
    requestInfo: {
      ipAddress?: string;
      userAgent?: string;
      sessionId?: string;
      deviceFingerprint?: string;
    }
  ) {
    const rental = await prisma.ebookRental.findFirst({
      where: {
        id: rentalId,
        userId: userId,
        bookId: bookId,
        isActive: true
      }
    });

    if (!rental) {
      throw new Error('Invalid rental');
    }

    // Determine access type based on event type
    let accessType: 'SECURITY_VIOLATION' | 'SUSPICIOUS_ACTIVITY' | 'RENTAL_END';
    let suspiciousActivity = false;

    switch (eventType) {
      case 'security_violation':
        accessType = 'SECURITY_VIOLATION';
        suspiciousActivity = true;
        break;
      case 'suspicious_activity':
        accessType = 'SUSPICIOUS_ACTIVITY';
        suspiciousActivity = true;
        break;
      case 'rental_end':
        accessType = 'RENTAL_END';
        suspiciousActivity = false;
        break;
      default:
        accessType = 'SUSPICIOUS_ACTIVITY';
        suspiciousActivity = true;
    }

    // Log the security event
    const securityLog = await prisma.ebookAccessLog.create({
      data: {
        rentalId: rental.id,
        userId: userId,
        bookId: bookId,
        accessType,
        ipAddress: requestInfo.ipAddress || 'unknown',
        userAgent: requestInfo.userAgent || 'unknown',
        sessionId: requestInfo.sessionId || userId,
        deviceFingerprint: requestInfo.deviceFingerprint || 'unknown',
        suspiciousActivity,
        securityFlags: JSON.stringify({
          eventType,
          details,
          timestamp: new Date().toISOString(),
          userAgent: requestInfo.userAgent,
          ipAddress: requestInfo.ipAddress,
          deviceFingerprint: requestInfo.deviceFingerprint
        })
      }
    });

    // If it's a security violation, update the rental status
    if (suspiciousActivity) {
      await prisma.ebookRental.update({
        where: { id: rentalId },
        data: {
          isActive: false // Deactivate rental on security violation
        }
      });
    }

    // If it's a rental end, update the rental status
    if (eventType === 'rental_end') {
      await prisma.ebookRental.update({
        where: { id: rentalId },
        data: {
          isActive: false,
          endDate: new Date() // Force end the rental
        }
      });
    }

    return securityLog;
  }

  /**
   * Get security logs for a rental
   */
  static async getSecurityLogs(rentalId: string, userId: string) {
    return await prisma.ebookAccessLog.findMany({
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
   * Get rental statistics for admin
   */
  static async getRentalStats() {
    const totalRentals = await prisma.ebookRental.count();
    const activeRentals = await prisma.ebookRental.count({
      where: {
        isActive: true,
        endDate: {
          gt: new Date()
        }
      }
    });
    const securityViolations = await prisma.ebookAccessLog.count({
      where: {
        suspiciousActivity: true
      }
    });

    const recentRentals = await prisma.ebookRental.findMany({
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
      securityViolations,
      recentRentals
    };
  }
} 