import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const readingProgressSchema = z.object({
  currentCfi: z.string(),
  progress: z.number().min(0).max(100),
  readingTime: z.number().min(0).optional().default(0)
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookId = params.id;

    // Get reading history for this user and book
    const readingHistory = await prisma.readingHistory.findUnique({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId: bookId
        }
      }
    });

    if (!readingHistory) {
      return NextResponse.json({
        currentCfi: null,
        progress: 0,
        bookmarks: [],
        highlights: []
      });
    }

    return NextResponse.json({
      currentCfi: readingHistory.currentCfi,
      progress: readingHistory.progress,
      readingTime: readingHistory.readingTime,
      bookmarks: readingHistory.bookmarks || [],
      highlights: readingHistory.highlights || []
    });

  } catch (error) {
    console.error('Error fetching reading progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookId = params.id;
    const body = await request.json();
    
    const validatedData = readingProgressSchema.parse(body);

    // Update or create reading history
    const readingHistory = await prisma.readingHistory.upsert({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId: bookId
        }
      },
      update: {
        currentCfi: validatedData.currentCfi,
        progress: validatedData.progress,
        readingTime: {
          increment: validatedData.readingTime
        },
        lastReadAt: new Date(),
        completed: validatedData.progress >= 95 // Mark as completed at 95%
      },
      create: {
        userId: session.user.id,
        bookId: bookId,
        currentCfi: validatedData.currentCfi,
        progress: validatedData.progress,
        readingTime: validatedData.readingTime,
        lastReadAt: new Date(),
        completed: validatedData.progress >= 95
      }
    });

    return NextResponse.json({ success: true, readingHistory });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error saving reading progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}