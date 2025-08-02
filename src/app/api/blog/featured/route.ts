import { NextRequest, NextResponse } from 'next/server';

import { BlogService } from '@/lib/services/blog';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 6;

    if (limit < 1 || limit > 20) {
      return NextResponse.json(
        {
          success: false,
          error: 'Limit must be between 1 and 20',
        },
        { status: 400 }
      );
    }

    const posts = await BlogService.getFeaturedPosts(limit);

    return NextResponse.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error('Error in featured blog posts API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch featured blog posts',
      },
      { status: 500 }
    );
  }
}