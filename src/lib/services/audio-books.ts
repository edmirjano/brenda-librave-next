import { prisma } from '@/lib/db/prisma';

export interface AudioBookInfo {
  id: string;
  bookId: string;
  title: string;
  author: string;
  narrator: string;
  duration: number;
  fileSize: number;
  audioFileUrl?: string;
  sampleUrl?: string;
  price?: number;
  digitalPrice?: number;
  baseCurrency: 'ALL' | 'EUR';
  inventory: number;
  hasDigital: boolean;
  hasPhysical: boolean;
  active: boolean;
  featured: boolean;
  language: string;
  quality: string;
  chapters?: number;
  chapterList?: any;
}

export interface AudioBookRentalInfo {
  id: string;
  audioBookId: string;
  title: string;
  author: string;
  narrator: string;
  rentalType: string;
  rentalPrice: number;
  guaranteeAmount?: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  returnDate?: Date;
  isActive: boolean;
  isReturned: boolean;
  totalPlayTime: number;
  lastPlayedAt?: Date;
  playCount: number;
  completed: boolean;
  hasAccess: boolean;
}

export interface AudioBookAccess {
  hasAccess: boolean;
  userRental?: AudioBookRentalInfo;
  userSubscription?: any;
  availableAudioBooks: number;
  currentListens: number;
  maxConcurrent: number;
  canListenMore: boolean;
}

export class AudioBookService {
  /**
   * Get audio book by ID
   */
  static async getAudioBookById(audioBookId: string): Promise<AudioBookInfo | null> {
    const audioBook = await prisma.audioBook.findUnique({
      where: { id: audioBookId },
      select: {
        id: true,
        bookId: true,
        title: true,
        author: true,
        narrator: true,
        duration: true,
        fileSize: true,
        audioFileUrl: true,
        sampleUrl: true,
        price: true,
        digitalPrice: true,
        baseCurrency: true,
        inventory: true,
        hasDigital: true,
        hasPhysical: true,
        active: true,
        featured: true,
        language: true,
        quality: true,
        chapters: true,
        chapterList: true
      }
    });

    return audioBook;
  }

