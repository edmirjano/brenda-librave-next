import { prisma } from '@/lib/db/prisma';
import { logError, logInfo } from '@/lib/logging/logger';
import { slugify } from '@/lib/utils';

import type { CreateTagInput, TagWithoutRelations, UpdateTagInput } from '@/types/book';

/**
 * Service class for tag-related operations
 */
export class TagService {
  /**
   * Get all tags
   */
  static async getAllTags(): Promise<TagWithoutRelations[]> {
    try {
      const tags = await prisma.tag.findMany({
        orderBy: { name: 'asc' },
      });

      logInfo('All tags retrieved', { count: tags.length });

      return tags;
    } catch (error) {
      logError('Error getting all tags', error);
      return [];
    }
  }

  /**
   * Get tags with book counts
   */
  static async getTagsWithCounts(): Promise<
    Array<TagWithoutRelations & { bookCount: number }>
  > {
    try {
      const tags = await prisma.tag.findMany({
        include: {
          _count: {
            select: {
              books: {
                where: {
                  book: { active: true },
                },
              },
            },
          },
        },
        orderBy: { name: 'asc' },
      });

      const tagsWithCounts = tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        nameEn: tag.nameEn,
        slug: tag.slug,
        color: tag.color,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
        bookCount: tag._count.books,
      }));

      logInfo('Tags with counts retrieved', { count: tagsWithCounts.length });

      return tagsWithCounts;
    } catch (error) {
      logError('Error getting tags with counts', error);
      return [];
    }
  }

  /**
   * Get popular tags (most used)
   */
  static async getPopularTags(limit: number = 10): Promise<
    Array<TagWithoutRelations & { bookCount: number }>
  > {
    try {
      const tags = await prisma.tag.findMany({
        include: {
          _count: {
            select: {
              books: {
                where: {
                  book: { active: true },
                },
              },
            },
          },
        },
        orderBy: {
          books: {
            _count: 'desc',
          },
        },
        take: limit,
      });

      const popularTags = tags
        .map((tag) => ({
          id: tag.id,
          name: tag.name,
          nameEn: tag.nameEn,
          slug: tag.slug,
          color: tag.color,
          createdAt: tag.createdAt,
          updatedAt: tag.updatedAt,
          bookCount: tag._count.books,
        }))
        .filter((tag) => tag.bookCount > 0);

      logInfo('Popular tags retrieved', {
        count: popularTags.length,
        limit,
      });

      return popularTags;
    } catch (error) {
      logError('Error getting popular tags', error);
      return [];
    }
  }

  /**
   * Create a new tag
   */
  static async createTag(input: CreateTagInput): Promise<TagWithoutRelations> {
    try {
      // Generate slug if not provided
      const slug = input.slug || slugify(input.name);

      // Check if slug already exists
      const existingTag = await prisma.tag.findUnique({
        where: { slug },
      });

      if (existingTag) {
        throw new Error('A tag with this name already exists');
      }

      const tag = await prisma.tag.create({
        data: {
          ...input,
          slug,
        },
      });

      logInfo('Tag created', {
        tagId: tag.id,
        name: tag.name,
        slug: tag.slug,
      });

      return tag;
    } catch (error) {
      logError('Error creating tag', error, { input });
      throw new Error('Failed to create tag');
    }
  }

  /**
   * Update an existing tag
   */
  static async updateTag(input: UpdateTagInput): Promise<TagWithoutRelations> {
    try {
      const { id, ...updateData } = input;

      // If name is being updated, regenerate slug
      if (updateData.name) {
        updateData.slug = slugify(updateData.name);

        // Check if new slug conflicts with existing tags
        const existingTag = await prisma.tag.findFirst({
          where: {
            slug: updateData.slug,
            id: { not: id },
          },
        });

        if (existingTag) {
          throw new Error('A tag with this name already exists');
        }
      }

      const tag = await prisma.tag.update({
        where: { id },
        data: updateData,
      });

      logInfo('Tag updated', {
        tagId: tag.id,
        name: tag.name,
        changes: Object.keys(updateData),
      });

      return tag;
    } catch (error) {
      logError('Error updating tag', error, { input });
      throw new Error('Failed to update tag');
    }
  }

  /**
   * Delete a tag
   */
  static async deleteTag(id: string): Promise<void> {
    try {
      // Check if tag is used by any books
      const bookCount = await prisma.bookTag.count({
        where: { tagId: id },
      });

      if (bookCount > 0) {
        throw new Error('Cannot delete tag that is used by books');
      }

      const tag = await prisma.tag.findUnique({
        where: { id },
        select: { name: true },
      });

      if (!tag) {
        throw new Error('Tag not found');
      }

      await prisma.tag.delete({
        where: { id },
      });

      logInfo('Tag deleted', {
        tagId: id,
        name: tag.name,
      });
    } catch (error) {
      logError('Error deleting tag', error, { tagId: id });
      throw new Error('Failed to delete tag');
    }
  }

  /**
   * Search tags by name
   */
  static async searchTags(query: string): Promise<TagWithoutRelations[]> {
    try {
      const tags = await prisma.tag.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { nameEn: { contains: query, mode: 'insensitive' } },
          ],
        },
        orderBy: { name: 'asc' },
      });

      logInfo('Tags search completed', {
        query,
        count: tags.length,
      });

      return tags;
    } catch (error) {
      logError('Error searching tags', error, { query });
      return [];
    }
  }
}