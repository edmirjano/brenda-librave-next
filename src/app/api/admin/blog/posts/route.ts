import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth/config';
import { BlogService } from '@/lib/services/blog';
import { logError, logInfo } from '@/lib/logging/logger';
import { blogSearchSchema } from '@/lib/validations/blog';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    // Parse search parameters (admin can see all posts, not just published)
    const params = {
      query: searchParams.get('query') || undefined,
      categoryId: searchParams.get('categoryId') || undefined,
      tags: searchParams.get('tags')?.split(',').filter(Boolean) || undefined,
      language: (searchParams.get('language') as 'SQ' | 'EN') || undefined,
      type: (searchParams.get('type') as 'ADMIN' | 'USER' | 'FEATURED') || undefined,
      status: (searchParams.get('status') as 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'PUBLISHED') || undefined,
      authorId: searchParams.get('authorId') || undefined,
      published: searchParams.get('published') ? searchParams.get('published') === 'true' : undefined,
      sortBy: (searchParams.get('sortBy') as 'title' | 'createdAt' | 'publishedAt' | 'views' | 'likes') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20,
    };

    // Validate parameters
    const validationResult = blogSearchSchema.safeParse(params);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid search parameters',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const result = await BlogService.searchPosts(validationResult.data);

    logInfo('Admin blog posts retrieved', {
      adminId: session.user.id,
      totalCount: result.totalCount,
      page: params.page,
      limit: params.limit,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logError('Error in admin blog posts API', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch blog posts',
      },
      { status: 500 }
    );
  }
}