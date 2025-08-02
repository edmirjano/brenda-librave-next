import { prisma } from '@/lib/db/prisma';
import { logError, logInfo } from '@/lib/logging/logger';

import type {
  AddToCartInput,
  CartItem,
  CartSummary,
  UpdateCartItemInput,
} from '@/types/cart';

/**
 * Service class for shopping cart operations
 */
export class CartService {
  /**
   * Get user's cart items
   */
  static async getCartItems(userId: string): Promise<CartItem[]> {
    try {
      const cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: {
          book: {
            include: {
              category: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      logInfo('Cart items retrieved', {
        userId,
        itemCount: cartItems.length,
      });

      return cartItems;
    } catch (error) {
      logError('Error getting cart items', error, { userId });
      return [];
    }
  }

  /**
   * Add item to cart
   */
  static async addToCart(userId: string, input: AddToCartInput): Promise<CartItem> {
    try {
      const { bookId, quantity, isDigital, currency } = input;

      // Check if book exists and is active
      const book = await prisma.book.findFirst({
        where: {
          id: bookId,
          active: true,
        },
      });

      if (!book) {
        throw new Error('Book not found or not available');
      }

      // Check if digital version is available when requesting digital
      if (isDigital && !book.hasDigital) {
        throw new Error('Digital version not available for this book');
      }

      // Check inventory for physical books
      if (!isDigital && book.inventory < quantity) {
        throw new Error('Insufficient inventory');
      }

      // Check if item already exists in cart
      const existingItem = await prisma.cartItem.findUnique({
        where: {
          userId_bookId_isDigital: {
            userId,
            bookId,
            isDigital,
          },
        },
      });

      let cartItem: CartItem;

      if (existingItem) {
        // Update existing item quantity
        const newQuantity = existingItem.quantity + quantity;

        // Check inventory again for updated quantity
        if (!isDigital && book.inventory < newQuantity) {
          throw new Error('Insufficient inventory for requested quantity');
        }

        cartItem = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: newQuantity,
            currency,
          },
          include: {
            book: {
              include: {
                category: true,
              },
            },
          },
        });
      } else {
        // Create new cart item
        cartItem = await prisma.cartItem.create({
          data: {
            userId,
            bookId,
            quantity,
            isDigital,
            currency,
          },
          include: {
            book: {
              include: {
                category: true,
              },
            },
          },
        });
      }

      logInfo('Item added to cart', {
        userId,
        bookId,
        quantity,
        isDigital,
        cartItemId: cartItem.id,
      });

      return cartItem;
    } catch (error) {
      logError('Error adding to cart', error, { userId, input });
      throw error;
    }
  }

