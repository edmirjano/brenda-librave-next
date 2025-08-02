import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth/config';
import { CartService } from '@/lib/services/cart';
import { logError, logInfo } from '@/lib/logging/logger';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cartSummary = await CartService.getCartSummary(session.user.id);

    return NextResponse.json({
      success: true,
      data: cartSummary,
    });
  } catch (error) {
    logError('Error in cart API', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch cart',
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await CartService.clearCart(session.user.id);

    logInfo('Cart cleared via API', { userId: session.user.id });

    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully',
    });
  } catch (error) {
    logError('Error clearing cart', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to clear cart',
      },
      { status: 500 }
    );
  }
}