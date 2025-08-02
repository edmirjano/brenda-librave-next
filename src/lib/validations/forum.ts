import { z } from 'zod';

export const createForumTopicSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be less than 200 characters')
    .transform((title) => title.trim()),
  
  content: z
    .string()
    .min(1, 'Content is required')
    .min(10, 'Content must be at least 10 characters')
    .max(10000, 'Content must be less than 10,000 characters')
    .transform((content) => content.trim()),
  
  categoryId: z.string().min(1, 'Category is required'),
  
  bookId: z.string().optional(),
  
  tagIds: z.array(z.string()).optional(),
});

export const updateForumTopicSchema = createForumTopicSchema
  .partial()
  .extend({
    id: z.string().min(1, 'Topic ID is required'),
  })
  .refine(
    (data) => {
      const { id, ...updateFields } = data;
      return Object.keys(updateFields).length > 0;
    },
    { message: 'At least one field must be provided for update' }
  );

export const createForumPostSchema = z.object({
  content: z
    .string()
    .min(1, 'Content is required')
    .min(3, 'Content must be at least 3 characters')
    .max(5000, 'Content must be less than 5,000 characters')
    .transform((content) => content.trim()),
  
  topicId: z.string().min(1, 'Topic ID is required'),
  
  parentId: z.string().optional(),
});

export const updateForumPostSchema = z.object({
  id: z.string().min(1, 'Post ID is required'),
  
  content: z
    .string()
    .min(3, 'Content must be at least 3 characters')
    .max(5000, 'Content must be less than 5,000 characters')
    .transform((content) => content.trim())
    .optional(),
  
  status: z.enum(['ACTIVE', 'HIDDEN', 'DELETED', 'FLAGGED']).optional(),
});

export const createForumCategorySchema = z.object({
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
  
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .transform((desc) => desc.trim())
    .optional(),
  
  slug: z.string().optional(),
  
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color')
    .optional(),
  
  sortOrder: z.number().int().min(0).default(0),
  
  active: z.boolean().default(true),
});

export const addToWishlistSchema = z.object({
  bookId: z.string().min(1, 'Book ID is required'),
  priority: z.number().int().min(1).max(3).default(1),
  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .transform((notes) => notes.trim())
    .optional(),
});

export const createCollectionSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .transform((name) => name.trim()),
  
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .transform((desc) => desc.trim())
    .optional(),
  
  isPublic: z.boolean().default(false),
});

export const addToCollectionSchema = z.object({
  collectionId: z.string().min(1, 'Collection ID is required'),
  bookId: z.string().min(1, 'Book ID is required'),
  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .transform((notes) => notes.trim())
    .optional(),
});

export const forumSearchSchema = z.object({
  query: z.string().optional(),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  bookId: z.string().optional(),
  authorId: z.string().optional(),
  status: z.enum(['ACTIVE', 'LOCKED', 'HIDDEN', 'DELETED']).optional(),
  pinned: z.boolean().optional(),
  sortBy: z.enum(['title', 'createdAt', 'views', 'posts']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(20),
});

export const updateReadingProgressSchema = z.object({
  bookId: z.string().min(1, 'Book ID is required'),
  progress: z.number().int().min(0).max(100),
  completed: z.boolean().default(false),
  rating: z.number().int().min(1).max(5).optional(),
});

export type CreateForumTopicFormData = z.infer<typeof createForumTopicSchema>;
export type UpdateForumTopicFormData = z.infer<typeof updateForumTopicSchema>;
export type CreateForumPostFormData = z.infer<typeof createForumPostSchema>;
export type UpdateForumPostFormData = z.infer<typeof updateForumPostSchema>;
export type CreateForumCategoryFormData = z.infer<typeof createForumCategorySchema>;
export type AddToWishlistFormData = z.infer<typeof addToWishlistSchema>;
export type CreateCollectionFormData = z.infer<typeof createCollectionSchema>;
export type AddToCollectionFormData = z.infer<typeof addToCollectionSchema>;
export type ForumSearchFormData = z.infer<typeof forumSearchSchema>;
export type UpdateReadingProgressFormData = z.infer<typeof updateReadingProgressSchema>;