  /**
   * Update cart item quantity
   */
  static async updateCartItem(userId: string, input: UpdateCartItemInput): Promise<CartItem> {
    try {
      const { id, quantity } = input;

      // Verify cart item belongs to user
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          id,
          userId,
        },
        include: {
          book: true,
        },
      });

      if (!existingItem) {
        throw new Error('Cart item not found');
      }

      // Check inventory for physical books
      if (!existingItem.isDigital && existingItem.book.inventory < quantity) {
        throw new Error('Insufficient inventory');
      }

      const cartItem = await prisma.cartItem.update({
        where: { id },
        data: { quantity },
        include: {
          book: {
            include: {
              category: true,
            },
          },
        },
      });

      logInfo('Cart item updated', {
        userId,
        cartItemId: id,
        newQuantity: quantity,
      });

      return cartItem;
    } catch (error) {
      logError('Error updating cart item', error, { userId, input });
      throw error;
    }
  }

  /**
   * Remove item from cart
   */
  static async removeFromCart(userId: string, cartItemId: string): Promise<void> {
    try {
      // Verify cart item belongs to user
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          id: cartItemId,
          userId,
        },
      });

      if (!existingItem) {
        throw new Error('Cart item not found');
      }

      await prisma.cartItem.delete({
        where: { id: cartItemId },
      });

      logInfo('Item removed from cart', {
        userId,
        cartItemId,
      });
    } catch (error) {
      logError('Error removing from cart', error, { userId, cartItemId });
      throw error;
    }
  }

  /**
   * Clear user's cart
   */
  static async clearCart(userId: string): Promise<void> {
    try {
      const result = await prisma.cartItem.deleteMany({
        where: { userId },
      });

      logInfo('Cart cleared', {
        userId,
        itemsRemoved: result.count,
      });
    } catch (error) {
      logError('Error clearing cart', error, { userId });
      throw error;
    }
  }

  /**
   * Get cart summary with totals
   */
  static async getCartSummary(userId: string): Promise<CartSummary> {
    try {
      const cartItems = await this.getCartItems(userId);

      if (cartItems.length === 0) {
        return {
          items: [],
          totalItems: 0,
          subtotal: 0,
          shippingCost: 0,
          totalAmount: 0,
          currency: 'ALL',
          hasPhysicalItems: false,
          hasDigitalItems: false,
        };
      }

      // Calculate totals
      let subtotal = 0;
      let totalItems = 0;
      let hasPhysicalItems = false;
      let hasDigitalItems = false;
      const currency = cartItems[0]?.currency || 'ALL';

      for (const item of cartItems) {
        const price = item.isDigital
          ? currency === 'ALL'
            ? item.book.digitalPriceALL || 0
            : item.book.digitalPriceEUR || 0
          : currency === 'ALL'
            ? item.book.priceALL || 0
            : item.book.priceEUR || 0;

        subtotal += price * item.quantity;
        totalItems += item.quantity;

        if (item.isDigital) {
          hasDigitalItems = true;
        } else {
          hasPhysicalItems = true;
        }
      }

      // Calculate shipping cost
      const shippingCost = await this.calculateShippingCost(subtotal, currency, hasPhysicalItems);

      const summary: CartSummary = {
        items: cartItems,
        totalItems,
        subtotal,
        shippingCost,
        totalAmount: subtotal + shippingCost,
        currency,
        hasPhysicalItems,
        hasDigitalItems,
      };

      logInfo('Cart summary calculated', {
        userId,
        totalItems,
        subtotal,
        shippingCost,
        totalAmount: summary.totalAmount,
      });

      return summary;
    } catch (error) {
      logError('Error calculating cart summary', error, { userId });
      throw new Error('Failed to calculate cart summary');
    }
  }

  /**
   * Calculate shipping cost
   */
  private static async calculateShippingCost(
    subtotal: number,
    currency: 'ALL' | 'EUR',
    hasPhysicalItems: boolean
  ): Promise<number> {
    if (!hasPhysicalItems) {
      return 0; // No shipping for digital-only orders
    }

    try {
      // Get shipping settings from database
      const [shippingCostSetting, freeShippingThresholdSetting] = await Promise.all([
        prisma.setting.findUnique({
          where: { key: `shipping_cost_${currency.toLowerCase()}` },
        }),
        prisma.setting.findUnique({
          where: { key: `free_shipping_threshold_${currency.toLowerCase()}` },
        }),
      ]);

      const shippingCost = shippingCostSetting ? parseFloat(shippingCostSetting.value) : 
        currency === 'ALL' ? 300 : 3; // Default shipping costs

      const freeShippingThreshold = freeShippingThresholdSetting ? 
        parseFloat(freeShippingThresholdSetting.value) : 
        currency === 'ALL' ? 3000 : 30; // Default free shipping thresholds

      // Free shipping if order meets threshold
      if (subtotal >= freeShippingThreshold) {
        return 0;
      }

      return shippingCost;
    } catch (error) {
      logError('Error calculating shipping cost', error);
      // Return default shipping cost on error
      return currency === 'ALL' ? 300 : 3;
    }
  }

  /**
   * Get cart item count for user
   */
  static async getCartItemCount(userId: string): Promise<number> {
    try {
      const result = await prisma.cartItem.aggregate({
        where: { userId },
        _sum: {
          quantity: true,
        },
      });

      return result._sum.quantity || 0;
    } catch (error) {
      logError('Error getting cart item count', error, { userId });
      return 0;
    }
  }
}