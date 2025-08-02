import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth/config';
import { WishlistService } from '@/lib/services/wishlist';
import { logError } from '@/lib/logging/logger';
import { addToWishlistSchema } from '@/lib/validations/forum';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const wishlist = await WishlistService.getUserWishlist(session.user.id);

    return NextResponse.json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    logError('Error in wishlist API', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch wishlist',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate input data
    const validationResult = addToWishlistSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input data',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const wishlistItem = await WishlistService.addToWishlist(session.user.id, validationResult.data);

    return NextResponse.json({
      success: true,
      data: wishlistItem,
      message: 'Book added to wishlist successfully',
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not found') || error.message.includes('not available')) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      if (error.message.includes('already in')) {
        return NextResponse.json({ error: error.message }, { status: 409 });
      }
    }

    logError('Error adding to wishlist', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add to wishlist',
      },
      { status: 500 }
    );
  }
}