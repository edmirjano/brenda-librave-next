import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth/config';
import { CartService } from '@/lib/services/cart';
import { logError, logSecurity } from '@/lib/logging/logger';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { bookId, quantity = 1, isDigital = false, currency = 'ALL' } = body;

    // Validate input
    if (!bookId) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
    }

    if (quantity < 1 || quantity > 10) {
      return NextResponse.json(
        { error: 'Quantity must be between 1 and 10' },
        { status: 400 }
      );
    }

    if (!['ALL', 'EUR'].includes(currency)) {
      return NextResponse.json({ error: 'Invalid currency' }, { status: 400 });
    }

    const cartItem = await CartService.addToCart(session.user.id, {
      bookId,
      quantity,
      isDigital,
      currency,
    });

    return NextResponse.json({
      success: true,
      data: cartItem,
      message: 'Item added to cart successfully',
    });
  } catch (error) {
    if (error instanceof Error) {
      // Handle known business logic errors
      if (error.message.includes('not found') || error.message.includes('not available')) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      if (error.message.includes('inventory') || error.message.includes('Insufficient')) {
        return NextResponse.json({ error: error.message }, { status: 409 });
      }
    }

    logError('Error adding to cart', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add item to cart',
      },
      { status: 500 }
    );
  }
}