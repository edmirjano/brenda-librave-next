import { NextRequest, NextResponse } from 'next/server';

import { BookService } from '@/lib/services/books';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Book ID is required',
        },
        { status: 400 }
      );
    }

    const book = await BookService.getBookById(id);

    if (!book) {
      return NextResponse.json(
        {
          success: false,
          error: 'Book not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.error('Error in book API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch book',
      },
      { status: 500 }
    );
  }
}