import { z } from 'zod';

export const createBlogPostSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be less than 200 characters')
    .transform((title) => title.trim()),
  
  content: z
    .string()
    .min(1, 'Content is required')
    .min(50, 'Content must be at least 50 characters')
    .max(50000, 'Content must be less than 50,000 characters')
    .transform((content) => content.trim()),
  
  excerpt: z
    .string()
    .max(500, 'Excerpt must be less than 500 characters')
    .transform((excerpt) => excerpt.trim())
    .optional(),
  
  categoryId: z.string().optional(),
  
  featuredImage: z
    .string()
    .url('Invalid image URL')
    .optional(),
  
  language: z.enum(['SQ', 'EN']).default('SQ'),
  
  type: z.enum(['ADMIN', 'USER', 'FEATURED']).default('USER'),
  
  published: z.boolean().default(false),
  
  metaTitle: z
    .string()
    .max(60, 'Meta title must be less than 60 characters')
    .optional(),
  
  metaDescription: z
    .string()
    .max(160, 'Meta description must be less than 160 characters')
    .optional(),
  
  tagIds: z.array(z.string()).optional(),
});

export const updateBlogPostSchema = createBlogPostSchema
  .partial()
  .extend({
    id: z.string().min(1, 'Post ID is required'),
  })
  .refine(
    (data) => {
      const { id, ...updateFields } = data;
      return Object.keys(updateFields).length > 0;
    },
    { message: 'At least one field must be provided for update' }
  );

export const createBlogCategorySchema = z.object({
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

export const updateBlogCategorySchema = createBlogCategorySchema
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

export const createBlogTagSchema = z.object({
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
});

export const updateBlogTagSchema = createBlogTagSchema
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

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment content is required')
    .min(3, 'Comment must be at least 3 characters')
    .max(2000, 'Comment must be less than 2000 characters')
    .transform((content) => content.trim()),
  
  postId: z.string().min(1, 'Post ID is required'),
  
  parentId: z.string().optional(),
});

export const updateCommentSchema = z.object({
  id: z.string().min(1, 'Comment ID is required'),
  
  content: z
    .string()
    .min(3, 'Comment must be at least 3 characters')
    .max(2000, 'Comment must be less than 2000 characters')
    .transform((content) => content.trim())
    .optional(),
  
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'SPAM']).optional(),
});

export const blogSearchSchema = z.object({
  query: z.string().optional(),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  language: z.enum(['SQ', 'EN']).optional(),
  type: z.enum(['ADMIN', 'USER', 'FEATURED']).optional(),
  status: z.enum(['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'PUBLISHED']).optional(),
  authorId: z.string().optional(),
  published: z.boolean().optional(),
  sortBy: z.enum(['title', 'createdAt', 'publishedAt', 'views', 'likes']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(12),
});

export const moderationActionSchema = z.object({
  postId: z.string().min(1, 'Post ID is required'),
  action: z.enum(['APPROVE', 'REJECT', 'FEATURE']),
  rejectionReason: z
    .string()
    .min(10, 'Rejection reason must be at least 10 characters')
    .max(500, 'Rejection reason must be less than 500 characters')
    .optional()
    .refine((reason, ctx) => {
      if (ctx.parent.action === 'REJECT' && !reason) {
        return false;
      }
      return true;
    }, {
      message: 'Rejection reason is required when rejecting a post',
    }),
});

export type CreateBlogPostFormData = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostFormData = z.infer<typeof updateBlogPostSchema>;
export type CreateBlogCategoryFormData = z.infer<typeof createBlogCategorySchema>;
export type UpdateBlogCategoryFormData = z.infer<typeof updateBlogCategorySchema>;
export type CreateBlogTagFormData = z.infer<typeof createBlogTagSchema>;
export type UpdateBlogTagFormData = z.infer<typeof updateBlogTagSchema>;
export type CreateCommentFormData = z.infer<typeof createCommentSchema>;
export type UpdateCommentFormData = z.infer<typeof updateCommentSchema>;
export type BlogSearchFormData = z.infer<typeof blogSearchSchema>;
export type ModerationActionFormData = z.infer<typeof moderationActionSchema>;