import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/db/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; bookmarkId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookId = params.id;
    const bookmarkId = params.bookmarkId;

    // Get current reading history
    const readingHistory = await prisma.readingHistory.findUnique({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId: bookId
        }
      }
    });

    if (!readingHistory) {
      return NextResponse.json({ error: 'Reading history not found' }, { status: 404 });
    }

    const currentBookmarks = (readingHistory.bookmarks as any[]) || [];
    const updatedBookmarks = currentBookmarks.filter(
      (bookmark: any) => bookmark.id !== bookmarkId
    );

    // Update reading history without the deleted bookmark
    await prisma.readingHistory.update({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId: bookId
        }
      },
      data: {
        bookmarks: updatedBookmarks
      }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}