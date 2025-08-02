import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/db/prisma';
import { logError, logInfo } from '@/lib/logging/logger';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get dashboard statistics
    const [
      totalBooks,
      activeBooks,
      totalUsers,
      totalOrders,
      pendingOrders,
      lowStockBooks,
      recentOrders,
      totalRevenue,
    ] = await Promise.all([
      // Books stats
      prisma.book.count(),
      prisma.book.count({ where: { active: true } }),
      
      // Users stats
      prisma.user.count(),
      
      // Orders stats
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      
      // Low stock books (inventory < 5)
      prisma.book.count({
        where: {
          active: true,
          inventory: { lt: 5 },
        },
      }),
      
      // Recent orders
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          shippingName: true,
          totalAmount: true,
          status: true,
          createdAt: true,
        },
      }),
      
      // Total revenue (sum of all paid orders)
      prisma.order.aggregate({
        where: { status: 'PAID' },
        _sum: { totalAmount: true },
      }),
    ]);

    const dashboardStats = {
      totalBooks,
      activeBooks,
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      pendingOrders,
      lowStockBooks,
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.shippingName,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
      })),
    };

    logInfo('Admin dashboard stats retrieved', {
      adminId: session.user.id,
      statsRequested: Object.keys(dashboardStats),
    });

    return NextResponse.json({
      success: true,
      data: dashboardStats,
    });
  } catch (error) {
    logError('Error fetching admin dashboard stats', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dashboard statistics',
      },
      { status: 500 }
    );
  }
}