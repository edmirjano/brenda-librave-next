import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { updateProfileSchema } from '@/lib/validations/auth';
import { prisma } from '@/lib/db/prisma';
import { authOptions } from '@/lib/auth/config';
import { logInfo, logError } from '@/lib/logging/logger';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        language: true,
        currency: true,
        newsletter: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });

  } catch (error) {
    logError('Profile fetch error', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = updateProfileSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid input data',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { name, language, currency, newsletter } = validationResult.data;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        language,
        currency,
        newsletter,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        language: true,
        currency: true,
        newsletter: true,
        emailVerified: true,
        image: true,
        updatedAt: true,
      },
    });

    logInfo('User profile updated', {
      userId: session.user.id,
      changes: { name, language, currency, newsletter },
    });

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: updatedUser,
    });

  } catch (error) {
    logError('Profile update error', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}