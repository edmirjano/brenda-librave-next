import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/db/prisma';
import { logError, logInfo } from '@/lib/logging/logger';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const status = searchParams.get('status');
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 20;

    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (query) {
      where.OR = [
        { orderNumber: { contains: query } },
        { shippingName: { contains: query } },
        { shippingEmail: { contains: query } },
      ];
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    // Execute queries
    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            select: {
              id: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      shippingName: order.shippingName,
      shippingEmail: order.shippingEmail,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt.toISOString(),
      itemCount: order.items.length,
    }));

    logInfo('Admin orders retrieved', {
      adminId: session.user.id,
      totalCount,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: {
        orders: formattedOrders,
        totalCount,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    logError('Error fetching admin orders', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch orders',
      },
      { status: 500 }
    );
  }
}