  /**
   * Get all active audio books
   */
  static async getActiveAudioBooks() {
    return await prisma.audioBook.findMany({
      where: { active: true },
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
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ]
    });
  }

  /**
   * Get audio books by book ID (multiple audio versions)
   */
  static async getAudioBooksByBookId(bookId: string) {
    return await prisma.audioBook.findMany({
      where: { 
        bookId,
        active: true 
      },
      orderBy: [
        { quality: 'desc' },
        { language: 'asc' }
      ]
    });
  }

  /**
   * Create audio book rental
   */
  static async createAudioBookRental(data: {
    userId: string;
    audioBookId: string;
    orderItemId: string;
    rentalType: 'SINGLE_LISTEN' | 'TIME_LIMITED' | 'UNLIMITED_LISTENS';
    shippingAddress?: string;
    guaranteeAmount?: number;
  }) {
    const { userId, audioBookId, orderItemId, rentalType, shippingAddress, guaranteeAmount } = data;

    // Get audio book info
    const audioBook = await prisma.audioBook.findUnique({
      where: { id: audioBookId },
      select: {
        id: true,
        title: true,
        author: true,
        narrator: true,
        digitalPrice: true,
        price: true,
        baseCurrency: true,
        inventory: true,
        hasDigital: true,
        hasPhysical: true
      }
    });

    if (!audioBook) {
      throw new Error('Audio book not found');
    }

    if (!audioBook.hasDigital && !audioBook.hasPhysical) {
      throw new Error('Audio book not available for rental');
    }

    // Check if user already has an active rental
    const existingRental = await prisma.audioBookRental.findFirst({
      where: {
        userId,
        audioBookId,
        isActive: true,
        isReturned: false
      }
    });

    if (existingRental) {
      throw new Error('You already have an active rental for this audio book');
    }

    // Calculate rental duration and pricing
    let endDate: Date;
    let rentalPrice: number;
    const startDate = new Date();
    
    switch (rentalType) {
      case 'SINGLE_LISTEN':
        endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000); // 24 hours
        rentalPrice = Math.round((audioBook.digitalPrice || audioBook.price || 0) * 0.3); // 30% of price
        break;
      case 'TIME_LIMITED':
        endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
        rentalPrice = Math.round((audioBook.digitalPrice || audioBook.price || 0) * 0.6); // 60% of price
        break;
      case 'UNLIMITED_LISTENS':
        endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
        rentalPrice = Math.round((audioBook.digitalPrice || audioBook.price || 0) * 0.8); // 80% of price
        break;
      default:
        endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
        rentalPrice = Math.round((audioBook.digitalPrice || audioBook.price || 0) * 0.3);
    }

    // Calculate guarantee amount for physical audio books
    const calculatedGuarantee = guaranteeAmount || (audioBook.hasPhysical ? Math.round((audioBook.price || 0) * 0.8) : 0);

    // Create the audio book rental
    const rental = await prisma.audioBookRental.create({
      data: {
        userId,
        audioBookId,
        orderItemId,
        rentalType: rentalType as any,
        rentalPrice,
        guaranteeAmount: calculatedGuarantee,
        currency: audioBook.baseCurrency,
        startDate,
        endDate,
        shippingAddress,
        isActive: true,
        isReturned: false,
        totalPlayTime: 0,
        playCount: 0,
        completed: false
      }
    });

    // Log the rental creation
    await prisma.audioBookAccessLog.create({
      data: {
        rentalId: rental.id,
        userId,
        audioBookId,
        accessType: 'RENTAL_START',
        deviceInfo: 'Web Browser',
        ipAddress: '127.0.0.1' // Will be replaced with actual IP
      }
    });

    // Update inventory for physical audio books
    if (audioBook.hasPhysical && audioBook.inventory > 0) {
      await prisma.audioBook.update({
        where: { id: audioBookId },
        data: {
          inventory: {
            decrement: 1
          }
        }
      });
    }

    return {
      rentalId: rental.id,
      audioBookId: rental.audioBookId,
      title: audioBook.title,
      author: audioBook.author,
      narrator: audioBook.narrator,
      rentalType: rental.rentalType,
      rentalPrice: rental.rentalPrice,
      guaranteeAmount: rental.guaranteeAmount,
      currency: rental.currency,
      startDate: rental.startDate,
      endDate: rental.endDate,
      hasAccess: true
    };
  }

  /**
   * Check if user has access to audio book
   */
  static async checkAudioBookAccess(
    userId: string, 
    audioBookId: string
  ): Promise<AudioBookAccess> {
    // Check for active rental
    const rental = await prisma.audioBookRental.findFirst({
      where: {
        userId,
        audioBookId,
        isActive: true,
        isReturned: false,
        endDate: { gt: new Date() }
      }
    });

    // Check for subscription access
    const subscriptionAccess = await prisma.userSubscription.findFirst({
      where: {
        userId,
        isActive: true,
        endDate: { gt: new Date() },
        subscription: {
          books: {
            some: {
              book: {
                audioBooks: {
                  some: { id: audioBookId }
                }
              }
            }
          }
        }
      },
      include: {
        subscription: true
      }
    });

    if (rental) {
      return {
        hasAccess: true,
        userRental: {
          id: rental.id,
          audioBookId: rental.audioBookId,
          title: '', // Will be filled by calling function
          author: '',
          narrator: '',
          rentalType: rental.rentalType,
          rentalPrice: rental.rentalPrice,
          guaranteeAmount: rental.guaranteeAmount,
          currency: rental.currency,
          startDate: rental.startDate,
          endDate: rental.endDate,
          returnDate: rental.returnDate,
          isActive: rental.isActive,
          isReturned: rental.isReturned,
          totalPlayTime: rental.totalPlayTime,
          lastPlayedAt: rental.lastPlayedAt,
          playCount: rental.playCount,
          completed: rental.completed,
          hasAccess: true
        },
        availableAudioBooks: 1,
        currentListens: 1,
        maxConcurrent: 1,
        canListenMore: true
      };
    }

    if (subscriptionAccess) {
      return {
        hasAccess: true,
        userSubscription: subscriptionAccess,
        availableAudioBooks: 1,
        currentListens: 0,
        maxConcurrent: subscriptionAccess.subscription.maxConcurrent,
        canListenMore: true
      };
    }

    return {
      hasAccess: false,
      availableAudioBooks: 0,
      currentListens: 0,
      maxConcurrent: 0,
      canListenMore: false
    };
  }

  /**
   * Start listening to audio book
   */
  static async startListening(userId: string, audioBookId: string): Promise<boolean> {
    const access = await this.checkAudioBookAccess(userId, audioBookId);
    
    if (!access.hasAccess) {
      return false;
    }

    // Update rental if exists
    if (access.userRental) {
      await prisma.audioBookRental.update({
        where: { id: access.userRental.id },
        data: {
          playCount: {
            increment: 1
          },
          lastPlayedAt: new Date()
        }
      });
    }

    // Log access
    await prisma.audioBookAccessLog.create({
      data: {
        rentalId: access.userRental?.id,
        userSubscriptionId: access.userSubscription?.id,
        userId,
        audioBookId,
        accessType: 'PLAY_SESSION',
        deviceInfo: 'Web Browser',
        ipAddress: '127.0.0.1' // Will be replaced with actual IP
      }
    });

    return true;
  }

  /**
   * Update play time for audio book
   */
  static async updatePlayTime(
    userId: string, 
    audioBookId: string, 
    playTime: number
  ): Promise<void> {
    const access = await this.checkAudioBookAccess(userId, audioBookId);
    
    if (!access.hasAccess || !access.userRental) {
      return;
    }

    // Update total play time
    await prisma.audioBookRental.update({
      where: { id: access.userRental.id },
      data: {
        totalPlayTime: {
          increment: playTime
        },
        lastPlayedAt: new Date()
      }
    });

    // Log play session
    await prisma.audioBookAccessLog.create({
      data: {
        rentalId: access.userRental.id,
        userId,
        audioBookId,
        accessType: 'PLAY_SESSION',
        playTime,
        sessionDuration: playTime,
        deviceInfo: 'Web Browser',
        ipAddress: '127.0.0.1'
      }
    });
  }

  /**
   * Complete audio book listening
   */
  static async completeListening(userId: string, audioBookId: string): Promise<void> {
    const access = await this.checkAudioBookAccess(userId, audioBookId);
    
    if (!access.hasAccess || !access.userRental) {
      return;
    }

    // Mark as completed
    await prisma.audioBookRental.update({
      where: { id: access.userRental.id },
      data: {
        completed: true,
        lastPlayedAt: new Date()
      }
    });

    // Log completion
    await prisma.audioBookAccessLog.create({
      data: {
        rentalId: access.userRental.id,
        userId,
        audioBookId,
        accessType: 'COMPLETE_LISTEN',
        deviceInfo: 'Web Browser',
        ipAddress: '127.0.0.1'
      }
    });
  }

  /**
   * Get user's active audio book rentals
   */
  static async getUserAudioBookRentals(userId: string) {
    return await prisma.audioBookRental.findMany({
      where: {
        userId,
        isActive: true,
        isReturned: false
      },
      include: {
        audioBook: {
          select: {
            id: true,
            title: true,
            author: true,
            narrator: true,
            duration: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Get audio book rental history
   */
  static async getAudioBookRentalHistory(userId: string) {
    return await prisma.audioBookRental.findMany({
      where: { userId },
      include: {
        audioBook: {
          select: {
            id: true,
            title: true,
            author: true,
            narrator: true,
            duration: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Calculate audio book pricing
   */
  static calculateAudioBookPricing(basePrice: number) {
    return {
      SINGLE_LISTEN: {
        duration: '24 orë',
        rentalPrice: Math.round(basePrice * 0.3),
        description: 'Një dëgjim i plotë'
      },
      TIME_LIMITED: {
        duration: '7 ditë',
        rentalPrice: Math.round(basePrice * 0.6),
        description: 'Akses për 7 ditë'
      },
      UNLIMITED_LISTENS: {
        duration: '30 ditë',
        rentalPrice: Math.round(basePrice * 0.8),
        description: 'Dëgjime të pakufizuara për 30 ditë'
      }
    };
  }

  /**
   * Get audio book statistics
   */
  static async getAudioBookStats() {
    const [
      totalAudioBooks,
      activeAudioBooks,
      totalRentals,
      activeRentals,
      totalPlayTime,
      completedListens
    ] = await Promise.all([
      prisma.audioBook.count(),
      prisma.audioBook.count({ where: { active: true } }),
      prisma.audioBookRental.count(),
      prisma.audioBookRental.count({ 
        where: { 
          isActive: true, 
          isReturned: false 
        } 
      }),
      prisma.audioBookRental.aggregate({
        _sum: { totalPlayTime: true }
      }),
      prisma.audioBookRental.count({
        where: { completed: true }
      })
    ]);

    return {
      audioBooks: {
        total: totalAudioBooks,
        active: activeAudioBooks
      },
      rentals: {
        total: totalRentals,
        active: activeRentals
      },
      listening: {
        totalPlayTime: totalPlayTime._sum.totalPlayTime || 0,
        completedListens
      }
    };
  }

  /**
   * Add audio book to subscription
   */
  static async addAudioBookToSubscription(subscriptionId: string, audioBookId: string) {
    return await prisma.audioBookSubscriptionBook.create({
      data: {
        subscriptionId,
        audioBookId
      }
    });
  }

  /**
   * Remove audio book from subscription
   */
  static async removeAudioBookFromSubscription(subscriptionId: string, audioBookId: string) {
    return await prisma.audioBookSubscriptionBook.delete({
      where: {
        subscriptionId_audioBookId: {
          subscriptionId,
          audioBookId
        }
      }
    });
  }
} 