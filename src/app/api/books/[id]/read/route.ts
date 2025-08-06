import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/db/prisma';

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

    // Check if user has access to this book
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: {
        id: true,
        title: true,
        author: true,
        hasDigital: true,
        digitalFileUrl: true,
        digitalFileSize: true
      }
    });

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    if (!book.hasDigital || !book.digitalFileUrl) {
      return NextResponse.json({ error: 'Digital version not available' }, { status: 404 });
    }

    // Check if user has purchased this book (check orders)
    const userPurchase = await prisma.orderItem.findFirst({
      where: {
        bookId: bookId,
        isDigital: true,
        order: {
          userId: session.user.id,
          status: {
            in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED']
          }
        }
      },
      include: {
        order: true
      }
    });

    if (!userPurchase) {
      return NextResponse.json({ 
        error: 'Digital access not granted. Please purchase the ebook first.' 
      }, { status: 403 });
    }

    // Return book access information
    return NextResponse.json({
      bookId: book.id,
      title: book.title,
      author: book.author,
      ebookUrl: book.digitalFileUrl,
      fileSize: book.digitalFileSize,
      hasAccess: true,
      purchaseDate: userPurchase.order.createdAt
    });

  } catch (error) {
    console.error('Error checking book access:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}