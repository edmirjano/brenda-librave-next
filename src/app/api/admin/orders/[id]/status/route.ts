import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth/config';
import { OrderService } from '@/lib/services/orders';
import { logError, logInfo } from '@/lib/logging/logger';
import { updateOrderStatusSchema } from '@/lib/validations/order';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validationResult = updateOrderStatusSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input data',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { status, paymentId } = validationResult.data;

    const order = await OrderService.updateOrderStatus(id, status, paymentId);

    logInfo('Order status updated by admin', {
      adminId: session.user.id,
      orderId: id,
      newStatus: status,
      paymentId,
    });

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order status updated successfully',
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    logError('Error updating order status', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update order status',
      },
      { status: 500 }
    );
  }
}