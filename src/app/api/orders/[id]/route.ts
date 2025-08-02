import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth/config';
import { OrderService } from '@/lib/services/orders';
import { logError } from '@/lib/logging/logger';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const order = await OrderService.getOrderById(id, session.user.id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    logError('Error in order API', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch order',
      },
      { status: 500 }
    );
  }
}