import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth/config';
import { BlogService } from '@/lib/services/blog';
import { logError, logInfo } from '@/lib/logging/logger';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const result = await BlogService.toggleLike(id, session.user.id);

    logInfo('Blog post like toggled', {
      postId: id,
      userId: session.user.id,
      liked: result.liked,
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: result.liked ? 'Post liked successfully' : 'Like removed successfully',
    });
  } catch (error) {
    logError('Error toggling blog post like', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to toggle like',
      },
      { status: 500 }
    );
  }
}