import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validations/auth';
import { hashPassword } from '@/lib/auth/password';
import { prisma } from '@/lib/db/prisma';
import { logInfo, logError, logSecurity } from '@/lib/logging/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input data
    const validationResult = registerSchema.safeParse(body);
    
    if (!validationResult.success) {
      logSecurity('Registration attempt with invalid data', {
        email: body.email,
        errors: validationResult.error.errors,
      });
      
      return NextResponse.json(
        { 
          error: 'Invalid input data',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { name, email, password, language, currency, newsletter } = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      logSecurity('Registration attempt with existing email', { email });
      
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
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
        createdAt: true,
      },
    });

    logInfo('New user registered', {
      userId: user.id,
      email: user.email,
      language: user.language,
      currency: user.currency,
    });

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user,
      },
      { status: 201 }
    );

  } catch (error) {
    logError('Registration error', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}