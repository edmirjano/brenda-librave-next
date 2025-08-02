import { NextRequest, NextResponse } from 'next/server';

import { BookService } from '@/lib/services/books';
import { bookSearchSchema } from '@/lib/validations/book';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse search parameters
    const params = {
      query: searchParams.get('query') || undefined,
      categoryId: searchParams.get('categoryId') || undefined,
      tags: searchParams.get('tags')?.split(',').filter(Boolean) || undefined,
      language: (searchParams.get('language') as 'SQ' | 'EN') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      currency: (searchParams.get('currency') as 'ALL' | 'EUR') || 'ALL',
      featured: searchParams.get('featured') ? searchParams.get('featured') === 'true' : undefined,
      active: searchParams.get('active') ? searchParams.get('active') === 'true' : true,
      sortBy: (searchParams.get('sortBy') as 'title' | 'author' | 'price' | 'featured' | 'createdAt') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 12,
    };

    // Validate parameters
    const validationResult = bookSearchSchema.safeParse(params);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid search parameters',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const result = await BookService.searchBooks(validationResult.data);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error in books API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch books',
      },
      { status: 500 }
    );
  }
}