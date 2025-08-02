import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/db/prisma';
import { logError, logInfo, logSecurity } from '@/lib/logging/logger';

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
    const { role } = body;

    if (!role || !['USER', 'ADMIN'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Prevent admin from changing their own role
    if (id === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot change your own role' },
        { status: 400 }
      );
    }

    // Get user info for logging
    const user = await prisma.user.findUnique({
      where: { id },
      select: { name: true, email: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    logSecurity('User role changed by admin', {
      adminId: session.user.id,
      adminEmail: session.user.email,
      targetUserId: id,
      targetUserEmail: user.email,
      oldRole: user.role,
      newRole: role,
    });

    logInfo('User role updated', {
      adminId: session.user.id,
      userId: id,
      oldRole: user.role,
      newRole: role,
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'User role updated successfully',
    });
  } catch (error) {
    logError('Error updating user role', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update user role',
      },
      { status: 500 }
    );
  }
}