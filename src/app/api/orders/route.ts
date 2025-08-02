import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth/config';
import { OrderService } from '@/lib/services/orders';
import { logError, logInfo } from '@/lib/logging/logger';
import { createOrderSchema } from '@/lib/validations/order';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 10;

    if (page < 1 || limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    const result = await OrderService.getUserOrders(session.user.id, page, limit);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logError('Error in orders API (GET)', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch orders',
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
    const validationResult = createOrderSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input data',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const order = await OrderService.createOrder(session.user.id, validationResult.data);

    logInfo('Order created via API', {
      userId: session.user.id,
      orderId: order.id,
      orderNumber: order.orderNumber,
    });

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order created successfully',
    });
  } catch (error) {
    if (error instanceof Error) {
      // Handle known business logic errors
      if (error.message.includes('Cart is empty')) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    logError('Error creating order', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create order',
      },
      { status: 500 }
    );
  }
}