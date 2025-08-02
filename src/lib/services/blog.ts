import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/db/prisma';
import { logError, logInfo } from '@/lib/logging/logger';
import { slugify } from '@/lib/utils';

import type {
  BlogPost,
  BlogPostListItem,
  BlogSearchParams,
  BlogSearchResult,
  BlogStats,
  CreateBlogPostInput,
  UpdateBlogPostInput,
} from '@/types/blog';

/**
 * Service class for blog-related operations
 */
export class BlogService {
  /**
   * Search blog posts with filters and pagination
   */
  static async searchPosts(params: BlogSearchParams): Promise<BlogSearchResult> {
    try {
      const {
        query,
        categoryId,
        tags,
        language,
        type,
        status,
        authorId,
        published,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 12,
      } = params;

      const offset = (page - 1) * limit;

      // Build where clause
      const where: Prisma.BlogPostWhereInput = {
        ...(published !== undefined && { published }),
        ...(categoryId && { categoryId }),
        ...(language && { language }),
        ...(type && { type }),
        ...(status && { status }),
        ...(authorId && { authorId }),
        ...(query && {
          OR: [
            { title: { contains: query } },
            { content: { contains: query } },
            { excerpt: { contains: query } },
          ],
        }),
        ...(tags && tags.length > 0 && {
          tags: {
            some: {
              tag: {
                name: { in: tags },
              },
            },
          },
        }),
      };

      // Build order by clause
      const orderBy: Prisma.BlogPostOrderByWithRelationInput = {};
      if (sortBy === 'title') {
        orderBy.title = sortOrder;
      } else if (sortBy === 'publishedAt') {
        orderBy.publishedAt = sortOrder;
      } else if (sortBy === 'views') {
        orderBy.views = sortOrder;
      } else if (sortBy === 'likes') {
        orderBy.likes = sortOrder;
      } else {
        orderBy.createdAt = sortOrder;
      }

      // Execute queries
      const [posts, totalCount] = await Promise.all([
        prisma.blogPost.findMany({
          where,
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            category: true,
            tags: {
              include: {
                tag: true,
              },
            },
            _count: {
              select: {
                comments: true,
                likes_relation: true,
              },
            },
          },
          orderBy,
          skip: offset,
          take: limit,
        }),
        prisma.blogPost.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      logInfo('Blog posts search completed', {
        query,
        totalCount,
        page,
        limit,
      });

      return {
        posts,
        totalCount,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      logError('Error searching blog posts', error);
      throw new Error('Failed to search blog posts');
    }
  }

  /**
   * Get blog post by ID with full details
   */
  static async getPostById(id: string): Promise<BlogPost | null> {
    try {
      const post = await prisma.blogPost.findUnique({
        where: { id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          category: true,
          moderatedBy: {
            select: {
              id: true,
              name: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
          comments: {
            where: { status: 'APPROVED' },
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
              replies: {
                where: { status: 'APPROVED' },
                include: {
                  author: {
                    select: {
                      id: true,
                      name: true,
                      image: true,
                    },
                  },
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
          likes_relation: true,
          _count: {
            select: {
              comments: true,
              likes_relation: true,
            },
          },
        },
      });

      if (post) {
        // Increment view count
        await prisma.blogPost.update({
          where: { id },
          data: { views: { increment: 1 } },
        });

        logInfo('Blog post retrieved', { postId: id, title: post.title });
      }

      return post;
    } catch (error) {
      logError('Error getting blog post by ID', error, { postId: id });
      return null;
    }
  }

  /**
   * Get blog post by slug with full details
   */
  static async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const post = await prisma.blogPost.findUnique({
        where: { slug },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          category: true,
          moderatedBy: {
            select: {
              id: true,
              name: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
          comments: {
            where: { status: 'APPROVED' },
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
              replies: {
                where: { status: 'APPROVED' },
                include: {
                  author: {
                    select: {
                      id: true,
                      name: true,
                      image: true,
                    },
                  },
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
          likes_relation: true,
          _count: {
            select: {
              comments: true,
              likes_relation: true,
            },
          },
        },
      });

      if (post) {
        // Increment view count
        await prisma.blogPost.update({
          where: { slug },
          data: { views: { increment: 1 } },
        });

        logInfo('Blog post retrieved by slug', { slug, title: post.title });
      }

      return post;
    } catch (error) {
      logError('Error getting blog post by slug', error, { slug });
      return null;
    }
  }

  /**
   * Create a new blog post
   */
  static async createPost(input: CreateBlogPostInput, authorId: string): Promise<BlogPost> {
    try {
      // Generate slug if not provided
      const slug = slugify(input.title);

      // Check if slug already exists
      const existingPost = await prisma.blogPost.findUnique({
        where: { slug },
      });

      if (existingPost) {
        throw new Error('A post with this title already exists');
      }

      const { tagIds, ...postData } = input;

      // Set status based on type and user role
      let status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'PUBLISHED' = 'DRAFT';
      if (input.type === 'ADMIN') {
        status = input.published ? 'PUBLISHED' : 'DRAFT';
      } else if (input.type === 'USER') {
        status = 'PENDING_REVIEW';
      }

      const post = await prisma.blogPost.create({
        data: {
          ...postData,
          authorId,
          slug,
          status,
          publishedAt: input.published ? new Date() : null,
          ...(tagIds &&
            tagIds.length > 0 && {
              tags: {
                create: tagIds.map((tagId) => ({
                  tag: {
                    connect: { id: tagId },
                  },
                })),
              },
            }),
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          category: true,
          moderatedBy: {
            select: {
              id: true,
              name: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
          comments: true,
          likes_relation: true,
          _count: {
            select: {
              comments: true,
              likes_relation: true,
            },
          },
        },
      });

      logInfo('Blog post created', {
        postId: post.id,
        title: post.title,
        authorId,
        type: post.type,
        status: post.status,
      });

      return post;
    } catch (error) {
      logError('Error creating blog post', error, { input, authorId });
      throw new Error('Failed to create blog post');
    }
  }

  /**
   * Update an existing blog post
   */
  static async updatePost(input: UpdateBlogPostInput, userId: string): Promise<BlogPost> {
    try {
      const { id, tagIds, ...updateData } = input;

      // Check if post exists and user has permission
      const existingPost = await prisma.blogPost.findUnique({
        where: { id },
        include: { author: true },
      });

      if (!existingPost) {
        throw new Error('Blog post not found');
      }

      // Check permissions
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Only author or admin can edit
      if (existingPost.authorId !== userId && user.role !== 'ADMIN') {
        throw new Error('Permission denied');
      }

      // If title is being updated, regenerate slug
      if (updateData.title) {
        updateData.slug = slugify(updateData.title);

        // Check if new slug conflicts with existing posts
        const conflictingPost = await prisma.blogPost.findFirst({
          where: {
            slug: updateData.slug,
            id: { not: id },
          },
        });

        if (conflictingPost) {
          throw new Error('A post with this title already exists');
        }
      }

      // Handle publishing
      if (updateData.published && !existingPost.publishedAt) {
        updateData.publishedAt = new Date();
        if (existingPost.type === 'ADMIN') {
          updateData.status = 'PUBLISHED';
        }
      }

      const post = await prisma.blogPost.update({
        where: { id },
        data: {
          ...updateData,
          ...(tagIds !== undefined && {
            tags: {
              deleteMany: {},
              create: tagIds.map((tagId) => ({
                tag: {
                  connect: { id: tagId },
                },
              })),
            },
          }),
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          category: true,
          moderatedBy: {
            select: {
              id: true,
              name: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
          comments: true,
          likes_relation: true,
          _count: {
            select: {
              comments: true,
              likes_relation: true,
            },
          },
        },
      });

      logInfo('Blog post updated', {
        postId: post.id,
        title: post.title,
        userId,
        changes: Object.keys(updateData),
      });

      return post;
    } catch (error) {
      logError('Error updating blog post', error, { input, userId });
      throw error;
    }
  }

  /**
   * Delete a blog post
   */
  static async deletePost(id: string, userId: string): Promise<void> {
    try {
      const post = await prisma.blogPost.findUnique({
        where: { id },
        select: { title: true, authorId: true },
      });

      if (!post) {
        throw new Error('Blog post not found');
      }

      // Check permissions
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Only author or admin can delete
      if (post.authorId !== userId && user.role !== 'ADMIN') {
        throw new Error('Permission denied');
      }

      await prisma.blogPost.delete({
        where: { id },
      });

      logInfo('Blog post deleted', {
        postId: id,
        title: post.title,
        userId,
      });
    } catch (error) {
      logError('Error deleting blog post', error, { postId: id, userId });
      throw error;
    }
  }

  /**
   * Get featured blog posts
   */
  static async getFeaturedPosts(limit: number = 6): Promise<BlogPostListItem[]> {
    try {
      const posts = await prisma.blogPost.findMany({
        where: {
          type: 'FEATURED',
          published: true,
          status: 'PUBLISHED',
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likes_relation: true,
            },
          },
        },
        orderBy: {
          publishedAt: 'desc',
        },
        take: limit,
      });

      logInfo('Featured blog posts retrieved', { count: posts.length, limit });

      return posts;
    } catch (error) {
      logError('Error getting featured blog posts', error);
      return [];
    }
  }

  /**
   * Get recent blog posts
   */
  static async getRecentPosts(limit: number = 10): Promise<BlogPostListItem[]> {
    try {
      const posts = await prisma.blogPost.findMany({
        where: {
          published: true,
          status: 'PUBLISHED',
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likes_relation: true,
            },
          },
        },
        orderBy: {
          publishedAt: 'desc',
        },
        take: limit,
      });

      logInfo('Recent blog posts retrieved', { count: posts.length, limit });

      return posts;
    } catch (error) {
      logError('Error getting recent blog posts', error);
      return [];
    }
  }

  /**
   * Toggle like on a blog post
   */
  static async toggleLike(postId: string, userId: string): Promise<{ liked: boolean; totalLikes: number }> {
    try {
      const existingLike = await prisma.blogPostLike.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });

      let liked: boolean;
      let likeChange: number;

      if (existingLike) {
        // Remove like
        await prisma.blogPostLike.delete({
          where: { id: existingLike.id },
        });
        liked = false;
        likeChange = -1;
      } else {
        // Add like
        await prisma.blogPostLike.create({
          data: {
            userId,
            postId,
          },
        });
        liked = true;
        likeChange = 1;
      }

      // Update post like count
      const updatedPost = await prisma.blogPost.update({
        where: { id: postId },
        data: {
          likes: { increment: likeChange },
        },
        select: { likes: true },
      });

      logInfo('Blog post like toggled', {
        postId,
        userId,
        liked,
        totalLikes: updatedPost.likes,
      });

      return {
        liked,
        totalLikes: updatedPost.likes,
      };
    } catch (error) {
      logError('Error toggling blog post like', error, { postId, userId });
      throw new Error('Failed to toggle like');
    }
  }

  /**
   * Moderate a blog post (admin only)
   */
  static async moderatePost(
    postId: string,
    action: 'APPROVE' | 'REJECT' | 'FEATURE',
    moderatorId: string,
    rejectionReason?: string
  ): Promise<BlogPost> {
    try {
      let updateData: any = {
        moderatedAt: new Date(),
        moderatedById: moderatorId,
      };

      switch (action) {
        case 'APPROVE':
          updateData.status = 'APPROVED';
          updateData.published = true;
          updateData.publishedAt = new Date();
          break;
        case 'REJECT':
          updateData.status = 'REJECTED';
          updateData.published = false;
          updateData.rejectionReason = rejectionReason;
          break;
        case 'FEATURE':
          updateData.type = 'FEATURED';
          updateData.status = 'PUBLISHED';
          updateData.published = true;
          if (!updateData.publishedAt) {
            updateData.publishedAt = new Date();
          }
          break;
      }

      const post = await prisma.blogPost.update({
        where: { id: postId },
        data: updateData,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          category: true,
          moderatedBy: {
            select: {
              id: true,
              name: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
          comments: true,
          likes_relation: true,
          _count: {
            select: {
              comments: true,
              likes_relation: true,
            },
          },
        },
      });

      logInfo('Blog post moderated', {
        postId,
        action,
        moderatorId,
        newStatus: post.status,
      });

      return post;
    } catch (error) {
      logError('Error moderating blog post', error, { postId, action, moderatorId });
      throw new Error('Failed to moderate blog post');
    }
  }

  /**
   * Get blog statistics
   */
  static async getBlogStats(): Promise<BlogStats> {
    try {
      const [
        totalPosts,
        publishedPosts,
        draftPosts,
        userPosts,
        adminPosts,
        totalViews,
        totalLikes,
        totalComments,
        categoriesCount,
        tagsCount,
      ] = await Promise.all([
        prisma.blogPost.count(),
        prisma.blogPost.count({ where: { published: true } }),
        prisma.blogPost.count({ where: { status: 'DRAFT' } }),
        prisma.blogPost.count({ where: { type: 'USER' } }),
        prisma.blogPost.count({ where: { type: 'ADMIN' } }),
        prisma.blogPost.aggregate({ _sum: { views: true } }),
        prisma.blogPost.aggregate({ _sum: { likes: true } }),
        prisma.comment.count({ where: { status: 'APPROVED' } }),
        prisma.blogCategory.count({ where: { active: true } }),
        prisma.blogTag.count(),
      ]);

      const stats = {
        totalPosts,
        publishedPosts,
        draftPosts,
        userPosts,
        adminPosts,
        totalViews: totalViews._sum.views || 0,
        totalLikes: totalLikes._sum.likes || 0,
        totalComments,
        categoriesCount,
        tagsCount,
      };

      logInfo('Blog stats retrieved', stats);

      return stats;
    } catch (error) {
      logError('Error getting blog stats', error);
      throw new Error('Failed to get blog statistics');
    }
  }

  /**
   * Get posts pending moderation
   */
  static async getPendingPosts(limit: number = 20): Promise<BlogPostListItem[]> {
    try {
      const posts = await prisma.blogPost.findMany({
        where: {
          status: 'PENDING_REVIEW',
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likes_relation: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc', // Oldest first for moderation queue
        },
        take: limit,
      });

      logInfo('Pending blog posts retrieved', { count: posts.length, limit });

      return posts;
    } catch (error) {
      logError('Error getting pending blog posts', error);
      return [];
    }
  }
}