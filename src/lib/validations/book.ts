import { z } from 'zod';

export const createBookSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title must be less than 200 characters')
    .transform((title) => title.trim()),
  author: z
    .string()
    .min(1, 'Author is required')
    .min(2, 'Author must be at least 2 characters')
    .max(100, 'Author must be less than 100 characters')
    .transform((author) => author.trim()),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters')
    .transform((description) => description.trim()),
  isbn: z
    .string()
    .optional()
    .refine(
      (isbn) => {
        if (!isbn) return true;
        // Basic ISBN validation (10 or 13 digits with optional hyphens)
        const cleanIsbn = isbn.replace(/[-\s]/g, '');
        return /^\d{10}$|^\d{13}$/.test(cleanIsbn);
      },
      { message: 'Invalid ISBN format' }
    ),
  categoryId: z.string().min(1, 'Category is required'),
  priceALL: z
    .number()
    .min(0, 'Price must be positive')
    .max(1000000, 'Price is too high')
    .optional(),
  priceEUR: z
    .number()
    .min(0, 'Price must be positive')
    .max(10000, 'Price is too high')
    .optional(),
  digitalPriceALL: z
    .number()
    .min(0, 'Digital price must be positive')
    .max(1000000, 'Digital price is too high')
    .optional(),
  digitalPriceEUR: z
    .number()
    .min(0, 'Digital price must be positive')
    .max(10000, 'Digital price is too high')
    .optional(),
  inventory: z
    .number()
    .int('Inventory must be a whole number')
    .min(0, 'Inventory cannot be negative')
    .max(10000, 'Inventory is too high'),
  hasDigital: z.boolean().default(false),
  coverImage: z.string().url('Invalid image URL').optional(),
  publishedDate: z.date().optional(),
  language: z.enum(['SQ', 'EN']).default('SQ'),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  slug: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
});

export const updateBookSchema = createBookSchema
  .partial()
  .extend({
    id: z.string().min(1, 'Book ID is required'),
  })
  .refine(
    (data) => {
      // At least one field must be provided for update
      const { id, ...updateFields } = data;
      return Object.keys(updateFields).length > 0;
    },
    { message: 'At least one field must be provided for update' }
  );

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .transform((name) => name.trim()),
  nameEn: z
    .string()
    .min(2, 'English name must be at least 2 characters')
    .max(100, 'English name must be less than 100 characters')
    .transform((name) => name.trim())
    .optional(),
  slug: z.string().optional(),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .transform((desc) => desc.trim())
    .optional(),
  active: z.boolean().default(true),
});

export const updateCategorySchema = createCategorySchema
  .partial()
  .extend({
    id: z.string().min(1, 'Category ID is required'),
  })
  .refine(
    (data) => {
      const { id, ...updateFields } = data;
      return Object.keys(updateFields).length > 0;
    },
    { message: 'At least one field must be provided for update' }
  );

export const createTagSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .transform((name) => name.trim()),
  nameEn: z
    .string()
    .min(2, 'English name must be at least 2 characters')
    .max(50, 'English name must be less than 50 characters')
    .transform((name) => name.trim())
    .optional(),
  slug: z.string().optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color')
    .optional(),
});

export const updateTagSchema = createTagSchema
  .partial()
  .extend({
    id: z.string().min(1, 'Tag ID is required'),
  })
  .refine(
    (data) => {
      const { id, ...updateFields } = data;
      return Object.keys(updateFields).length > 0;
    },
    { message: 'At least one field must be provided for update' }
  );

export const bookSearchSchema = z.object({
  query: z.string().optional(),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  language: z.enum(['SQ', 'EN']).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  currency: z.enum(['ALL', 'EUR']).default('ALL'),
  featured: z.boolean().optional(),
  active: z.boolean().default(true),
  sortBy: z.enum(['title', 'author', 'price', 'featured', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(12),
});

export type CreateBookFormData = z.infer<typeof createBookSchema>;
export type UpdateBookFormData = z.infer<typeof updateBookSchema>;
export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;
export type CreateTagFormData = z.infer<typeof createTagSchema>;
export type UpdateTagFormData = z.infer<typeof updateTagSchema>;
export type BookSearchFormData = z.infer<typeof bookSearchSchema>;