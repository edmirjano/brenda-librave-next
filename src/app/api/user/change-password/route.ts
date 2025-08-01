import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth/config';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { prisma } from '@/lib/db/prisma';
import { logError, logInfo, logSecurity } from '@/lib/logging/logger';
import { changePasswordSchema } from '@/lib/validations/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = changePasswordSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input data',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = validationResult.data;

    // Get current user with password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!user || !user.password) {
      logSecurity('Password change attempt for user without password', {
        userId: session.user.id,
      });

      return NextResponse.json({ error: 'User not found or no password set' }, { status: 404 });
    }

    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      logSecurity('Invalid current password during password change', {
        userId: session.user.id,
        email: user.email,
      });

      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        password: hashedNewPassword,
      },
    });

    logInfo('Password changed successfully', {
      userId: session.user.id,
      email: user.email,
    });

    return NextResponse.json({
      message: 'Password changed successfully',
    });
  } catch (error) {
    logError('Password change error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
