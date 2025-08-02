import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/db/prisma';
import { logError, logInfo } from '@/lib/logging/logger';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().email().toLowerCase(),
  name: z.string().optional(),
  language: z.enum(['SQ', 'EN']).default('SQ'),
  interests: z.array(z.string()).default([]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input data
    const validationResult = subscribeSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input data',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { email, name, language, interests } = validationResult.data;

    // Check if email already exists
    const existingSubscriber = await prisma.user.findUnique({
      where: { email },
      select: { id: true, newsletter: true },
    });

    if (existingSubscriber) {
      if (existingSubscriber.newsletter) {
        return NextResponse.json(
          { error: 'Email is already subscribed to newsletter' },
          { status: 409 }
        );
      } else {
        // Update existing user to enable newsletter
        await prisma.user.update({
          where: { email },
          data: { newsletter: true },
        });

        logInfo('Existing user subscribed to newsletter', { email });

        return NextResponse.json({
          success: true,
          message: 'Successfully subscribed to newsletter',
        });
      }
    }

    // For now, we'll just log the subscription since we don't have a separate newsletter table
    // In a full implementation, you'd create a NewsletterSubscriber model
    logInfo('Newsletter subscription request', {
      email,
      name,
      language,
      interests,
    });

    // Simulate successful subscription
    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
    });
  } catch (error) {
    logError('Newsletter subscription error', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}