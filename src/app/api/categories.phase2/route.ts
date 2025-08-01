import { NextRequest, NextResponse } from 'next/server';

import { CategoryService } from '@/lib/services/categories';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const withCounts = searchParams.get('withCounts') === 'true';
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const query = searchParams.get('query');

    let categories;

    if (query) {
      // Search categories
      categories = await CategoryService.searchCategories(query);
    } else if (withCounts) {
      // Get categories with book counts
      categories = await CategoryService.getCategoriesWithCounts();
    } else if (includeInactive) {
      // Get all categories (admin view)
      categories = await CategoryService.getAllCategories();
    } else {
      // Get active categories only
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
        error: error instanceof Error ? error.message : 'Failed to fetch categories',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // This endpoint is for creating categories (admin only)
    // Authentication and authorization would be added here

    const body = await request.json();

    // Basic validation
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }

    const category = await CategoryService.createCategory(body);

    return NextResponse.json(
      {
        success: true,
        data: category,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create category',
      },
      { status: 500 }
    );
  }
}
