import { prisma } from '@/lib/db/prisma';
import { logError, logInfo } from '@/lib/logging/logger';

import type {
  CreateOrderInput,
  Order,
  OrderSummary,
  OrderWithoutRelations,
} from '@/types/cart';

/**
 * Service class for order management
 */
export class OrderService {
  /**
   * Create order from cart
   */
  static async createOrder(userId: string, input: CreateOrderInput): Promise<Order> {
    try {
      // Get cart items
      const cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: {
          book: true,
        },
      });

      if (cartItems.length === 0) {
        throw new Error('Cart is empty');
      }

      // Calculate order totals
      const orderSummary = await this.calculateOrderSummary(cartItems, input.currency, input.couponCode);

      // Generate order number
      const orderNumber = await this.generateOrderNumber();

      // Get current exchange rate
      const exchangeRate = await this.getCurrentExchangeRate();

      // Create order in transaction
      const order = await prisma.$transaction(async (tx) => {
        // Create order
        const newOrder = await tx.order.create({
          data: {
            userId,
            orderNumber,
            status: 'PENDING',
            totalAmount: orderSummary.totalAmount,
            shippingCost: orderSummary.shippingCost,
            currency: input.currency,
            exchangeRate,
            shippingName: input.shippingName,
            shippingEmail: input.shippingEmail,
            shippingPhone: input.shippingPhone,
            shippingAddress: input.shippingAddress,
            shippingCity: input.shippingCity,
            shippingZip: input.shippingZip,
            shippingCountry: input.shippingCountry,
            paymentMethod: input.paymentMethod,
          },
        });

        // Create order items
        const orderItems = await Promise.all(
          cartItems.map((cartItem) => {
            const price = cartItem.isDigital
              ? input.currency === 'ALL'
                ? cartItem.book.digitalPriceALL || 0
                : cartItem.book.digitalPriceEUR || 0
              : input.currency === 'ALL'
                ? cartItem.book.priceALL || 0
                : cartItem.book.priceEUR || 0;

            return tx.orderItem.create({
              data: {
                orderId: newOrder.id,
                bookId: cartItem.bookId,
                quantity: cartItem.quantity,
                price,
                currency: input.currency,
                isDigital: cartItem.isDigital,
              },
            });
          })
        );

        // Handle coupon usage if applicable
        if (input.couponCode && orderSummary.discount > 0) {
          const coupon = await tx.coupon.findUnique({
            where: { code: input.couponCode },
          });

          if (coupon) {
            await tx.couponUsage.create({
              data: {
                couponId: coupon.id,
                userId,
                orderId: newOrder.id,
                discount: orderSummary.discount,
              },
            });

            // Update coupon usage count
            await tx.coupon.update({
              where: { id: coupon.id },
              data: {
                usedCount: { increment: 1 },
              },
            });
          }
        }

        // Clear cart after successful order creation
        await tx.cartItem.deleteMany({
          where: { userId },
        });

        return newOrder;
      });

      // Fetch complete order with relations
      const completeOrder = await prisma.order.findUnique({
        where: { id: order.id },
        include: {
          items: {
            include: {
              book: true,
            },
          },
          couponUsage: {
            include: {
              coupon: true,
            },
          },
        },
      });

      if (!completeOrder) {
        throw new Error('Failed to retrieve created order');
      }

      logInfo('Order created successfully', {
        userId,
        orderId: order.id,
        orderNumber,
        totalAmount: orderSummary.totalAmount,
        itemCount: cartItems.length,
      });

