import { z } from 'zod';

export const createOrderSchema = z.object({
  // Shipping information
  shippingName: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-ZëÇçĞğŞşÖöÜüÄäÎîÏïÀàÔô\s-']+$/, 'Name contains invalid characters')
    .transform((name) => name.trim()),
  
  shippingEmail: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase()
    .transform((email) => email.trim()),
  
  shippingPhone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[\+]?[0-9\s\-\(\)]{8,20}$/, 'Please enter a valid phone number')
    .transform((phone) => phone.trim()),
  
  shippingAddress: z
    .string()
    .min(1, 'Address is required')
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must be less than 200 characters')
    .transform((address) => address.trim()),
  
  shippingCity: z
    .string()
    .min(1, 'City is required')
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must be less than 100 characters')
    .transform((city) => city.trim()),
  
  shippingZip: z
    .string()
    .min(1, 'ZIP code is required')
    .regex(/^[0-9A-Za-z\s-]{3,10}$/, 'Please enter a valid ZIP code')
    .transform((zip) => zip.trim()),
  
  shippingCountry: z
    .string()
    .min(1, 'Country is required')
    .min(2, 'Country must be at least 2 characters')
    .max(100, 'Country must be less than 100 characters')
    .transform((country) => country.trim()),
  
  // Payment information
  paymentMethod: z.enum(['PAYPAL', 'STRIPE', 'BANK_TRANSFER'], {
    errorMap: () => ({ message: 'Please select a valid payment method' }),
  }),
  
  // Optional coupon
  couponCode: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[A-Z0-9_-]+$/, 'Invalid coupon code format')
    .transform((code) => code.toUpperCase().trim())
    .optional(),
  
  // Currency preference
  currency: z.enum(['ALL', 'EUR'], {
    errorMap: () => ({ message: 'Please select a valid currency' }),
  }),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
  paymentId: z.string().optional(),
});

export const addToCartSchema = z.object({
  bookId: z.string().min(1, 'Book ID is required'),
  quantity: z
    .number()
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .max(10, 'Quantity cannot exceed 10'),
  isDigital: z.boolean().default(false),
  currency: z.enum(['ALL', 'EUR']).default('ALL'),
});

export const updateCartItemSchema = z.object({
  quantity: z
    .number()
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .max(10, 'Quantity cannot exceed 10'),
});

export type CreateOrderFormData = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusFormData = z.infer<typeof updateOrderStatusSchema>;
export type AddToCartFormData = z.infer<typeof addToCartSchema>;
export type UpdateCartItemFormData = z.infer<typeof updateCartItemSchema>;