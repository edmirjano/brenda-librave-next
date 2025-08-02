import { NextRequest, NextResponse } from 'next/server';

import { BookService } from '@/lib/services/books';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 8;

    if (limit < 1 || limit > 50) {
      return NextResponse.json(
        {
          success: false,
          error: 'Limit must be between 1 and 50',
        },
        { status: 400 }
      );
    }

    const books = await BookService.getFeaturedBooks(limit);

    return NextResponse.json({
      success: true,
      data: books,
    });
  } catch (error) {
    console.error('Error in featured books API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch featured books',
      },
      { status: 500 }
    );
  }
}