import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth/config';
import { WishlistService } from '@/lib/services/wishlist';
import { logError } from '@/lib/logging/logger';

interface RouteParams {
  params: Promise<{
    bookId: string;
  }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bookId } = await params;

    await WishlistService.removeFromWishlist(session.user.id, bookId);

    return NextResponse.json({
      success: true,
      message: 'Book removed from wishlist successfully',
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    logError('Error removing from wishlist', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to remove from wishlist',
      },
      { status: 500 }
    );
  }
}