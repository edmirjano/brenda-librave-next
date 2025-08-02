import { Prisma } from '@prisma/client';

// Cart types
export type CartItem = Prisma.CartItemGetPayload<{
  include: {
    book: {
      include: {
        category: true;
      };
    };
  };
}>;

export type CartItemWithoutRelations = Prisma.CartItemGetPayload<{}>;

export interface AddToCartInput {
  bookId: string;
  quantity: number;
  isDigital: boolean;
  currency: 'ALL' | 'EUR';
}

export interface UpdateCartItemInput {
  id: string;
  quantity: number;
}

export interface CartSummary {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  currency: 'ALL' | 'EUR';
  hasPhysicalItems: boolean;
  hasDigitalItems: boolean;
}

// Order types
export type Order = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        book: true;
      };
    };
    couponUsage: {
      include: {
        coupon: true;
      };
    };
  };
}>;

export type OrderWithoutRelations = Prisma.OrderGetPayload<{}>;

export interface CreateOrderInput {
  // Shipping information
  shippingName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingZip: string;
  shippingCountry: string;
  
  // Payment information
  paymentMethod: 'PAYPAL' | 'STRIPE' | 'BANK_TRANSFER';
  
  // Optional coupon
  couponCode?: string;
  
  // Currency preference
  currency: 'ALL' | 'EUR';
}

export interface OrderSummary {
  subtotal: number;
  shippingCost: number;
  discount: number;
  totalAmount: number;
  currency: 'ALL' | 'EUR';
  items: Array<{
    bookId: string;
    title: string;
    author: string;
    quantity: number;
    price: number;
    isDigital: boolean;
  }>;
}

// Coupon types
export type Coupon = Prisma.CouponGetPayload<{}>;

export interface ApplyCouponInput {
  code: string;
  orderTotal: number;
  currency: 'ALL' | 'EUR';
  bookIds: string[];
  categoryIds: string[];
}

export interface CouponValidationResult {
  isValid: boolean;
  discount: number;
  message: string;
  coupon?: Coupon;
}

// Payment types
export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
}

export interface PayPalPaymentData {
  orderID: string;
  payerID: string;
  paymentID: string;
  amount: number;
  currency: string;
}

// Shipping types
export interface ShippingRate {
  cost: number;
  currency: 'ALL' | 'EUR';
  method: string;
  estimatedDays: number;
}

export interface ShippingCalculation {
  domestic: ShippingRate;
  international: ShippingRate;
  freeShippingThreshold: number;
  currency: 'ALL' | 'EUR';
}