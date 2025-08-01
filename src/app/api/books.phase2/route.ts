import { NextRequest, NextResponse } from 'next/server';

import { BookService } from '@/lib/services/books';

import type { BookSearchParams } from '@/types/book';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse search parameters
    const params: BookSearchParams = {
      query: searchParams.get('query') || undefined,
      categoryId: searchParams.get('categoryId') || undefined,
      tags: searchParams.get('tags')?.split(',').filter(Boolean) || undefined,
      language: (searchParams.get('language') as 'SQ' | 'EN') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      currency: (searchParams.get('currency') as 'ALL' | 'EUR') || 'ALL',
      featured: searchParams.get('featured') ? searchParams.get('featured') === 'true' : undefined,
      active: searchParams.get('active') ? searchParams.get('active') === 'true' : true,
      sortBy:
        (searchParams.get('sortBy') as 'title' | 'author' | 'price' | 'featured' | 'createdAt') ||
        'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 12,
    };

    // Validate pagination parameters
    if (params.page && params.page < 1) {
      return NextResponse.json(
        { success: false, error: 'Page must be greater than 0' },
        { status: 400 }
      );
    }

    if (params.limit && (params.limit < 1 || params.limit > 100)) {
      return NextResponse.json(
        { success: false, error: 'Limit must be between 1 and 100' },
        { status: 400 }
      );
    }

    // Validate price parameters
    if (params.minPrice && params.minPrice < 0) {
      return NextResponse.json(
        { success: false, error: 'Minimum price cannot be negative' },
        { status: 400 }
      );
    }

    if (params.maxPrice && params.maxPrice < 0) {
      return NextResponse.json(
        { success: false, error: 'Maximum price cannot be negative' },
        { status: 400 }
      );
    }

    if (params.minPrice && params.maxPrice && params.minPrice > params.maxPrice) {
      return NextResponse.json(
        { success: false, error: 'Minimum price cannot be greater than maximum price' },
        { status: 400 }
      );
    }

    const result = await BookService.searchBooks(params);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error in books API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch books',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // This endpoint is for creating books (admin only)
    // Authentication and authorization would be added here

    const body = await request.json();

    // Basic validation
    if (!body.title || !body.author || !body.categoryId) {
      return NextResponse.json(
        { success: false, error: 'Title, author, and category are required' },
        { status: 400 }
      );
    }

    const book = await BookService.createBook(body);

    return NextResponse.json(
      {
        success: true,
        data: book,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create book',
      },
      { status: 500 }
    );
  }
}
