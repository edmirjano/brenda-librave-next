import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const bookmarkSchema = z.object({
  id: z.string(),
  cfi: z.string(),
  excerpt: z.string(),
  chapter: z.string().optional(),
  created: z.coerce.date()
});

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
    
    const validatedBookmark = bookmarkSchema.parse(body);

    // Get current reading history
    const readingHistory = await prisma.readingHistory.findUnique({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId: bookId
        }
      }
    });

    const currentBookmarks = (readingHistory?.bookmarks as any[]) || [];
    const updatedBookmarks = [...currentBookmarks, validatedBookmark];

    // Update reading history with new bookmark
    await prisma.readingHistory.upsert({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId: bookId
        }
      },
      update: {
        bookmarks: updatedBookmarks
      },
      create: {
        userId: session.user.id,
        bookId: bookId,
        bookmarks: updatedBookmarks,
        progress: 0
      }
    });

    return NextResponse.json({ success: true, bookmark: validatedBookmark });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid bookmark data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error saving bookmark:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}