import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/db/prisma';
import { logError, logInfo } from '@/lib/logging/logger';
import { slugify } from '@/lib/utils';

import type {
  CreateForumTopicInput,
  ForumSearchParams,
  ForumSearchResult,
  ForumStats,
  ForumTopic,
  ForumTopicListItem,
  UpdateForumTopicInput,
} from '@/types/forum';

/**
 * Service class for forum-related operations
 */
export class ForumService {
  /**
   * Search forum topics with filters and pagination
   */
  static async searchTopics(params: ForumSearchParams): Promise<ForumSearchResult> {
    try {
      const {
        query,
        categoryId,
        tags,
        bookId,
        authorId,
        status = 'ACTIVE',
        pinned,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 20,
      } = params;

      const offset = (page - 1) * limit;

      // Build where clause
      const where: Prisma.ForumTopicWhereInput = {
        status,
        ...(categoryId && { categoryId }),
        ...(bookId && { bookId }),
        ...(authorId && { authorId }),
        ...(pinned !== undefined && { pinned }),
        ...(query && {
          OR: [
            { title: { contains: query } },
            { content: { contains: query } },
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
      const orderBy: Prisma.ForumTopicOrderByWithRelationInput = {};
      if (sortBy === 'title') {
        orderBy.title = sortOrder;
      } else if (sortBy === 'views') {
        orderBy.views = sortOrder;
      } else if (sortBy === 'posts') {
        orderBy.posts = { _count: sortOrder };
      } else {
        orderBy.createdAt = sortOrder;
      }

      // Execute queries
      const [topics, totalCount] = await Promise.all([
        prisma.forumTopic.findMany({
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
            book: {
              select: {
                id: true,
                title: true,
                author: true,
                slug: true,
              },
            },
            tags: {
              include: {
                tag: true,
              },
            },
            _count: {
              select: {
                posts: true,
              },
            },
          },
          orderBy: [
            { pinned: 'desc' }, // Pinned topics first
            orderBy,
          ],
          skip: offset,
          take: limit,
        }),
        prisma.forumTopic.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      logInfo('Forum topics search completed', {
        query,
        totalCount,
        page,
        limit,
      });

      return {
        topics,
        totalCount,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      logError('Error searching forum topics', error);
      throw new Error('Failed to search forum topics');
    }
  }

  /**
   * Get forum topic by ID with full details
   */
  static async getTopicById(id: string): Promise<ForumTopic | null> {
    try {
      const topic = await prisma.forumTopic.findUnique({
        where: { id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          category: true,
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              slug: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
          posts: {
            where: { status: 'ACTIVE' },
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
              replies: {
                where: { status: 'ACTIVE' },
                include: {
                  author: {
                    select: {
                      id: true,
                      name: true,
                      image: true,
                    },
                  },
                },
                orderBy: { createdAt: 'asc' },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
          _count: {
            select: {
              posts: true,
            },
          },
        },
      });

      if (topic) {
        // Increment view count
        await prisma.forumTopic.update({
          where: { id },
          data: { views: { increment: 1 } },
        });

        logInfo('Forum topic retrieved', { topicId: id, title: topic.title });
      }

      return topic;
    } catch (error) {
      logError('Error getting forum topic by ID', error, { topicId: id });
      return null;
    }
  }

  /**
   * Get forum topic by slug with full details
   */
  static async getTopicBySlug(slug: string): Promise<ForumTopic | null> {
    try {
      const topic = await prisma.forumTopic.findUnique({
        where: { slug },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          category: true,
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              slug: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
          posts: {
            where: { status: 'ACTIVE' },
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
              replies: {
                where: { status: 'ACTIVE' },
                include: {
                  author: {
                    select: {
                      id: true,
                      name: true,
                      image: true,
                    },
                  },
                },
                orderBy: { createdAt: 'asc' },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
          _count: {
            select: {
              posts: true,
            },
          },
        },
      });

      if (topic) {
        // Increment view count
        await prisma.forumTopic.update({
          where: { slug },
          data: { views: { increment: 1 } },
        });

        logInfo('Forum topic retrieved by slug', { slug, title: topic.title });
      }

      return topic;
    } catch (error) {
      logError('Error getting forum topic by slug', error, { slug });
      return null;
    }
  }

  /**
   * Create a new forum topic
   */
  static async createTopic(input: CreateForumTopicInput, authorId: string): Promise<ForumTopic> {
    try {
      // Generate slug
      const slug = slugify(input.title);

      // Check if slug already exists
      const existingTopic = await prisma.forumTopic.findUnique({
        where: { slug },
      });

      if (existingTopic) {
        throw new Error('A topic with this title already exists');
      }

      const { tagIds, ...topicData } = input;

      const topic = await prisma.forumTopic.create({
        data: {
          ...topicData,
          authorId,
          slug,
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
              image: true,
            },
          },
          category: true,
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              slug: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
          posts: true,
          _count: {
            select: {
              posts: true,
            },
          },
        },
      });

      logInfo('Forum topic created', {
        topicId: topic.id,
        title: topic.title,
        authorId,
        categoryId: topic.categoryId,
      });

      return topic;
    } catch (error) {
      logError('Error creating forum topic', error, { input, authorId });
      throw error;
    }
  }

  /**
   * Get forum categories with topic counts
   */
  static async getCategories(): Promise<any[]> {
    try {
      const categories = await prisma.forumCategory.findMany({
        where: { active: true },
        include: {
          _count: {
            select: {
              topics: {
                where: { status: 'ACTIVE' },
              },
            },
          },
        },
        orderBy: { sortOrder: 'asc' },
      });

      logInfo('Forum categories retrieved', { count: categories.length });

      return categories;
    } catch (error) {
      logError('Error getting forum categories', error);
      return [];
    }
  }

  /**
   * Get forum statistics
   */
  static async getForumStats(): Promise<ForumStats> {
    try {
      const [
        totalTopics,
        totalPosts,
        totalCategories,
        activeUsers,
        topCategories,
        recentActivity,
      ] = await Promise.all([
        prisma.forumTopic.count({ where: { status: 'ACTIVE' } }),
        prisma.forumPost.count({ where: { status: 'ACTIVE' } }),
        prisma.forumCategory.count({ where: { active: true } }),
        prisma.user.count({
          where: {
            OR: [
              { forumTopics: { some: {} } },
              { forumPosts: { some: {} } },
            ],
          },
        }),
        prisma.forumCategory.findMany({
          where: { active: true },
          include: {
            _count: {
              select: {
                topics: {
                  where: { status: 'ACTIVE' },
                },
              },
            },
          },
          orderBy: {
            topics: {
              _count: 'desc',
            },
          },
          take: 5,
        }),
        prisma.forumTopic.findMany({
          where: { status: 'ACTIVE' },
          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        }),
      ]);

      const stats: ForumStats = {
        totalTopics,
        totalPosts,
        totalCategories,
        activeUsers,
        topCategories: topCategories.map(cat => ({
          id: cat.id,
          name: cat.name,
          topicCount: cat._count.topics,
        })),
        recentActivity: recentActivity.map(topic => ({
          type: 'topic' as const,
          title: topic.title,
          author: topic.author.name,
          createdAt: topic.createdAt.toISOString(),
        })),
      };

      logInfo('Forum stats retrieved', stats);

      return stats;
    } catch (error) {
      logError('Error getting forum stats', error);
      throw new Error('Failed to get forum statistics');
    }
  }
}