      return completeOrder;
    } catch (error) {
      logError('Error creating order', error, { userId, input });
      throw error;
    }
  }

  /**
   * Get order by ID
   */
  static async getOrderById(orderId: string, userId?: string): Promise<Order | null> {
    try {
      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
          ...(userId && { userId }),
        },
        include: {
          items: {
            include: {
              book: true,
            },
          },
          couponUsage: {
            include: {
              coupon: true,
            },
          },
        },
      });

      if (order) {
        logInfo('Order retrieved', {
          orderId,
          orderNumber: order.orderNumber,
          userId: order.userId,
        });
      }

      return order;
    } catch (error) {
      logError('Error getting order', error, { orderId, userId });
      return null;
    }
  }

  /**
   * Get user's orders
   */
  static async getUserOrders(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    orders: OrderWithoutRelations[];
    totalCount: number;
    totalPages: number;
  }> {
    try {
      const offset = (page - 1) * limit;

      const [orders, totalCount] = await Promise.all([
        prisma.order.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          skip: offset,
          take: limit,
        }),
        prisma.order.count({
          where: { userId },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      logInfo('User orders retrieved', {
        userId,
        page,
        limit,
        totalCount,
      });

      return {
        orders,
        totalCount,
        totalPages,
      };
    } catch (error) {
      logError('Error getting user orders', error, { userId });
      return {
        orders: [],
        totalCount: 0,
        totalPages: 0,
      };
    }
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(
    orderId: string,
    status: 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED',
    paymentId?: string
  ): Promise<OrderWithoutRelations> {
    try {
      const updateData: any = { status };

      if (status === 'PAID' && paymentId) {
        updateData.paymentId = paymentId;
        updateData.paidAt = new Date();
      }

      const order = await prisma.order.update({
        where: { id: orderId },
        data: updateData,
      });

      logInfo('Order status updated', {
        orderId,
        newStatus: status,
        paymentId,
      });

      return order;
    } catch (error) {
      logError('Error updating order status', error, { orderId, status });
      throw new Error('Failed to update order status');
    }
  }

  /**
   * Calculate order summary
   */
  private static async calculateOrderSummary(
    cartItems: any[],
    currency: 'ALL' | 'EUR',
    couponCode?: string
  ): Promise<OrderSummary> {
    let subtotal = 0;
    const items = [];

    // Calculate subtotal
    for (const cartItem of cartItems) {
      const price = cartItem.isDigital
        ? currency === 'ALL'
          ? cartItem.book.digitalPriceALL || 0
          : cartItem.book.digitalPriceEUR || 0
        : currency === 'ALL'
          ? cartItem.book.priceALL || 0
          : cartItem.book.priceEUR || 0;

      const itemTotal = price * cartItem.quantity;
      subtotal += itemTotal;

      items.push({
        bookId: cartItem.bookId,
        title: cartItem.book.title,
        author: cartItem.book.author,
        quantity: cartItem.quantity,
        price,
        isDigital: cartItem.isDigital,
      });
    }

    // Calculate shipping
    const hasPhysicalItems = cartItems.some(item => !item.isDigital);
    const shippingCost = await this.calculateShippingCost(subtotal, currency, hasPhysicalItems);

    // Calculate discount
    let discount = 0;
    if (couponCode) {
      // TODO: Implement coupon validation and discount calculation
      // For now, return 0 discount
    }

    return {
      subtotal,
      shippingCost,
      discount,
      totalAmount: subtotal + shippingCost - discount,
      currency,
      items,
    };
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
      return 0;
    }

    try {
      const [shippingCostSetting, freeShippingThresholdSetting] = await Promise.all([
        prisma.setting.findUnique({
          where: { key: `shipping_cost_${currency.toLowerCase()}` },
        }),
        prisma.setting.findUnique({
          where: { key: `free_shipping_threshold_${currency.toLowerCase()}` },
        }),
      ]);

      const shippingCost = shippingCostSetting ? parseFloat(shippingCostSetting.value) : 
        currency === 'ALL' ? 300 : 3;

      const freeShippingThreshold = freeShippingThresholdSetting ? 
        parseFloat(freeShippingThresholdSetting.value) : 
        currency === 'ALL' ? 3000 : 30;

      return subtotal >= freeShippingThreshold ? 0 : shippingCost;
    } catch (error) {
      logError('Error calculating shipping cost', error);
      return currency === 'ALL' ? 300 : 3;
    }
  }

  /**
   * Generate unique order number
   */
  private static async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Get daily order count
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    
    const dailyCount = await prisma.order.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    const orderSequence = (dailyCount + 1).toString().padStart(4, '0');
    
    return `BL${year}${month}${day}${orderSequence}`;
  }

  /**
   * Get current exchange rate
   */
  private static async getCurrentExchangeRate(): Promise<number> {
    try {
      const exchangeRate = await prisma.exchangeRate.findFirst({
        where: {
          fromCurrency: 'EUR',
          toCurrency: 'ALL',
          isActive: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });

      return exchangeRate?.rate || 100; // Default rate
    } catch (error) {
      logError('Error getting exchange rate', error);
      return 100; // Default rate
    }
  }
}