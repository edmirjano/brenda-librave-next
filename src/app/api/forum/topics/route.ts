import { NextRequest, NextResponse } from 'next/server';

import { ForumService } from '@/lib/services/forum';
import { forumSearchSchema } from '@/lib/validations/forum';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse search parameters
    const params = {
      query: searchParams.get('query') || undefined,
      categoryId: searchParams.get('categoryId') || undefined,
      tags: searchParams.get('tags')?.split(',').filter(Boolean) || undefined,
      bookId: searchParams.get('bookId') || undefined,
      authorId: searchParams.get('authorId') || undefined,
      status: (searchParams.get('status') as 'ACTIVE' | 'LOCKED' | 'HIDDEN' | 'DELETED') || 'ACTIVE',
      pinned: searchParams.get('pinned') ? searchParams.get('pinned') === 'true' : undefined,
      sortBy: (searchParams.get('sortBy') as 'title' | 'createdAt' | 'views' | 'posts') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20,
    };

    // Validate parameters
    const validationResult = forumSearchSchema.safeParse(params);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid search parameters',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const result = await ForumService.searchTopics(validationResult.data);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error in forum topics API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch forum topics',
      },
      { status: 500 }
    );
  }
}