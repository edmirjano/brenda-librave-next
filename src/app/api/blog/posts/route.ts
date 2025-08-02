import { NextRequest, NextResponse } from 'next/server';

import { BlogService } from '@/lib/services/blog';
import { blogSearchSchema } from '@/lib/validations/blog';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse search parameters
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
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 12,
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

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error in blog posts API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch blog posts',
      },
      { status: 500 }
    );
  }
}