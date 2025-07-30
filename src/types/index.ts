import type { User, Book, Category, Order, CartItem, OrderItem, NewsletterSubscriber } from '@/generated/prisma'

// Re-export Prisma types
export type { User, Book, Category, Order, CartItem, OrderItem, NewsletterSubscriber }

// Enum types
export type Role = 'USER' | 'ADMIN'
export type Language = 'SQ' | 'EN'
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'

// Extended types for the application
export interface BookWithCategory extends Book {
  category: Category
}

export interface CartItemWithBook extends CartItem {
  book: BookWithCategory
}

export interface OrderWithItems extends Order {
  items: (OrderItem & {
    book: Book
  })[]
  user: User
}

// Form types
export interface BookFormData {
  title: string
  author: string
  description: string
  isbn?: string
  categoryId: string
  price?: number
  digitalPrice?: number
  inventory: number
  hasDigital: boolean
  language: Language
  featured: boolean
}

export interface UserFormData {
  name: string
  email: string
  password?: string
  language: Language
  newsletter: boolean
}

export interface OrderFormData {
  shippingName: string
  shippingEmail: string
  shippingAddress: string
  shippingCity: string
  shippingZip: string
  shippingCountry: string
}