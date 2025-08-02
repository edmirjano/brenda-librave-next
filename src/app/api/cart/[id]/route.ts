import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth/config';
import { CartService } from '@/lib/services/cart';
import { logError } from '@/lib/logging/logger';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { quantity } = body;

    if (!quantity || quantity < 1 || quantity > 10) {
      return NextResponse.json(
        { error: 'Quantity must be between 1 and 10' },
        { status: 400 }
      );
    }

    const cartItem = await CartService.updateCartItem(session.user.id, {
      id,
      quantity,
    });

    return NextResponse.json({
      success: true,
      data: cartItem,
      message: 'Cart item updated successfully',
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof Error && error.message.includes('inventory')) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    logError('Error updating cart item', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update cart item',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await CartService.removeFromCart(session.user.id, id);

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart successfully',
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    logError('Error removing cart item', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to remove cart item',
      },
      { status: 500 }
    );
  }
}