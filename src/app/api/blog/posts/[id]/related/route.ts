import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/db/prisma';
import { logError, logInfo } from '@/lib/logging/logger';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 3;

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    if (limit < 1 || limit > 10) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 10' },
        { status: 400 }
      );
    }

    // Get current post to find related posts
    const currentPost = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!currentPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const tagIds = currentPost.tags.map((pt) => pt.tag.id);

    // Find related posts based on category and tags
    const relatedPosts = await prisma.blogPost.findMany({
      where: {
        id: { not: id },
        published: true,
        status: 'PUBLISHED',
        OR: [
          { categoryId: currentPost.categoryId },
          {
            tags: {
              some: {
                tagId: { in: tagIds },
              },
            },
          },
        ],
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
      orderBy: [
        { type: 'desc' }, // Featured posts first
        { publishedAt: 'desc' },
      ],
      take: limit,
    });

    logInfo('Related blog posts retrieved', {
      postId: id,
      count: relatedPosts.length,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: relatedPosts,
    });
  } catch (error) {
    logError('Error fetching related blog posts', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch related posts',
      },
      { status: 500 }
    );
  }
}