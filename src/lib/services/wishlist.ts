import { prisma } from '@/lib/db/prisma';
import { logError, logInfo } from '@/lib/logging/logger';

import type { AddToWishlistInput, Wishlist } from '@/types/forum';

/**
 * Service class for wishlist operations
 */
export class WishlistService {
  /**
   * Get user's wishlist
   */
  static async getUserWishlist(userId: string): Promise<Wishlist[]> {
    try {
      const wishlist = await prisma.wishlist.findMany({
        where: { userId },
        include: {
          book: {
            include: {
              category: true,
            },
          },
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' },
        ],
      });

      logInfo('User wishlist retrieved', {
        userId,
        itemCount: wishlist.length,
      });

      return wishlist;
    } catch (error) {
      logError('Error getting user wishlist', error, { userId });
      return [];
    }
  }

  /**
   * Add book to wishlist
   */
  static async addToWishlist(userId: string, input: AddToWishlistInput): Promise<Wishlist> {
    try {
      const { bookId, priority = 1, notes } = input;

      // Check if book exists
      const book = await prisma.book.findUnique({
        where: { id: bookId },
        select: { id: true, title: true, active: true },
      });

      if (!book || !book.active) {
        throw new Error('Book not found or not available');
      }

      // Check if already in wishlist
      const existingItem = await prisma.wishlist.findUnique({
        where: {
          userId_bookId: {
            userId,
            bookId,
          },
        },
      });

      if (existingItem) {
        throw new Error('Book is already in your wishlist');
      }

      const wishlistItem = await prisma.wishlist.create({
        data: {
          userId,
          bookId,
          priority,
          notes,
        },
        include: {
          book: {
            include: {
              category: true,
            },
          },
        },
      });

      logInfo('Book added to wishlist', {
        userId,
        bookId,
        bookTitle: book.title,
        priority,
      });

      return wishlistItem;
    } catch (error) {
      logError('Error adding to wishlist', error, { userId, input });
      throw error;
    }
  }

  /**
   * Remove book from wishlist
   */
  static async removeFromWishlist(userId: string, bookId: string): Promise<void> {
    try {
      const existingItem = await prisma.wishlist.findUnique({
        where: {
          userId_bookId: {
            userId,
            bookId,
          },
        },
      });

      if (!existingItem) {
        throw new Error('Book not found in wishlist');
      }

      await prisma.wishlist.delete({
        where: { id: existingItem.id },
      });

      logInfo('Book removed from wishlist', {
        userId,
        bookId,
      });
    } catch (error) {
      logError('Error removing from wishlist', error, { userId, bookId });
      throw error;
    }
  }

  /**
   * Update wishlist item
   */
  static async updateWishlistItem(
    userId: string,
    bookId: string,
    updates: { priority?: number; notes?: string }
  ): Promise<Wishlist> {
    try {
      const existingItem = await prisma.wishlist.findUnique({
        where: {
          userId_bookId: {
            userId,
            bookId,
          },
        },
      });

      if (!existingItem) {
        throw new Error('Book not found in wishlist');
      }

      const updatedItem = await prisma.wishlist.update({
        where: { id: existingItem.id },
        data: updates,
        include: {
          book: {
            include: {
              category: true,
            },
          },
        },
      });

      logInfo('Wishlist item updated', {
        userId,
        bookId,
        updates,
      });

      return updatedItem;
    } catch (error) {
      logError('Error updating wishlist item', error, { userId, bookId, updates });
      throw error;
    }
  }

  /**
   * Check if book is in user's wishlist
   */
  static async isInWishlist(userId: string, bookId: string): Promise<boolean> {
    try {
      const item = await prisma.wishlist.findUnique({
        where: {
          userId_bookId: {
            userId,
            bookId,
          },
        },
      });

      return !!item;
    } catch (error) {
      logError('Error checking wishlist status', error, { userId, bookId });
      return false;
    }
  }
}