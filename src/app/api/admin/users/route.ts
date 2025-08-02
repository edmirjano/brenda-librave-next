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
    const role = searchParams.get('role');
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
        { name: { contains: query } },
        { email: { contains: query } },
      ];
    }

    if (role && role !== 'all') {
      where.role = role;
    }

    // Execute queries
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          newsletter: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
            },
          },
        },
        orderBy: [
          { role: 'desc' }, // ADMIN first
          { createdAt: 'desc' },
        ],
        skip: offset,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    // Get total spent for each user
    const userIds = users.map(user => user.id);
    const userSpending = await prisma.order.groupBy({
      by: ['userId'],
      where: {
        userId: { in: userIds },
        status: 'PAID',
      },
      _sum: {
        totalAmount: true,
      },
    });

    const spendingMap = new Map(
      userSpending.map(spending => [
        spending.userId,
        spending._sum.totalAmount || 0,
      ])
    );

    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified?.toISOString() || null,
      newsletter: user.newsletter,
      createdAt: user.createdAt.toISOString(),
      orderCount: user._count.orders,
      totalSpent: spendingMap.get(user.id) || 0,
    }));

    logInfo('Admin users retrieved', {
      adminId: session.user.id,
      totalCount,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: {
        users: formattedUsers,
        totalCount,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    logError('Error fetching admin users', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch users',
      },
      { status: 500 }
    );
  }
}