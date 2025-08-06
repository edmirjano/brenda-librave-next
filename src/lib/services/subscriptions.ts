import { prisma } from '@/lib/db/prisma';

export interface SubscriptionInfo {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: 'ALL' | 'EUR';
  duration: number;
  maxConcurrent: number;
  includesEbooks: boolean;
  includesHardcopy: boolean;
  unlimitedReads: boolean;
  prioritySupport: boolean;
  bookCount: number;
  isActive: boolean;
  featured: boolean;
}

export interface UserSubscriptionInfo {
  id: string;
  subscriptionId: string;
  subscriptionName: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  autoRenew: boolean;
  totalReads: number;
  currentReads: number;
  maxConcurrent: number;
  daysRemaining: number;
  hasAccess: boolean;
}

export interface SubscriptionAccess {
  hasAccess: boolean;
  userSubscription?: UserSubscriptionInfo;
  availableBooks: number;
  currentReads: number;
  maxConcurrent: number;
  canReadMore: boolean;
}

export class SubscriptionService {
  /**
   * Get all active subscriptions
   */
  static async getActiveSubscriptions(): Promise<SubscriptionInfo[]> {
    const subscriptions = await prisma.subscription.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { books: true }
        }
      },
      orderBy: [
        { featured: 'desc' },
        { price: 'asc' }
      ]
    });

    return subscriptions.map(sub => ({
      id: sub.id,
      name: sub.name,
      description: sub.description,
      price: sub.price,
      currency: sub.currency,
      duration: sub.duration,
      maxConcurrent: sub.maxConcurrent,
      includesEbooks: sub.includesEbooks,
      includesHardcopy: sub.includesHardcopy,
      unlimitedReads: sub.unlimitedReads,
      prioritySupport: sub.prioritySupport,
      bookCount: sub._count.books,
      isActive: sub.isActive,
      featured: sub.featured
    }));
  }

  /**
   * Get subscription by ID
   */
  static async getSubscriptionById(subscriptionId: string): Promise<SubscriptionInfo | null> {
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        _count: {
          select: { books: true }
        }
      }
    });

    if (!subscription) return null;

    return {
      id: subscription.id,
      name: subscription.name,
      description: subscription.description,
      price: subscription.price,
      currency: subscription.currency,
      duration: subscription.duration,
      maxConcurrent: subscription.maxConcurrent,
      includesEbooks: subscription.includesEbooks,
      includesHardcopy: subscription.includesHardcopy,
      unlimitedReads: subscription.unlimitedReads,
      prioritySupport: subscription.prioritySupport,
      bookCount: subscription._count.books,
      isActive: subscription.isActive,
      featured: subscription.featured
    };
  }

  /**
   * Get user's active subscription
   */
  static async getUserSubscription(userId: string): Promise<UserSubscriptionInfo | null> {
    const userSubscription = await prisma.userSubscription.findFirst({
      where: {
        userId,
        isActive: true,
        endDate: { gt: new Date() }
      },
      include: {
        subscription: true
      }
    });

    if (!userSubscription) return null;

    const daysRemaining = Math.ceil(
      (userSubscription.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      id: userSubscription.id,
      subscriptionId: userSubscription.subscriptionId,
      subscriptionName: userSubscription.subscription.name,
      startDate: userSubscription.startDate,
      endDate: userSubscription.endDate,
      isActive: userSubscription.isActive,
      autoRenew: userSubscription.autoRenew,
      totalReads: userSubscription.totalReads,
      currentReads: userSubscription.currentReads,
      maxConcurrent: userSubscription.subscription.maxConcurrent,
      daysRemaining,
      hasAccess: daysRemaining > 0
    };
  }

  /**
   * Check if user has subscription access to a book
   */
  static async checkSubscriptionAccess(
    userId: string, 
    bookId: string
  ): Promise<SubscriptionAccess> {
    // Get user's active subscription
    const userSubscription = await prisma.userSubscription.findFirst({
      where: {
        userId,
        isActive: true,
        endDate: { gt: new Date() }
      },
      include: {
        subscription: {
          include: {
            books: {
              where: { bookId }
            }
          }
        }
      }
    });

    if (!userSubscription) {
      return {
        hasAccess: false,
        availableBooks: 0,
        currentReads: 0,
        maxConcurrent: 0,
        canReadMore: false
      };
    }

    // Check if book is in subscription
    const bookInSubscription = userSubscription.subscription.books.length > 0;
    if (!bookInSubscription) {
      return {
        hasAccess: false,
        userSubscription: {
          id: userSubscription.id,
          subscriptionId: userSubscription.subscriptionId,
          subscriptionName: userSubscription.subscription.name,
          startDate: userSubscription.startDate,
          endDate: userSubscription.endDate,
          isActive: userSubscription.isActive,
          autoRenew: userSubscription.autoRenew,
          totalReads: userSubscription.totalReads,
          currentReads: userSubscription.currentReads,
          maxConcurrent: userSubscription.subscription.maxConcurrent,
          daysRemaining: Math.ceil(
            (userSubscription.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          ),
          hasAccess: true
        },
        availableBooks: userSubscription.subscription.books.length,
        currentReads: userSubscription.currentReads,
        maxConcurrent: userSubscription.subscription.maxConcurrent,
        canReadMore: userSubscription.currentReads < userSubscription.subscription.maxConcurrent
      };
    }

    // Check concurrent reading limit
    const canReadMore = userSubscription.currentReads < userSubscription.subscription.maxConcurrent;

    return {
      hasAccess: true,
      userSubscription: {
        id: userSubscription.id,
        subscriptionId: userSubscription.subscriptionId,
        subscriptionName: userSubscription.subscription.name,
        startDate: userSubscription.startDate,
        endDate: userSubscription.endDate,
        isActive: userSubscription.isActive,
        autoRenew: userSubscription.autoRenew,
        totalReads: userSubscription.totalReads,
        currentReads: userSubscription.currentReads,
        maxConcurrent: userSubscription.subscription.maxConcurrent,
        daysRemaining: Math.ceil(
          (userSubscription.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        ),
        hasAccess: true
      },
      availableBooks: userSubscription.subscription.books.length,
      currentReads: userSubscription.currentReads,
      maxConcurrent: userSubscription.subscription.maxConcurrent,
      canReadMore
    };
  }

  /**
   * Start reading a book (increment current reads)
   */
  static async startReading(userId: string, bookId: string): Promise<boolean> {
    const access = await this.checkSubscriptionAccess(userId, bookId);
    
    if (!access.hasAccess || !access.canReadMore) {
      return false;
    }

    // Increment current reads
    await prisma.userSubscription.update({
      where: { id: access.userSubscription!.id },
      data: {
        currentReads: {
          increment: 1
        },
        totalReads: {
          increment: 1
        }
      }
    });

    // Log access start
    await prisma.subscriptionAccessLog.create({
      data: {
        userSubscriptionId: access.userSubscription!.id,
        userId,
        bookId,
        accessType: 'BOOK_ACCESS_START',
        deviceInfo: 'Web Browser',
        ipAddress: '127.0.0.1' // Will be replaced with actual IP
      }
    });

    return true;
  }

  /**
   * Stop reading a book (decrement current reads)
   */
  static async stopReading(userId: string, bookId: string): Promise<void> {
    const userSubscription = await prisma.userSubscription.findFirst({
      where: {
        userId,
        isActive: true,
        endDate: { gt: new Date() }
      }
    });

    if (!userSubscription) return;

    // Decrement current reads
    await prisma.userSubscription.update({
      where: { id: userSubscription.id },
      data: {
        currentReads: {
          decrement: 1
        }
      }
    });

    // Log access end
    await prisma.subscriptionAccessLog.create({
      data: {
        userSubscriptionId: userSubscription.id,
        userId,
        bookId,
        accessType: 'BOOK_ACCESS_END',
        deviceInfo: 'Web Browser',
        ipAddress: '127.0.0.1' // Will be replaced with actual IP
      }
    });
  }

  /**
   * Get subscription books for a user
   */
  static async getSubscriptionBooks(userId: string) {
    const userSubscription = await prisma.userSubscription.findFirst({
      where: {
        userId,
        isActive: true,
        endDate: { gt: new Date() }
      },
      include: {
        subscription: {
          include: {
            books: {
              include: {
                book: {
                  select: {
                    id: true,
                    title: true,
                    author: true,
                    coverImage: true,
                    hasDigital: true,
                    hasHardcopy: true,
                    digitalPrice: true,
                    price: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!userSubscription) return [];

    return userSubscription.subscription.books.map(sb => ({
      id: sb.book.id,
      title: sb.book.title,
      author: sb.book.author,
      coverImage: sb.book.coverImage,
      hasDigital: sb.book.hasDigital,
      hasHardcopy: sb.book.hasHardcopy,
      digitalPrice: sb.book.digitalPrice,
      price: sb.book.price,
      addedAt: sb.addedAt
    }));
  }

  /**
   * Create a new subscription
   */
  static async createSubscription(data: {
    name: string;
    description?: string;
    price: number;
    currency: 'ALL' | 'EUR';
    duration: number;
    maxConcurrent: number;
    includesEbooks: boolean;
    includesHardcopy: boolean;
    unlimitedReads: boolean;
    prioritySupport: boolean;
    bookIds: string[];
  }) {
    const subscription = await prisma.subscription.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        currency: data.currency,
        duration: data.duration,
        maxConcurrent: data.maxConcurrent,
        includesEbooks: data.includesEbooks,
        includesHardcopy: data.includesHardcopy,
        unlimitedReads: data.unlimitedReads,
        prioritySupport: data.prioritySupport,
        books: {
          create: data.bookIds.map(bookId => ({
            bookId
          }))
        }
      }
    });

    return subscription;
  }

  /**
   * Subscribe a user to a subscription
   */
  static async subscribeUser(
    userId: string,
    subscriptionId: string,
    paymentMethod?: string
  ) {
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId }
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    // Calculate end date
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + subscription.duration);

    // Cancel any existing active subscription
    await prisma.userSubscription.updateMany({
      where: {
        userId,
        isActive: true
      },
      data: {
        isActive: false
      }
    });

    // Create new subscription
    const userSubscription = await prisma.userSubscription.create({
      data: {
        userId,
        subscriptionId,
        startDate: new Date(),
        endDate,
        isActive: true,
        autoRenew: true,
        paymentMethod
      }
    });

    return userSubscription;
  }

  /**
   * Get subscription statistics for admin
   */
  static async getSubscriptionStats() {
    const [
      totalSubscriptions,
      activeSubscriptions,
      totalUsers,
      activeUsers,
      totalBooks,
      totalRevenue
    ] = await Promise.all([
      prisma.subscription.count(),
      prisma.subscription.count({ where: { isActive: true } }),
      prisma.userSubscription.count(),
      prisma.userSubscription.count({ 
        where: { 
          isActive: true, 
          endDate: { gt: new Date() } 
        } 
      }),
      prisma.subscriptionBook.count(),
      prisma.userSubscription.aggregate({
        _sum: { totalReads: true }
      })
    ]);

    return {
      subscriptions: {
        total: totalSubscriptions,
        active: activeSubscriptions
      },
      users: {
        total: totalUsers,
        active: activeUsers
      },
      books: totalBooks,
      totalReads: totalRevenue._sum.totalReads || 0
    };
  }

  /**
   * Add book to subscription
   */
  static async addBookToSubscription(subscriptionId: string, bookId: string) {
    return await prisma.subscriptionBook.create({
      data: {
        subscriptionId,
        bookId
      }
    });
  }

  /**
   * Remove book from subscription
   */
  static async removeBookFromSubscription(subscriptionId: string, bookId: string) {
    return await prisma.subscriptionBook.delete({
      where: {
        subscriptionId_bookId: {
          subscriptionId,
          bookId
        }
      }
    });
  }

  /**
   * Get subscription access logs
   */
  static async getAccessLogs(userSubscriptionId: string) {
    return await prisma.subscriptionAccessLog.findMany({
      where: { userSubscriptionId },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
} 