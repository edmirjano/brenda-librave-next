import { NextRequest, NextResponse } from 'next/server';

import { CategoryService } from '@/lib/services/categories';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const withCounts = searchParams.get('withCounts') === 'true';

    let categories;

    if (withCounts) {
      categories = await CategoryService.getCategoriesWithCounts();
    } else if (includeInactive) {
      categories = await CategoryService.getAllCategories();
    } else {
      categories = await CategoryService.getActiveCategories();
    }

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error in categories API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
      },
      { status: 500 }
    );
  }
}